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
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8213384887:AAEOrDzFB_SWji0msmrgyNhonayAZ2TwUoc';
const JWT_SECRET = process.env.JWT_SECRET || 'evans_super_secret_key_2024_change_this_in_production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';

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
      telegram_username TEXT,
      language TEXT DEFAULT 'ru',
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
      title TEXT,
      message TEXT,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      delivered INTEGER DEFAULT 0,
      read_status INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      theme TEXT DEFAULT 'light',
      currency TEXT DEFAULT 'RUB',
      notification_types TEXT DEFAULT '["subscription_created","subscription_updated","subscription_deleted","payment_reminder","test","telegram_connected","telegram_disconnected","monthly_report"]',
      monthly_report INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  console.log('✅ Database initialization completed');
})();

// ---------------- Multi-language Support ----------------
const translations = {
  ru: {
    welcome: `🤖 Добро пожаловать в Evans Bot!\n\n✨ Ваш Chat ID: <code>{chatId}</code>\n\n📨 Вы будете получать уведомления о:\n✅ Добавлении подписок\n✏️ Изменении подписок\n🗑️ Удалении подписок\n⏰ Предстоящих списаниях\n\n⚡ Начните управлять своими подписками умнее!`,
    help: `📋 Доступные команды:\n\n/start - Получить Chat ID и инструкции\n/help - Показать это сообщение\n/language - Сменить язык (Русский/English)`,
    language: `🌐 Выберите язык / Choose language:\n\n🇷🇺 Русский\n🇺🇸 English`,
    languageSet: `✅ Язык изменен на Русский`,
    languageSetEn: `✅ Language changed to English`,
    unknownCommand: `Отправьте /start чтобы получить ваш Chat ID для подключения уведомлений Evans.`,
    subscriptionCreated: `✅ Подписка добавлена: "{title}"\n💳 Стоимость: {price} {currency}/{period}\n📅 Следующее списание: {nextCharge}`,
    subscriptionUpdated: `✏️ Подписка обновлена: "{title}"\n💳 Новая стоимость: {price} {currency}/{period}`,
    subscriptionDeleted: `🗑️ Подписка удалена: "{title}"\n💳 Была стоимость: {price} {currency}/{period}`,
    paymentReminder: `⏰ Напоминание: подписка "{title}" будет списана через {days} дн. ({date})`,
    telegramConnected: `🔔 Evans: Уведомления подключены! Вы будете получать уведомления о:\n\n✅ Новых подписках\n✏️ Изменениях подписок\n🗑️ Удалении подписок\n⏰ Предстоящих списаниях\n\nУправляйте подписками с умом! 💡`,
    welcomeUser: `🎉 Добро пожаловать в Evans, {name}!\n\nТеперь вы можете отслеживать все подписки в одном месте и получать напоминания о списаниях.\n\n📊 Все подписки в одном месте\n🔔 Умные напоминания\n💸 Анализ расходов\n\nУдачи в управлении подписками!`,
    testNotification: `🔔 Тестовое уведомление от Evans! Система уведомлений работает корректно.`,
    monthlyReport: `📊 Отчет по подпискам за {month}\n\n💰 Всего в месяц: {total} RUB\n📈 Активных подписок: {count}\n📂 По категориям:\n{categories}`,
    adviceUnused: `💡 Совет: Подписка "{title}" не используется {days} дней. Возможно, стоит отменить?`,
    adviceExpensive: `💡 Совет: Подписка "{title}" довольно дорогая ({price} RUB/мес). Проверьте, часто ли вы её используете.`
  },
  en: {
    welcome: `🤖 Welcome to Evans Bot!\n\n✨ Your Chat ID: <code>{chatId}</code>\n\n📨 You will receive notifications about:\n✅ New subscriptions\n✏️ Subscription updates\n🗑️ Subscription deletions\n⏰ Upcoming payments\n\n⚡ Start managing your subscriptions smarter!`,
    help: `📋 Available commands:\n\n/start - Get Chat ID and instructions\n/help - Show this message\n/language - Change language (Russian/English)`,
    language: `🌐 Choose language:\n\n🇷🇺 Русский\n🇺🇸 English`,
    languageSet: `✅ Language changed to English`,
    languageSetEn: `✅ Language changed to English`,
    unknownCommand: `Send /start to get your Chat ID for connecting Evans notifications.`,
    subscriptionCreated: `✅ Subscription added: "{title}"\n💳 Price: {price} {currency}/{period}\n📅 Next charge: {nextCharge}`,
    subscriptionUpdated: `✏️ Subscription updated: "{title}"\n💳 New price: {price} {currency}/{period}`,
    subscriptionDeleted: `🗑️ Subscription deleted: "{title}"\n💳 Was price: {price} {currency}/{period}`,
    paymentReminder: `⏰ Reminder: subscription "{title}" will be charged in {days} days ({date})`,
    telegramConnected: `🔔 Evans: Notifications connected! You will receive notifications about:\n\n✅ New subscriptions\n✏️ Subscription updates\n🗑️ Subscription deletions\n⏰ Upcoming payments\n\nManage your subscriptions wisely! 💡`,
    welcomeUser: `🎉 Welcome to Evans, {name}!\n\nNow you can track all subscriptions in one place and receive payment reminders.\n\n📊 All subscriptions in one place\n🔔 Smart reminders\n💸 Expense analysis\n\nGood luck managing your subscriptions!`,
    testNotification: `🔔 Test notification from Evans! Notification system is working correctly.`,
    monthlyReport: `📊 Subscriptions report for {month}\n\n💰 Monthly total: {total} RUB\n📈 Active subscriptions: {count}\n📂 By category:\n{categories}`,
    adviceUnused: `💡 Advice: Subscription "{title}" hasn't been used for {days} days. Maybe you should cancel it?`,
    adviceExpensive: `💡 Advice: Subscription "{title}" is quite expensive ({price} RUB/month). Check if you use it often enough.`
  }
};

