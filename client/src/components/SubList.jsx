import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useData } from '../contexts/DataContext.jsx';

export default function SubList({ onAddSubscription, onEditSubscription }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('RUB');
  const [viewType, setViewType] = useState('subscriptions');

  const { language } = useLanguage();
  const { subscriptions, services, deleteSubscription, deleteService } = useData();

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const translations = {
    en: {
      mySubscriptions: 'My Subscriptions',
      myServices: 'My Services',
      noSubscriptions: 'No Subscriptions',
      noServices: 'No Services',
      addFirstSubscription: 'Add first subscription',
      addFirstService: 'Add first service',
      addSubscription: 'Add Subscription',
      addService: 'Add Service',
      loading: 'Loading...',
      cost: 'Cost',
      period: 'Period',
      nextCharge: 'Next Charge',
      startDate: 'Start Date',
      monthly: 'Monthly',
      yearly: 'Yearly',
      notSpecified: 'Not specified',
      edit: 'Edit',
      delete: 'Delete',
      deleteConfirm: 'Delete this subscription?',
      deleteServiceConfirm: 'Delete this service?',
      filterAll: 'All',
      filterActive: 'Active',
      filterInactive: 'Inactive',
      sortDate: 'By date',
      sortPrice: 'By price',
      sortName: 'By name',
      totalMonthly: 'Monthly',
      searchPlaceholder: 'Search...',
      daysUntilCharge: 'days until charge',
      active: 'Active',
      inactive: 'Inactive',
      currency: 'Currency',
      rubles: 'Rubles',
      dollars: 'Dollars',
      euro: 'Euro',
      viewSubscriptions: 'Subscriptions',
      viewServices: 'Services',
      serviceType: 'Service type',
      provider: 'Provider',
      subscription: 'Subscription',
      streaming: 'Streaming',
      music: 'Music',
      software: 'Software',
      gaming: 'Gaming',
      education: 'Education',
      fitness: 'Fitness',
      utility: 'Utilities',
      internet: 'Internet',
      mobile: 'Mobile',
      tv: 'TV',
      insurance: 'Insurance',
      otherService: 'Other',
      other: 'Other',
      totalItems: 'Total',
      activeItems: 'Active',
      today: 'Today',
      tomorrow: 'Tomorrow',
      soon: 'Soon'
    },
    ru: {
      mySubscriptions: 'Мои подписки',
      myServices: 'Мои услуги',
      noSubscriptions: 'Нет подписок',
      noServices: 'Нет услуг',
      addFirstSubscription: 'Добавьте первую подписку',
      addFirstService: 'Добавьте первую услугу',
      addSubscription: 'Добавить подписку',
      addService: 'Добавить услугу',
      loading: 'Загрузка...',
      cost: 'Стоимость',
      period: 'Период',
      nextCharge: 'Следующее списание',
      startDate: 'Дата начала',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
      notSpecified: 'Не указано',
      edit: 'Редактировать',
      delete: 'Удалить',
      deleteConfirm: 'Удалить эту подписку?',
      deleteServiceConfirm: 'Удалить эту услугу?',
      filterAll: 'Все',
      filterActive: 'Активные',
      filterInactive: 'Неактивные',
      sortDate: 'По дате',
      sortPrice: 'По цене',
      sortName: 'По названию',
      totalMonthly: 'В месяц',
      searchPlaceholder: 'Поиск...',
      daysUntilCharge: 'дней до списания',
      active: 'Активна',
      inactive: 'Неактивна',
      currency: 'Валюта',
      rubles: 'Рубли',
      dollars: 'Доллары',
      euro: 'Евро',
      viewSubscriptions: 'Подписки',
      viewServices: 'Услуги',
      serviceType: 'Тип услуги',
      provider: 'Провайдер',
      subscription: 'Подписка',
      streaming: 'Стриминг',
      music: 'Музыка',
      software: 'Программы',
      gaming: 'Игры',
      education: 'Образование',
      fitness: 'Фитнес',
      utility: 'Коммунальные',
      internet: 'Интернет',
      mobile: 'Мобильная связь',
      tv: 'Телевидение',
      insurance: 'Страхование',
      otherService: 'Другое',
      other: 'Другое',
      totalItems: 'Всего',
      activeItems: 'Активных',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      soon: 'Скоро'
    }
  };

  const t = translations[language];

  const exchangeRates = {
    RUB: 1,
    USD: 0.011,
    EUR: 0.010
  };

  const currencySymbols = {
    RUB: '₽',
    USD: '$',
    EUR: '€'
  };

  const convertPrice = (price) => {
    const rubPrice = parseFloat(price) || 0;
    return rubPrice * exchangeRates[currency];
  };

  const formatPrice = (price) => {
    const convertedPrice = convertPrice(price);
    return `${convertedPrice.toFixed(2)} ${currencySymbols[currency]}`;
  };

  const getFilteredItems = () => {
    const items = viewType === 'services' ? services : subscriptions;

    const filtered = items.filter(item => {
      if (filter === 'active') return item.active !== false;
      if (filter === 'inactive') return item.active === false;
      return true;
    });

    return filtered.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.provider && item.provider.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.service_type && getServiceTypeLabel(item.service_type).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getSortedItems = () => {
    const filteredItems = getFilteredItems();

    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return new Date(b.created_at || b.start_date || 0) - new Date(a.created_at || a.start_date || 0);
      }
    });
  };

  const calculateTotalMonthly = () => {
    const items = viewType === 'services' ? services : subscriptions;
    return items.reduce((total, item) => {
      if (item.active === false) return total;
      const price = parseFloat(item.price) || 0;
      const monthlyPrice = item.period === 'year' ? price / 12 : price;
      return total + monthlyPrice;
    }, 0);
  };

  const getNextChargeDate = (item) => {
    if (!item.start_date) return null;

    const startDate = new Date(item.start_date);
    const now = new Date();

    // Find next charge date
    let nextCharge = new Date(startDate);

    while (nextCharge <= now) {
      if (item.period === 'year') {
        nextCharge.setFullYear(nextCharge.getFullYear() + 1);
      } else {
        nextCharge.setMonth(nextCharge.getMonth() + 1);
      }
    }

    return nextCharge;
  };

  const getDaysUntilCharge = (item) => {
    const nextCharge = getNextChargeDate(item);
    if (!nextCharge) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextCharge.setHours(0, 0, 0, 0);

    const diffTime = nextCharge - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getProgressPercentage = (item) => {
    const daysUntil = getDaysUntilCharge(item);
    if (daysUntil === null) return 0;

    const totalDays = item.period === 'year' ? 365 : 30;
    return Math.max(0, Math.min(100, ((totalDays - daysUntil) / totalDays) * 100));
  };

  const formatDate = (dateString) => {
    if (!dateString) return t.notSpecified;
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const formatNextChargeDate = (item) => {
    const nextCharge = getNextChargeDate(item);
    if (!nextCharge) return t.notSpecified;

    const daysUntil = getDaysUntilCharge(item);

    if (daysUntil === 0) return t.today;
    if (daysUntil === 1) return t.tomorrow;
    if (daysUntil <= 7) return t.soon;

    return formatDate(nextCharge);
  };

  const getServiceTypeLabel = (serviceType) => {
    const types = {
      utility: t.utility,
      internet: t.internet,
      mobile: t.mobile,
      tv: t.tv,
      insurance: t.insurance,
      other: t.otherService
    };
    return types[serviceType] || serviceType;
  };

  const getCategoryLabel = (category) => {
  const categories = {
    // Английские ключи
    'subscription': t.subscription,
    'streaming': t.streaming,
    'music': t.music,
    'software': t.software,
    'gaming': t.gaming,
    'education': t.education,
    'fitness': t.fitness,
    'other': t.other,
    
    // Русские ключи (на всякий случай)
    'подписка': t.subscription,
    'стриминг': t.streaming,
    'музыка': t.music,
    'программы': t.software,
    'игры': t.gaming,
    'образование': t.education,
    'фитнес': t.fitness,
    'другое': t.other,
    
    // Разные варианты написания
    'game': t.gaming,
    'games': t.gaming,
    'игра': t.gaming,
    'гейминг': t.gaming
  };
  
  return categories[category?.toLowerCase()] || category || t.other;
};

  const handleDelete = (itemId, isService = false) => {
    const confirmMessage = isService ? t.deleteServiceConfirm : t.deleteConfirm;
    if (!confirm(confirmMessage)) return;

    try {
      if (isService) {
        deleteService(itemId);
      } else {
        deleteSubscription(itemId);
      }
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const handleEdit = (item, isService = false) => {
    setActiveDropdown(null);
    onEditSubscription(item);
  };

  const handleAdd = () => {
    if (viewType === 'services') {
      onAddSubscription({ type: 'service' });
    } else {
      onAddSubscription({});
    }
  };

  const totalMonthly = calculateTotalMonthly();
  const sortedItems = getSortedItems();
  const currentItems = viewType === 'services' ? services : subscriptions;
  const activeItems = currentItems.filter(item => item.active !== false);
  const isEmpty = currentItems.length === 0;

  return (
    <div className="sub-list">
      <div className="sub-list-header">
        <div className="header-main">
          <div className="header-title-section">
            <h1>{viewType === 'services' ? t.myServices : t.mySubscriptions}</h1>
            <div className="total-badge">
              <span className="total-label">{t.totalMonthly}</span>
              <span className="total-amount">
                {formatPrice(totalMonthly)}
              </span>
            </div>
          </div>

          <div className="view-switcher">
            <button
              className={`view-btn ${viewType === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setViewType('subscriptions')}
            >
              <span className="view-icon">📱</span>
              {t.viewSubscriptions}
            </button>
            <button
              className={`view-btn ${viewType === 'services' ? 'active' : ''}`}
              onClick={() => setViewType('services')}
            >
              <span className="view-icon">🏠</span>
              {t.viewServices}
            </button>
          </div>
        </div>

        <div className="header-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <div className="select-wrapper">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="currency-select"
              >
                <option value="RUB">{t.rubles}</option>
                <option value="USD">{t.dollars}</option>
                <option value="EUR">{t.euro}</option>
              </select>
            </div>

            <div className="select-wrapper">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">{t.filterAll}</option>
                <option value="active">{t.filterActive}</option>
                <option value="inactive">{t.filterInactive}</option>
              </select>
            </div>

            <div className="select-wrapper">
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
          </div>

          <button
            className="add-btn-primary"
            onClick={handleAdd}
          >
            <span className="btn-icon">+</span>
            {viewType === 'services' ? t.addService : t.addSubscription}
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div className="no-items">
          <div className="empty-state">
            <div className="empty-icon">
              {viewType === 'services' ? '🏠' : '📱'}
            </div>
            <h3>{viewType === 'services' ? t.noServices : t.noSubscriptions}</h3>
            <p>{viewType === 'services' ? t.addFirstService : t.addFirstSubscription}</p>
            <button
              className="btn-primary"
              onClick={handleAdd}
            >
              <span className="btn-plus">+</span>
              {viewType === 'services' ? t.addService : t.addSubscription}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="items-grid">
            {sortedItems.map((item) => {
              const daysUntil = getDaysUntilCharge(item);
              const progress = getProgressPercentage(item);

              return (
                <div key={item.id} className={`item-card ${item.active === false ? 'inactive' : ''}`}>
                  <div className="card-header">
                    <div className="item-info">
                      <h3 className="item-title">{item.title}</h3>
                      <div className="item-meta">
                        <span className="item-category">
                          {viewType === 'services' ? getServiceTypeLabel(item.service_type) : getCategoryLabel(item.category)}
                        </span>
                        {item.provider && (
                          <span className="item-provider">• {item.provider}</span>
                        )}
                        {item.isKnownService !== undefined && (
                          <span className={`service-status ${item.isKnownService ? 'known' : 'unknown'}`}>
                            {item.isKnownService ? '✅' : '❓'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="card-actions">
                      <div className={`status-badge ${item.active !== false ? 'active' : 'inactive'}`}>
                        {item.active !== false ? t.active : t.inactive}
                      </div>

                      <div className="dropdown-container">
                        <button
                          className="dropdown-toggle"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === item.id ? null : item.id);
                          }}
                        >
                          <span className="dots-icon">⋯</span>
                        </button>

                        {activeDropdown === item.id && (
                          <div className="dropdown-menu">
                            <button
                              className="dropdown-item"
                              onClick={() => handleEdit(item, viewType === 'services')}
                            >
                              <span className="dropdown-icon">✏️</span>
                              {t.edit}
                            </button>
                            <button
                              className="dropdown-item delete"
                              onClick={() => handleDelete(item.id, viewType === 'services')}
                            >
                              <span className="dropdown-icon">🗑️</span>
                              {t.delete}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="item-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">{t.cost}</span>
                        <span className="detail-value price">
                          {formatPrice(item.price)}
                          <span className="period-badge">
                            {item.period === 'year' ? t.yearly : t.monthly}
                          </span>
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{t.nextCharge}</span>
                        <span className="detail-value next-charge">
                          {formatNextChargeDate(item)}
                          {daysUntil !== null && daysUntil > 7 && (
                            <span className="days-badge">{daysUntil} {t.daysUntilCharge}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {viewType === 'services' && item.service_type && (
                      <div className="detail-row">
                        <div className="detail-item full-width">
                          <span className="detail-label">{t.serviceType}</span>
                          <span className="detail-value">
                            {getServiceTypeLabel(item.service_type)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {item.active !== false && daysUntil !== null && (
                    <div className="card-footer">
                      <div className="progress-section">
                        <div className="progress-info">
                          <span className="days-left">
                            {daysUntil === 0 ? t.today :
                              daysUntil === 1 ? t.tomorrow :
                                `${daysUntil} ${t.daysUntilCharge}`}
                          </span>
                          <span className="progress-percentage">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="items-summary">
            <div className="summary-card">
              <div className="summary-item">
                <span className="summary-label">{t.totalItems}</span>
                <span className="summary-value">{currentItems.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.activeItems}</span>
                <span className="summary-value active-count">
                  {activeItems.length}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.totalMonthly}</span>
                <span className="summary-value price-total">
                  {formatPrice(totalMonthly)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .sub-list {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }
        
        .sub-list-header {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 24px;
        }
        
        .header-title-section {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .header-main h1 {
          margin: 0;
          color: #1a365d;
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .total-badge {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          padding: 16px 24px;
          border-radius: 16px;
          color: white;
          text-align: center;
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .total-label {
          display: block;
          font-size: 13px;
          opacity: 0.9;
          margin-bottom: 6px;
          font-weight: 600;
        }
        
        .total-amount {
          display: block;
          font-size: 20px;
          font-weight: 800;
        }
        
        .view-switcher {
          display: flex;
          background: rgba(26, 54, 93, 0.05);
          border-radius: 16px;
          padding: 6px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          gap: 4px;
        }
        
        .view-btn {
          display: flex;
          align-items: center;
          gap: 8px;
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
        
        .view-btn.active {
          background: #1a365d;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.2);
        }
        
        .view-icon {
          font-size: 16px;
        }
        
        .header-controls {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .search-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }
        
        .search-input {
          width: 100%;
          padding: 16px 48px 16px 20px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          background: rgba(255,255,255,0.9);
          color: #2d3748;
          font-size: 15px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .search-input:focus {
          outline: none;
          border-color: #1a365d;
          box-shadow: 0 0 0 4px rgba(26, 54, 93, 0.1);
          background: white;
        }
        
        .search-input::placeholder {
          color: #a0aec0;
        }
        
        .search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          font-size: 18px;
        }
        
        .filter-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .select-wrapper {
          position: relative;
        }
        
        .select-wrapper::after {
          content: '▼';
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #4a5568;
          font-size: 10px;
          pointer-events: none;
        }
        
        .currency-select, .filter-select, .sort-select {
          padding: 16px 40px 16px 16px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255,255,255,0.9);
          color: #2d3748;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
          backdrop-filter: blur(10px);
          appearance: none;
        }
        
        .currency-select:focus, .filter-select:focus, .sort-select:focus {
          outline: none;
          border-color: #1a365d;
          box-shadow: 0 0 0 4px rgba(26, 54, 93, 0.1);
          background: white;
        }
        
        .add-btn-primary {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          border: none;
          color: white;
          padding: 16px 24px;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 15px;
          white-space: nowrap;
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.2);
        }
        
        .add-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(26, 54, 93, 0.3);
        }
        
        .no-items {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          color: #2d3748;
          max-width: 400px;
        }
        
        .empty-icon {
          font-size: 80px;
          margin-bottom: 24px;
          opacity: 0.8;
        }
        
        .empty-state h3 {
          margin: 0 0 16px 0;
          font-size: 28px;
          color: #1a365d;
          font-weight: 700;
        }
        
        .empty-state p {
          margin: 0 0 32px 0;
          color: #4a5568;
          font-size: 16px;
          line-height: 1.5;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
          border: none;
          padding: 18px 32px;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s ease;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.2);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(26, 54, 93, 0.3);
        }
        
        .btn-plus {
          font-size: 20px;
          font-weight: 300;
        }
        
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        
        .item-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
          color: #2d3748;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }
        
        .item-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .item-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          border-color: rgba(26, 54, 93, 0.3);
        }
        
        .item-card:hover::before {
          opacity: 1;
        }
        
        .item-card.inactive {
          opacity: 0.6;
          background: rgba(247, 250, 252, 0.9);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        
        .item-info {
          flex: 1;
        }
        
        .item-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #1a365d;
          line-height: 1.3;
        }
        
        .item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .item-category {
          font-size: 13px;
          background: rgba(26, 54, 93, 0.1);
          padding: 6px 12px;
          border-radius: 10px;
          display: inline-block;
          color: #1a365d;
          font-weight: 600;
        }
        
        .item-provider {
          font-size: 13px;
          color: #718096;
          font-weight: 500;
        }
        
        .service-status {
          font-size: 14px;
        }
        
        .service-status.known {
          color: #38a169;
        }
        
        .service-status.unknown {
          color: #dd6b20;
        }
        
        .card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-badge.active {
          background: rgba(72, 187, 120, 0.1);
          color: #38a169;
          border: 1px solid rgba(72, 187, 120, 0.2);
        }
        
        .status-badge.inactive {
          background: rgba(229, 62, 62, 0.1);
          color: #e53e3e;
          border: 1px solid rgba(229, 62, 62, 0.2);
        }
        
        .dropdown-container {
          position: relative;
        }
        
        .dropdown-toggle {
          background: rgba(26, 54, 93, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: #4a5568;
          transition: all 0.3s ease;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dropdown-toggle:hover {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          border-color: rgba(26, 54, 93, 0.3);
        }
        
        .dots-icon {
          font-size: 18px;
          font-weight: bold;
          line-height: 1;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 8px;
          min-width: 160px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          z-index: 100;
          margin-top: 8px;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #4a5568;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .dropdown-item:hover {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
        }
        
        .dropdown-item.delete:hover {
          background: rgba(229, 62, 62, 0.1);
          color: #e53e3e;
        }
        
        .dropdown-icon {
          font-size: 16px;
          width: 16px;
          text-align: center;
        }
        
        .item-details {
          margin-bottom: 24px;
        }
        
        .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .detail-item.full-width {
          grid-column: 1 / -1;
        }
        
        .detail-label {
          font-size: 12px;
          color: #718096;
          margin-bottom: 6px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .price {
          color: #1a365d;
          font-weight: 700;
          font-size: 16px;
        }
        
        .period-badge {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .next-charge {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .days-badge {
          background: rgba(26, 54, 93, 0.05);
          color: #4a5568;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .card-footer {
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          padding-top: 20px;
        }
        
        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .days-left {
          font-size: 13px;
          color: #1a365d;
          font-weight: 700;
        }
        
        .progress-percentage {
          font-size: 12px;
          color: #718096;
          font-weight: 600;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .items-summary {
          margin-top: 40px;
        }
        
        .summary-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          padding: 32px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .summary-item {
          text-align: center;
          padding: 0 16px;
        }
        
        .summary-label {
          display: block;
          font-size: 13px;
          color: #718096;
          margin-bottom: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .summary-value {
          display: block;
          font-size: 24px;
          font-weight: 800;
          color: #1a365d;
        }
        
        .active-count {
          color: #38a169;
        }
        
        .price-total {
          color: #1a365d;
          font-size: 22px;
        }
        
        @media (max-width: 1024px) {
          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .sub-list {
            padding: 16px;
          }
          
          .sub-list-header {
            padding: 24px;
          }
          
          .header-main {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          
          .header-title-section {
            justify-content: space-between;
          }
          
          .header-main h1 {
            font-size: 28px;
          }
          
          .header-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .search-box {
            min-width: 100%;
          }
          
          .filter-controls {
            justify-content: space-between;
            width: 100%;
          }
          
          .currency-select, .filter-select, .sort-select {
            min-width: 110px;
          }
          
          .items-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .summary-card {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 24px;
          }
          
          .summary-item {
            padding: 0;
          }
        }
        
        @media (max-width: 480px) {
          .view-switcher {
            width: 100%;
            justify-content: center;
          }
          
          .view-btn {
            flex: 1;
            justify-content: center;
          }
          
          .filter-controls {
            flex-direction: column;
          }
          
          .select-wrapper {
            width: 100%;
          }
          
          .currency-select, .filter-select, .sort-select {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}