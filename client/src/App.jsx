import React, { useEffect, useState } from 'react';
import SubList from './components/SubList.jsx';
import AddModal from './components/AddModal.jsx';
import Stats from './components/Stats.jsx';
import Advice from './components/Advice.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx';

// Компонент для перевода
const translations = {
  ru: {
    welcome: {
      title: 'Evans',
      subtitle: 'Умный контроль подписок',
      description: 'Отслеживайте все подписки в одном месте, получайте уведомления о списаниях и оптимизируйте расходы',
      createAccount: 'Начать бесплатно',
      login: 'Войти',
      loginGoogle: 'Продолжить с Google',
      loginTelegram: 'Продолжить с Telegram',
      features: {
        track: 'Отслеживание',
        trackDesc: 'Все подписки в одном месте',
        control: 'Контроль',
        controlDesc: 'Умные напоминания о платежах',
        save: 'Экономия',
        saveDesc: 'Анализ и оптимизация расходов'
      }
    },
    nav: {
      home: 'Главная',
      stats: 'Статистика',
      advice: 'Аналитика'
    },
    common: {
      hello: 'Привет',
      logout: 'Выйти',
      language: 'RU/EN'
    }
  },
  en: {
    welcome: {
      title: 'Evans',
      subtitle: 'Smart Subscription Management',
      description: 'Track all subscriptions in one place, get payment reminders, and optimize your spending',
      createAccount: 'Get Started Free',
      login: 'Sign In',
      loginGoogle: 'Continue with Google',
      loginTelegram: 'Continue with Telegram',
      features: {
        track: 'Tracking',
        trackDesc: 'All subscriptions in one place',
        control: 'Control',
        controlDesc: 'Smart payment reminders',
        save: 'Savings',
        saveDesc: 'Spending analysis and optimization'
      }
    },
    nav: {
      home: 'Home',
      stats: 'Statistics',
      advice: 'Analytics'
    },
    common: {
      hello: 'Hello',
      logout: 'Logout',
      language: 'RU/EN'
    }
  }
};