function getTranslation(lang, key, params = {}) {
  const text = translations[lang]?.[key] || translations['en'][key] || key;
  return text.replace(/{(\w+)}/g, (match, param) => params[param] || match);
}

async function getUserLanguage(userId) {
  try {
    if (!db) return 'ru';
    const user = await db.get('SELECT language FROM users WHERE id = ?', userId);
    return user?.language || 'ru';
  } catch (error) {
    return 'ru';
  }
}

// ---------------- Telegram Bot Initialization ----------------
let bot = null;
console.log('🔧 Initializing Telegram bot...');

if (TELEGRAM_TOKEN && TELEGRAM_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
  try {
    bot = new TelegramBot(TELEGRAM_TOKEN, {
      polling: {
        interval: 3000,
        timeout: 10,
        autoStart: true
      }
    });

    console.log('✅ Telegram bot initialized with polling');

    bot.getMe().then(me => {
      console.log(`🤖 Bot info: ${me.first_name} (@${me.username})`);
    }).catch(err => {
      console.error('❌ Bot getMe failed:', err.message);
    });

    // Обработчик сообщений
    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      const username = msg.from.username ? `@${msg.from.username}` : null;

      console.log(`📩 Received message from ${chatId} (${username}): ${text}`);

      let userLang = 'ru';
      try {
        const user = await db.get('SELECT id, language FROM users WHERE telegram_chat_id = ?', chatId);
        if (user) userLang = user.language;
      } catch (error) {}

      if (text && text.startsWith('/start')) {
        try {
          const startParams = text.split(' ')[1];
          let welcomeMessage = '';
          let connectionEstablished = false;
          
          if (startParams) {
            try {
              const params = JSON.parse(Buffer.from(startParams, 'base64').toString());
              console.log('🔑 Start params received:', params);

              if (params.email && params.username) {
                const user = await db.get('SELECT id, name FROM users WHERE email = ?', params.email);
                if (user) {
                  await db.run(
                    'UPDATE users SET telegram_chat_id = ?, telegram_username = ? WHERE id = ?',
                    [chatId, params.username, user.id]
                  );
                  
                  welcomeMessage = getTranslation(userLang, 'telegramConnected');
                  connectionEstablished = true;
                  console.log(`✅ Telegram connected for user ${user.id} (${params.username})`);

                  try {
                    await sendNotification(
                      user.id,
                      'telegram_connected',
                      userLang === 'ru' ? 'Telegram подключен ✅' : 'Telegram connected ✅',
                      getTranslation(userLang, 'telegramConnected')
                    );
                  } catch (notifError) {}

                  try {
                    const welcomeUserMessage = getTranslation(userLang, 'welcomeUser', { 
                      name: user.name || (userLang === 'ru' ? 'друг' : 'friend') 
                    });
                    await bot.sendMessage(chatId, welcomeUserMessage);
                  } catch (welcomeError) {}
                } else {
                  welcomeMessage = `🤖 Добро пожаловать в Evans Bot!\n\n` +
                    `📧 Email: ${params.email}\n` +
                    `👤 Username: ${params.username}\n\n` +
                    (userLang === 'ru' 
                      ? 'Вернитесь в приложение Evans и завершите регистрацию, чтобы подключить уведомления.'
                      : 'Return to the Evans app and complete registration to connect notifications.'
                    );
                }
              }
            } catch (paramError) {
              console.log('No valid start params or decoding error:', paramError);
              welcomeMessage = getTranslation(userLang, 'welcome', { chatId });
            }
          } else {
            welcomeMessage = getTranslation(userLang, 'welcome', { chatId });
          }

          await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
          console.log(`📝 Sent welcome message to ${chatId}, connection: ${connectionEstablished}`);

        } catch (error) {
          console.error('Error processing /start command:', error);
          await bot.sendMessage(chatId, '🚫 An error occurred. Please try again.', { parse_mode: 'HTML' });
        }
      } else if (text === '/help') {
        await bot.sendMessage(chatId, getTranslation(userLang, 'help'));
      } else if (text === '/language' || text === '🇷🇺 Русский' || text === '🇺🇸 English') {
        if (text === '🇷🇺 Русский') {
          await db.run('UPDATE users SET language = ? WHERE telegram_chat_id = ?', ['ru', chatId]);
          await bot.sendMessage(chatId, getTranslation('ru', 'languageSet'));
        } else if (text === '🇺🇸 English') {
          await db.run('UPDATE users SET language = ? WHERE telegram_chat_id = ?', ['en', chatId]);
          await bot.sendMessage(chatId, getTranslation('en', 'languageSet'));
        } else {
          await bot.sendMessage(chatId, getTranslation(userLang, 'language'));
        }
      } else {
        await bot.sendMessage(chatId, getTranslation(userLang, 'unknownCommand'));
      }
    });

    bot.on('polling_error', (error) => {
      console.error('🤖 Telegram polling error:', error.message);
    });

  } catch (error) {
    console.error('❌ Failed to initialize Telegram bot:', error.message);
    bot = null;
  }
} else {
  console.log('⚠️ Telegram bot token not configured');
  bot = null;
}

