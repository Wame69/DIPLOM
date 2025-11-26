// components/HelpCenter.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function HelpCenter({ onClose }) {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();

  const translations = {
    ru: {
      helpCenter: 'Центр помощи',
      searchPlaceholder: 'Поиск по помощи...',
      popularQuestions: 'Популярные вопросы',
      contactSupport: 'Связаться с поддержкой',
      supportTitle: 'Нужна дополнительная помощь?',
      supportDesc: 'Наша команда поддержки готова помочь вам 24/7',
      categories: {
        'getting-started': 'Начало работы',
        'subscriptions': 'Управление подписками',
        'billing': 'Оплата и счета',
        'features': 'Функции'
      },
      articles: {
        'getting-started': [
          {
            id: 1,
            title: 'Как добавить первую подписку',
            content: 'Чтобы добавить подписку, нажмите на кнопку "+" в правом верхнем углу главного экрана. Заполните информацию о подписке: название, стоимость, период оплаты и категорию.'
          },
          {
            id: 2,
            title: 'Настройка уведомлений',
            content: 'Вы можете настроить напоминания о продлении подписок в настройках приложения. Доступны уведомления за 7, 3 и 1 день до списания.'
          }
        ],
        'subscriptions': [
          {
            id: 3,
            title: 'Редактирование подписок',
            content: 'Для редактирования подписки нажмите на три точки в карточке подписки и выберите "Редактировать". Вы можете изменить все параметры подписки.'
          },
          {
            id: 4,
            title: 'Анализ расходов',
            content: 'В разделе "Аналитика" вы можете просмотреть детальную статистику по вашим расходам на подписки с разбивкой по категориям и периодам.'
          }
        ],
        'billing': [
          {
            id: 5,
            title: 'Методы оплаты',
            content: 'Мы поддерживаем различные методы оплаты включая банковские карты, электронные кошельки и мобильные платежи.'
          }
        ],
        'features': [
          {
            id: 6,
            title: 'AI Помощник',
            content: 'Наш AI помощник анализирует ваши подписки и предлагает рекомендации по оптимизации расходов. Доступен через кнопку с иконкой робота.'
          },
          {
            id: 7,
            title: 'Голосовые команды',
            content: 'Используйте голосовые команды для быстрого управления подписками. Скажите "добавить подписку" или "показать статистику".'
          }
        ]
      },
      popularQuestions: [
        'Как отменить подписку?',
        'Где посмотреть статистику?',
        'Как настроить Telegram уведомления?',
        'Что такое AI помощник?',
        'Как работает голосовое управление?',
        'Можно ли экспортировать данные?'
      ]
    },
    en: {
      helpCenter: 'Help Center',
      searchPlaceholder: 'Search help...',
      popularQuestions: 'Popular questions',
      contactSupport: 'Contact Support',
      supportTitle: 'Need additional help?',
      supportDesc: 'Our support team is ready to help you 24/7',
      categories: {
        'getting-started': 'Getting Started',
        'subscriptions': 'Subscription Management',
        'billing': 'Billing & Payments',
        'features': 'Features'
      },
      articles: {
        'getting-started': [
          {
            id: 1,
            title: 'How to add your first subscription',
            content: 'To add a subscription, click the "+" button in the top right corner of the main screen. Fill in the subscription information: name, cost, payment period, and category.'
          },
          {
            id: 2,
            title: 'Notification settings',
            content: 'You can set up subscription renewal reminders in the app settings. Notifications are available 7, 3, and 1 day before payment.'
          }
        ],
        'subscriptions': [
          {
            id: 3,
            title: 'Editing subscriptions',
            content: 'To edit a subscription, click the three dots on the subscription card and select "Edit". You can change all subscription parameters.'
          },
          {
            id: 4,
            title: 'Expense analysis',
            content: 'In the "Analytics" section, you can view detailed statistics on your subscription expenses with breakdown by categories and periods.'
          }
        ],
        'billing': [
          {
            id: 5,
            title: 'Payment methods',
            content: 'We support various payment methods including bank cards, e-wallets, and mobile payments.'
          }
        ],
        'features': [
          {
            id: 6,
            title: 'AI Assistant',
            content: 'Our AI assistant analyzes your subscriptions and provides recommendations for expense optimization. Available via the robot icon button.'
          },
          {
            id: 7,
            title: 'Voice commands',
            content: 'Use voice commands for quick subscription management. Say "add subscription" or "show statistics".'
          }
        ]
      },
      popularQuestions: [
        'How to cancel subscription?',
        'Where to view statistics?',
        'How to set up Telegram notifications?',
        'What is AI assistant?',
        'How does voice control work?',
        'Can I export data?'
      ]
    }
  };

  const t = translations[language];

  const categories = {
    'getting-started': {
      title: t.categories['getting-started'],
      icon: '🚀',
      articles: t.articles['getting-started']
    },
    'subscriptions': {
      title: t.categories.subscriptions,
      icon: '💰',
      articles: t.articles.subscriptions
    },
    'billing': {
      title: t.categories.billing,
      icon: '💳',
      articles: t.articles.billing
    },
    'features': {
      title: t.categories.features,
      icon: '🔧',
      articles: t.articles.features
    }
  };

  const handleContactSupport = () => {
    alert(language === 'ru' ? 'Форма связи с поддержкой открыта' : 'Support contact form opened');
  };

  const filteredArticles = categories[activeCategory].articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content xlarge" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.helpCenter}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="help-content">
          <div className="search-section">
            <div className="search-box">
              <input 
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          
          <div className="popular-questions">
            <h3>{t.popularQuestions}</h3>
            <div className="questions-grid">
              {t.popularQuestions.map((question, index) => (
                <button key={index} className="question-chip">
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          <div className="help-layout">
            <div className="categories-sidebar">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>
            
            <div className="articles-content">
              <h3>{categories[activeCategory].title}</h3>
              <div className="articles-list">
                {filteredArticles.length === 0 ? (
                  <div className="no-results">
                    <p>По вашему запросу ничего не найдено</p>
                  </div>
                ) : (
                  filteredArticles.map(article => (
                    <div key={article.id} className="article-card">
                      <h4>{article.title}</h4>
                      <p>{article.content}</p>
                      <button className="read-more">
                        {language === 'ru' ? 'Читать подробнее →' : 'Read more →'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="contact-support">
            <div className="support-card">
              <div className="support-icon">💬</div>
              <div className="support-content">
                <h4>{t.supportTitle}</h4>
                <p>{t.supportDesc}</p>
              </div>
              <button className="btn-primary" onClick={handleContactSupport}>
                {t.contactSupport}
              </button>
            </div>
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
        
        .modal-content.xlarge {
          width: 900px;
          max-width: 95vw;
          height: 80vh;
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
        
        .help-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        
        .search-section {
          margin-bottom: 32px;
        }
        
        .search-box {
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .search-box input {
          width: 100%;
          padding: 16px 50px 16px 20px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #f7fafc;
          color: #2d3748;
        }
        
        .search-box input:focus {
          outline: none;
          border-color: #1a365d;
          box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
        }
        
        .search-box input::placeholder {
          color: #a0aec0;
        }
        
        .search-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #a0aec0;
        }
        
        .popular-questions {
          margin-bottom: 32px;
        }
        
        .popular-questions h3 {
          margin: 0 0 16px 0;
          color: #1a365d;
          font-size: 18px;
        }
        
        .questions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .question-chip {
          padding: 12px 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          color: #4a5568;
        }
        
        .question-chip:hover {
          background: rgba(26, 54, 93, 0.1);
          border-color: #1a365d;
          color: #1a365d;
        }
        
        .help-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        
        .categories-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .category-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          background: rgba(0,0,0,0.05);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-size: 14px;
          color: #4a5568;
        }
        
        .category-btn:hover {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
        }
        
        .category-btn.active {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
        }
        
        .category-icon {
          font-size: 18px;
        }
        
        .articles-content h3 {
          margin: 0 0 20px 0;
          color: #1a365d;
          font-size: 20px;
        }
        
        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
          color: #a0aec0;
        }
        
        .article-card {
          padding: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          transition: all 0.3s ease;
          background: #f7fafc;
        }
        
        .article-card:hover {
          border-color: #1a365d;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.1);
        }
        
        .article-card h4 {
          margin: 0 0 8px 0;
          color: #1a365d;
          font-size: 16px;
        }
        
        .article-card p {
          margin: 0 0 12px 0;
          color: #4a5568;
          line-height: 1.5;
          font-size: 14px;
        }
        
        .read-more {
          background: none;
          border: none;
          color: #1a365d;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          font-weight: 500;
        }
        
        .read-more:hover {
          text-decoration: underline;
        }
        
        .contact-support {
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          padding-top: 32px;
        }
        
        .support-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          border-radius: 16px;
          color: white;
        }
        
        .support-icon {
          font-size: 40px;
        }
        
        .support-content {
          flex: 1;
        }
        
        .support-content h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .support-content p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }
        
        .btn-primary {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          background: white;
          color: #1a365d;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255,255,255,0.3);
        }
        
        @media (max-width: 768px) {
          .help-layout {
            grid-template-columns: 1fr;
          }
          
          .categories-sidebar {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 16px;
          }
          
          .category-btn {
            white-space: nowrap;
          }
          
          .support-card {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}