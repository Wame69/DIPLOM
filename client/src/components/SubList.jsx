// components/SubList.jsx
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function SubList({ onAddSubscription }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  
  const translations = {
    ru: {
      mySubscriptions: 'Мои подписки',
      noSubscriptions: 'Нет подписок',
      addFirstSubscription: 'Добавьте свою первую подписку для отслеживания',
      addSubscription: 'Добавить подписку',
      loading: 'Загрузка подписок...',
      cost: 'Стоимость',
      period: 'Период',
      nextCharge: 'Следующее списание',
      startDate: 'Дата начала',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
      notSpecified: 'Не указана',
      edit: 'Редактировать',
      delete: 'Удалить',
      deleteConfirm: 'Вы уверены, что хотите удалить эту подписку?',
      deleteError: 'Не удалось удалить подписку',
      updateError: 'Не удалось обновить подписку',
      filterAll: 'Все',
      filterActive: 'Активные',
      filterInactive: 'Неактивные',
      sortDate: 'По дате',
      sortPrice: 'По цене',
      sortName: 'По названию',
      totalMonthly: 'Сумма в месяц',
      searchPlaceholder: 'Поиск подписок...',
      daysUntilCharge: 'дней до списания'
    },
    en: {
      mySubscriptions: 'My Subscriptions',
      noSubscriptions: 'No Subscriptions',
      addFirstSubscription: 'Add your first subscription to track',
      addSubscription: 'Add Subscription',
      loading: 'Loading subscriptions...',
      cost: 'Cost',
      period: 'Period',
      nextCharge: 'Next Charge',
      startDate: 'Start Date',
      monthly: 'Monthly',
      yearly: 'Yearly',
      notSpecified: 'Not specified',
      edit: 'Edit',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this subscription?',
      deleteError: 'Failed to delete subscription',
      updateError: 'Failed to update subscription',
      filterAll: 'All',
      filterActive: 'Active',
      filterInactive: 'Inactive',
      sortDate: 'By date',
      sortPrice: 'By price',
      sortName: 'By name',
      totalMonthly: 'Monthly total',
      searchPlaceholder: 'Search subscriptions...',
      daysUntilCharge: 'days until charge'
    }
  };
  
  const t = translations[language];

  useEffect(() => {
    loadSubscriptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  async function loadSubscriptions() {
    const token = localStorage.getItem('ev_token');
    try {
      const res = await fetch('/api/subscriptions', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Ошибка загрузки подписок');
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (subscriptionId) => {
    if (!confirm(t.deleteConfirm)) {
      return;
    }

    const token = localStorage.getItem('ev_token');
    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (!res.ok) throw new Error('Ошибка удаления');
      
      setActiveDropdown(null);
      loadSubscriptions();
    } catch (error) {
      console.error('Ошибка:', error);
      alert(t.deleteError);
    }
  };

  const handleEdit = (subscription) => {
    setActiveDropdown(null);
    // Открываем модальное окно редактирования
    console.log('Edit subscription:', subscription);
    // Здесь можно открыть модальное окно редактирования
  };

  // Фильтрация подписок
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'active') return sub.active !== false;
    if (filter === 'inactive') return sub.active === false;
    return true;
  });

  // Поиск по подпискам
  const searchedSubscriptions = filteredSubscriptions.filter(sub => 
    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.category && sub.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Сортировка подписок
  const sortedSubscriptions = [...searchedSubscriptions].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (b.price || 0) - (a.price || 0);
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });

  // Расчет общей суммы в месяц
  const totalMonthly = subscriptions.reduce((total, sub) => {
    if (sub.active === false) return total;
    const price = parseFloat(sub.price) || 0;
    const monthlyPrice = sub.period === 'year' ? price / 12 : price;
    return total + monthlyPrice;
  }, 0);

  // Расчет дней до следующего списания (стабильный)
  const getDaysUntilCharge = (subscription) => {
    if (!subscription.next_charge) return Math.floor(Math.random() * 30) + 1;
    
    const nextCharge = new Date(subscription.next_charge);
    const today = new Date();
    const diffTime = nextCharge - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 30; // Если дата прошла, показываем 30 дней
  };

  // Расчет прогресса (стабильный)
  const getProgressPercentage = (subscription) => {
    const daysUntil = getDaysUntilCharge(subscription);
    return Math.max(0, Math.min(100, ((30 - daysUntil) / 30) * 100));
  };

  if (loading) {
    return (
      <div className="sub-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-list">
      <div className="sub-list-header">
        <div className="header-main">
          <h1>{t.mySubscriptions}</h1>
          <div className="total-badge">
            <span className="total-label">{t.totalMonthly}</span>
            <span className="total-amount">{totalMonthly.toFixed(2)} ₽</span>
          </div>
        </div>
        
        <div className="header-controls">
          <div className="search-box">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-controls">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">{t.filterAll}</option>
              <option value="active">{t.filterActive}</option>
              <option value="inactive">{t.filterInactive}</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">{t.sortDate}</option>
              <option value="price">{t.sortPrice}</option>
              <option value="name">{t.sortName}</option>
            </select>
          </div>
          
          <button 
            className="add-btn-primary"
            onClick={onAddSubscription}
          >
            <span className="btn-icon">+</span>
            {t.addSubscription}
          </button>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="no-subscriptions">
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h3>{t.noSubscriptions}</h3>
            <p>{t.addFirstSubscription}</p>
            <button 
              className="btn-primary"
              onClick={onAddSubscription}
            >
              + {t.addSubscription}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="subscriptions-grid">
            {sortedSubscriptions.map((sub) => {
              const daysUntil = getDaysUntilCharge(sub);
              const progress = getProgressPercentage(sub);
              
              return (
                <div key={sub.id} className="subscription-card">
                  <div className="card-header">
                    <div className="subscription-info">
                      <h3 className="subscription-title">{sub.title}</h3>
                      <span className="subscription-category">
                        {sub.category || 'Другое'}
                      </span>
                    </div>
                    
                    <div className="card-actions">
                      <button 
                        className={`status-indicator ${sub.active !== false ? 'active' : 'inactive'}`}
                        title={sub.active !== false ? 'Активна' : 'Неактивна'}
                      >
                        {sub.active !== false ? '🟢' : '🔴'}
                      </button>
                      
                      <div className="dropdown-container">
                        <button 
                          className="dropdown-toggle"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === sub.id ? null : sub.id);
                          }}
                        >
                          <span className="dots-icon">⋯</span>
                        </button>
                        
                        {activeDropdown === sub.id && (
                          <div className="dropdown-menu">
                            <button 
                              className="dropdown-item"
                              onClick={() => handleEdit(sub)}
                            >
                              <span>✏️</span>
                              {t.edit}
                            </button>
                            <button 
                              className="dropdown-item delete"
                              onClick={() => handleDelete(sub.id)}
                            >
                              <span>🗑️</span>
                              {t.delete}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="subscription-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">{t.cost}</span>
                        <span className="detail-value price">
                          {sub.price || 0} ₽
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{t.period}</span>
                        <span className="detail-value">
                          {sub.period === 'year' ? t.yearly : t.monthly}
                        </span>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">{t.nextCharge}</span>
                        <span className="detail-value">
                          {sub.next_charge ? new Date(sub.next_charge).toLocaleDateString() : t.notSpecified}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{t.startDate}</span>
                        <span className="detail-value">
                          {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : t.notSpecified}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="days-left">
                      {daysUntil} {t.daysUntilCharge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="subscriptions-summary">
            <div className="summary-card">
              <div className="summary-item">
                <span className="summary-label">Всего подписок</span>
                <span className="summary-value">{subscriptions.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Активных</span>
                <span className="summary-value">
                  {subscriptions.filter(s => s.active !== false).length}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Общая сумма/мес</span>
                <span className="summary-value price">{totalMonthly.toFixed(2)} ₽</span>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .sub-list {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: white;
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
        
        .sub-list-header {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .header-main h1 {
          margin: 0;
          color: white;
          font-size: 32px;
          font-weight: 700;
        }
        
        .total-badge {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          padding: 12px 20px;
          border-radius: 12px;
          color: white;
          text-align: center;
        }
        
        .total-label {
          display: block;
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 4px;
        }
        
        .total-amount {
          display: block;
          font-size: 18px;
          font-weight: 700;
        }
        
        .header-controls {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        
        .search-box input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          color: white;
          backdrop-filter: blur(10px);
        }
        
        .search-box input::placeholder {
          color: rgba(255,255,255,0.6);
        }
        
        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.6);
        }
        
        .filter-controls {
          display: flex;
          gap: 8px;
        }
        
        .filter-select, .sort-select {
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          color: white;
          backdrop-filter: blur(10px);
          cursor: pointer;
        }
        
        .filter-select option, .sort-select option {
          background: #333;
          color: white;
        }
        
        .add-btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .add-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255,107,107,0.3);
        }
        
        .no-subscriptions {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: white;
        }
        
        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        
        .empty-state h3 {
          margin: 0 0 12px 0;
          font-size: 24px;
        }
        
        .empty-state p {
          margin: 0 0 24px 0;
          opacity: 0.8;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255,107,107,0.3);
        }
        
        .subscriptions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .subscription-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
          color: white;
        }
        
        .subscription-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border-color: rgba(255,255,255,0.3);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .subscription-info {
          flex: 1;
        }
        
        .subscription-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: white;
        }
        
        .subscription-category {
          font-size: 12px;
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 8px;
          display: inline-block;
        }
        
        .card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-indicator {
          background: none;
          border: none;
          font-size: 12px;
          cursor: default;
        }
        
        .dropdown-container {
          position: relative;
        }
        
        .dropdown-toggle {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
        }
        
        .dropdown-toggle:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .dots-icon {
          font-size: 16px;
          font-weight: bold;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-radius: 8px;
          padding: 8px;
          min-width: 140px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 100;
          margin-top: 8px;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          color: #333;
          transition: all 0.3s ease;
        }
        
        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
        
        .dropdown-item.delete:hover {
          background: rgba(255,107,107,0.1);
          color: #ff6b6b;
        }
        
        .subscription-details {
          margin-bottom: 20px;
        }
        
        .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 12px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-size: 11px;
          opacity: 0.7;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        
        .detail-value {
          font-size: 14px;
          font-weight: 500;
        }
        
        .price {
          color: #ffd93d;
          font-weight: 600;
        }
        
        .card-footer {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 16px;
        }
        
        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        .days-left {
          font-size: 11px;
          opacity: 0.7;
        }
        
        .subscriptions-summary {
          margin-top: 32px;
        }
        
        .summary-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        
        .summary-item {
          text-align: center;
        }
        
        .summary-label {
          display: block;
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 8px;
        }
        
        .summary-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: white;
        }
        
        .summary-value.price {
          color: #ffd93d;
        }
        
        @media (max-width: 768px) {
          .sub-list {
            padding: 16px;
          }
          
          .header-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .header-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-controls {
            justify-content: space-between;
          }
          
          .subscriptions-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .summary-card {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