// ---------------- Helpers ----------------
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

// ---------------- Notification System ----------------
async function sendNotification(userId, type, title, message, subscriptionId = null) {
  try {
    console.log(`📨 [SEND_NOTIFICATION] User: ${userId}, Type: ${type}, Title: ${title}`);

    if (!db) {
      return { error: 'Database not initialized', savedToLog: false };
    }

    const user = await db.get(
      'SELECT id, telegram_chat_id, language FROM users WHERE id = ?',
      userId
    );

    if (!user) {
      return { error: 'User not found', savedToLog: false };
    }

    const notificationId = uuidv4();
    const userLanguage = user.language || 'ru';

    try {
      await db.run(
        `INSERT INTO notifications_log 
         (id, user_id, subscription_id, type, title, message, sent_at, delivered, read_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [notificationId, userId, subscriptionId, type, title, message, new Date().toISOString(), 0, 0]
      );
      console.log(`✅ Notification saved to log: ${notificationId}`);
    } catch (dbError) {
      return { error: 'Database error: ' + dbError.message, savedToLog: false };
    }

    let allowedTypes = ["subscription_created", "subscription_updated", "subscription_deleted", "payment_reminder", "test", "telegram_connected", "telegram_disconnected", "monthly_report"];

    try {
      const preferences = await db.get(
        'SELECT notification_types FROM user_preferences WHERE user_id = ?',
        userId
      );
      if (preferences && preferences.notification_types) {
        allowedTypes = JSON.parse(preferences.notification_types);
      }
    } catch (prefError) {}

    let telegramSent = false;
    let telegramError = null;

    if (user.telegram_chat_id && bot && allowedTypes.includes(type)) {
      try {
        const telegramMessage = `🔔 ${title}\n\n${message}`;
        await bot.sendMessage(user.telegram_chat_id, telegramMessage);
        await db.run('UPDATE notifications_log SET delivered = 1 WHERE id = ?', [notificationId]);
        telegramSent = true;
        console.log(`✅ Telegram notification sent to ${user.telegram_chat_id}`);
      } catch (telegramError) {
        console.error('❌ Telegram send failed:', telegramError.message);
      }
    }

    return { notificationId, telegramSent, telegramError, savedToLog: true, userLanguage };
  } catch (error) {
    console.error('❌ Send notification error:', error);
    return { error: error.message, savedToLog: false };
  }
}

// ---------------- Telegram Endpoints ----------------
app.post('/api/telegram/generate-link', async (req, res) => {
  try {
    const { telegramUsername, email, name } = req.body;

    if (!telegramUsername || !telegramUsername.startsWith('@')) {
      return res.status(400).json({ 
        error: 'Invalid Telegram username format. Must start with @' 
      });
    }

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    const params = {
      email: email,
      username: telegramUsername,
      name: name || '',
      action: 'connect',
      timestamp: Date.now(),
      source: 'evans_app'
    };

    const startParam = Buffer.from(JSON.stringify(params)).toString('base64').replace(/=/g, '');
    
    const botUsername = 'evans_notifications_bot';
    const telegramUrl = `https://t.me/${botUsername}?start=${startParam}`;

    res.json({
      success: true,
      telegramUrl,
      botUsername: '@evans_notifications_bot',
      instructions: {
        en: `Click the link to open Telegram with @evans_notifications_bot, then press START in the bot chat`,
        ru: `Нажмите на ссылку чтобы открыть Telegram с ботом @evans_notifications_bot, затем нажмите START в диалоге с ботом`
      }
    });

  } catch (error) {
    console.error('Generate Telegram link error:', error);
    res.status(500).json({ 
      error: 'Failed to generate Telegram link: ' + error.message 
    });
  }
});

app.get('/api/telegram/status', authMiddleware, async (req, res) => {
  try {
    let botStatus = 'not_initialized';
    let botInfo = null;

    if (bot) {
      try {
        const me = await bot.getMe();
        botStatus = 'working';
        botInfo = { name: me.first_name, username: me.username };
      } catch (error) {
        botStatus = 'token_invalid';
      }
    }

    const user = await db.get(
      'SELECT telegram_chat_id, telegram_username FROM users WHERE id = ?',
      req.user.id
    );

    let userLanguage = 'ru';
    try {
      const userWithLang = await db.get('SELECT language FROM users WHERE id = ?', req.user.id);
      userLanguage = userWithLang?.language || 'ru';
    } catch (e) {}

    res.json({
      botStatus,
      botInfo,
      userConnected: !!user.telegram_chat_id,
      userChatId: user.telegram_chat_id,
      userTelegramUsername: user.telegram_username,
      userLanguage
    });

  } catch (e) {
    console.error('Telegram status error:', e);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

app.get('/api/telegram/check-connection', authMiddleware, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT telegram_chat_id, telegram_username FROM users WHERE id = ?',
      req.user.id
    );

    res.json({
      connected: !!user.telegram_chat_id,
      chatId: user.telegram_chat_id,
      username: user.telegram_username
    });
  } catch (error) {
    console.error('Check Telegram connection error:', error);
    res.status(500).json({ error: 'Failed to check Telegram connection' });
  }
});

app.post('/api/telegram/disconnect', authMiddleware, async (req, res) => {
  try {
    const userLang = await getUserLanguage(req.user.id);

    await db.run(
      'UPDATE users SET telegram_chat_id = NULL, telegram_username = NULL WHERE id = ?',
      [req.user.id]
    );

    await sendNotification(
      req.user.id,
      'telegram_disconnected',
      userLang === 'ru' ? 'Telegram отключен' : 'Telegram disconnected',
      userLang === 'ru' ? 'Уведомления в Telegram отключены' : 'Telegram notifications disabled'
    );

    res.json({
      ok: true,
      message: userLang === 'ru' ? 'Telegram уведомления отключены' : 'Telegram notifications disabled'
    });

  } catch (e) {
    console.error('Telegram disconnect error:', e);
    res.status(500).json({ error: 'Failed to disconnect Telegram' });
  }
});

// ---------------- Auth Routes ----------------
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, telegram_username, language = 'ru' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email/password required' });
    const exists = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (exists) return res.status(400).json({ error: 'user exists' });

    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);
    
    await db.run(
      'INSERT INTO users (id, email, password_hash, name, telegram_username, language) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, hash, name || '', telegram_username || null, language]
    );

    await db.run(
      'INSERT INTO user_preferences (user_id, theme, currency, notification_types, monthly_report) VALUES (?, ?, ?, ?, ?)',
      [id, 'light', 'RUB', JSON.stringify(["subscription_created", "subscription_updated", "subscription_deleted", "payment_reminder", "test", "telegram_connected", "telegram_disconnected", "monthly_report"]), 1]
    );

    const token = signJwt({ id, email, name: name || '' });
    res.json({ 
      ok: true, 
      token, 
      user: { 
        id, 
        email, 
        name: name || '', 
        telegram_username: telegram_username || null,
        telegram_chat_id: null,
        language 
      } 
    });
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

    let userLanguage = 'ru';
    try {
      const userWithLang = await db.get('SELECT language FROM users WHERE id = ?', user.id);
      userLanguage = userWithLang?.language || 'ru';
    } catch (e) {}

    const token = signJwt({ id: user.id, email: user.email, name: user.name });
    res.json({ 
      ok: true, 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        telegram_chat_id: user.telegram_chat_id,
        telegram_username: user.telegram_username,
        language: userLanguage 
      } 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, email, name, telegram_chat_id, telegram_username FROM users WHERE id = ?', 
      req.user.id
    );

    let userLanguage = 'ru';
    try {
      const userWithLang = await db.get('SELECT language FROM users WHERE id = ?', req.user.id);
      userLanguage = userWithLang?.language || 'ru';
    } catch (e) {}

    res.json({ 
      user: { 
        ...user, 
        language: userLanguage 
      } 
    });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
});

