// components/Stats.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useData } from '../contexts/DataContext.jsx';

export default function Stats() {
  const [timeRange, setTimeRange] = useState('month');
  const [chartData, setChartData] = useState([]);
  const { language } = useLanguage();
  const { getStats, subscriptions, services } = useData();

  const translations = {
    en: {
      analytics: 'Analytics',
      totalSpending: 'Total Spending',
      activeSubscriptions: 'Active Subscriptions',
      monthlyAverage: 'Monthly Average',
      savings: 'Savings',
      byCategory: 'Spending by Category',
      subscriptionDistribution: 'Subscription Distribution',
      spendingTrend: 'Spending Trend',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      last3Months: 'Last 3 Months',
      last6Months: 'Last 6 Months',
      thisYear: 'This Year',
      subscriptions: 'Subscriptions',
      services: 'Services',
      streaming: 'Streaming',
      software: 'Software',
      music: 'Music',
      utilities: 'Utilities',
      other: 'Other',
      total: 'Total',
      month: 'Month',
      rubles: 'Rubles',
      noData: 'No data available',
      addSubscriptions: 'Add subscriptions to see analytics'
    },
    ru: {
      analytics: 'Аналитика',
      totalSpending: 'Общие расходы',
      activeSubscriptions: 'Активные подписки',
      monthlyAverage: 'Среднемесячно',
      savings: 'Экономия',
      byCategory: 'Расходы по категориям',
      subscriptionDistribution: 'Распределение подписок',
      spendingTrend: 'Тренд расходов',
      thisMonth: 'Этот месяц',
      lastMonth: 'Прошлый месяц',
      last3Months: '3 месяца',
      last6Months: '6 месяцев',
      thisYear: 'Этот год',
      subscriptions: 'Подписки',
      services: 'Услуги',
      streaming: 'Стриминг',
      software: 'Софт',
      music: 'Музыка',
      utilities: 'Коммунальные',
      other: 'Другое',
      total: 'Всего',
      month: 'Месяц',
      rubles: 'Рубли',
      noData: 'Нет данных',
      addSubscriptions: 'Добавьте подписки для просмотра аналитики'
    }
  };

  const t = translations[language];

  const stats = getStats();
  const allItems = [...subscriptions, ...services].filter(item => item.active !== false);

  useEffect(() => {
    // Генерация данных для графика
    const categories = {};
    allItems.forEach(item => {
      const category = item.category || item.service_type || 'other';
      const price = parseFloat(item.price) || 0;
      const monthlyPrice = item.period === 'year' ? price / 12 : price;
      
      if (!categories[category]) categories[category] = 0;
      categories[category] += monthlyPrice;
    });

    const chartData = Object.entries(categories).map(([name, value]) => ({
      name: t[name.toLowerCase()] || name,
      value: Math.round(value),
      color: getCategoryColor(name)
    }));

    setChartData(chartData);
  }, [subscriptions, services, language]);

  const getCategoryColor = (category) => {
    const colors = {
      streaming: '#1a365d',
      software: '#2d3748',
      music: '#4a5568',
      utilities: '#718096',
      internet: '#2b6cb0',
      mobile: '#3182ce',
      tv: '#4299e1',
      insurance: '#63b3ed',
      other: '#90cdf4'
    };
    return colors[category.toLowerCase()] || '#cbd5e0';
  };

  const getMonthlySpending = () => {
    return allItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + (item.period === 'year' ? price / 12 : price);
    }, 0);
  };

  const getSubscriptionDistribution = () => {
    const subsCount = subscriptions.filter(s => s.active !== false).length;
    const servicesCount = services.filter(s => s.active !== false).length;
    
    return [
      { name: t.subscriptions, value: subsCount, color: '#1a365d' },
      { name: t.services, value: servicesCount, color: '#2d3748' }
    ];
  };

  if (allItems.length === 0) {
    return (
      <div className="stats-container">
        <div className="background-elements">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
          <div className="bg-pattern"></div>
        </div>

        <div className="stats-content">
          <div className="stats-header">
            <h1>{t.analytics}</h1>
          </div>
          
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <h3>{t.noData}</h3>
            <p>{t.addSubscriptions}</p>
          </div>
        </div>

        <style jsx>{`
          .stats-container {
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

          .stats-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 32px;
            position: relative;
            z-index: 2;
          }

          .stats-header {
            margin-bottom: 40px;
          }

          .stats-header h1 {
            margin: 0;
            font-size: 36px;
            font-weight: 800;
            color: #1a365d;
            background: linear-gradient(135deg, #1a365d, #2d3748);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .no-data {
            text-align: center;
            padding: 100px 20px;
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          }

          .no-data-icon {
            font-size: 80px;
            margin-bottom: 24px;
            opacity: 0.7;
          }

          .no-data h3 {
            margin: 0 0 16px 0;
            font-size: 24px;
            color: #1a365d;
            font-weight: 700;
          }

          .no-data p {
            margin: 0;
            color: #4a5568;
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  }

  const monthlySpending = getMonthlySpending();
  const distribution = getSubscriptionDistribution();

  return (
    <div className="stats-container">
      <div className="background-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="stats-content">
        <div className="stats-header">
          <h1>{t.analytics}</h1>
          <div className="time-range-selector">
            <button 
              className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              {t.thisMonth}
            </button>
            <button 
              className={`time-btn ${timeRange === '3months' ? 'active' : ''}`}
              onClick={() => setTimeRange('3months')}
            >
              {t.last3Months}
            </button>
            <button 
              className={`time-btn ${timeRange === '6months' ? 'active' : ''}`}
              onClick={() => setTimeRange('6months')}
            >
              {t.last6Months}
            </button>
            <button 
              className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              {t.thisYear}
            </button>
          </div>
        </div>

        <div className="stats-grid">
          {/* Основные метрики */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <div className="metric-value">{Math.round(monthlySpending)} ₽</div>
                <div className="metric-label">{t.totalSpending}</div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">📱</div>
              <div className="metric-content">
                <div className="metric-value">{stats.activeSubscriptions + stats.activeServices}</div>
                <div className="metric-label">{t.activeSubscriptions}</div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-value">{Math.round(monthlySpending / (stats.activeSubscriptions + stats.activeServices) || 0)} ₽</div>
                <div className="metric-label">{t.monthlyAverage}</div>
              </div>
            </div>
            
            <div className="metric-card success">
              <div className="metric-icon">💸</div>
              <div className="metric-content">
                <div className="metric-value">~{Math.round(monthlySpending * 0.15)} ₽</div>
                <div className="metric-label">{t.savings}</div>
              </div>
            </div>
          </div>

          {/* График по категориям */}
          <div className="chart-section">
            <h3>{t.byCategory}</h3>
            <div className="chart-container">
              {chartData.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="chart-bar">
                    <div 
                      className="chart-fill"
                      style={{
                        width: `${(item.value / monthlySpending) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <div className="chart-label">
                    <span className="category-name">{item.name}</span>
                    <span className="category-value">{item.value} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Распределение подписок */}
          <div className="distribution-section">
            <h3>{t.subscriptionDistribution}</h3>
            <div className="distribution-chart">
              {distribution.map((item, index) => (
                <div key={index} className="distribution-item">
                  <div className="distribution-info">
                    <div 
                      className="distribution-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="distribution-name">{item.name}</span>
                    <span className="distribution-value">{item.value}</span>
                  </div>
                  <div className="distribution-bar">
                    <div 
                      className="distribution-fill"
                      style={{
                        width: `${(item.value / (stats.activeSubscriptions + stats.activeServices)) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Детальная статистика */}
          <div className="detailed-stats">
            <h3>Детальная статистика</h3>
            <div className="stats-table">
              {chartData.map((item, index) => (
                <div key={index} className="stat-row">
                  <div className="stat-category">
                    <div 
                      className="stat-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    {item.name}
                  </div>
                  <div className="stat-value">{item.value} ₽</div>
                  <div className="stat-percentage">
                    {Math.round((item.value / monthlySpending) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stats-container {
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

        .stats-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px;
          position: relative;
          z-index: 2;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .stats-header h1 {
          margin: 0;
          font-size: 36px;
          font-weight: 800;
          color: #1a365d;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .time-range-selector {
          display: flex;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 6px;
          gap: 4px;
        }

        .time-btn {
          padding: 12px 20px;
          border: none;
          background: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .time-btn.active {
          background: #1a365d;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.2);
        }

        .time-btn:hover:not(.active) {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
        }

        .stats-grid {
          display: grid;
          gap: 24px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .metric-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .metric-card.primary {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
        }

        .metric-card.success {
          border-color: rgba(72, 187, 120, 0.3);
        }

        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .metric-icon {
          font-size: 40px;
          opacity: 0.9;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1;
        }

        .metric-card.primary .metric-value {
          color: white;
        }

        .metric-label {
          font-size: 14px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-card.primary .metric-label {
          color: rgba(255,255,255,0.9);
        }

        .chart-section, .distribution-section, .detailed-stats {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .chart-section h3, .distribution-section h3, .detailed-stats h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
          color: #1a365d;
          font-weight: 700;
        }

        .chart-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .chart-bar {
          flex: 1;
          height: 12px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 6px;
          overflow: hidden;
        }

        .chart-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .chart-label {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 150px;
          font-size: 14px;
          font-weight: 600;
        }

        .category-name {
          color: #2d3748;
        }

        .category-value {
          color: #1a365d;
          font-weight: 700;
        }

        .distribution-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .distribution-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .distribution-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .distribution-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .distribution-name {
          flex: 1;
          font-size: 14px;
          color: #2d3748;
          font-weight: 500;
        }

        .distribution-value {
          font-size: 14px;
          color: #1a365d;
          font-weight: 700;
        }

        .distribution-bar {
          width: 100%;
          height: 8px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 4px;
          overflow: hidden;
        }

        .distribution-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .stats-table {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(247, 250, 252, 0.8);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .stat-row:hover {
          background: rgba(26, 54, 93, 0.05);
        }

        .stat-category {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          color: #2d3748;
        }

        .stat-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .stat-value {
          font-weight: 700;
          color: #1a365d;
          min-width: 80px;
          text-align: right;
        }

        .stat-percentage {
          color: #718096;
          font-size: 14px;
          min-width: 50px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .stats-content {
            padding: 16px;
          }

          .stats-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .time-range-selector {
            flex-wrap: wrap;
          }

          .time-btn {
            flex: 1;
            min-width: calc(50% - 4px);
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .metric-card {
            padding: 20px;
          }

          .chart-section, .distribution-section, .detailed-stats {
            padding: 24px;
          }

          .chart-label {
            min-width: 120px;
          }

          .stat-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .stat-value, .stat-percentage {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .stats-header h1 {
            font-size: 28px;
          }

          .metric-value {
            font-size: 24px;
          }

          .time-btn {
            padding: 10px 16px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}