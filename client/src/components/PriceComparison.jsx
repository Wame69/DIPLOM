import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getServiceData, isServiceInDatabase, calculateSavings } from '../utils/priceComparison';

export default function PriceComparison({ subscription, onClose }) {
  const { language } = useLanguage();

  const translations = {
    en: {
      priceComparison: 'Price Comparison',
      currentPlan: 'Current Plan',
      alternatives: 'Cheaper Alternatives',
      familyPlan: 'Family Plan',
      annualPlan: 'Annual Plan',
      monthly: 'monthly',
      annual: 'annual',
      potentialSavings: 'Potential Savings',
      switch: 'Switch',
      features: 'Features',
      noAlternatives: 'No cheaper alternatives found',
      noData: 'No price data available',
      serviceNotInDatabase: 'This service is not in our database',
      noComparison: 'We cannot provide price comparison for this service',
      close: 'Close',
      knownService: 'Service in database',
      unknownService: 'Service not in database'
    },
    ru: {
      priceComparison: 'Сравнение цен',
      currentPlan: 'Текущий план',
      alternatives: 'Более дешевые альтернативы',
      familyPlan: 'Семейный тариф',
      annualPlan: 'Годовой план',
      monthly: 'в месяц',
      annual: 'в год',
      potentialSavings: 'Потенциальная экономия',
      switch: 'Перейти',
      features: 'Возможности',
      noAlternatives: 'Более дешевых альтернатив не найдено',
      noData: 'Данные о ценах отсутствуют',
      serviceNotInDatabase: 'Этот сервис отсутствует в нашей базе',
      noComparison: 'Мы не можем предоставить сравнение цен для этого сервиса',
      close: 'Закрыть',
      knownService: 'Сервис в базе данных',
      unknownService: 'Сервис не в базе данных'
    }
  };

  const t = translations[language];

  if (!subscription) return null;

  const serviceKnown = isServiceInDatabase(subscription.title, subscription.category || subscription.service_type);
  const serviceData = serviceKnown ? getServiceData(subscription.title, subscription.category || subscription.service_type) : null;
  const currentMonthly = subscription.period === 'year' ? subscription.price / 12 : subscription.price;

  const getAlternatives = () => {
    if (!serviceKnown || !serviceData) return [];

    const alternatives = [];

    // Добавляем альтернативные сервисы
    serviceData.alternatives?.forEach(alt => {
      const savings = currentMonthly - alt.price;
      if (savings > 0) {
        alternatives.push({
          type: 'alternative',
          name: alt.name,
          price: alt.price,
          savings: Math.round(savings),
          period: 'monthly',
          features: alt.features,
          serviceKnown: true
        });
      }
    });

    // Добавляем семейный тариф если есть
    if (serviceData.family) {
      const familyPerUser = serviceData.family / 4;
      const savings = currentMonthly - familyPerUser;
      if (savings > 0) {
        alternatives.push({
          type: 'family',
          name: `${subscription.title} Family`,
          price: Math.round(familyPerUser),
          savings: Math.round(savings),
          period: 'monthly',
          features: ['До 4 пользователей', 'Общий доступ'],
          serviceKnown: true
        });
      }
    }

    // Добавляем годовую подписку если текущая месячная
    if (subscription.period === 'month' && serviceData) {
      const annualMonthly = Object.values(serviceData)
        .filter(val => typeof val === 'number')
        .reduce((min, price) => Math.min(min, price), Infinity) * 10 / 12;
      
      const savings = currentMonthly - annualMonthly;
      if (savings > 0) {
        alternatives.push({
          type: 'annual',
          name: `${subscription.title} Annual`,
          price: Math.round(annualMonthly),
          savings: Math.round(savings),
          period: 'monthly',
          features: ['Годовая оплата', 'Скидка 20%'],
          serviceKnown: true
        });
      }
    }

    return alternatives.sort((a, b) => b.savings - a.savings);
  };

  const alternatives = getAlternatives();

  // Если сервис неизвестен в базе
  if (!serviceKnown) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{t.priceComparison}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="comparison-content">
            <div className="unknown-service">
              <div className="unknown-icon">❓</div>
              <h3>{t.serviceNotInDatabase}</h3>
              <p>{t.noComparison}</p>
              
              <div className="current-plan-info">
                <h4>{t.currentPlan}</h4>
                <div className="plan-card current">
                  <div className="plan-name">{subscription.title}</div>
                  <div className="plan-price">
                    {Math.round(currentMonthly)} ₽ <span>/{t.monthly}</span>
                  </div>
                  <div className="service-status unknown">
                    {t.unknownService}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-primary" onClick={onClose}>
              {t.close}
            </button>
          </div>
        </div>

        <style jsx>{`
          .unknown-service {
            text-align: center;
            padding: 20px;
          }
          
          .unknown-icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.7;
          }
          
          .unknown-service h3 {
            color: #e53e3e;
            margin-bottom: 12px;
          }
          
          .current-plan-info {
            margin-top: 30px;
          }
          
          .current-plan-info h4 {
            margin-bottom: 16px;
            color: #1a365d;
          }
          
          .service-status {
            margin-top: 12px;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .service-status.unknown {
            background: #fed7d7;
            color: #c53030;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{t.priceComparison}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="comparison-content">
          {/* Статус сервиса */}
          <div className="service-status known">
            <span className="status-icon">✅</span>
            {t.knownService}
          </div>

          {/* Текущий план */}
          <div className="current-plan">
            <h3>{t.currentPlan}</h3>
            <div className="plan-card current">
              <div className="plan-name">{subscription.title}</div>
              <div className="plan-price">
                {Math.round(currentMonthly)} ₽ <span>/{t.monthly}</span>
              </div>
              <div className="plan-period">
                {subscription.period === 'year' ? t.annual : t.monthly}
              </div>
            </div>
          </div>

          {/* Альтернативы */}
          <div className="alternatives-section">
            <h3>{t.alternatives}</h3>
            {alternatives.length > 0 ? (
              <div className="alternatives-list">
                {alternatives.map((alt, index) => (
                  <div key={index} className="alternative-card">
                    <div className="alternative-header">
                      <div className="alternative-name">{alt.name}</div>
                      <div className="alternative-price">
                        {alt.price} ₽ <span>/{t.monthly}</span>
                      </div>
                    </div>
                    
                    <div className="alternative-savings">
                      <span className="savings-badge">
                        +{alt.savings} ₽ {t.potentialSavings}
                      </span>
                    </div>

                    <div className="alternative-features">
                      {alt.features?.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="alternative-type">
                      {alt.type === 'family' && '👨‍👩‍👧‍👦 '}
                      {alt.type === 'annual' && '📅 '}
                      {alt.type === 'alternative' && '🔄 '}
                      {t[alt.type + 'Plan'] || alt.type}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-alternatives">
                <div className="no-alt-icon">✅</div>
                <p>{t.noAlternatives}</p>
                <p className="subtext">Ваш текущий тариф оптимален</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            {t.close}
          </button>
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
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          width: 500px;
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #1a365d;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 8px;
          border-radius: 8px;
        }
        
        .close-btn:hover {
          background: #f7fafc;
        }
        
        .comparison-content {
          padding: 24px;
        }
        
        .service-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #c6f6d5;
          color: #276749;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .service-status.known {
          background: #c6f6d5;
          color: #276749;
        }
        
        .status-icon {
          font-size: 16px;
        }
        
        .current-plan, .alternatives-section {
          margin-bottom: 32px;
        }
        
        h3 {
          margin: 0 0 16px 0;
          color: #1a365d;
          font-size: 18px;
        }
        
        .plan-card {
          background: #f7fafc;
          border: 2px solid #1a365d;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        
        .plan-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 8px;
        }
        
        .plan-price {
          font-size: 24px;
          font-weight: 800;
          color: #1a365d;
          margin-bottom: 4px;
        }
        
        .plan-price span {
          font-size: 14px;
          color: #718096;
          font-weight: 400;
        }
        
        .plan-period {
          color: #718096;
          font-size: 14px;
        }
        
        .alternatives-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .alternative-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }
        
        .alternative-card:hover {
          border-color: #1a365d;
          box-shadow: 0 4px 12px rgba(26, 54, 93, 0.1);
        }
        
        .alternative-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .alternative-name {
          font-weight: 600;
          color: #2d3748;
        }
        
        .alternative-price {
          font-weight: 700;
          color: #1a365d;
        }
        
        .alternative-price span {
          font-size: 12px;
          color: #718096;
          font-weight: 400;
        }
        
        .alternative-savings {
          margin-bottom: 12px;
        }
        
        .savings-badge {
          background: #38a169;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .alternative-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }
        
        .feature-tag {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
        }
        
        .alternative-type {
          font-size: 12px;
          color: #718096;
        }
        
        .no-alternatives {
          text-align: center;
          padding: 40px 20px;
          color: #718096;
        }
        
        .no-alt-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.7;
        }
        
        .subtext {
          font-size: 14px;
          margin-top: 8px;
          opacity: 0.8;
        }
        
        .modal-actions {
          padding: 24px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
        
        .btn-primary {
          background: #1a365d;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .alternative-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}