// ---------------- Language Endpoints ----------------
app.post('/api/user/language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.body;
    if (!['ru', 'en'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    await db.run('UPDATE users SET language = ? WHERE id = ?', [language, req.user.id]);
    const userLang = await getUserLanguage(req.user.id);

    res.json({
      ok: true,
      message: getTranslation(userLang, language === 'ru' ? 'languageSet' : 'languageSetEn'),
      language
    });

  } catch (e) {
    console.error('Language change error:', e);
    res.status(500).json({ error: 'Failed to change language' });
  }
});

// ---------------- Subscription CRUD ----------------
app.get('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC', req.user.id);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.post('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const { title, price, period, startDate, category, reminder, currency } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const id = uuidv4();
    const next = normalizeNextCharge(startDate, period);
    const reminderDays = reminder ? JSON.stringify(reminder) : JSON.stringify([7, 3, 1]);

    await db.run(
      'INSERT INTO subscriptions (id, user_id, title, price, period, start_date, next_charge, category, reminder_days, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, req.user.id, title, price, period, startDate, next, category, reminderDays, currency || 'RUB']
    );

    const sub = await db.get('SELECT * FROM subscriptions WHERE id = ?', id);
    const userLang = await getUserLanguage(req.user.id);

    await sendNotification(
      req.user.id,
      'subscription_created',
      userLang === 'ru' ? 'Подписка добавлена ✅' : 'Subscription added ✅',
      getTranslation(userLang, 'subscriptionCreated', {
        title: title,
        price: price,
        currency: currency || 'RUB',
        period: period || 'month',
        nextCharge: new Date(next).toLocaleDateString(userLang === 'ru' ? 'ru-RU' : 'en-US')
      }),
      id
    );

    res.json(sub);

  } catch (e) {
    console.error('❌ Subscription creation error:', e);
    res.status(500).json({ error: 'server error' });
  }
});

