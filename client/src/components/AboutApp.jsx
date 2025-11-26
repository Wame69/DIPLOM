// components/AboutApp.jsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function AboutApp({ onClose }) {
  const { language } = useLanguage();

  const translations = {
    ru: {
      aboutApp: 'О приложении',
      appName: 'Evans',
      version: 'Версия 2.0.0',
      description: 'Инновационная платформа для управления подписками с AI-помощником и передовыми технологиями 2025 года',
      ourFeatures: 'Наши возможности',
      stats: 'Evans в цифрах',
      ourTeam: 'Наша команда',
      downloadApp: '📱 Скачать приложение',
      visitWebsite: '🌐 Посетить сайт',
      termsOfUse: '📝 Условия использования',
      privacyPolicy: '🔒 Политика конфиденциальности',
      users: 'пользователей',
      subscriptions: 'подписок',
      saved: 'сэкономлено',
      availability: 'доступность'
    },
    en: {
      aboutApp: 'About App',
      appName: 'Evans',
      version: 'Version 2.0.0',
      description: 'Innovative subscription management platform with AI assistant and cutting-edge 2025 technologies',
      ourFeatures: 'Our Features',
      stats: 'Evans in Numbers',
      ourTeam: 'Our Team',
      downloadApp: '📱 Download App',
      visitWebsite: '🌐 Visit Website',
      termsOfUse: '📝 Terms of Use',
      privacyPolicy: '🔒 Privacy Policy',
      users: 'users',
      subscriptions: 'subscriptions',
      saved: 'saved',
      availability: 'availability'
    }
  };

  const t = translations[language];

  const features = [
    {
      icon: '🤖',
      title: 'AI Помощник',
      description: language === 'ru' ? 'Умные рекомендации по оптимизации ваших подписок' : 'Smart recommendations for optimizing your subscriptions'
    },
    {
      icon: '🎤',
      title: language === 'ru' ? 'Голосовые команды' : 'Voice Commands',
      description: language === 'ru' ? 'Управление подписками с помощью голоса' : 'Voice-controlled subscription management'
    },
    {
      icon: '📊',
      title: language === 'ru' ? '3D Аналитика' : '3D Analytics',
      description: language === 'ru' ? 'Продвинутая визуализация ваших расходов' : 'Advanced visualization of your expenses'
    },
    {
      icon: '🔔',
      title: language === 'ru' ? 'Умные уведомления' : 'Smart Notifications',
      description: language === 'ru' ? 'Автоматические напоминания о продлении' : 'Automatic renewal reminders'
    }
  ];

  const team = [
    {
      name: 'Алексей Петров',
      role: language === 'ru' ? 'Главный разработчик' : 'Lead Developer',
      avatar: '👨‍💻'
    },
    {
      name: 'Мария Иванова',
      role: language === 'ru' ? 'UI/UX дизайнер' : 'UI/UX Designer',
      avatar: '👩‍🎨'
    },
    {
      name: 'Дмитрий Сидоров',
      role: language === 'ru' ? 'AI инженер' : 'AI Engineer',
      avatar: '🤖'
    }
  ];

  const stats = [
    { number: '10K+', label: t.users },
    { number: '50K+', label: t.subscriptions },
    { number: '5M+ ₽', label: t.saved },
    { number: '99.9%', label: t.availability }
  ];

  const handleLinkClick = (linkType) => {
    const messages = {
      download: language === 'ru' ? 'Скачивание приложения' : 'Downloading app',
      website: language === 'ru' ? 'Открытие сайта' : 'Opening website',
      terms: language === 'ru' ? 'Условия использования' : 'Terms of use',
      privacy: language === 'ru' ? 'Политика конфиденциальности' : 'Privacy policy'
    };
    alert(`${messages[linkType]} ${language === 'ru' ? 'в разработке' : 'in development'}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.aboutApp}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="about-content">
          <div className="app-hero">
            <div className="app-icon">🚀</div>
            <h1>{t.appName}</h1>
            <p className="version">{t.version}</p>
            <p className="description">
              {t.description}
            </p>
          </div>
          
          <div className="features-section">
            <h3>{t.ourFeatures}</h3>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="stats-section">
            <h3>{t.stats}</h3>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="team-section">
            <h3>{t.ourTeam}</h3>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-member">
                  <div className="member-avatar">{member.avatar}</div>
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="links-section">
            <button className="link-btn" onClick={() => handleLinkClick('download')}>
              {t.downloadApp}
            </button>
            <button className="link-btn" onClick={() => handleLinkClick('website')}>
              {t.visitWebsite}
            </button>
            <button className="link-btn" onClick={() => handleLinkClick('terms')}>
              {t.termsOfUse}
            </button>
            <button className="link-btn" onClick={() => handleLinkClick('privacy')}>
              {t.privacyPolicy}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content.large {
          width: 700px;
          max-width: 90vw;
          max-height: 90vh;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #1a365d;
          font-size: 24px;
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
        
        .about-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        
        .app-hero {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px 0;
        }
        
        .app-icon {
          font-size: 80px;
          margin-bottom: 16px;
        }
        
        .app-hero h1 {
          margin: 0 0 8px 0;
          font-size: 48px;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        
        .version {
          margin: 0 0 16px 0;
          color: #a0aec0;
          font-size: 14px;
          font-weight: 500;
        }
        
        .description {
          margin: 0;
          color: #4a5568;
          line-height: 1.6;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          font-size: 16px;
        }
        
        .features-section {
          margin-bottom: 40px;
        }
        
        .features-section h3 {
          margin: 0 0 24px 0;
          color: #1a365d;
          text-align: center;
          font-size: 24px;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .feature-item {
          padding: 24px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
          background: #f7fafc;
        }
        
        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(26, 54, 93, 0.1);
          border-color: #1a365d;
        }
        
        .feature-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }
        
        .feature-item h4 {
          margin: 0 0 8px 0;
          color: #1a365d;
          font-size: 18px;
        }
        
        .feature-item p {
          margin: 0;
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .stats-section {
          margin-bottom: 40px;
        }
        
        .stats-section h3 {
          margin: 0 0 24px 0;
          color: #1a365d;
          text-align: center;
          font-size: 24px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
        }
        
        .stat-item {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          border-radius: 12px;
          color: white;
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .stat-label {
          font-size: 12px;
          opacity: 0.9;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        .team-section {
          margin-bottom: 40px;
        }
        
        .team-section h3 {
          margin: 0 0 24px 0;
          color: #1a365d;
          text-align: center;
          font-size: 24px;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }
        
        .team-member {
          text-align: center;
          padding: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: #f7fafc;
        }
        
        .member-avatar {
          font-size: 40px;
          margin-bottom: 12px;
        }
        
        .team-member h4 {
          margin: 0 0 4px 0;
          color: #1a365d;
          font-size: 16px;
        }
        
        .team-member p {
          margin: 0;
          color: #4a5568;
          font-size: 14px;
        }
        
        .links-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        
        .link-btn {
          padding: 16px 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          text-align: left;
          color: #4a5568;
        }
        
        .link-btn:hover {
          background: rgba(26, 54, 93, 0.1);
          border-color: #1a365d;
          color: #1a365d;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .app-hero h1 {
            font-size: 36px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .links-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}