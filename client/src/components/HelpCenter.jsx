// components/HelpCenter.jsx
import React, { useState } from 'react';

export default function HelpCenter({ onClose }) {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = {
    'getting-started': {
      title: 'Начало работы',
      icon: '🚀',
      articles: [
        {
          id: 1,
          title: 'Как добавить первую подписку',
          content: 'Чтобы добавить подписку, нажмите на кнопку "+" в правом верхнем углу...'
        },
        {
          id: 2,
          title: 'Настройка уведомлений',
          content: 'Вы можете настроить напоминания о продлении подписок...'
        }
      ]
    },
    'subscriptions': {
      title: 'Управление подписками',
      icon: '💰',
      articles: [
        {
          id: 3,
          title: 'Редактирование подписок',
          content: 'Для редактирования подписки нажмите на три точки в карточке...'
        },
        {
          id: 4,
          title: 'Анализ расходов',
          content: 'В разделе "Аналитика" вы можете просмотреть детальную статистику...'
        }
      ]
    },
    'billing': {
      title: 'Оплата и счета',
      icon: '💳',
      articles: [
        {
          id: 5,
          title: 'Методы оплаты',
          content: 'Мы поддерживаем различные методы оплаты...'
        }
      ]
    }
  };

  const popularQuestions = [
    'Как отменить подписку?',
    'Где посмотреть статистику?',
    'Как настроить Telegram уведомления?',
    'Что такое AI помощник?'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content xlarge" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Центр помощи</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="help-content">
          <div className="search-section">
            <div className="search-box">
              <input 
                type="text"
                placeholder="Поиск по помощи..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          
          <div className="popular-questions">
            <h3>Популярные вопросы</h3>
            <div className="questions-grid">
              {popularQuestions.map((question, index) => (
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
                {categories[activeCategory].articles.map(article => (
                  <div key={article.id} className="article-card">
                    <h4>{article.title}</h4>
                    <p>{article.content}</p>
                    <button className="read-more">Читать подробнее →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="contact-support">
            <div className="support-card">
              <div className="support-icon">💬</div>
              <div className="support-content">
                <h4>Нужна дополнительная помощь?</h4>
                <p>Наша команда поддержки готова помочь вам 24/7</p>
              </div>
              <button className="btn-primary">Связаться с поддержкой</button>
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
          border: 2px solid rgba(0,0,0,0.1);
          border-radius: 16px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .search-box input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .search-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #666;
        }
        
        .popular-questions {
          margin-bottom: 32px;
        }
        
        .popular-questions h3 {
          margin: 0 0 16px 0;
          color: #333;
        }
        
        .questions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .question-chip {
          padding: 12px 20px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 20px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .question-chip:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
          color: #667eea;
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
        }
        
        .category-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
        
        .category-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .category-icon {
          font-size: 18px;
        }
        
        .articles-content h3 {
          margin: 0 0 20px 0;
          color: #333;
        }
        
        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .article-card {
          padding: 20px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .article-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }
        
        .article-card h4 {
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .article-card p {
          margin: 0 0 12px 0;
          color: #666;
          line-height: 1.5;
        }
        
        .read-more {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
        }
        
        .contact-support {
          border-top: 1px solid rgba(0,0,0,0.1);
          padding-top: 32px;
        }
        
        .support-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: linear-gradient(135deg, #667eea, #764ba2);
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
        }
        
        .btn-primary {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          background: white;
          color: #667eea;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
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
          }
        }
      `}</style>
    </div>
  );
}