app.put('/api/subscriptions/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const sub = await db.get('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?', id, req.user.id);
    if (!sub) return res.status(404).json({ error: 'not found' });

    const { title, price, period, next_charge, active, last_used, category, reminder } = req.body;
    const reminderDays = reminder ? JSON.stringify(reminder) : sub.reminder_days;

    await db.run(
      `UPDATE subscriptions SET title=?, price=?, period=?, next_charge=?, active=?, last_used=?, category=?, reminder_days=? WHERE id=?`,
      [title || sub.title, price !== undefined ? Number(price) : sub.price, period || sub.period, next_charge || sub.next_charge, active ? 1 : 0, last_used || sub.last_used, category || sub.category, reminderDays, id]
    );

    const updated = await db.get('SELECT * FROM subscriptions WHERE id = ?', id);
    const userLang = await getUserLanguage(req.user.id);

    if (title !== sub.title || price !== sub.price || period !== sub.period) {
      await sendNotification(
        req.user.id,
        'subscription_updated',
        userLang === 'ru' ? 'Подписка обновлена ✏️' : 'Subscription updated ✏️',
        getTranslation(userLang, 'subscriptionUpdated', {
          title: title || sub.title,
          price: price !== undefined ? price : sub.price,
          currency: updated.currency || 'RUB',
          period: period || sub.period
        }),
        id
      );
    }

    res.json(updated);

  } catch (e) {
    console.error('❌ Subscription update error:', e);
    res.status(500).json({ error: 'server error' });
  }
});

