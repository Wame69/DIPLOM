// App.jsx
import React, { useEffect, useState, useRef } from 'react';
import SubList from './components/SubList.jsx';
import AddModal from './components/AddModal.jsx';
import EditSubscriptionModal from './components/EditSubscriptionModal.jsx';
import Stats from './components/Stats.jsx';
import Advice from './components/Advice.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import NotificationsPanel from './components/NotificationsPanel.jsx';
import ProfileSettings from './components/ProfileSettings.jsx';
import AppSettings from './components/AppSettings.jsx';
import HelpCenter from './components/HelpCenter.jsx';
import AboutApp from './components/AboutApp.jsx';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx';

// AI Assistant Component
function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Привет! Я ваш AI-помощник по подпискам. Я могу помочь анализировать ваши расходы, находить дублирующиеся подписки и предлагать оптимизации. Чем могу помочь?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Имитация AI ответа с реальной логикой
    setTimeout(() => {
      let response = '';
      
      if (input.toLowerCase().includes('экономи') || input.toLowerCase().includes('сэкономить')) {
        response = "Проанализировав ваши подписки, я вижу возможность сэкономить около 2000₽ в месяц. Рекомендую объединить стриминговые сервисы и перейти на годовые тарифы для софта.";
      } else if (input.toLowerCase().includes('дублирующиеся') || input.toLowerCase().includes('похожие')) {
        response = "Нашел 2 потенциально дублирующиеся подписки: Spotify и Яндекс.Музыка. Также Netflix и Кинопоиск HD предлагают схожий контент. Могу помочь оптимизировать?";
      } else if (input.toLowerCase().includes('статистик') || input.toLowerCase().includes('аналитик')) {
        response = "Ваши ежемесячные расходы на подписки: 8450₽. Самые затратные категории: стриминг (45%), софт (25%). По сравнению с прошлым месяцем расходы выросли на 12%.";
      } else {
        response = "Я ваш AI-помощник по подпискам. Я могу:\n• Анализировать ваши расходы\n• Находить дублирующиеся подписки\n• Предлагать оптимизации\n• Сравнивать тарифы\n\nЧто вас интересует?";
      }

      const aiResponse = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <div className="ai-title">
          <span className="ai-icon">🤖</span>
          <h3>AI Помощник</h3>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="ai-chat">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      <div className="ai-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Спросите о ваших подписках..."
        />
        <button onClick={handleSend} disabled={!input.trim()}>➤</button>
      </div>
      
      <div className="ai-suggestions">
        <button onClick={() => setInput('Как я могу сэкономить на подписках?')}>
          💰 Экономия
        </button>
        <button onClick={() => setInput('Какие подписки можно оптимизировать?')}>
          🔄 Оптимизация
        </button>
        <button onClick={() => setInput('Покажи мою статистику расходов')}>
          📊 Статистика
        </button>
      </div>

      <style jsx>{`
        .ai-assistant {
          position: fixed;
          bottom: 80px;
          right: 32px;
          width: 400px;
          height: 500px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .ai-header {
          padding: 20px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .ai-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .ai-icon {
          font-size: 20px;
        }
        
        .ai-header h3 {
          margin: 0;
          color: #333;
          font-weight: 600;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        
        .close-btn:hover {
          background: rgba(0,0,0,0.05);
        }
        
        .ai-chat {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .message {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 16px;
          animation: messageAppear 0.3s ease;
        }
        
        @keyframes messageAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .message.assistant {
          align-self: flex-start;
          background: rgba(0,0,0,0.05);
          color: #333;
        }
        
        .message-content {
          margin-bottom: 4px;
          white-space: pre-line;
        }
        
        .message-time {
          font-size: 11px;
          opacity: 0.7;
        }
        
        .typing-indicator {
          display: flex;
          gap: 4px;
        }
        
        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #666;
          animation: typing 1.4s infinite;
        }
        
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        
        .ai-input {
          padding: 16px 20px;
          border-top: 1px solid rgba(0,0,0,0.1);
          display: flex;
          gap: 12px;
        }
        
        .ai-input input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          outline: none;
          font-size: 14px;
        }
        
        .ai-input button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .ai-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .ai-suggestions {
          padding: 0 20px 16px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .ai-suggestions button {
          padding: 8px 12px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          background: rgba(0,0,0,0.05);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }
        
        .ai-suggestions button:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
        }
        
        @media (max-width: 768px) {
          .ai-assistant {
            width: calc(100vw - 32px);
            right: 16px;
            bottom: 16px;
            height: 60vh;
          }
        }
      `}</style>
    </div>
  );
}

