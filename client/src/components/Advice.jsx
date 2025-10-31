// components/Advice.jsx
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Advice() {
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { language } = useLanguage();

  const translations = {
    ru: {
      recommendations: 'Рекомендации',
      loading: 'Загрузка рекомендаций...',
      all: 'Все',
      savings: 'Экономия',
      optimization: 'Оптимизация',
      security: 'Безопасность',
      noAdvice: 'Рекомендаций пока нет — всё отлично!',
      implement: 'Внедрить',
      later: 'Позже',
      potentialSavings: 'Потенциальная экономия',
      monthly: 'в месяц',
      implemented: 'Внедрено',
      highImpact: 'Высокий эффект',
      mediumImpact: 'Средний эффект',
      lowImpact: 'Низкий эффект'
    },
    en: {
      recommendations: 'Recommendations',
      loading: 'Loading recommendations...',
      all: 'All',
      savings: 'Savings',
      optimization: 'Optimization',
      security: 'Security',
      noAdvice: 'No recommendations yet — everything is great!',
      implement: 'Implement',
      later: 'Later',
      potentialSavings: 'Potential savings',
      monthly: 'per month',
      implemented: 'Implemented',
      highImpact: 'High impact',
      mediumImpact: 'Medium impact',
      lowImpact: 'Low impact'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchAdvice();
  }, []);

  async function fetchAdvice() {
    const token = localStorage.getItem('ev_token');
    try {
      const res = await fetch('/api/advice', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        setAdvice(data.advice || []);
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setLoading(false);
    }
  }

  // Демо-рекомендации
  const demoAdvice = [
    {
      id: 1,
      type: 'savings',
      title: 'Объединить стриминговые подписки',
      description: 'Netflix и YouTube Premium можно заменить на комбинированный тариф',
      savings: 450,
      impact: 'high',
      category: 'Streaming'
    },
    {
      id: 2,
      type: 'optimization',
      title: 'Перейти на годовые тарифы',
      description: 'Годовые подписки на софт обычно на 20% дешевле месячных',
      savings: 320,
      impact: 'medium',
      category: 'Software'
    },
    {
      id: 3,
      type: 'security',
      title: 'Обновить пароли подписок',
      description: 'Некоторые подписки используют слабые пароли',
      savings: 0,
      impact: 'high',
      category: 'Security'
    },
    {
      id: 4,
      type: 'savings',
      title: 'Отключить неиспользуемые подписки',
      description: 'Подписка на Adobe Creative Cloud не использовалась 60+ дней',
      savings: 1290,
      impact: 'high',
      category: 'Software'
    }
  ];

  const filteredAdvice = activeTab === 'all' 
    ? demoAdvice 
    : demoAdvice.filter(item => item.type === activeTab);

  const handleImplement = (adviceId) => {
    setAdvice(prev => prev.filter(item => item.id !== adviceId));
    // Здесь можно добавить логику внедрения рекомендации
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd93d';
      case 'low': return '#4ecdc4';
      default: return '#667eea';
    }
  };

  const getImpactText = (impact) => {
    switch (impact) {
      case 'high': return t.highImpact;
      case 'medium': return t.mediumImpact;
      case 'low': return t.lowImpact;
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="advice-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advice-container">
      <div className="advice-header">
        <h1>{t.recommendations}</h1>
        <div className="advice-stats">
          <div className="stat">
            <div className="stat-value">{demoAdvice.length}</div>
            <div className="stat-label">Рекомендаций</div>
          </div>
          <div className="stat">
            <div className="stat-value">2,060 ₽</div>
            <div className="stat-label">{t.potentialSavings}</div>
          </div>
        </div>
      </div>

      <div className="advice-tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t.all}
        </button>
        <button 
          className={`tab ${activeTab === 'savings' ? 'active' : ''}`}
          onClick={() => setActiveTab('savings')}
        >
          {t.savings}
        </button>
        <button 
          className={`tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          {t.optimization}
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          {t.security}
        </button>
      </div>

      <div className="advice-list">
        {filteredAdvice.length === 0 ? (
          <div className="no-advice">
            <div className="no-advice-icon">🎉</div>
            <h3>{t.noAdvice}</h3>
            <p>Ваши подписки оптимизированы и безопасны</p>
          </div>
        ) : (
          filteredAdvice.map((item) => (
            <div key={item.id} className="advice-card">
              <div className="advice-header">
                <div className="advice-meta">
                  <span 
                    className="impact-badge"
                    style={{ backgroundColor: getImpactColor(item.impact) }}
                  >
                    {getImpactText(item.impact)}
                  </span>
                  <span className="category-tag">{item.category}</span>
                </div>
                {item.savings > 0 && (
                  <div className="savings-badge">
                    +{item.savings} ₽ {t.monthly}
                  </div>
                )}
              </div>
              
              <h3 className="advice-title">{item.title}</h3>
              <p className="advice-description">{item.description}</p>
              
              <div className="advice-actions">
                <button 
                  className="btn-primary"
                  onClick={() => handleImplement(item.id)}
                >
                  {t.implement}
                </button>
                <button className="btn-secondary">
                  {t.later}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="ai-recommendation">
        <div className="ai-header">
          <div className="ai-icon">🤖</div>
          <div className="ai-content">
            <h3>AI Анализ ваших подписок</h3>
            <p>На основе анализа ваших привычек, AI рекомендует рассмотреть семейные тарифы</p>
          </div>
        </div>
        <button className="btn-outline">
          Подробнее от AI
        </button>
      </div>

      <style jsx>{`
        .advice-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: white;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .advice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        
        .advice-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }
        
        .advice-stats {
          display: flex;
          gap: 24px;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #ffd93d;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .advice-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 4px;
        }
        
        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.7);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .tab.active {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        
        .tab:hover:not(.active) {
          background: rgba(255,255,255,0.1);
        }
        
        .advice-list {
          display: grid;
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .advice-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }
        
        .advice-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          border-color: rgba(255,255,255,0.3);
        }
        
        .advice-card .advice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .advice-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .impact-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: white;
        }
        
        .category-tag {
          padding: 4px 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          font-size: 11px;
        }
        
        .savings-badge {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .advice-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .advice-description {
          margin: 0 0 20px 0;
          opacity: 0.8;
          line-height: 1.5;
        }
        
        .advice-actions {
          display: flex;
          gap: 12px;
        }
        
        .btn-primary, .btn-secondary, .btn-outline {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255,107,107,0.3);
        }
        
        .btn-secondary {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        
        .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
        }
        
        .btn-outline:hover {
          background: rgba(255,255,255,0.1);
        }
        
        .no-advice {
          text-align: center;
          padding: 60px 20px;
          opacity: 0.8;
        }
        
        .no-advice-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        
        .no-advice h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
        }
        
        .ai-recommendation {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .ai-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        
        .ai-icon {
          font-size: 32px;
        }
        
        .ai-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .ai-content p {
          margin: 0;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .advice-container {
            padding: 16px;
          }
          
          .advice-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .advice-stats {
            width: 100%;
            justify-content: space-around;
          }
          
          .advice-tabs {
            flex-wrap: wrap;
          }
          
          .tab {
            flex: 1;
            min-width: calc(50% - 4px);
          }
          
          .ai-recommendation {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .ai-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}