app.delete('/api/subscriptions/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const sub = await db.get('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?', id, req.user.id);
    if (!sub) return res.status(404).json({ error: 'not found' });

    const userLang = await getUserLanguage(req.user.id);
    await db.run('DELETE FROM subscriptions WHERE id = ? AND user_id = ?', id, req.user.id);

    await sendNotification(
      req.user.id,
      'subscription_deleted',
      userLang === 'ru' ? 'Подписка удалена 🗑️' : 'Subscription deleted 🗑️',
      getTranslation(userLang, 'subscriptionDeleted', {
        title: sub.title,
        price: sub.price,
        currency: sub.currency || 'RUB',
        period: sub.period
      }),
      id
    );

    res.json({ ok: true });
  } catch (e) {
    console.error('❌ Subscription deletion error:', e);
    res.status(500).json({ error: 'server error' });
  }
});

// ---------------- Additional Endpoints ----------------
app.get('/api/analytics/overview', authMiddleware, async (req, res) => {
  try {
    const subs = await db.all('SELECT * FROM subscriptions WHERE user_id = ? AND active = 1', req.user.id);
    const monthlyTotal = subs.reduce((sum, sub) => {
      if (sub.period === 'year') return sum + (sub.price / 12);
      return sum + Number(sub.price || 0);
    }, 0);

    const byCategory = {};
    subs.forEach(sub => {
      const category = sub.category || 'Other';
      const monthlyPrice = sub.period === 'year' ? (sub.price / 12) : Number(sub.price || 0);
      byCategory[category] = (byCategory[category] || 0) + monthlyPrice;
    });

    res.json({
      totalActive: subs.length,
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
      byCategory
    });
  } catch (e) {
    console.error('Analytics error:', e);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

app.get('/api/notifications/settings', authMiddleware, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT telegram_chat_id, telegram_username, email FROM users WHERE id = ?',
      req.user.id
    );

    let userLanguage = 'ru';
    try {
      const userWithLang = await db.get('SELECT language FROM users WHERE id = ?', req.user.id);
      userLanguage = userWithLang?.language || 'ru';
    } catch (e) {}

    res.json({
      telegramConnected: !!user.telegram_chat_id,
      telegramChatId: user.telegram_chat_id,
      telegramUsername: user.telegram_username,
      email: user.email,
      language: userLanguage
    });
  } catch (e) {
    console.error('Notifications settings error:', e);
    res.status(500).json({ error: 'Failed to load notification settings' });
  }
});

app.post('/api/test-notification', authMiddleware, async (req, res) => {
  try {
    const userLang = await getUserLanguage(req.user.id);
    const result = await sendNotification(
      req.user.id,
      'test',
      userLang === 'ru' ? 'Тестовое уведомление ✅' : 'Test notification ✅',
      getTranslation(userLang, 'testNotification')
    );

    res.json({
      ok: true,
      message: userLang === 'ru' ? 'Тестовое уведомление отправлено!' : 'Test notification sent!',
      result
    });
  } catch (e) {
    console.error('Test notification error:', e);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// ---------------- Health Check ----------------
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      telegram: !!bot,
      cron: 'active'
    }
  });
});

// ---------------- Server Start ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Telegram bot: ${bot ? '✅ Active (@evans_notifications_bot)' : '❌ Disabled'}`);
}); 