// Voice Command Component
function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Голосовые команды не поддерживаются в вашем браузере. Попробуйте Chrome или Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ru-RU';

    recognition.start();
    setIsListening(true);
    setTranscript('');

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      console.log('Voice command:', text);
      
      // Обработка команд
      handleVoiceCommand(text.toLowerCase());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleVoiceCommand = (command) => {
    const commands = {
      'добавить подписку': () => {
        alert('Открываю форму добавления подписки');
        // Здесь можно вызвать функцию открытия модального окна
      },
      'показать статистику': () => {
        alert('Перехожу к статистике');
        window.location.hash = '#stats';
      },
      'сколько я трачу': () => {
        alert('Ваши ежемесячные расходы: 8,450 рублей');
      },
      'ближайшие списания': () => {
        alert('Ближайшие списания: Netflix - через 3 дня, Spotify - через 7 дней');
      },
      'открой рекомендации': () => {
        alert('Открываю рекомендации');
        window.location.hash = '#advice';
      },
      'помощь': () => {
        alert('Я могу: добавить подписку, показать статистику, рассказать о расходах');
      }
    };

    for (const [key, action] of Object.entries(commands)) {
      if (command.includes(key)) {
        action();
        return;
      }
    }

    alert(`Не понял команду "${command}". Попробуйте: "добавить подписку", "показать статистику", "сколько я трачу"`);
  };

  return { isListening, transcript, startListening };
}

