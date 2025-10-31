// components/AboutApp.jsx
import React from 'react';

export default function AboutApp({ onClose }) {
  const features = [
    {
      icon: '🤖',
      title: 'AI Помощник',
      description: 'Умные рекомендации по оптимизации ваших подписок'
    },
    {
      icon: '🎤',
      title: 'Голосовые команды',
      description: 'Управление подписками с помощью голоса'
    },
    {
      icon: '📊',
      title: '3D Аналитика',
      description: 'Продвинутая визуализация ваших расходов'
    },
    {
      icon: '🔔',
      title: 'Умные уведомления',
      description: 'Автоматические напоминания о продлении'
    }
  ];

  const team = [
    {
      name: 'Алексей Петров',
      role: 'Главный разработчик',
      avatar: '👨‍💻'
    },
    {
      name: 'Мария Иванова',
      role: 'UI/UX дизайнер',
      avatar: '👩‍🎨'
    },
    {
      name: 'Дмитрий Сидоров',
      role: 'AI инженер',
      avatar: '🤖'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>О приложении</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="about-content">
          <div className="app-hero">
            <div className="app-icon">🚀</div>
            <h1>Evens</h1>
            <p className="version">Версия 2.0.0</p>
            <p className="description">
              Инновационная платформа для управления подписками с AI-помощником 
              и передовыми технологиями 2025 года
            </p>
          </div>
          
          <div className="features-section">
            <h3>Наши возможности</h3>
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
            <h3>Evens в цифрах</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">пользователей</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">подписок</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5M+ ₽</div>
                <div className="stat-label">сэкономлено</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">доступность</div>
              </div>
            </div>
          </div>
          
          <div className="team-section">
            <h3>Наша команда</h3>
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
            <button className="link-btn">📱 Скачать приложение</button>
            <button className="link-btn">🌐 Посетить сайт</button>
            <button className="link-btn">📝 Условия использования</button>
            <button className="link-btn">🔒 Политика конфиденциальности</button>
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
          color: #333;
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
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .version {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }
        
        .description {
          margin: 0;
          color: #666;
          line-height: 1.6;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .features-section {
          margin-bottom: 40px;
        }
        
        .features-section h3 {
          margin: 0 0 24px 0;
          color: #333;
          text-align: center;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .feature-item {
          padding: 24px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
          border-color: #667eea;
        }
        
        .feature-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }
        
        .feature-item h4 {
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .feature-item p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .stats-section {
          margin-bottom: 40px;
        }
        
        .stats-section h3 {
          margin: 0 0 24px 0;
          color: #333;
          text-align: center;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
        }
        
        .stat-item {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
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
        }
        
        .team-section {
          margin-bottom: 40px;
        }
        
        .team-section h3 {
          margin: 0 0 24px 0;
          color: #333;
          text-align: center;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }
        
        .team-member {
          text-align: center;
          padding: 20px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
        }
        
        .member-avatar {
          font-size: 40px;
          margin-bottom: 12px;
        }
        
        .team-member h4 {
          margin: 0 0 4px 0;
          color: #333;
        }
        
        .team-member p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .links-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        
        .link-btn {
          padding: 16px 20px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          text-align: left;
        }
        
        .link-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
          color: #667eea;
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
      `}</style>
    </div>
  );
}