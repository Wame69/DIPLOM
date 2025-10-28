import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function SubList({ onAddSubscription }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSub, setEditingSub] = useState(null);
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
      updateError: 'Не удалось обновить подписку'
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
      updateError: 'Failed to update subscription'
    }
  };
  
  const t = translations[language];

  useEffect(() => {
    loadSubscriptions();
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
      
      loadSubscriptions();
    } catch (error) {
      console.error('Ошибка:', error);
      alert(t.deleteError);
    }
  };

  const handleEdit = (subscription) => {
    setEditingSub(subscription);
  };

  const handleSaveEdit = async (updatedSub) => {
    const token = localStorage.getItem('ev_token');
    try {
      const res = await fetch(`/api/subscriptions/${updatedSub.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(updatedSub)
      });

      if (!res.ok) throw new Error('Ошибка обновления');
      
      setEditingSub(null);
      loadSubscriptions();
    } catch (error) {
      console.error('Ошибка:', error);
      alert(t.updateError);
    }
  };

  const handleCancelEdit = () => {
    setEditingSub(null);
  };

  if (loading) {
    return <div className="loading">{t.loading}</div>;
  }

  return (
    <div className="sub-list">
      <div className="sub-list-header">
        <h2>{t.mySubscriptions}</h2>
        <button 
          className="add-btn-circle"
          onClick={onAddSubscription}
          title={t.addSubscription}
        >
          <span className="plus-icon">+</span>
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="no-subscriptions">
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h3>{t.noSubscriptions}</h3>
            <p>{t.addFirstSubscription}</p>
            <button 
              className="btn btn-primary"
              onClick={onAddSubscription}
            >
              + {t.addSubscription}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="subscriptions-grid">
            {subscriptions.map((sub) => (
              editingSub && editingSub.id === sub.id ? (
                <div key={sub.id} className="grid-item">
                  <EditSubscriptionForm
                    subscription={sub}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                  />
                </div>
              ) : (
                <div key={sub.id} className="grid-item">
                  <SubscriptionCard
                    subscription={sub}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    t={t}
                    language={language}
                  />
                </div>
              )
            ))}
          </div>

          <div className="add-bottom">
            <button 
              className="btn btn-primary btn-large"
              onClick={onAddSubscription}
            >
              + {t.addSubscription}
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .sub-list {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .sub-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e1e5e9;
        }
        
        .sub-list-header h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .add-btn-circle {
          width: 50px;
          height: 50px;
          border: none;
          border-radius: 50%;
          background: #007bff;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
          position: relative;
        }
        
        .add-btn-circle:hover {
          background: #0056b3;
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }
        
        .add-btn-circle:hover::after {
          content: '${t.addSubscription}';
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
        }
        
        .plus-icon {
          line-height: 1;
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
        }
        
        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .empty-state h3 {
          margin: 0 0 12px 0;
          font-size: 24px;
          color: #1a1a1a;
        }
        
        .empty-state p {
          margin: 0 0 24px 0;
          color: #666;
          font-size: 16px;
        }
        
        /* Новая сетка по три в ряд */
        .subscriptions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .grid-item {
          min-width: 0;
        }
        
        .subscription-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #007bff;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .subscription-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .subscription-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          word-break: break-word;
        }
        
        .subscription-category {
          font-size: 12px;
          color: #666;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 12px;
          display: inline-block;
          margin-top: 4px;
        }
        
        .subscription-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }
        
        .price {
          color: #007bff;
          font-weight: 600;
        }
        
        .subscription-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: auto;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-edit {
          background: #28a745;
          color: white;
        }
        
        .btn-edit:hover {
          background: #218838;
        }
        
        .btn-delete {
          background: #dc3545;
          color: white;
        }
        
        .btn-delete:hover {
          background: #c82333;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background: #0056b3;
        }
        
        .btn-outline {
          background: white;
          color: #666;
          border: 1px solid #e1e5e9;
        }
        
        .btn-outline:hover {
          background: #f8f9fa;
        }
        
        .add-bottom {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }
        
        .btn-large {
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
        }
        
        .loading {
          text-align: center;
          padding: 60px 20px;
          font-size: 18px;
          color: #666;
        }

        /* Стили для формы редактирования */
        .edit-form {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #28a745;
          height: 100%;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }
        
        .form-input, .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        /* Адаптивность для мобильных устройств */
        @media (max-width: 1024px) {
          .subscriptions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .subscriptions-grid {
            grid-template-columns: 1fr;
          }
          
          .sub-list {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}

// Компонент карточки подписки
function SubscriptionCard({ subscription, onEdit, onDelete, t, language }) {
  const categoryMapping = {
    ru: {
      'Streaming': 'Стриминг',
      'Software': 'Софт',
      'Music': 'Музыка',
      'Cloud': 'Облако',
      'Gaming': 'Игры',
      'Education': 'Образование',
      'Health': 'Здоровье',
      'Finance': 'Финансы',
      'Shopping': 'Шоппинг',
      'Food': 'Еда',
      'Transport': 'Транспорт',
      'Utilities': 'Коммунальные',
      'Entertainment': 'Развлечения',
      'News': 'Новости',
      'Productivity': 'Продуктивность',
      'Security': 'Безопасность',
      'Social': 'Социальные сети',
      'Other': 'Другое'
    },
    en: {
      'Streaming': 'Streaming',
      'Software': 'Software',
      'Music': 'Music',
      'Cloud': 'Cloud',
      'Gaming': 'Gaming',
      'Education': 'Education',
      'Health': 'Health',
      'Finance': 'Finance',
      'Shopping': 'Shopping',
      'Food': 'Food',
      'Transport': 'Transport',
      'Utilities': 'Utilities',
      'Entertainment': 'Entertainment',
      'News': 'News',
      'Productivity': 'Productivity',
      'Security': 'Security',
      'Social': 'Social',
      'Other': 'Other'
    }
  };

  // Функция для правильного склонения рублей
  const formatCurrency = (price, currency) => {
    if (language === 'ru' && currency === 'RUB') {
      const numPrice = parseFloat(price);
      const lastDigit = Math.floor(numPrice) % 10;
      const lastTwoDigits = Math.floor(numPrice) % 100;
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return `${numPrice} рублей`;
      } else if (lastDigit === 1) {
        return `${numPrice} рубль`;
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        return `${numPrice} рубля`;
      } else {
        return `${numPrice} рублей`;
      }
    }
    
    // Для английского языка или других валют оставляем как есть
    return `${price} ${currency}`;
  };

  const getCategory = (category) => {
    return categoryMapping[language][category] || category;
  };

  const getPeriod = (period) => {
    return period === 'month' ? t.monthly : t.yearly;
  };

  const getDate = (dateString) => {
    if (!dateString) return t.notSpecified;
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  return (
    <div className="subscription-card">
      <div className="subscription-header">
        <div>
          <h3 className="subscription-title">{subscription.title}</h3>
          <span className="subscription-category">
            {getCategory(subscription.category || 'Other')}
          </span>
        </div>
      </div>
      
      <div className="subscription-details">
        <div className="detail-item">
          <span className="detail-label">{t.cost}</span>
          <span className="detail-value price">
            {formatCurrency(subscription.price, subscription.currency)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t.period}</span>
          <span className="detail-value">
            {getPeriod(subscription.period)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t.nextCharge}</span>
          <span className="detail-value">
            {getDate(subscription.next_charge)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t.startDate}</span>
          <span className="detail-value">
            {getDate(subscription.start_date)}
          </span>
        </div>
      </div>
      
      <div className="subscription-actions">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(subscription)}
        >
          {t.edit}
        </button>
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(subscription.id)}
        >
          {t.delete}
        </button>
      </div>
    </div>
  );
}

// Компонент формы редактирования
function EditSubscriptionForm({ subscription, onSave, onCancel }) {
  const { language } = useLanguage();
  
  const translations = {
    ru: {
      title: 'Название',
      price: 'Цена',
      period: 'Период',
      category: 'Категория',
      startDate: 'Дата начала подписки',
      cancel: 'Отмена',
      save: 'Сохранить',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно'
    },
    en: {
      title: 'Title',
      price: 'Price',
      period: 'Period',
      category: 'Category',
      startDate: 'Subscription Start Date',
      cancel: 'Cancel',
      save: 'Save',
      monthly: 'Monthly',
      yearly: 'Yearly'
    }
  };
  
  const t = translations[language];

  const categoryOptions = {
    ru: [
      { value: 'Streaming', label: 'Стриминг' },
      { value: 'Software', label: 'Софт' },
      { value: 'Music', label: 'Музыка' },
      { value: 'Cloud', label: 'Облако' },
      { value: 'Gaming', label: 'Игры' },
      { value: 'Education', label: 'Образование' },
      { value: 'Health', label: 'Здоровье' },
      { value: 'Finance', label: 'Финансы' },
      { value: 'Shopping', label: 'Шоппинг' },
      { value: 'Food', label: 'Еда' },
      { value: 'Transport', label: 'Транспорт' },
      { value: 'Utilities', label: 'Коммунальные' },
      { value: 'Entertainment', label: 'Развлечения' },
      { value: 'News', label: 'Новости' },
      { value: 'Productivity', label: 'Продуктивность' },
      { value: 'Security', label: 'Безопасность' },
      { value: 'Social', label: 'Социальные сети' },
      { value: 'Other', label: 'Другое' }
    ],
    en: [
      { value: 'Streaming', label: 'Streaming' },
      { value: 'Software', label: 'Software' },
      { value: 'Music', label: 'Music' },
      { value: 'Cloud', label: 'Cloud' },
      { value: 'Gaming', label: 'Gaming' },
      { value: 'Education', label: 'Education' },
      { value: 'Health', label: 'Health' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Shopping', label: 'Shopping' },
      { value: 'Food', label: 'Food' },
      { value: 'Transport', label: 'Transport' },
      { value: 'Utilities', label: 'Utilities' },
      { value: 'Entertainment', label: 'Entertainment' },
      { value: 'News', label: 'News' },
      { value: 'Productivity', label: 'Productivity' },
      { value: 'Security', label: 'Security' },
      { value: 'Social', label: 'Social' },
      { value: 'Other', label: 'Other' }
    ]
  };

  const [form, setForm] = useState({
    title: subscription.title,
    price: subscription.price,
    period: subscription.period,
    category: subscription.category || 'Other',
    start_date: subscription.start_date ? subscription.start_date.split('T')[0] : '',
    active: subscription.active
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...subscription,
      ...form,
      price: parseFloat(form.price) || 0
    });
  };

  return (
    <div className="edit-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t.title}</label>
          <input 
            type="text"
            className="form-input"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.price}</label>
            <input 
              type="number"
              step="0.01"
              className="form-input"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{t.period}</label>
            <select 
              className="form-select"
              value={form.period}
              onChange={(e) => handleChange('period', e.target.value)}
            >
              <option value="month">{t.monthly}</option>
              <option value="year">{t.yearly}</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.category}</label>
            <select 
              className="form-select"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categoryOptions[language].map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">{t.startDate}</label>
            <input 
              type="date"
              className="form-input"
              value={form.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            {t.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}