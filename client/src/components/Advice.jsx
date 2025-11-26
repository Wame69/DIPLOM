import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useData } from '../contexts/DataContext.jsx';

export default function Advice() {
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [implementedAdvice, setImplementedAdvice] = useState([]);
  const [showAIDetails, setShowAIDetails] = useState(false);
  const [showImplemented, setShowImplemented] = useState(false);
  const [activeAdvice, setActiveAdvice] = useState([]);
  const { language } = useLanguage();
  const { subscriptions, services } = useData();

  const translations = {
    en: {
      recommendations: 'Recommendations',
      loading: 'Loading recommendations...',
      all: 'All',
      savings: 'Savings',
      optimization: 'Optimization',
      security: 'Security',
      implemented: 'Implemented',
      noAdvice: 'No recommendations yet — everything looks great!',
      noAdviceSubtitle: 'Your subscriptions are optimized and secure',
      noImplementedAdvice: 'No implemented recommendations yet',
      noImplementedSubtitle: 'Implement recommendations to see them here',
      implement: 'Implement',
      update: 'Update',
      optimize: 'Optimize',
      secure: 'Secure',
      later: 'Later',
      dismiss: 'Dismiss',
      potentialSavings: 'Potential savings',
      monthly: 'per month',
      implementedCount: 'Implemented',
      highImpact: 'High impact',
      mediumImpact: 'Medium impact',
      lowImpact: 'Low impact',
      showImplemented: 'Show implemented',
      hideImplemented: 'Hide implemented',
      totalSavings: 'Total savings',
      aiRecommendation: 'AI Recommendation',
      duplicateSubscriptions: 'Duplicate subscriptions found',
      expensiveSubscriptions: 'High-cost subscriptions',
      unusedSubscriptions: 'Potentially unused subscriptions',
      familyPlanOpportunity: 'Family plan opportunity',
      annualSavings: 'Annual subscription savings',
      streaming: 'Streaming',
      software: 'Software',
      music: 'Music',
      utilities: 'Utilities',
      active: 'Active',
      aiDetails: 'AI details',
      hideDetails: 'Hide details',
      aiAnalysis: 'AI analysis shows you could save up to {savings} monthly by implementing these recommendations. Focus on consolidating duplicate services and switching to annual plans for maximum savings.',
      aiTip: 'Based on analysis of your subscriptions, AI recommends considering family plans and annual billing',
      multipleSubscriptions: 'Multiple {category} subscriptions found. Consider consolidating to save money.',
      expensiveAlternative: '{title} costs {price} monthly. Look for cheaper alternatives.',
      annualSwitch: 'Switch {title} to annual billing to save ~{savings} per year',
      familyPlanSave: 'Combine streaming services into a family plan to save up to 40%',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
      actionCompleted: 'Action "{action}" completed for recommendation "{title}"',
      removeImplemented: 'Remove',
      restoreAdvice: 'Restore',
      removeConfirm: 'Remove this implemented recommendation?',
      restoredSuccess: 'Recommendation restored successfully',
      removedSuccess: 'Recommendation removed successfully',
      implementedAt: 'Implemented on',
      remove: 'Remove',
      restore: 'Restore to active'
    },
    ru: {
      recommendations: 'Рекомендации',
      loading: 'Загрузка рекомендаций...',
      all: 'Все',
      savings: 'Экономия',
      optimization: 'Оптимизация',
      security: 'Безопасность',
      implemented: 'Внедрённые',
      noAdvice: 'Рекомендаций пока нет — всё отлично!',
      noAdviceSubtitle: 'Ваши подписки оптимизированы и защищены',
      noImplementedAdvice: 'Пока нет внедрённых рекомендаций',
      noImplementedSubtitle: 'Внедрите рекомендации, чтобы увидеть их здесь',
      implement: 'Внедрить',
      update: 'Обновить',
      optimize: 'Оптимизировать',
      secure: 'Защитить',
      later: 'Отложить',
      dismiss: 'Скрыть',
      potentialSavings: 'Потенциальная экономия',
      monthly: 'в месяц',
      implementedCount: 'Внедрено',
      highImpact: 'Высокий эффект',
      mediumImpact: 'Средний эффект',
      lowImpact: 'Низкий эффект',
      showImplemented: 'Показать внедрённые',
      hideImplemented: 'Скрыть внедрённые',
      totalSavings: 'Общая экономия',
      aiRecommendation: 'AI Рекомендация',
      duplicateSubscriptions: 'Найдены дублирующие подписки',
      expensiveSubscriptions: 'Дорогие подписки',
      unusedSubscriptions: 'Потенциально неиспользуемые подписки',
      familyPlanOpportunity: 'Возможность семейного тарифа',
      annualSavings: 'Экономия на годовой подписке',
      streaming: 'Стриминг',
      software: 'Программы',
      music: 'Музыка',
      utilities: 'Утилиты',
      active: 'Активные',
      aiDetails: 'AI детали',
      hideDetails: 'Скрыть детали',
      aiAnalysis: 'AI анализ показывает, что вы можете сэкономить до {savings} в месяц, внедрив эти рекомендации. Сосредоточьтесь на объединении дублирующих сервисов и переходе на годовые планы для максимальной экономии.',
      aiTip: 'На основе анализа ваших подписок, AI рекомендует рассмотреть семейные тарифы и годовую оплату',
      multipleSubscriptions: 'Найдены несколько подписок {category}. Рассмотрите возможность объединения для экономии денег.',
      expensiveAlternative: '{title} стоит {price} в месяц. Найдите более дешёвые альтернативы.',
      annualSwitch: 'Перейдите на годовую оплату {title} чтобы сэкономить ~{savings} в год',
      familyPlanSave: 'Объедините стриминговые сервисы в семейный тариф чтобы сэкономить до 40%',
      showDetails: 'Показать детали',
      hideDetails: 'Скрыть детали',
      actionCompleted: 'Действие "{action}" завершено для рекомендации "{title}"',
      removeImplemented: 'Удалить',
      restoreAdvice: 'Восстановить',
      removeConfirm: 'Удалить эту внедрённую рекомендацию?',
      restoredSuccess: 'Рекомендация успешно восстановлена',
      removedSuccess: 'Рекомендация успешно удалена',
      implementedAt: 'Внедрено',
      remove: 'Удалить',
      restore: 'Вернуть в активные'
    }
  };

  const t = translations[language];

  // Function to generate recommendations based on real data
  const generateRealAdvice = () => {
    const allItems = [...subscriptions, ...services].filter(item => item.active !== false);
    const adviceList = [];

    // Analyze duplicate subscriptions
    const categories = {};
    allItems.forEach(item => {
      const category = item.category || item.service_type || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });

    Object.entries(categories).forEach(([category, items]) => {
      if (items.length > 1) {
        const totalMonthly = items.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          return sum + (item.period === 'year' ? price / 12 : price);
        }, 0);
        
        adviceList.push({
          id: `duplicate-${category}`,
          type: 'savings',
          title: t.duplicateSubscriptions,
          description: t.multipleSubscriptions.replace('{category}', t[category.toLowerCase()] || category),
          savings: Math.round(totalMonthly * 0.3), // 30% potential savings
          impact: 'high',
          category: t[category.toLowerCase()] || category,
          actionType: 'optimize'
        });
      }
    });

    // Analyze expensive subscriptions
    allItems.forEach(item => {
      const price = parseFloat(item.price) || 0;
      const monthlyPrice = item.period === 'year' ? price / 12 : price;
      
      if (monthlyPrice > 1000) {
        adviceList.push({
          id: `expensive-${item.id}`,
          type: 'savings',
          title: t.expensiveSubscriptions,
          description: t.expensiveAlternative
            .replace('{title}', item.title)
            .replace('{price}', Math.round(monthlyPrice)),
          savings: Math.round(monthlyPrice * 0.2), // 20% savings
          impact: 'high',
          category: t[item.category?.toLowerCase()] || item.category || t[item.service_type?.toLowerCase()] || item.service_type || 'other',
          actionType: 'implement'
        });
      }
    });

    // Analyze annual subscriptions opportunity
    const monthlySubs = allItems.filter(item => item.period === 'month' && parseFloat(item.price) > 200);
    monthlySubs.forEach(item => {
      const annualSavings = parseFloat(item.price) * 0.2; // 20% savings with annual plan
      if (annualSavings > 100) {
        adviceList.push({
          id: `annual-${item.id}`,
          type: 'savings',
          title: t.annualSavings,
          description: t.annualSwitch
            .replace('{title}', item.title)
            .replace('{savings}', Math.round(annualSavings)),
          savings: Math.round(annualSavings),
          impact: 'medium',
          category: t[item.category?.toLowerCase()] || item.category || t[item.service_type?.toLowerCase()] || item.service_type || 'other',
          actionType: 'optimize'
        });
      }
    });

    // Family plan opportunity for streaming services
    const streamingSubs = allItems.filter(item => 
      (item.category === 'Streaming' || item.service_type === 'streaming') && 
      parseFloat(item.price) > 300
    );
    if (streamingSubs.length >= 2) {
      const totalStreaming = streamingSubs.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + (item.period === 'year' ? price / 12 : price);
      }, 0);
      
      adviceList.push({
        id: 'family-plan',
        type: 'savings',
        title: t.familyPlanOpportunity,
        description: t.familyPlanSave,
        savings: Math.round(totalStreaming * 0.4),
        impact: 'high',
        category: t.streaming,
        actionType: 'implement'
      });
    }

    return adviceList;
  };

  useEffect(() => {
    const realAdvice = generateRealAdvice();
    setAdvice(realAdvice);
    setLoading(false);
    
    // Load implemented recommendations
    const savedImplemented = localStorage.getItem('ev_implemented_advice');
    if (savedImplemented) {
      setImplementedAdvice(JSON.parse(savedImplemented));
    }
  }, [subscriptions, services, language]);

  useEffect(() => {
    setActiveAdvice(advice);
  }, [advice]);

  const filteredAdvice = activeTab === 'all' 
    ? activeAdvice 
    : activeAdvice.filter(item => item.type === activeTab);

  const displayedAdvice = showImplemented ? implementedAdvice : filteredAdvice;

  const getActionButtonText = (actionType) => {
    switch (actionType) {
      case 'update': return t.update;
      case 'optimize': return t.optimize;
      case 'secure': return t.secure;
      default: return t.implement;
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'update': return '🔒';
      case 'optimize': return '⚡';
      case 'secure': return '🛡️';
      default: return '✅';
    }
  };

  const handleAction = (adviceId, actionType) => {
    const adviceToImplement = activeAdvice.find(item => item.id === adviceId);
    if (adviceToImplement) {
      const updatedAdvice = activeAdvice.filter(item => item.id !== adviceId);
      const implemented = { 
        ...adviceToImplement, 
        implemented: true, 
        implementedAt: new Date().toISOString(),
        actionType: actionType
      };
      
      setActiveAdvice(updatedAdvice);
      setImplementedAdvice(prev => {
        const newImplemented = [...prev, implemented];
        localStorage.setItem('ev_implemented_advice', JSON.stringify(newImplemented));
        return newImplemented;
      });

      // Show action notification
      alert(t.actionCompleted
        .replace('{action}', getActionButtonText(actionType))
        .replace('{title}', adviceToImplement.title));
    }
  };

  const handleDismiss = (adviceId) => {
    setActiveAdvice(prev => prev.filter(item => item.id !== adviceId));
  };

  const handleLater = (adviceId) => {
    setActiveAdvice(prev => prev.filter(item => item.id !== adviceId));
  };

  const handleAIDetails = () => {
    setShowAIDetails(!showAIDetails);
  };

  // Remove implemented advice
  const handleRemoveImplemented = (adviceId) => {
    if (window.confirm(t.removeConfirm)) {
      setImplementedAdvice(prev => {
        const updatedImplemented = prev.filter(item => item.id !== adviceId);
        localStorage.setItem('ev_implemented_advice', JSON.stringify(updatedImplemented));
        return updatedImplemented;
      });
      alert(t.removedSuccess);
    }
  };

  // Restore implemented advice to active
  const handleRestoreAdvice = (adviceId) => {
    const adviceToRestore = implementedAdvice.find(item => item.id === adviceId);
    if (adviceToRestore) {
      const { implemented, implementedAt, ...restoredAdvice } = adviceToRestore;
      
      setActiveAdvice(prev => [...prev, restoredAdvice]);
      setImplementedAdvice(prev => {
        const updatedImplemented = prev.filter(item => item.id !== adviceId);
        localStorage.setItem('ev_implemented_advice', JSON.stringify(updatedImplemented));
        return updatedImplemented;
      });
      
      alert(t.restoredSuccess);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#1a365d';
      case 'medium': return '#2d3748';
      case 'low': return '#4a5568';
      default: return '#1a365d';
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

  const totalPotentialSavings = activeAdvice.reduce((sum, item) => sum + item.savings, 0);
  const totalImplementedSavings = implementedAdvice.reduce((sum, item) => sum + item.savings, 0);

  if (loading) {
    return (
      <div className="advice-container">
        <div className="background-elements">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
          <div className="bg-pattern"></div>
        </div>
        
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>

        <style jsx>{`
          .advice-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
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
              radial-gradient(circle at 20% 20%, rgba(26, 54, 93, 0.02) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(26, 54, 93, 0.01) 0%, transparent 50%);
          }

          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 20px;
            position: relative;
            z-index: 2;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(26, 54, 93, 0.3);
            border-top: 3px solid #1a365d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-state p {
            color: #1a365d;
            font-size: 16px;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="advice-container">
      <div className="background-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="advice-content">
        <div className="advice-header">
          <h1>{t.recommendations}</h1>
          <div className="advice-stats">
            <div className="stat">
              <div className="stat-value">{activeAdvice.length}</div>
              <div className="stat-label">{t.active}</div>
            </div>
            <div className="stat">
              <div className="stat-value">{implementedAdvice.length}</div>
              <div className="stat-label">{t.implementedCount}</div>
            </div>
            <div className="stat">
              <div className="stat-value">{totalPotentialSavings} ₽</div>
              <div className="stat-label">{t.potentialSavings}</div>
            </div>
            <div className="stat">
              <div className="stat-value success">{totalImplementedSavings} ₽</div>
              <div className="stat-label">{t.totalSavings}</div>
            </div>
          </div>
        </div>

        <div className="controls-row">
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

          <button 
            className={`toggle-implemented ${showImplemented ? 'active' : ''}`}
            onClick={() => setShowImplemented(!showImplemented)}
          >
            {showImplemented ? t.hideImplemented : t.showImplemented}
          </button>
        </div>

        <div className="advice-list">
          {displayedAdvice.length === 0 ? (
            <div className="no-advice">
              <div className="no-advice-icon">
                {showImplemented ? '📋' : '🎉'}
              </div>
              <h3>{showImplemented ? t.noImplementedAdvice : t.noAdvice}</h3>
              <p>{showImplemented ? t.noImplementedSubtitle : t.noAdviceSubtitle}</p>
            </div>
          ) : (
            displayedAdvice.map((item) => (
              <div key={item.id} className="advice-card">
                <div className="advice-card-header">
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
                  {!showImplemented ? (
                    <>
                      <button 
                        className="btn-primary"
                        onClick={() => handleAction(item.id, item.actionType)}
                      >
                        <span className="btn-icon">{getActionIcon(item.actionType)}</span>
                        {getActionButtonText(item.actionType)}
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => handleLater(item.id)}
                      >
                        <span className="btn-icon">⏰</span>
                        {t.later}
                      </button>
                      <button 
                        className="btn-outline"
                        onClick={() => handleDismiss(item.id)}
                      >
                        <span className="btn-icon">✕</span>
                        {t.dismiss}
                      </button>
                    </>
                  ) : (
                    <div className="implemented-actions">
                      <div className="implemented-info">
                        <span className="implemented-badge">
                          {getActionIcon(item.actionType)} {getActionButtonText(item.actionType)}
                        </span>
                        {item.implementedAt && (
                          <span className="implemented-date">
                            {t.implementedAt}: {new Date(item.implementedAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                          </span>
                        )}
                      </div>
                      <div className="implemented-buttons">
                        <button 
                          className="btn-restore"
                          onClick={() => handleRestoreAdvice(item.id)}
                        >
                          <span className="btn-icon">↶</span>
                          {t.restore}
                        </button>
                        <button 
                          className="btn-remove"
                          onClick={() => handleRemoveImplemented(item.id)}
                        >
                          <span className="btn-icon">🗑️</span>
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="ai-recommendation">
          <div className="ai-header">
            <div className="ai-icon">🤖</div>
            <div className="ai-content">
              <h3>{t.aiRecommendation}</h3>
              <p>{t.aiTip}</p>
              {showAIDetails && (
                <div className="ai-details">
                  <p>{t.aiAnalysis.replace('{savings}', Math.round(totalPotentialSavings) + '₽')}</p>
                </div>
              )}
            </div>
          </div>
          <button className="btn-dark" onClick={handleAIDetails}>
            <span className="btn-icon">{showAIDetails ? '📋' : '🔍'}</span>
            {showAIDetails ? t.hideDetails : t.showDetails}
          </button>
        </div>
      </div>

      <style jsx>{`
        .advice-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          position: relative;
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
            radial-gradient(circle at 20% 20%, rgba(26, 54, 93, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(26, 54, 93, 0.01) 0%, transparent 50%);
        }

        .advice-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px;
          position: relative;
          z-index: 2;
        }
        
        .advice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        
        .advice-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #1a365d;
        }
        
        .advice-stats {
          display: flex;
          gap: 32px;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 4px;
        }

        .stat-value.success {
          color: #1a365d;
        }
        
        .stat-label {
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }
        
        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 20px;
        }
        
        .advice-tabs {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 4px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .tab {
          padding: 12px 20px;
          border: none;
          background: transparent;
          color: #4a5568;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
        }
        
        .tab.active {
          background: #1a365d;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.3);
        }
        
        .tab:hover:not(.active) {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
        }

        .toggle-implemented {
          padding: 12px 24px;
          border: 1px solid #1a365d;
          background: #1a365d;
          color: white;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.3);
        }

        .toggle-implemented:hover {
          background: #2d3748;
          border-color: #2d3748;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.4);
        }

        .toggle-implemented.active {
          background: #2d3748;
          border-color: #2d3748;
        }
        
        .advice-list {
          display: grid;
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .advice-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .advice-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          border-color: rgba(26, 54, 93, 0.3);
        }
        
        .advice-card-header {
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
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        
        .category-tag {
          padding: 6px 12px;
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .savings-badge {
          background: #1a365d;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.3);
        }
        
        .advice-title {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a365d;
        }
        
        .advice-description {
          margin: 0 0 20px 0;
          color: #4a5568;
          line-height: 1.5;
          font-size: 14px;
        }
        
        .advice-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .btn-primary, .btn-secondary, .btn-outline, .btn-dark, .btn-restore, .btn-remove {
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-primary {
          background: #1a365d;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.3);
        }
        
        .btn-primary:hover {
          background: #2d3748;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.4);
        }
        
        .btn-secondary {
          background: #2d3748;
          color: white;
          box-shadow: 0 4px 15px rgba(45, 55, 72, 0.3);
        }
        
        .btn-secondary:hover {
          background: #4a5568;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(45, 55, 72, 0.4);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid #4a5568;
          color: #4a5568;
        }
        
        .btn-outline:hover {
          background: #4a5568;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(74, 85, 104, 0.3);
        }

        .btn-dark {
          background: #1a365d;
          color: white;
          border: 1px solid #1a365d;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.3);
        }

        .btn-dark:hover {
          background: #2d3748;
          border-color: #2d3748;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.4);
        }

        .btn-restore {
          background: #2d3748;
          color: white;
          box-shadow: 0 4px 15px rgba(45, 55, 72, 0.3);
        }

        .btn-restore:hover {
          background: #4a5568;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(45, 55, 72, 0.4);
        }

        .btn-remove {
          background: #e53e3e;
          color: white;
          box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
        }

        .btn-remove:hover {
          background: #c53030;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(229, 62, 62, 0.4);
        }

        .btn-icon {
          font-size: 16px;
        }

        .implemented-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 16px;
        }

        .implemented-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .implemented-badge {
          background: #1a365d;
          color: white;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.3);
        }

        .implemented-date {
          color: #718096;
          font-size: 12px;
        }

        .implemented-buttons {
          display: flex;
          gap: 8px;
        }
        
        .no-advice {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .no-advice-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .no-advice h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
          color: #1a365d;
          font-weight: 600;
        }

        .no-advice p {
          margin: 0;
          color: #4a5568;
          font-size: 14px;
        }
        
        .ai-recommendation {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .ai-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          flex: 1;
        }
        
        .ai-icon {
          font-size: 32px;
          color: #1a365d;
        }
        
        .ai-content {
          flex: 1;
        }
        
        .ai-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #1a365d;
          font-weight: 600;
        }
        
        .ai-content p {
          margin: 0;
          color: #4a5568;
          font-size: 14px;
          line-height: 1.4;
        }

        .ai-details {
          margin-top: 12px;
          padding: 12px;
          background: rgba(26, 54, 93, 0.05);
          border-radius: 8px;
          border-left: 3px solid #1a365d;
        }

        .ai-details p {
          margin: 0;
          color: #4a5568;
          font-size: 13px;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .advice-content {
            padding: 16px;
          }
          
          .advice-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          
          .advice-stats {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
          }

          .stat {
            flex: 1;
            min-width: calc(50% - 8px);
          }
          
          .controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
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
            gap: 20px;
          }
          
          .ai-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .advice-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-primary, .btn-secondary, .btn-outline, .btn-dark, .btn-restore, .btn-remove {
            width: 100%;
            justify-content: center;
          }

          .advice-card-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .advice-meta {
            width: 100%;
          }

          .implemented-actions {
            flex-direction: column;
            gap: 12px;
          }

          .implemented-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .implemented-buttons {
            width: 100%;
          }

          .btn-restore, .btn-remove {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .advice-header h1 {
            font-size: 24px;
          }

          .stat-value {
            font-size: 20px;
          }

          .advice-stats {
            gap: 12px;
          }

          .stat {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}