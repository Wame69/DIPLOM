import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export default function Login({ onSuccess, onRegister, onWelcome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const translations = {
    ru: {
      title: 'Вход в Evans',
      subtitle: 'С возвращением! Войдите в свой аккаунт',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Введите ваш пароль',
      loginBtn: 'Войти',
      registerText: 'Нет аккаунта?',
      registerLink: 'Создать аккаунт',
      back: 'Назад',
      or: 'или',
      socialHint: 'Или войдите через социальные сети на главном экране',
      forgotPassword: 'Забыли пароль?'
    },
    en: {
      title: 'Sign In to Evans',
      subtitle: 'Welcome back! Sign in to your account',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      loginBtn: 'Sign In',
      registerText: 'Don\'t have an account?',
      registerLink: 'Create account',
      back: 'Back',
      or: 'or',
      socialHint: 'Or sign in with social networks on the main screen',
      forgotPassword: 'Forgot password?'
    }
  };

  const t = translations[language];

  async function submit(e) {
    e.preventDefault();
    if (!email || !password) {
      alert(language === 'ru' ? 'Заполните все поля' : 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/login', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ email, password })
      });
      const j = await res.json();
      if (j.token) {
        localStorage.setItem('ev_token', j.token);
        onSuccess();
      } else {
        alert(j.error || (language === 'ru' ? 'Ошибка входа' : 'Login error'));
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
          <div style={{width: '40px'}}></div>
        </div>

        <div className="auth-content">
          <h1 className="auth-title">{t.title}</h1>
          <p className="auth-subtitle">{t.subtitle}</p>

          <form onSubmit={submit} className="auth-form">
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
              <div className="password-header">
                <label className="form-label">{t.passwordLabel}</label>
                <button type="button" className="forgot-password">
                  {t.forgotPassword}
                </button>
              </div>
              <input 
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary large full-width"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  {language === 'ru' ? 'Вход...' : 'Signing in...'}
                </>
              ) : (
                t.loginBtn
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t.or}</span>
          </div>

          <div className="social-hint">
            {t.socialHint}
          </div>

          <div className="auth-footer">
            <span className="auth-footer-text">{t.registerText}</span>
            <button className="auth-link" onClick={onRegister}>
              {t.registerLink}
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

        .password-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .forgot-password {
          background: none;
          border: none;
          color: #007bff;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .forgot-password:hover {
          background: #f0f9ff;
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

        .social-hint {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.5;
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

          .password-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .forgot-password {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}