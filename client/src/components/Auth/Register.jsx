import React, { useState } from 'react';
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
      telegramPlaceholder: '@username или номер телефона',
      telegramHint: 'Укажите ваш Telegram для получения уведомлений. Мы автоматически найдем ваш Chat ID',
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
        telegramInvalid: 'Некорректный формат Telegram'
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
      telegramPlaceholder: '@username or phone number',
      telegramHint: 'Provide your Telegram for notifications. We will automatically find your Chat ID',
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
        telegramInvalid: 'Invalid Telegram format'
      }
    }
  };

  const t = translations[language];

  // Валидация email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация пароля
  const validatePassword = (password) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };

  // Валидация Telegram
  const validateTelegram = (telegram) => {
    if (!telegram) return true; // Необязательное поле
    const telegramRegex = /^(@[a-zA-Z0-9_]{5,32}|(\+?\d{10,15}))$/;
    return telegramRegex.test(telegram);
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    // Валидация email
    if (!email) {
      newErrors.email = t.errors.emailRequired;
    } else if (!validateEmail(email)) {
      newErrors.email = t.errors.emailInvalid;
    }

    // Валидация имени
    if (name && name.length < 2) {
      newErrors.name = t.errors.nameTooShort;
    }

    // Валидация пароля
    if (!password) {
      newErrors.password = t.errors.passwordRequired;
    } else if (!validatePassword(password)) {
      newErrors.password = t.errors.passwordWeak;
    }

    // Валидация подтверждения пароля
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.errors.passwordsMatch;
    }

    // Валидация Telegram
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
      const res = await fetch('/api/register', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ 
          email, 
          password, 
          name: name || undefined,
          telegram_username: telegramUsername || undefined
        })
      });
      
      const j = await res.json();
      
      if (j.token) {
        localStorage.setItem('ev_token', j.token);
        
        // Если указан Telegram, отправляем приветственное сообщение
        if (telegramUsername) {
          try {
            await fetch('/api/send-telegram-welcome', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + j.token
              },
              body: JSON.stringify({ telegram_username: telegramUsername })
            });
          } catch (telegramError) {
            console.log('Telegram welcome message not sent:', telegramError);
          }
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

  // Очистка ошибки при изменении поля
  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="auth-container">
      {/* Декоративные элементы фона в стиле Evans */}
      <div className="background-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-pattern"></div>
      </div>

      {/* Основная карточка */}
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
            {/* Поле имени */}
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

            {/* Поле email */}
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

            {/* Поле пароля */}
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

            {/* Подтверждение пароля */}
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

            {/* Поле Telegram */}
            <div className="input-group">
              <label className="input-label">
                {t.telegramLabel}
                <span className="optional-tag">{t.optional}</span>
              </label>
              <input 
                type="text"
                className={`text-input ${errors.telegramUsername ? 'input-error' : ''}`}
                value={telegramUsername}
                onChange={e => {
                  setTelegramUsername(e.target.value);
                  clearError('telegramUsername');
                }}
                placeholder={t.telegramPlaceholder}
              />
              <div className="telegram-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.158l-1.99 9.359c-.145.658-.537.818-1.084.509l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.241-.213-.054-.334-.373-.12l-6.869 4.326-2.96-.924c-.64-.203-.652-.64.135-.945l11.566-4.458c.534-.196 1.006.128.832.945z"/>
                </svg>
                {t.telegramHint}
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
          background: linear-gradient(135deg, #FAF0E6 0%, #FFF8DC 50%, #F5F5DC 100%);
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
          background: rgba(160, 82, 45, 0.03);
          border: 1px solid rgba(160, 82, 45, 0.1);
        }

        .shape-1 {
          width: 250px;
          height: 250px;
          top: 10%;
          right: 5%;
          background: rgba(139, 69, 19, 0.05);
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: 15%;
          left: 5%;
          background: rgba(210, 180, 140, 0.08);
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          background: rgba(139, 115, 85, 0.06);
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(160, 82, 45, 0.03) 2px, transparent 0),
            radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.02) 1px, transparent 0);
          background-size: 60px 60px, 40px 40px;
          background-position: 0 0, 20px 20px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(139, 69, 19, 0.1),
            0 8px 24px rgba(139, 69, 19, 0.05),
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
          border: 1px solid rgba(210, 180, 140, 0.4);
          border-radius: 12px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #8B7355;
          backdrop-filter: blur(10px);
          font-size: 14px;
          font-weight: 500;
        }

        .back-button:hover {
          background: #A0522D;
          color: white;
          border-color: #A0522D;
          transform: translateX(-2px);
        }

        .back-text {
          display: none;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 20px;
          color: #A0522D;
        }

        .logo-icon {
          font-size: 24px;
          background: linear-gradient(135deg, #A0522D, #8B4513);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
          background: linear-gradient(135deg, #8B4513, #A0522D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 16px;
          color: #8B7355;
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
          color: #8B4513;
        }

        .optional-tag {
          background: rgba(160, 82, 45, 0.1);
          color: #A0522D;
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid rgba(160, 82, 45, 0.2);
        }

        .text-input {
          padding: 16px;
          border: 2px solid rgba(210, 180, 140, 0.4);
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          color: #8B4513;
          backdrop-filter: blur(10px);
        }

        .text-input:focus {
          outline: none;
          border-color: #A0522D;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 4px rgba(160, 82, 45, 0.1);
          transform: translateY(-1px);
        }

        .text-input::placeholder {
          color: #A0522D;
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
          color: #8B7355;
          opacity: 0.7;
        }

        .telegram-note {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 136, 204, 0.05);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(0, 136, 204, 0.2);
          color: #2c3e50;
          font-size: 12px;
          margin-top: 4px;
        }

        .submit-button {
          background: linear-gradient(135deg, #A0522D, #8B4513);
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
            0 8px 25px rgba(160, 82, 45, 0.3),
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

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 28px 0;
          color: #8B7355;
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(210, 180, 140, 0.6), transparent);
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
          color: #8B7355;
          opacity: 0.9;
        }

        .footer-link {
          background: none;
          border: none;
          color: #A0522D;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .footer-link:hover {
          background: rgba(160, 82, 45, 0.1);
          color: #8B4513;
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