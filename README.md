# Evens — Subscription Tracker (Diploma Project)

Это готовый проект для диплома: backend + frontend, PWA-ready, с поддержкой регистрации (email/password), Google OAuth и Telegram Login Widget, а также Telegram уведомлений.

## Структура
- `server.js` — сервер (Express + SQLite)
- `package.json` — зависимости сервера
- `client/` — React frontend (Vite)
- `data/` — хранение SQLite (создаётся автоматически)
- `.env.example` — пример переменных окружения

## Быстрый старт (локально)

1. Сервер:
```bash
# в корне папки Evens
npm install
cp .env.example .env
# отредактируй .env (особенно JWT_SECRET, FRONTEND_URL)
node server.js
```

2. Фронтенд:
```bash
cd client
npm install
npm run dev
# открой http://localhost:3000
```

## OAuth / Telegram
- Google OAuth: зарегай приложение в Google Cloud, укажи `http://localhost:4000/auth/google/callback` в разрешённых redirect URI.
- Telegram Login: укажи имя бота (например `@my_bot`) в REACT_APP_TELEGRAM_BOT_NAME при сборке клиента, либо используй кнопку вручную.

## Примечания
- По умолчанию база создаётся в `data/subtrackr.db`.
- Cron job в сервере запускается каждый час и посылает Telegram-напоминания пользователям, у которых задан `telegram_chat_id`, либо в глобальный `TELEGRAM_CHAT_ID`.

Удачи на защите — если хочешь, могу ещё добавить оформление README и подготовить короткую презентацию.
