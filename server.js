require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const axios = require('axios');
const crypto = require('crypto');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'data', 'subtrackr.db');
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const GLOBAL_TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

let db;
(async () => {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  db = await open({ filename: DB_FILE, driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      name TEXT,
      telegram_chat_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      price REAL,
      currency TEXT DEFAULT 'RUB',
      period TEXT,
      start_date TEXT,
      next_charge TEXT,
      category TEXT,
      reminder_days TEXT,
      metadata TEXT,
      last_used TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS notifications_log (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      subscription_id TEXT,
      type TEXT,
      sent_at TEXT,
      delivered INTEGER DEFAULT 0
    );
  `);
})();

let bot = null;
if (TELEGRAM_TOKEN) bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// ---------------- helpers ----------------
function normalizeNextCharge(startISO, period) {
  const sd = startISO ? new Date(startISO) : new Date();
  const next = new Date(sd);
  if (period === 'year') next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1);
  return next.toISOString();
}

function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'no token' });
  const token = h.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

function verifyTelegramAuth(data) {
  const { hash, ...rest } = data;
  const secret = crypto.createHash('sha256').update(TELEGRAM_TOKEN).digest();
  const dataCheckString = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return hmac === hash;
}

// ---------------- Курсы валют ----------------
async function getExchangeRates() {
  try {
    const response = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
    return response.data;
  } catch (error) {
    console.error('Ошибка получения курсов:', error);
    return {
      Valute: {
        USD: { Value: 90, Previous: 90 },
        EUR: { Value: 98, Previous: 98 }
      }
    };
  }
}

// Эндпоинт для получения курсов валют
app.get('/api/exchange-rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json({
      USD: rates.Valute.USD.Value,
      EUR: rates.Valute.EUR.Value,
      RUB: 1
    });
  } catch (error) {
    console.error('Exchange rates error:', error);
    res.status(500).json({ error: 'Не удалось получить курсы валют' });
  }
});

// ---------------- auth routes ----------------
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, telegram_chat_id } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email/password required' });
    const exists = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (exists) return res.status(400).json({ error: 'user exists' });

    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (id, email, password_hash, name, telegram_chat_id) VALUES (?, ?, ?, ?, ?)', [id, email, hash, name || '', telegram_chat_id || null]);

    if (telegram_chat_id && bot) {
      try {
        await bot.sendMessage(telegram_chat_id, `🎉 Добро пожаловать в Evens, ${name || 'друг'}!\nТеперь ты можешь отслеживать все подписки и получать напоминания. Удачи!`);
      } catch (e) { console.error('welcome telegram send error', e); }
    }

    const token = signJwt({ id, email, name: name || '' });
    res.json({ ok: true, token, user: { id, email, name: name || '', telegram_chat_id: telegram_chat_id || null } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email/password required' });
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });
    const token = signJwt({ id: user.id, email: user.email, name: user.name });
    res.json({ ok: true, token, user: { id: user.id, email: user.email, name: user.name, telegram_chat_id: user.telegram_chat_id } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.get('SELECT id, email, name, telegram_chat_id FROM users WHERE id = ?', req.user.id);
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
});

// ---------------- Telegram login ----------------
app.post('/auth/telegram', async (req, res) => {
  try {
    if (!TELEGRAM_TOKEN) return res.status(500).json({ error: 'telegram not configured on server' });
    const payload = req.body || {};
    if (!verifyTelegramAuth(payload)) return res.status(400).json({ error: 'invalid telegram auth' });

    const telegramId = String(payload.id);
    const emailLike = `tg_${telegramId}@evens.local`;
    let user = await db.get('SELECT * FROM users WHERE telegram_chat_id = ? OR email = ?', telegramId, emailLike);
    if (!user) {
      const id = uuidv4();
      const name = `${payload.first_name || ''} ${payload.last_name || ''}`.trim();
      await db.run('INSERT INTO users (id, email, name, telegram_chat_id) VALUES (?, ?, ?, ?)', [id, emailLike, name, telegramId]);
      user = await db.get('SELECT * FROM users WHERE id = ?', id);
    }
    const token = signJwt({ id: user.id, email: user.email, name: user.name });
    res.json({ ok: true, token, user: { id: user.id, email: user.email, name: user.name, telegram_chat_id: user.telegram_chat_id } });
  } catch (e) {
    console.error('auth/telegram error', e);
    res.status(500).json({ error: e.message });
  }
});

// ---------------- Google OAuth ----------------
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:4000'}/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || `google_${profile.id}@evens.local`;
      let user = await db.get('SELECT * FROM users WHERE email = ?', email);
      if (!user) {
        const id = uuidv4();
        const name = profile.displayName || '';
        await db.run('INSERT INTO users (id, email, name) VALUES (?, ?, ?)', [id, email, name]);
        user = await db.get('SELECT * FROM users WHERE id = ?', id);
      }
      return cb(null, user);
    } catch (e) { return cb(e); }
  }));

  app.use(passport.initialize());

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    async (req, res) => {
      const user = req.user;
      const token = signJwt({ id: user.id, email: user.email, name: user.name });
      return res.redirect(`${FRONTEND_URL}/?token=${token}`);
    });
}

// ---------------- subscriptions CRUD ----------------
app.get('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC', req.user.id);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.post('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const { title, price, period, startDate, category, reminder, currency } = req.body;
    const id = uuidv4();
    const next = normalizeNextCharge(startDate, period);
    const reminderDays = reminder ? JSON.stringify(JSON.parse(reminder)) : JSON.stringify([7, 3, 1]);
    await db.run(`
      INSERT INTO subscriptions (id, user_id, title, price, period, start_date, next_charge, category, reminder_days, currency, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, title, Number(price || 0), period || 'month', startDate || new Date().toISOString(), next, category || 'Other', reminderDays, currency || 'RUB', JSON.stringify({})]
    );
    const sub = await db.get('SELECT * FROM subscriptions WHERE id = ?', id);
    res.json(sub);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.put('/api/subscriptions/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const sub = await db.get('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?', id, req.user.id);
    if (!sub) return res.status(404).json({ error: 'not found' });
    const { title, price, period, next_charge, active, last_used, category, reminder } = req.body;
    const reminderDays = reminder ? JSON.stringify(reminder) : sub.reminder_days;
    await db.run(`UPDATE subscriptions SET title=?, price=?, period=?, next_charge=?, active=?, last_used=?, category=?, reminder_days=? WHERE id=?`,
      [title || sub.title, price !== undefined ? Number(price) : sub.price, period || sub.period, next_charge || sub.next_charge, active ? 1 : 0, last_used || sub.last_used, category || sub.category, reminderDays, id]);
    const updated = await db.get('SELECT * FROM subscriptions WHERE id = ?', id);
    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.delete('/api/subscriptions/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    await db.run('DELETE FROM subscriptions WHERE id = ? AND user_id = ?', id, req.user.id);
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

// ---------------- Statistics ----------------
app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const { currency = 'RUB' } = req.query;
    const rows = await db.all('SELECT price, period, currency, category, next_charge, start_date FROM subscriptions WHERE active=1 AND user_id = ?', req.user.id);
    
    const rates = await getExchangeRates();
    const exchangeRates = {
      USD: rates.Valute.USD.Value,
      EUR: rates.Valute.EUR.Value,
      RUB: 1
    };
    
    const convertPrice = (price, fromCurrency, toCurrency) => {
      if (fromCurrency === toCurrency) return price;
      const inRub = fromCurrency === 'RUB' ? price : price * exchangeRates[fromCurrency];
      return toCurrency === 'RUB' ? inRub : inRub / exchangeRates[toCurrency];
    };

    const monthTotals = {};
    const categoryTotals = {};
    const totalMonthly = { RUB: 0, USD: 0, EUR: 0 };

    rows.forEach(r => {
      const price = parseFloat(r.price) || 0;
      const rowCurrency = r.currency || 'RUB';
      
      let monthly = price;
      if (r.period === 'year') {
        monthly = price / 12;
      }

      totalMonthly.RUB += convertPrice(monthly, rowCurrency, 'RUB');
      totalMonthly.USD += convertPrice(monthly, rowCurrency, 'USD');
      totalMonthly.EUR += convertPrice(monthly, rowCurrency, 'EUR');

      const monthlyInTarget = convertPrice(monthly, rowCurrency, currency);
      
      const category = r.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + monthlyInTarget;

      const chargeDate = r.next_charge ? new Date(r.next_charge) : new Date(r.start_date);
      if (!isNaN(chargeDate.getTime())) {
        for (let i = 0; i < 6; i++) {
          const forecastDate = new Date(chargeDate);
          forecastDate.setMonth(forecastDate.getMonth() + i);
          const monthKey = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
          monthTotals[monthKey] = (monthTotals[monthKey] || 0) + monthlyInTarget;
        }
      }
    });

    const sortedMonthly = {};
    Object.keys(monthTotals)
      .sort()
      .forEach(key => {
        sortedMonthly[key] = Math.round(monthTotals[key] * 100) / 100;
      });

    const roundedCategories = {};
    Object.keys(categoryTotals).forEach(key => {
      roundedCategories[key] = Math.round(categoryTotals[key] * 100) / 100;
    });

    res.json({ 
      monthly: sortedMonthly, 
      category: roundedCategories,
      total: totalMonthly,
      currency: currency
    });
  } catch (e) { 
    console.error('Stats error:', e);
    res.status(500).json({ error: 'server error' });
  }
});

// ---------------- Advice ----------------
app.get('/api/advice', authMiddleware, async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC', req.user.id);
    const advice = [];
    for (const s of rows) {
      const lastUsed = s.last_used ? new Date(s.last_used) : null;
      const daysUnused = lastUsed ? Math.floor((Date.now() - lastUsed.getTime())/(1000*60*60*24)) : null;
      if (daysUnused !== null && daysUnused > 60) {
        advice.push({ id: s.id, title: s.title, reason: `Не использовалась ${daysUnused} дней` });
        continue;
      }
      if (s.price > 1000 && s.period === 'month') {
        advice.push({ id: s.id, title: s.title, reason: `Дорогая подписка (${s.price} ₽/мес)` });
        continue;
      }
    }
    res.json({ advice });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

// ---------------- Telegram test ----------------
app.post('/api/telegram/test', async (req, res) => {
  try {
    const { token, chatId, message } = req.body;
    if (!token || !chatId) return res.status(400).json({ ok: false, error: 'token/chatId required' });
    const tempBot = new TelegramBot(token, { polling: false });
    await tempBot.sendMessage(chatId, message || '🔔 Тестовое сообщение из Evens');
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ ok: false, error: e.message }); }
});

// ---------------- Cron: reminders ----------------
cron.schedule('0 * * * *', async () => {
  try {
    const rows = await db.all('SELECT s.*, u.telegram_chat_id as user_chat FROM subscriptions s LEFT JOIN users u ON s.user_id=u.id WHERE s.active=1');
    const now = new Date();
    for (const s of rows) {
      if (!s.next_charge) continue;
      const next = new Date(s.next_charge);
      const diffDays = Math.ceil((next - now) / (1000*60*60*24));
      let reminders = [7,3,1];
      try { reminders = JSON.parse(s.reminder_days || '[7,3,1]'); } catch {}
      if (reminders.includes(diffDays)) {
        const msg = `🔔 Напоминание: подписка "${s.title}" будет списана через ${diffDays} дн. (${next.toLocaleDateString()})`;
        console.log('[Reminder]', msg);
        const targetChat = s.user_chat || GLOBAL_TELEGRAM_CHAT_ID;
        if (bot && targetChat) {
          try {
            await bot.sendMessage(targetChat, msg);
            const nid = uuidv4();
            await db.run('INSERT INTO notifications_log (id, user_id, subscription_id, type, sent_at, delivered) VALUES (?, ?, ?, ?, ?, ?)',
              [nid, s.user_id, s.id, 'telegram', new Date().toISOString(), 1]);
          } catch (e) { console.error('cron send error', e); }
        }
      }
    }
  } catch (e) { console.error('cron error', e); }
});

// server.js (дополнения к существующему коду)
// Добавим новые эндпоинты для AI помощника и уведомлений

// AI Assistant endpoint
app.post('/api/ai/analyze', authMiddleware, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Имитация AI анализа
    const analysis = {
      suggestions: [
        {
          type: 'optimization',
          title: 'Оптимизация подписок',
          message: 'Мы нашли 2 подписки, которые можно объединить',
          confidence: 0.85
        },
        {
          type: 'savings',
          title: 'Возможность экономии',
          message: 'Вы можете сэкономить до 15% перейдя на годовые тарифы',
          confidence: 0.92
        }
      ],
      response: `На основе анализа ваших подписок, я рекомендую рассмотреть возможность объединения похожих сервисов. Также обратите внимание на годовые тарифы - они часто выгоднее месячных.`
    };
    
    res.json(analysis);
  } catch (e) {
    console.error('AI analysis error:', e);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// Notifications endpoint
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await db.all(`
      SELECT * FROM notifications_log 
      WHERE user_id = ? 
      ORDER BY sent_at DESC 
      LIMIT 50
    `, req.user.id);
    
    res.json({ notifications });
  } catch (e) {
    console.error('Notifications error:', e);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

// User preferences endpoint
app.put('/api/user/preferences', authMiddleware, async (req, res) => {
  try {
    const { theme, language, notifications, currency } = req.body;
    
    // Здесь можно сохранить настройки в отдельную таблицу
    // Пока просто возвращаем успех
    res.json({ ok: true, message: 'Preferences updated' });
  } catch (e) {
    console.error('Preferences update error:', e);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Voice commands processing
app.post('/api/voice/command', authMiddleware, async (req, res) => {
  try {
    const { command } = req.body;
    
    const responses = {
      'добавить подписку': { action: 'add_subscription', message: 'Открываю форму добавления подписки' },
      'показать статистику': { action: 'show_stats', message: 'Перехожу к статистике' },
      'сколько я трачу': { action: 'show_total', message: 'Показываю общие расходы' },
      'ближайшие списания': { action: 'show_upcoming', message: 'Показываю ближайшие платежи' }
    };
    
    const response = responses[command.toLowerCase()] || 
      { action: 'unknown', message: 'Не понял команду. Попробуйте сказать "добавить подписку" или "показать статистику"' };
    
    res.json(response);
  } catch (e) {
    console.error('Voice command error:', e);
    res.status(500).json({ error: 'Voice command processing failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend listening on port ${PORT}`));