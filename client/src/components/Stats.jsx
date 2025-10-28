import React, { useEffect, useState } from 'react';

export default function Stats() {
  const [stats, setStats] = useState({ monthly: {}, category: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const token = localStorage.getItem('ev_token');
    try {
      const res = await fetch('/api/stats', {
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

  if (loading) return <div className="loading">Загрузка статистики...</div>;

  return (
    <div className="stats">
      <h2>Статистика</h2>
      
      <div className="stats-section">
        <h3>Расходы по месяцам</h3>
        {Object.keys(stats.monthly).length === 0 ? (
          <p>Нет данных</p>
        ) : (
          <div className="monthly-stats">
            {Object.entries(stats.monthly).map(([month, amount]) => (
              <div key={month} className="stat-item">
                <span>{month}:</span>
                <strong>{amount.toLocaleString('ru-RU')} ₽</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stats-section">
        <h3>Расходы по категориям</h3>
        {Object.keys(stats.category).length === 0 ? (
          <p>Нет данных</p>
        ) : (
          <div className="category-stats">
            {Object.entries(stats.category).map(([category, amount]) => (
              <div key={category} className="stat-item">
                <span>{category}:</span>
                <strong>{amount.toLocaleString('ru-RU')} ₽/мес</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .stats {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .stats-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        
        .stats-section h3 {
          margin: 0 0 16px 0;
          color: #1a1a1a;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .stat-item:last-child {
          border-bottom: none;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
}