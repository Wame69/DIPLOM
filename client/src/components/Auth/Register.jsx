import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export default function Register({ onSuccess, onLogin, onWelcome }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const translations = {
    ru: {
      title: 'Создать аккаунт',
      subtitle: 'Присоединяйтесь к Evans для управления подписками',
      nameLabel: 'Имя',
      namePlaceholder: 'Введите ваше имя',
      optional: 'Необязательно',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Создайте надежный пароль',
      telegramLabel: 'Telegram Chat ID',
      telegramPlaceholder: 'Ваш ID чата в Telegram',
      telegramHint: 'Если указать Telegram Chat ID — мы сразу отправим приветствие в Telegram',
      registerBtn: 'Создать аккаунт',
      loginText: 'Уже есть аккаунт?',
      loginLink: 'Войти',
      back: 'Назад',
      or: 'или',
      minPassword: 'Минимум 6 символов'
    },
    en: {
      title: 'Create Account',
      subtitle: 'Join Evans to manage your subscriptions',
      nameLabel: 'Name',
      namePlaceholder: 'Enter your name',
      optional: 'Optional',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a strong password',
      telegramLabel: 'Telegram Chat ID',
      telegramPlaceholder: 'Your Telegram chat ID',
      telegramHint: 'If you provide Telegram Chat ID, we will send a welcome message immediately',
      registerBtn: 'Create Account',
      loginText: 'Already have an account?',
      loginLink: 'Sign In',
      back: 'Back',
      or: 'or',
      minPassword: 'Minimum 6 characters'
    }
  };

  const t = translations[language];

  async function submit(e) {
    e.preventDefault();
    if (password.length < 6) {
      alert(language === 'ru' ? 'Пароль должен содержать минимум 6 символов' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/register', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ email, password, name, telegram_chat_id: telegramChatId })
      });
      const j = await res.json();
      if (j.token) {
        localStorage.setItem('ev_token', j.token);
        onSuccess();
      } else {
        alert(j.error || (language === 'ru' ? 'Ошибка регистрации' : 'Registration error'));
      }
    } catch (e) { 
      console.error(e); 
      alert(language === 'ru' ? 'Ошибка соединения' : 'Connection error'); 
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button className="back-button" onClick={onWelcome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="auth-logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Evans</span>
          </div>
          <div style={{width: '40px'}}></div> {/* Spacer for alignment */}
        </div>

        <div className="auth-content">
          <h1 className="auth-title">{t.title}</h1>
          <p className="auth-subtitle">{t.subtitle}</p>

          <form onSubmit={submit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                {t.nameLabel}
                <span className="optional-badge">{t.optional}</span>
              </label>
              <input 
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.emailLabel}</label>
              <input 
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.passwordLabel}</label>
              <input 
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                minLength="6"
                required
              />
              <div className="input-hint">{t.minPassword}</div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.telegramLabel}
                <span className="optional-badge">{t.optional}</span>
              </label>
              <input 
                type="text"
                className="form-input"
                value={telegramChatId}
                onChange={e => setTelegramChatId(e.target.value)}
                placeholder={t.telegramPlaceholder}
              />
              <div className="input-hint telegram-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.158l-1.99 9.359c-.145.658-.537.818-1.084.509l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.241-.213-.054-.334-.373-.12l-6.869 4.326-2.96-.924c-.64-.203-.652-.64.135-.945l11.566-4.458c.534-.196 1.006.128.832.945z"/>
                </svg>
                {t.telegramHint}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary large full-width"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  {language === 'ru' ? 'Создание...' : 'Creating...'}
                </>
              ) : (
                t.registerBtn
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t.or}</span>
          </div>

          <div className="auth-footer">
            <span className="auth-footer-text">{t.loginText}</span>
            <button className="auth-link" onClick={onLogin}>
              {t.loginLink}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .auth-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 440px;
          overflow: hidden;
        }

        .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }

        .back-button {
          background: #f8fafc;
          border: none;
          border-radius: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
        }

        .back-button:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 20px;
          color: #007bff;
        }

        .logo-icon {
          font-size: 20px;
        }

        .auth-content {
          padding: 32px;
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          text-align: center;
        }

        .auth-subtitle {
          font-size: 16px;
          color: #64748b;
          text-align: center;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .optional-badge {
          background: #f3f4f6;
          color: #6b7280;
          font-size: 11px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .form-input {
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .input-hint {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .telegram-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0f9ff;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e0f2fe;
          color: #0369a1;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary.large {
          padding: 16px 24px;
          font-size: 16px;
        }

        .btn-primary.full-width {
          width: 100%;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .auth-divider span {
          padding: 0 16px;
        }

        .auth-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
        }

        .auth-footer-text {
          color: #6b7280;
        }

        .auth-link {
          background: none;
          border: none;
          color: #007bff;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .auth-link:hover {
          background: #f0f9ff;
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 16px;
            align-items: flex-start;
          }

          .auth-card {
            border-radius: 16px;
          }

          .auth-content {
            padding: 24px;
          }

          .auth-title {
            font-size: 24px;
          }

          .auth-header {
            padding: 20px 20px 0;
          }
        }
      `}</style>
    </div>
  );
}