function AppContent() {
  const [page, setPage] = useState('welcome');
  const [user, setUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { isListening, transcript, startListening } = useVoiceCommands();
  
  const menuRef = useRef(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setShowMenu(false);
  }

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setShowEdit(true);
  };

  const handleSaveSubscription = async (updatedSub) => {
    const token = localStorage.getItem('ev_token');
    try {
      const res = await fetch(`/api/subscriptions/${updatedSub.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(updatedSub)
      });

      if (!res.ok) throw new Error('Ошибка обновления');
      
      setShowEdit(false);
      setEditingSubscription(null);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось обновить подписку');
    }
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch (action) {
      case 'notifications':
        setNotificationsOpen(true);
        break;
      case 'profile':
        setProfileOpen(true);
        break;
      case 'settings':
        setSettingsOpen(true);
        break;
      case 'help':
        setHelpOpen(true);
        break;
      case 'about':
        setAboutOpen(true);
        break;
      case 'ai':
        setAiAssistantOpen(true);
        break;
      default:
        break;
    }
  };

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
        subscriptions: 'Подписки',
        stats: 'Аналитика',
        advice: 'Рекомендации'
      },
      common: {
        hello: 'Привет',
        logout: 'Выйти',
        language: 'RU/EN',
        notifications: 'Уведомления',
        profile: 'Профиль',
        settings: 'Настройки',
        help: 'Помощь',
        about: 'О приложении',
        aiAssistant: 'AI Помощник',
        voiceCommand: 'Голосовая команда',
        listening: 'Слушаю...'
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
        subscriptions: 'Subscriptions',
        stats: 'Statistics',
        advice: 'Recommendations'
      },
      common: {
        hello: 'Hello',
        logout: 'Logout',
        language: 'RU/EN',
        notifications: 'Notifications',
        profile: 'Profile',
        settings: 'Settings',
        help: 'Help',
        about: 'About',
        aiAssistant: 'AI Assistant',
        voiceCommand: 'Voice Command',
        listening: 'Listening...'
      }
    }
  };

  const t = translations[language];

  if (page === 'welcome' && !user) {
    return (
      <div className="welcome-container">
        {/* Декоративные элементы фона в стиле Evans */}
        <div className="background-elements">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
          <div className="bg-pattern"></div>
        </div>

        <div className="welcome-header">
          <div className="logo">
            <span className="logo-icon">🚀</span>
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
              Умный контроль подписок <span className="gradient-text">2025</span>
            </h1>
            <h2 className="hero-subtitle">AI-помощник, голосовые команды и продвинутая аналитика</h2>
            
            <div className="hero-features-grid">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI Аналитика</h3>
                <p>Умные рекомендации по оптимизации расходов</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎤</div>
                <h3>Голосовые команды</h3>
                <p>Управление подписками голосом</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>3D Аналитика</h3>
                <p>Визуализация данных в реальном времени</p>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-primary large" onClick={() => setPage('register')}>
                🚀 Начать использовать
              </button>
              
              <div className="social-buttons">
                <a href="/auth/google" className="btn-social google">
                  <span className="social-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#A0522D" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#8B4513" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#D2B48C" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#8B7355" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </span>
                  {t.welcome.loginGoogle}
                </a>
                
                <a href="/auth/telegram" className="btn-social telegram">
                  <span className="social-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#A0522D" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.158l-1.99 9.359c-.145.658-.537.818-1.084.509l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.241-.213-.054-.334-.373-.12l-6.869 4.326-2.96-.924c-.64-.203-.652-.64.135-.945l11.566-4.458c.534-.196 1.006.128.832.945z"/>
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
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
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
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
          }

          .shape-1 {
            width: 300px;
            height: 300px;
            top: -100px;
            right: -100px;
          }

          .shape-2 {
            width: 200px;
            height: 200px;
            bottom: -50px;
            left: -50px;
          }

          .shape-3 {
            width: 150px;
            height: 150px;
            top: 50%;
            right: 20%;
          }

          .bg-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
          }

          .welcome-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 48px;
            position: relative;
            z-index: 2;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 28px;
            font-weight: 800;
            color: white;
          }

          .logo-icon {
            font-size: 32px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .btn-text {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 12px 24px;
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-text:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
          }

          .btn-primary {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 16px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(255,107,107,0.4);
          }

          .btn-language {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 10px 16px;
            border-radius: 12px;
            cursor: pointer;
          }

          .welcome-hero {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            position: relative;
            z-index: 2;
          }

          .hero-content {
            text-align: center;
            max-width: 1200px;
          }

          .hero-title {
            font-size: 4.5rem;
            font-weight: 800;
            color: white;
            margin: 0 0 24px 0;
            line-height: 1.1;
          }

          .gradient-text {
            background: linear-gradient(135deg, #ffd93d, #ff6b6b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-subtitle {
            font-size: 1.5rem;
            color: rgba(255,255,255,0.9);
            margin-bottom: 60px;
            font-weight: 400;
          }

          .hero-features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-bottom: 60px;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
          }

          .feature-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            padding: 40px 30px;
            text-align: center;
            transition: all 0.3s ease;
          }

          .feature-card:hover {
            transform: translateY(-10px);
            background: rgba(255,255,255,0.15);
          }

          .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
          }

          .feature-card h3 {
            color: white;
            font-size: 1.5rem;
            margin: 0 0 12px 0;
          }

          .feature-card p {
            color: rgba(255,255,255,0.8);
            margin: 0;
            line-height: 1.5;
          }

          .btn-primary.large {
            padding: 20px 40px;
            font-size: 1.2rem;
            border-radius: 20px;
          }

          .hero-actions {
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
            align-items: center;
            margin-bottom: 80px;
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
            border-radius: 12px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            color: white;
            min-width: 180px;
            justify-content: center;
          }

          .btn-social:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.2);
            box-shadow: 0 8px 25px rgba(255,255,255,0.15);
          }

          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
          }

          /* Горизонтальное расположение фич */
          .features-horizontal {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
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
            background: rgba(255,255,255,0.15);
          }

          .feature-icon {
            font-size: 2.5rem;
            flex-shrink: 0;
          }

          .feature-content h3 {
            margin: 0 0 8px 0;
            font-size: 1.125rem;
            font-weight: 600;
            color: white;
          }

          .feature-content p {
            margin: 0;
            color: rgba(255,255,255,0.8);
            line-height: 1.4;
            font-size: 0.9rem;
          }

          .feature-divider {
            width: 1px;
            height: 40px;
            background: rgba(255,255,255,0.2);
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

            .hero-features-grid {
              grid-template-columns: 1fr;
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
              padding: 8px 12px;
            }

            .btn-primary {
              padding: 8px 12px;
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
      <div className="background-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-pattern"></div>
      </div>

      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Evans</span>
          </div>
          <nav className="nav">
            <button
              onClick={() => { setPage('home'); }}
              className={page === 'home' ? 'nav-btn active' : 'nav-btn'}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => { setPage('subscriptions'); }}
              className={page === 'subscriptions' ? 'nav-btn active' : 'nav-btn'}
            >
              {t.nav.subscriptions}
            </button>
            <button
              onClick={() => { setPage('stats'); }}
              className={page === 'stats' ? 'nav-btn active' : 'nav-btn'}
            >
              {t.nav.stats}
            </button>
            <button
              onClick={() => { setPage('advice'); }}
              className={page === 'advice' ? 'nav-btn active' : 'nav-btn'}
            >
              {t.nav.advice}
            </button>
          </nav>
        </div>
        
        <div className="header-right">
          {/* AI Assistant Button */}
          <button 
            className="header-action-btn ai-btn"
            onClick={() => setAiAssistantOpen(true)}
            title={t.common.aiAssistant}
          >
            <span className="btn-icon">🤖</span>
          </button>

          {/* Voice Command Button */}
          <button 
            className={`header-action-btn voice-btn ${isListening ? 'listening' : ''}`}
            onClick={startListening}
            title={t.common.voiceCommand}
          >
            <span className="btn-icon">🎤</span>
            {isListening && <div className="pulse-ring"></div>}
          </button>

          {isListening && transcript && (
            <div className="voice-transcript">
              {transcript}
            </div>
          )}

          <div className="user-info">
            <span className="user-avatar">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
            <span className="user-name">
              {t.common.hello}, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
            </span>
          </div>

          <button className="btn language-btn" onClick={toggleLanguage}>
            {t.common.language}
          </button>

          <div className="menu-container" ref={menuRef}>
            <button 
              className="menu-toggle"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            
            {showMenu && (
              <div className="dropdown-menu">
                <button className="menu-item" onClick={() => handleMenuAction('notifications')}>
                  <span className="menu-icon">🔔</span>
                  {t.common.notifications}
                  <span className="notification-badge">3</span>
                </button>
                <button className="menu-item" onClick={() => handleMenuAction('profile')}>
                  <span className="menu-icon">👤</span>
                  {t.common.profile}
                </button>
                <button className="menu-item" onClick={() => handleMenuAction('settings')}>
                  <span className="menu-icon">⚙️</span>
                  {t.common.settings}
                </button>
                <button className="menu-item" onClick={() => handleMenuAction('help')}>
                  <span className="menu-icon">❓</span>
                  {t.common.help}
                </button>
                <button className="menu-item" onClick={() => handleMenuAction('about')}>
                  <span className="menu-icon">ℹ️</span>
                  {t.common.about}
                </button>
                <div className="menu-divider"></div>
                <button className="menu-item logout" onClick={handleLogout}>
                  <span className="menu-icon">🚪</span>
                  {t.common.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        {page === 'home' && <SubList onAddSubscription={() => setShowAdd(true)} onEditSubscription={handleEditSubscription} />}
        {page === 'subscriptions' && <SubList onAddSubscription={() => setShowAdd(true)} onEditSubscription={handleEditSubscription} />}
        {page === 'stats' && <Stats />}
        {page === 'advice' && <Advice />}
      </main>

      {/* Модальные окна */}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
      {showEdit && editingSubscription && (
        <EditSubscriptionModal 
          subscription={editingSubscription}
          onClose={() => {
            setShowEdit(false);
            setEditingSubscription(null);
          }}
          onSave={handleSaveSubscription}
        />
      )}
      {notificationsOpen && <NotificationsPanel onClose={() => setNotificationsOpen(false)} />}
      {profileOpen && <ProfileSettings onClose={() => setProfileOpen(false)} />}
      {settingsOpen && <AppSettings onClose={() => setSettingsOpen(false)} />}
      {helpOpen && <HelpCenter onClose={() => setHelpOpen(false)} />}
      {aboutOpen && <AboutApp onClose={() => setAboutOpen(false)} />}
      {aiAssistantOpen && <AIAssistant onClose={() => setAiAssistantOpen(false)} />}

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }

        .background-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          right: 5%;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          bottom: 15%;
          left: 5%;
        }

        .shape-3 {
          width: 120px;
          height: 120px;
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
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 50%);
        }
        
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.1);
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
          font-size: 24px;
          color: white;
        }
        
        .logo-icon {
          font-size: 24px;
        }
        
        .nav {
          display: flex;
          gap: 8px;
        }
        
        .nav-btn {
          padding: 12px 24px;
          border: none;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          color: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
        }
        
        .nav-btn:hover {
          background: rgba(255,255,255,0.2);
          color: white;
          transform: translateY(-2px);
        }
        
        .nav-btn.active {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          box-shadow: 0 4px 15px rgba(255,107,107,0.3);
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }

        .header-action-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .header-action-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .header-action-btn.listening {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,107,107,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255,107,107,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,107,107,0); }
        }

        .pulse-ring {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid #ff6b6b;
          border-radius: 14px;
          animation: pulse-ring 1.5s infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        .btn-icon {
          font-size: 18px;
          display: block;
        }

        .voice-transcript {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-top: 8px;
          white-space: nowrap;
          z-index: 1000;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-weight: 500;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }
        
        .language-btn {
          padding: 10px 16px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 12px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .language-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .menu-container {
          position: relative;
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .menu-toggle:hover {
          background: rgba(255,255,255,0.2);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 20px;
        }

        .hamburger span {
          height: 2px;
          background: white;
          transition: all 0.3s ease;
        }

        .menu-toggle:hover .hamburger span {
          background: #ff6b6b;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 12px;
          min-width: 240px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          margin-top: 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 16px;
          border: none;
          background: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          transition: all 0.3s ease;
          position: relative;
        }

        .menu-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .menu-item.logout {
          color: #ff6b6b;
        }

        .menu-item.logout:hover {
          background: rgba(255,107,107,0.1);
        }

        .menu-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .notification-badge {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 10px;
          position: absolute;
          right: 16px;
          font-weight: 600;
        }

        .menu-divider {
          height: 1px;
          background: rgba(0,0,0,0.1);
          margin: 8px 0;
        }
        
        .main {
          padding: 32px;
          min-height: calc(100vh - 80px);
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .header {
            padding: 12px 16px;
          }
          
          .header-left {
            gap: 20px;
          }
          
          .nav {
            gap: 4px;
          }
          
          .nav-btn {
            padding: 10px 16px;
            font-size: 12px;
          }
          
          .header-right {
            gap: 8px;
          }
          
          .user-info .user-name {
            display: none;
          }
          
          .main {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .header-left {
            gap: 12px;
          }
          
          .logo {
            font-size: 18px;
          }
          
          .nav {
            display: none;
          }
          
          .header-action-btn {
            padding: 8px;
          }
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