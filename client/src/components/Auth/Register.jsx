import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export default function Register({ onSuccess, onLogin, onWelcome }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
      confirmPasswordLabel: 'Подтверждение пароля',
      confirmPasswordPlaceholder: 'Повторите пароль',
      telegramLabel: 'Telegram Username',
      telegramPlaceholder: '@username',
      telegramHint: 'Укажите ваш Telegram для получения уведомлений',
      telegramConnect: 'Подключить Telegram',
      telegramConnecting: 'Подключение...',
      telegramConnected: 'Telegram подключен!',
      registerBtn: 'Создать аккаунт',
      loginText: 'Уже есть аккаунт?',
      loginLink: 'Войти',
      back: 'Назад',
      or: 'или',
      minPassword: 'Минимум 8 символов, включая цифры и буквы',
      errors: {
        emailRequired: 'Email обязателен',
        emailInvalid: 'Некорректный формат email',
        passwordRequired: 'Пароль обязателен',
        passwordWeak: 'Пароль слишком слабый',
        passwordsMatch: 'Пароли не совпадают',
        nameTooShort: 'Имя должно содержать минимум 2 символа',
        telegramInvalid: 'Некорректный формат Telegram (начинается с @)'
      }
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
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Repeat password',
      telegramLabel: 'Telegram Username',
      telegramPlaceholder: '@username',
      telegramHint: 'Provide your Telegram for notifications',
      telegramConnect: 'Connect Telegram',
      telegramConnecting: 'Connecting...',
      telegramConnected: 'Telegram connected!',
      registerBtn: 'Create Account',
      loginText: 'Already have an account?',
      loginLink: 'Sign In',
      back: 'Back',
      or: 'or',
      minPassword: 'Minimum 8 characters, including numbers and letters',
      errors: {
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        passwordRequired: 'Password is required',
        passwordWeak: 'Password is too weak',
        passwordsMatch: 'Passwords do not match',
        nameTooShort: 'Name must be at least 2 characters',
        telegramInvalid: 'Invalid Telegram format (must start with @)'
      }
    }
  };

  const t = translations[language];
  const [telegramStatus, setTelegramStatus] = useState('disconnected');

  useEffect(() => {
    const checkPendingTelegramConnection = () => {
      const pending = localStorage.getItem('pending_telegram_connection');
      if (pending) {
        const connectionData = JSON.parse(pending);
        
        if (Date.now() - connectionData.timestamp < 10 * 60 * 1000) {
          if (connectionData.username === telegramUsername) {
            setTelegramStatus('pending');
          }
        } else {
          localStorage.removeItem('pending_telegram_connection');
        }
      }
    };

    checkPendingTelegramConnection();
  }, [telegramUsername]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };

  const validateTelegram = (telegram) => {
    if (!telegram) return true;
    const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/;
    return telegramRegex.test(telegram);
  };

  const connectTelegram = async () => {
    if (!telegramUsername || !validateTelegram(telegramUsername)) {
      setErrors(prev => ({ ...prev, telegramUsername: t.errors.telegramInvalid }));
      return;
    }

    setTelegramStatus('connecting');

    try {
      const token = localStorage.getItem('ev_token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const response = await fetch('/api/telegram/generate-link', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          telegramUsername: telegramUsername,
          email: email,
          name: name
        })
      });

      const result = await response.json();

      if (result.success && result.telegramUrl) {
        localStorage.setItem('pending_telegram_connection', JSON.stringify({
          username: telegramUsername,
          email: email,
          timestamp: Date.now()
        }));

        window.open(result.telegramUrl, '_blank');
        
        setTelegramStatus('pending');
        
        setTimeout(() => {
          alert(
            language === 'ru'
              ? 'Telegram открыт. Нажмите кнопку "START" в диалоге с ботом @evans_notifications_bot, затем вернитесь в приложение и завершите регистрацию.'
              : 'Telegram opened. Click "START" button in the bot chat @evans_notifications_bot, then return to the app and complete registration.'
          );
        }, 1000);
      } else {
        throw new Error(result.error || 'Failed to generate Telegram link');
      }

    } catch (error) {
      console.error('Telegram connection error:', error);
      setTelegramStatus('disconnected');
      setErrors(prev => ({ 
        ...prev, 
        telegramUsername: language === 'ru' 
          ? 'Ошибка подключения. Попробуйте позже'
          : 'Connection error. Please try again later'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = t.errors.emailRequired;
    } else if (!validateEmail(email)) {
      newErrors.email = t.errors.emailInvalid;
    }

    if (name && name.length < 2) {
      newErrors.name = t.errors.nameTooShort;
    }

    if (!password) {
      newErrors.password = t.errors.passwordRequired;
    } else if (!validatePassword(password)) {
      newErrors.password = t.errors.passwordWeak;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.errors.passwordsMatch;
    }

    if (telegramUsername && !validateTelegram(telegramUsername)) {
      newErrors.telegramUsername = t.errors.telegramInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      let finalTelegramUsername = telegramUsername;
      
      const pendingConnection = localStorage.getItem('pending_telegram_connection');
      if (pendingConnection) {
        const connectionData = JSON.parse(pendingConnection);
        if (connectionData.username === telegramUsername) {
          finalTelegramUsername = telegramUsername;
        }
      }

      const res = await fetch('/api/register', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ 
          email, 
          password, 
          name: name || undefined,
          telegram_username: finalTelegramUsername || undefined
        })
      });
      
      const j = await res.json();
      
      if (j.token) {
        localStorage.setItem('ev_token', j.token);
        localStorage.removeItem('pending_telegram_connection');
        
        if (finalTelegramUsername) {
          alert(
            language === 'ru'
              ? `Аккаунт создан! Теперь откройте Telegram и нажмите START в диалоге с @evans_notifications_bot чтобы подключить уведомления.`
              : `Account created! Now open Telegram and press START in the chat with @evans_notifications_bot to connect notifications.`
          );
        }
        
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

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="auth-container">
      <div className="background-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="auth-card">
        <div className="card-header">
          <button className="back-button" onClick={onWelcome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="back-text">{t.back}</span>
          </button>
          <div className="header-spacer"></div>
        </div>

        <div className="card-content">
          <div className="content-header">
            <h1 className="title">{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <div className="input-group">
              <label className="input-label">
                {t.nameLabel}
                <span className="optional-tag">{t.optional}</span>
              </label>
              <input 
                type="text"
                className={`text-input ${errors.name ? 'input-error' : ''}`}
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  clearError('name');
                }}
                placeholder={t.namePlaceholder}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">{t.emailLabel}</label>
              <input 
                type="email"
                className={`text-input ${errors.email ? 'input-error' : ''}`}
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
                placeholder={t.emailPlaceholder}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">{t.passwordLabel}</label>
              <input 
                type="password"
                className={`text-input ${errors.password ? 'input-error' : ''}`}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  clearError('password');
                }}
                placeholder={t.passwordPlaceholder}
                required
              />
              <div className="input-hint">{t.minPassword}</div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">{t.confirmPasswordLabel}</label>
              <input 
                type="password"
                className={`text-input ${errors.confirmPassword ? 'input-error' : ''}`}
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  clearError('confirmPassword');
                }}
                placeholder={t.confirmPasswordPlaceholder}
                required
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">
                {t.telegramLabel}
                <span className="optional-tag">{t.optional}</span>
              </label>
              
              <div className="telegram-input-container">
                <input 
                  type="text"
                  className={`text-input ${errors.telegramUsername ? 'input-error' : ''}`}
                  value={telegramUsername}
                  onChange={e => {
                    setTelegramUsername(e.target.value);
                    clearError('telegramUsername');
                    setTelegramStatus('disconnected');
                  }}
                  placeholder={t.telegramPlaceholder}
                />
                <button
                  type="button"
                  className={`telegram-connect-btn ${
                    telegramStatus === 'connected' ? 'connected' : 
                    telegramStatus === 'connecting' ? 'connecting' : 
                    telegramStatus === 'pending' ? 'pending' : ''
                  }`}
                  onClick={connectTelegram}
                  disabled={!telegramUsername || telegramStatus === 'connecting'}
                >
                  {telegramStatus === 'connecting' ? (
                    <>
                      <div className="loading-spinner small"></div>
                      {t.telegramConnecting}
                    </>
                  ) : telegramStatus === 'connected' ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      {t.telegramConnected}
                    </>
                  ) : telegramStatus === 'pending' ? (
                    <>
                      <div className="pending-indicator"></div>
                      {language === 'ru' ? 'Ожидание...' : 'Pending...'}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.158l-1.99 9.359c-.145.658-.537.818-1.084.509l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.241-.213-.054-.334-.373-.12l-6.869 4.326-2.96-.924c-.64-.203-.652-.64.135-.945l11.566-4.458c.534-.196 1.006.128.832.945z"/>
                      </svg>
                      {t.telegramConnect}
                    </>
                  )}
                </button>
              </div>
              
              <div className="telegram-note">
                <div className="telegram-steps">
                  <h4>{language === 'ru' ? 'Как подключить Telegram:' : 'How to connect Telegram:'}</h4>
                  <ol>
                    <li>{language === 'ru' ? 'Нажмите кнопку "Подключить Telegram"' : 'Click "Connect Telegram" button'}</li>
                    <li>{language === 'ru' ? 'Откроется Telegram с ботом @evans_notifications_bot' : 'Telegram will open with @evans_notifications_bot'}</li>
                    <li>{language === 'ru' ? 'Нажмите START в диалоге с ботом' : 'Click START in the bot chat'}</li>
                    <li>{language === 'ru' ? 'Вернитесь и завершите регистрацию' : 'Return and complete registration'}</li>
                  </ol>
                  <div className="telegram-bot-info">
                    <strong>Бот: @evans_notifications_bot</strong>
                  </div>
                </div>
              </div>
              
              {errors.telegramUsername && <span className="error-text">{errors.telegramUsername}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  {language === 'ru' ? 'Создание...' : 'Creating...'}
                </>
              ) : (
                t.registerBtn
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">{t.or}</span>
          </div>

          <div className="auth-footer">
            <span className="footer-text">{t.loginText}</span>
            <button className="footer-link" onClick={onLogin}>
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
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .background-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(26, 54, 93, 0.03), rgba(45, 55, 72, 0.02));
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .shape-1 {
          width: 250px;
          height: 250px;
          top: 10%;
          right: 5%;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: 15%;
          left: 5%;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 20%, rgba(26, 54, 93, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(26, 54, 93, 0.01) 0%, transparent 50%);
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.6);
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #4a5568;
          backdrop-filter: blur(10px);
          font-size: 14px;
          font-weight: 500;
        }

        .back-button:hover {
          background: #1a365d;
          color: white;
          border-color: #1a365d;
          transform: translateX(-2px);
        }

        .back-text {
          display: none;
        }

        .header-spacer {
          width: 40px;
        }

        .card-content {
          padding: 32px;
        }

        .content-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 16px;
          color: #4a5568;
          margin: 0;
          line-height: 1.5;
          opacity: 0.9;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1a365d;
        }

        .optional-tag {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid rgba(26, 54, 93, 0.2);
        }

        .text-input {
          padding: 16px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          color: #1a365d;
          backdrop-filter: blur(10px);
        }

        .text-input:focus {
          outline: none;
          border-color: #1a365d;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 4px rgba(26, 54, 93, 0.1);
          transform: translateY(-1px);
        }

        .text-input::placeholder {
          color: #4a5568;
          opacity: 0.5;
        }

        .text-input.input-error {
          border-color: #e74c3c;
          background-color: rgba(231, 76, 60, 0.05);
        }

        .text-input.input-error:focus {
          border-color: #e74c3c;
          box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
        }

        .error-text {
          color: #e74c3c;
          font-size: 12px;
          font-weight: 500;
          margin-top: 2px;
        }

        .input-hint {
          font-size: 12px;
          color: #4a5568;
          opacity: 0.7;
        }

        .telegram-input-container {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }

        .telegram-input-container .text-input {
          flex: 1;
        }

        .telegram-connect-btn {
          background: linear-gradient(135deg, #0088cc, #006699);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          min-width: 160px;
          justify-content: center;
        }

        .telegram-connect-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 136, 204, 0.3);
        }

        .telegram-connect-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .telegram-connect-btn.connecting {
          background: linear-gradient(135deg, #4a5568, #2d3748);
        }

        .telegram-connect-btn.connected {
          background: linear-gradient(135deg, #38a169, #2f855a);
        }

        .telegram-connect-btn.pending {
          background: linear-gradient(135deg, #d69e2e, #b7791f);
        }

        .telegram-note {
          background: rgba(0, 136, 204, 0.05);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(0, 136, 204, 0.2);
          margin-top: 4px;
        }

        .telegram-steps h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #1a365d;
          font-weight: 600;
        }

        .telegram-steps ol {
          margin: 0;
          padding-left: 16px;
          font-size: 12px;
          color: #4a5568;
          line-height: 1.4;
        }

        .telegram-steps li {
          margin-bottom: 4px;
        }

        .telegram-bot-info {
          margin-top: 8px;
          padding: 8px;
          background: rgba(0, 136, 204, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(0, 136, 204, 0.2);
          font-size: 12px;
          text-align: center;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-spinner.small {
          width: 14px;
          height: 14px;
          border-width: 1.5px;
        }

        .pending-indicator {
          width: 14px;
          height: 14px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .submit-button {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 18px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          backdrop-filter: blur(10px);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px rgba(26, 54, 93, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 28px 0;
          color: #4a5568;
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.8), transparent);
        }

        .divider-text {
          padding: 0 16px;
          opacity: 0.8;
        }

        .auth-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
        }

        .footer-text {
          color: #4a5568;
          opacity: 0.9;
        }

        .footer-link {
          background: none;
          border: none;
          color: #1a365d;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .footer-link:hover {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          transform: translateY(-1px);
        }

        @media (min-width: 768px) {
          .back-text {
            display: block;
          }
          
          .back-button {
            padding: 8px 16px;
          }
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 16px;
            align-items: flex-start;
          }

          .auth-card {
            border-radius: 20px;
          }

          .card-content {
            padding: 24px;
          }

          .title {
            font-size: 28px;
          }

          .card-header {
            padding: 20px 20px 0;
          }

          .telegram-input-container {
            flex-direction: column;
          }

          .telegram-connect-btn {
            min-width: auto;
            padding: 12px 16px;
          }

          .shape-1 {
            width: 180px;
            height: 180px;
            top: 5%;
            right: -30px;
          }

          .shape-2 {
            width: 150px;
            height: 150px;
            bottom: 10%;
            left: -20px;
          }

          .shape-3 {
            width: 120px;
            height: 120px;
            top: 70%;
            right: 10%;
          }
        }
      `}</style>
    </div>
  );
}