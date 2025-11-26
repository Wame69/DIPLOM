import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useData } from '../contexts/DataContext.jsx';

export default function EditSubscriptionModal({ subscription, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    period: 'month',
    startDate: '',
    category: 'Streaming',
    currency: 'RUB',
    active: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();
  const { updateSubscription } = useData();

  // Initialize form with subscription data
  useEffect(() => {
    if (subscription) {
      setForm({
        title: subscription.title || '',
        price: subscription.price || '',
        period: subscription.period || 'month',
        startDate: subscription.start_date || subscription.startDate || new Date().toISOString().split('T')[0],
        category: subscription.category || 'Streaming',
        currency: subscription.currency || 'RUB',
        active: subscription.active !== false
      });
    }
  }, [subscription]);

  const translations = {
    en: {
      editSubscription: 'Edit Subscription',
      title: 'Title',
      price: 'Price',
      period: 'Period',
      startDate: 'Start Date',
      category: 'Category',
      currency: 'Currency',
      active: 'Active',
      cancel: 'Cancel',
      save: 'Save Changes',
      saving: 'Saving...',
      monthly: 'Monthly',
      yearly: 'Yearly'
    },
    ru: {
      editSubscription: 'Редактировать подписку',
      title: 'Название',
      price: 'Цена',
      period: 'Период',
      startDate: 'Дата начала',
      category: 'Категория',
      currency: 'Валюта',
      active: 'Активна',
      cancel: 'Отмена',
      save: 'Сохранить изменения',
      saving: 'Сохранение...',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно'
    }
  };

  const t = translations[language];

  const categoryOptions = {
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
    ],
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
    ]
  };

  const currencyOptions = [
    { value: 'RUB', label: '₽ Rubles' },
    { value: 'USD', label: '$ Dollars' },
    { value: 'EUR', label: '€ Euro' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.price) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await updateSubscription(subscription.id, {
        title: form.title,
        price: parseFloat(form.price),
        period: form.period,
        start_date: form.startDate,
        category: form.category,
        currency: form.currency,
        active: form.active
      });

      onSave && onSave();
      onClose();
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Error updating subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (!subscription) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.editSubscription}</h2>
          <button className="close-button" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">{t.title}</label>
            <input 
              type="text" 
              className="form-input"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required 
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">{t.currency}</label>
              <select 
                className="form-select"
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                disabled={isSubmitting}
              >
                {currencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t.period}</label>
              <select 
                className="form-select"
                value={form.period}
                onChange={(e) => handleChange('period', e.target.value)}
                disabled={isSubmitting}
              >
                <option value="month">{t.monthly}</option>
                <option value="year">{t.yearly}</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">{t.startDate}</label>
              <input 
                type="date" 
                className="form-input"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required 
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">{t.category}</label>
            <select 
              className="form-select"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              disabled={isSubmitting}
            >
              {categoryOptions[language].map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={form.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="checkbox-custom"></span>
              {t.active}
            </label>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>
            <button 
              type="submit" 
              className="btn btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #718096;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-button:hover:not(:disabled) {
          background: #f7fafc;
          color: #4a5568;
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #4a5568;
          font-size: 14px;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s ease;
          background: white;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .form-input:disabled, .form-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f7fafc;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-weight: 500;
          color: #4a5568;
        }

        .checkbox-label input {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-radius: 4px;
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-label input:checked + .checkbox-custom {
          background: #4299e1;
          border-color: #4299e1;
        }

        .checkbox-label input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .checkbox-label input:disabled + .checkbox-custom {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-save {
          background: #4299e1;
          color: white;
        }

        .btn-save:not(:disabled):hover {
          background: #3182ce;
        }

        .btn-cancel {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
        }

        .btn-cancel:not(:disabled):hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        @media (max-width: 768px) {
          .modal-content {
            max-width: 100%;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .modal-actions {
            flex-direction: column-reverse;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}