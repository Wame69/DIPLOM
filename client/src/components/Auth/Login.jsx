import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export default function Login({ onSuccess, onRegister, onWelcome }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const translations = {
    ru: {
      title: 'Вход в Evans',
      subtitle: 'Войдите в свой аккаунт для управления подписками',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Пароль',
      passwordPlaceholder: 'Введите ваш пароль',
      login: 'Войти',
      noAccount: 'Нет аккаунта?',
      register: 'Зарегистрироваться',
      back: 'Назад',
      loginError: 'Ошибка входа',
      or: 'или'
    },
    en: {
      title: 'Sign in to Evans',
      subtitle: 'Sign in to your account to manage subscriptions',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      login: 'Sign In',
      noAccount: 'No account?',
      register: 'Register',
      back: 'Back',
      loginError: 'Login error',
      or: 'or'
    }
  };

  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) throw new Error('Login failed');
      
      const data = await res.json();
      localStorage.setItem('ev_token', data.token);
      onSuccess();
    } catch (error) {
      console.error('Login error:', error);
      alert(t.loginError);
    } finally {
      setLoading(false);
    }
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

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">{t.email}</label>
              <input 
                type="email"
                className="text-input"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">{t.password}</label>
              <input 
                type="password"
                className="text-input"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder={t.passwordPlaceholder}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  {language === 'ru' ? 'Вход...' : 'Signing in...'}
                </>
              ) : (
                t.login
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">{t.or}</span>
          </div>

          <div className="auth-footer">
            <span className="footer-text">{t.noAccount}</span>
            <button className="footer-link" onClick={onRegister}>
              {t.register}
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