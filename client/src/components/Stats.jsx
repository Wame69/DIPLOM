// components/Stats.jsx
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Stats() {
  const [stats, setStats] = useState({ 
    monthly: {}, 
    category: {},
    total: { RUB: 0, USD: 0, EUR: 0 },
    currency: 'RUB'
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6m');
  const [currency, setCurrency] = useState('RUB');
  const { language } = useLanguage();

  const translations = {
    ru: {
      statistics: 'Аналитика расходов',
      loading: 'Загрузка статистики...',
      monthlyExpenses: 'Расходы по месяцам',
      byCategory: 'Расходы по категориям',
      totalExpenses: 'Общие расходы',
      noData: 'Нет данных',
      thisMonth: 'Этот месяц',
      lastMonth: 'Прошлый месяц',
      last6Months: 'Последние 6 месяцев',
      lastYear: 'Последний год',
      monthlyAverage: 'Среднемесячно',
      totalSaved: 'Всего сэкономлено',
      potentialSavings: 'Потенциальная экономия',
      mostExpensive: 'Самая дорогая подписка',
      recommendations: 'Рекомендации'
    },
    en: {
      statistics: 'Expense Analytics',
      loading: 'Loading statistics...',
      monthlyExpenses: 'Monthly Expenses',
      byCategory: 'Expenses by Category',
      totalExpenses: 'Total Expenses',
      noData: 'No data',
      thisMonth: 'This month',
      lastMonth: 'Last month',
      last6Months: 'Last 6 months',
      lastYear: 'Last year',
      monthlyAverage: 'Monthly average',
      totalSaved: 'Total saved',
      potentialSavings: 'Potential savings',
      mostExpensive: 'Most expensive subscription',
      recommendations: 'Recommendations'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadStats();
  }, [timeRange, currency]);

  async function loadStats() {
    const token = localStorage.getItem('ev_token');
    try {
      const res = await fetch(`/api/stats?currency=${currency}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Ошибка загрузки статистики');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  }

  // Генерация демо-данных для визуализации
  const generateChartData = () => {
    const months = language === 'ru' 
      ? ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, index) => ({
      month,
      amount: Math.floor(Math.random() * 10000) + 2000
    }));
  };

  const chartData = generateChartData();
  const categoryData = Object.entries(stats.category || {}).map(([name, value]) => ({
    name,
    value
  }));

  if (loading) {
    return (
      <div className="stats-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>{t.statistics}</h1>
        <div className="controls">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="1m">{t.thisMonth}</option>
            <option value="2m">{t.lastMonth}</option>
            <option value="6m">{t.last6Months}</option>
            <option value="12m">{t.lastYear}</option>
          </select>
          
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-select"
          >
            <option value="RUB">₽ RUB</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        {/* Карточки с общей статистикой */}
        <div className="stat-cards">
          <div className="stat-card primary">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total?.RUB?.toFixed(2) || '0'} ₽</div>
              <div className="stat-label">{t.monthlyAverage}</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <div className="stat-value">1,245 ₽</div>
              <div className="stat-label">{t.totalSaved}</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">2,580 ₽</div>
              <div className="stat-label">{t.potentialSavings}</div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">Netflix</div>
              <div className="stat-label">{t.mostExpensive}</div>
            </div>
          </div>
        </div>

        {/* График расходов по месяцам */}
        <div className="chart-section">
          <h3>{t.monthlyExpenses}</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {chartData.map((item, index) => (
                <div key={index} className="chart-bar-container">
                  <div className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{ height: `${(item.amount / 15000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bar-label">{item.month}</span>
                  <span className="bar-value">{item.amount.toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Расходы по категориям */}
        <div className="categories-section">
          <h3>{t.byCategory}</h3>
          <div className="categories-list">
            {categoryData.length === 0 ? (
              <div className="no-data">{t.noData}</div>
            ) : (
              categoryData.map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category.name}</span>
                    <span className="category-amount">{category.value} ₽/мес</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-progress"
                      style={{ 
                        width: `${(category.value / Math.max(...categoryData.map(c => c.value))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Круговые диаграммы */}
        <div className="pie-charts">
          <div className="pie-chart">
            <h4>Распределение по типам</h4>
            <div className="pie-container">
              <div className="pie-segment streaming"></div>
              <div className="pie-segment software"></div>
              <div className="pie-segment music"></div>
              <div className="pie-segment other"></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color streaming"></span>
                <span>Стриминг 45%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color software"></span>
                <span>Софт 25%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color music"></span>
                <span>Музыка 15%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color other"></span>
                <span>Другое 15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stats-container {
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
        
        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        
        .stats-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }
        
        .controls {
          display: flex;
          gap: 12px;
        }
        
        .time-select, .currency-select {
          padding: 10px 16px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: white;
          backdrop-filter: blur(10px);
          cursor: pointer;
        }
        
        .stats-grid {
          display: grid;
          gap: 24px;
        }
        
        .stat-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        
        .stat-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .stat-card.primary {
          border-left: 4px solid #667eea;
        }
        
        .stat-card.success {
          border-left: 4px solid #4ecdc4;
        }
        
        .stat-card.warning {
          border-left: 4px solid #ffd93d;
        }
        
        .stat-card.info {
          border-left: 4px solid #ff6b6b;
        }
        
        .stat-icon {
          font-size: 32px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .chart-section {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
        }
        
        .chart-section h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
        }
        
        .chart-container {
          height: 300px;
          display: flex;
          align-items: flex-end;
        }
        
        .chart-bars {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          height: 100%;
          gap: 8px;
        }
        
        .chart-bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
        }
        
        .chart-bar {
          width: 30px;
          height: 100%;
          background: rgba(255,255,255,0.1);
          border-radius: 4px 4px 0 0;
          position: relative;
          display: flex;
          align-items: flex-end;
        }
        
        .bar-fill {
          width: 100%;
          background: linear-gradient(to top, #667eea, #764ba2);
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
          min-height: 20px;
        }
        
        .bar-label {
          font-size: 12px;
          margin-top: 8px;
          opacity: 0.8;
        }
        
        .bar-value {
          font-size: 10px;
          opacity: 0.6;
          margin-top: 4px;
        }
        
        .categories-section {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
        }
        
        .categories-section h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
        }
        
        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .category-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .category-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .category-name {
          font-weight: 500;
        }
        
        .category-amount {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .category-bar {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .category-progress {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #ee5a24);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .no-data {
          text-align: center;
          padding: 40px;
          opacity: 0.6;
        }
        
        .pie-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .pie-chart {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }
        
        .pie-chart h4 {
          margin: 0 0 20px 0;
          font-size: 18px;
        }
        
        .pie-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: conic-gradient(
            #667eea 0% 45%,
            #4ecdc4 45% 70%,
            #ffd93d 70% 85%,
            #ff6b6b 85% 100%
          );
          margin: 0 auto 20px;
          position: relative;
        }
        
        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        
        .legend-color.streaming { background: #667eea; }
        .legend-color.software { background: #4ecdc4; }
        .legend-color.music { background: #ffd93d; }
        .legend-color.other { background: #ff6b6b; }
        
        @media (max-width: 768px) {
          .stats-container {
            padding: 16px;
          }
          
          .stats-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .controls {
            width: 100%;
            justify-content: space-between;
          }
          
          .stat-cards {
            grid-template-columns: 1fr;
          }
          
          .chart-bars {
            gap: 4px;
          }
          
          .chart-bar {
            width: 20px;
          }
          
          .bar-label {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}