function AppContent() {
  const [page, setPage] = useState('welcome');
  const [user, setUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  
  const t = translations[language];

  useEffect(() => {
    const url = new URL(window.location.href);
    const t = url.searchParams.get('token');
    if (t) {
      localStorage.setItem('ev_token', t);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname);
    }
    loadMe();
  }, []);

  async function loadMe() {
    const token = localStorage.getItem('ev_token');
    if (!token) return setUser(null);
    try {
      const res = await fetch('/api/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) {
        localStorage.removeItem('ev_token');
        setUser(null);
        return;
      }
      const j = await res.json();
      setUser(j.user);
      setPage('home');
    } catch (e) {
      console.error('Load me error:', e);
      localStorage.removeItem('ev_token');
      setUser(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem('ev_token');
    setUser(null);
    setPage('welcome');
  }

  if (page === 'welcome' && !user) {
    return (
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Evans</span>
          </div>
          <div className="header-actions">
            <button className="btn-text" onClick={() => setPage('login')}>
              {t.welcome.login}
            </button>
            <button className="btn-primary" onClick={() => setPage('register')}>
              {t.welcome.createAccount}
            </button>
            <button className="btn-language" onClick={toggleLanguage}>
              {t.common.language}
            </button>
          </div>
        </div>

        <div className="welcome-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              {t.welcome.title}
            </h1>
            <h2 className="hero-subtitle">{t.welcome.subtitle}</h2>
            <p className="hero-description">{t.welcome.description}</p>
            
            <div className="hero-actions">
              <button className="btn-primary large" onClick={() => setPage('register')}>
                {t.welcome.createAccount}
              </button>
              
              <div className="social-buttons">
                <a href="/auth/google" className="btn-social google">
                  <span className="social-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </span>
                  {t.welcome.loginGoogle}
                </a>
                
                <a href="/auth/telegram" className="btn-social telegram">
                  <span className="social-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#0088cc" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.158l-1.99 9.359c-.145.658-.537.818-1.084.509l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.241-.213-.054-.334-.373-.12l-6.869 4.326-2.96-.924c-.64-.203-.652-.64.135-.945l11.566-4.458c.534-.196 1.006.128.832.945z"/>
                    </svg>
                  </span>
                  {t.welcome.loginTelegram}
                </a>
              </div>
            </div>

            {/* Горизонтальное расположение фич */}
            <div className="features-horizontal">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h3>{t.welcome.features.track}</h3>
                  <p>{t.welcome.features.trackDesc}</p>
                </div>
              </div>
              
              <div className="feature-divider"></div>
              
              <div className="feature-item">
                <div className="feature-icon">🔔</div>
                <div className="feature-content">
                  <h3>{t.welcome.features.control}</h3>
                  <p>{t.welcome.features.controlDesc}</p>
                </div>
              </div>
              
              <div className="feature-divider"></div>
              
              <div className="feature-item">
                <div className="feature-icon">💸</div>
                <div className="feature-content">
                  <h3>{t.welcome.features.save}</h3>
                  <p>{t.welcome.features.saveDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .welcome-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .welcome-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 48px;
            backdrop-filter: blur(10px);
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 700;
          }

          .logo-icon {
            font-size: 28px;
          }

          .logo-text {
            background: linear-gradient(45deg, #fff, #e0e7ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .btn-text {
            background: none;
            border: none;
            color: white;
            font-size: 14px;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 6px;
            transition: background 0.2s;
          }

          .btn-text:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            backdrop-filter: blur(10px);
          }

          .btn-primary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
          }

          .btn-language {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }

          .welcome-hero {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 80px);
            padding: 48px 24px;
          }

          .hero-content {
            text-align: center;
            max-width: 1000px;
          }

          .hero-title {
            font-size: 4rem;
            font-weight: 800;
            margin: 0 0 16px 0;
            background: linear-gradient(45deg, #fff, #e0e7ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-subtitle {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 0 24px 0;
            opacity: 0.9;
          }

          .hero-description {
            font-size: 1.125rem;
            line-height: 1.6;
            margin: 0 0 48px 0;
            opacity: 0.8;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-actions {
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
            align-items: center;
            margin-bottom: 80px;
          }

          .btn-primary.large {
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            min-width: 200px;
          }

          .social-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn-social {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: white;
            min-width: 180px;
            justify-content: center;
          }

          .btn-social:hover {
            transform: translateY(-1px);
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
          }

          .btn-social.google:hover {
            background: rgba(255, 255, 255, 0.9);
            color: #333;
          }

          .btn-social.telegram:hover {
            background: #0088cc;
            border-color: #0088cc;
          }

          /* Горизонтальное расположение фич */
          .features-horizontal {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 0;
            max-width: 800px;
            margin: 0 auto;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 32px 24px;
            flex: 1;
            text-align: left;
            transition: all 0.3s ease;
          }

          .feature-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .feature-icon {
            font-size: 2.5rem;
            flex-shrink: 0;
          }

          .feature-content h3 {
            margin: 0 0 8px 0;
            font-size: 1.125rem;
            font-weight: 600;
          }

          .feature-content p {
            margin: 0;
            opacity: 0.8;
            line-height: 1.4;
            font-size: 0.9rem;
          }

          .feature-divider {
            width: 1px;
            height: 40px;
            background: rgba(255, 255, 255, 0.3);
            flex-shrink: 0;
          }

          @media (max-width: 768px) {
            .welcome-header {
              padding: 16px 24px;
            }

            .hero-title {
              font-size: 3rem;
            }

            .hero-subtitle {
              font-size: 1.25rem;
            }

            .hero-actions {
              margin-bottom: 60px;
            }

            .social-buttons {
              flex-direction: column;
              width: 100%;
              max-width: 300px;
            }

            .btn-social {
              width: 100%;
            }

            .features-horizontal {
              flex-direction: column;
              border-radius: 16px;
            }

            .feature-item {
              text-align: center;
              flex-direction: column;
              gap: 12px;
              padding: 24px 20px;
            }

            .feature-divider {
              width: 80%;
              height: 1px;
              margin: 0 auto;
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: 2.5rem;
            }

            .header-actions {
              gap: 8px;
            }

            .btn-text {
              padding: 6px 12px;
            }

            .btn-primary {
              padding: 8px 16px;
            }

            .features-horizontal {
              margin: 0 16px;
            }
          }
        `}</style>
      </div>
    );
  }

  if (page === 'login') {
    return <Login onSuccess={() => { loadMe(); }} onRegister={() => setPage('register')} onWelcome={() => setPage('welcome')} />;
  }
  if (page === 'register') {
    return <Register onSuccess={() => { loadMe(); }} onLogin={() => setPage('login')} onWelcome={() => setPage('welcome')} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Evans</span>
          </div>
          <nav className="nav">
            <button
              onClick={() => setPage('home')}
              className={page === 'home' ? 'nav-btn active' : 'nav-btn'}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => setPage('stats')}
              className={page === 'stats' ? 'nav-btn active' : 'nav-btn'}
            >
              {t.nav.stats}
            </button>
            <button
              onClick={() => setPage('advice')}
              className={page === 'advice' ? 'nav-btn active' : 'nav-btn'}
            >
              {t.nav.advice}
            </button>
          </nav>
        </div>
        <div className="header-right">
          <div className="user-info">{t.common.hello}, {user?.name || user?.email}</div>
          <button className="btn language-btn" onClick={toggleLanguage}>
            {t.common.language}
          </button>
          <button className="btn outline" onClick={handleLogout}>{t.common.logout}</button>
        </div>
      </header>

      <main className="main">
        {page === 'home' && <SubList onAddSubscription={() => setShowAdd(true)} />}
        {page === 'stats' && <Stats />}
        {page === 'advice' && <Advice />}
      </main>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: #f8fafc;
        }
        
        .header {
          background: white;
          padding: 16px 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        
        .logo {
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
        
        .nav {
          display: flex;
          gap: 4px;
        }
        
        .nav-btn {
          padding: 10px 20px;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          color: #64748b;
        }
        
        .nav-btn:hover {
          background: #f1f5f9;
          color: #334155;
        }
        
        .nav-btn.active {
          background: #007bff;
          color: white;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .user-info {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }
        
        .language-btn {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .language-btn:hover {
          background: #f8fafc;
          border-color: #007bff;
          color: #007bff;
        }
        
        .btn {
          padding: 10px 20px;
          border: 2px solid #007bff;
          background: #007bff;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .btn:hover {
          background: #0056b3;
          border-color: #0056b3;
          transform: translateY(-1px);
        }
        
        .btn.outline {
          background: white;
          color: #007bff;
        }
        
        .btn.outline:hover {
          background: #f8f9fa;
        }
        
        .main {
          padding: 32px;
          min-height: calc(100vh - 80px);
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}