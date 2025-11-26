import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useData } from '../contexts/DataContext.jsx';

export default function AddModal({ onClose, initialData = null }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    period: 'month',
    startDate: new Date().toISOString().split('T')[0],
    category: 'Streaming',
    service_type: 'other',
    provider: '',
    currency: 'RUB',
    reminder: '7',
    customReminder: '',
    type: 'subscription'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();
  const { addSubscription, addService } = useData();

  // Initialize form
  useEffect(() => {
    if (initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData,
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        type: initialData.type || 'subscription'
      }));
    }
  }, [initialData]);

  const translations = {
    en: {
      addSubscription: 'Add Subscription',
      addService: 'Add Service',
      title: 'Title',
      enterTitle: 'Enter title',
      price: 'Price',
      examplePrice: 'example: 299',
      period: 'Period',
      startDate: 'Start Date',
      category: 'Category',
      serviceType: 'Service type',
      provider: 'Provider',
      currency: 'Currency',
      reminders: 'Reminders',
      days: 'days',
      custom: 'custom',
      number: 'number',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      monthly: 'Monthly',
      yearly: 'Yearly',
      rubles: 'Rubles',
      dollars: 'Dollars',
      euro: 'Euro',
      subscription: 'Subscription',
      utility: 'Utility',
      internet: 'Internet',
      mobile: 'Mobile',
      tv: 'TV',
      insurance: 'Insurance',
      otherService: 'Other service',
      type: 'Type',
      selectType: 'Select type',
      requiredField: 'Required field'
    },
    ru: {
      addSubscription: 'Добавить подписку',
      addService: 'Добавить услугу',
      title: 'Название',
      enterTitle: 'Введите название',
      price: 'Цена',
      examplePrice: 'например 299',
      period: 'Период',
      startDate: 'Дата начала',
      category: 'Категория',
      serviceType: 'Тип услуги',
      provider: 'Провайдер',
      currency: 'Валюта',
      reminders: 'Напоминания',
      days: 'дн.',
      custom: 'свой',
      number: 'число',
      cancel: 'Отмена',
      save: 'Сохранить',
      saving: 'Сохранение...',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
      rubles: 'Рубли',
      dollars: 'Доллары',
      euro: 'Евро',
      subscription: 'Подписка',
      utility: 'Коммунальные',
      internet: 'Интернет',
      mobile: 'Мобильная связь',
      tv: 'Телевидение',
      insurance: 'Страхование',
      otherService: 'Другая услуга',
      type: 'Тип',
      selectType: 'Выберите тип',
      requiredField: 'Обязательное поле'
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

  const serviceTypeOptions = {
    en: [
      { value: 'utility', label: 'Utility' },
      { value: 'internet', label: 'Internet' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'tv', label: 'TV' },
      { value: 'insurance', label: 'Insurance' },
      { value: 'other', label: 'Other service' }
    ],
    ru: [
      { value: 'utility', label: 'Коммунальная услуга' },
      { value: 'internet', label: 'Интернет' },
      { value: 'mobile', label: 'Мобильная связь' },
      { value: 'tv', label: 'Телевидение' },
      { value: 'insurance', label: 'Страхование' },
      { value: 'other', label: 'Другая услуга' }
    ]
  };

  const currencyOptions = [
    { value: 'RUB', label: t.rubles, symbol: '₽' },
    { value: 'USD', label: t.dollars, symbol: '$' },
    { value: 'EUR', label: t.euro, symbol: '€' }
  ];

  const typeOptions = [
    { value: 'subscription', label: t.subscription },
    { value: 'service', label: t.utility }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.title.trim()) {
      alert(`${t.title} - ${t.requiredField}`);
      return;
    }
    
    if (!form.price || parseFloat(form.price) <= 0) {
      alert(`${t.price} - ${t.requiredField}`);
      return;
    }
    
    setIsSubmitting(true);

    try {
      let reminderDays = [];
      
      if (form.reminder === 'custom' && form.customReminder) {
        reminderDays = [parseInt(form.customReminder)];
      } else {
        reminderDays = [parseInt(form.reminder)];
      }
      
      const itemData = {
        title: form.title,
        price: parseFloat(form.price) || 0,
        period: form.period,
        start_date: form.startDate,
        currency: form.currency,
        reminder: reminderDays,
      };

      if (form.type === 'service') {
        itemData.service_type = form.service_type;
        itemData.provider = form.provider;
        addService(itemData);
      } else {
        itemData.category = form.category;
        addSubscription(itemData);
      }

      // Show success notification
      showSuccessNotification();
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span class="notification-text">
          ${form.type === 'service' ? t.addService : t.addSubscription} successfully added!
        </span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleReminderChange = (day) => {
    setForm(prev => ({ 
      ...prev, 
      reminder: day
    }));
  };

  const isService = form.type === 'service';
  const modalTitle = isService ? t.addService : t.addSubscription;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <span className="modal-icon">{isService ? '🏠' : '📱'}</span>
            <h2 className="modal-title">{modalTitle}</h2>
          </div>
          <button className="close-button" onClick={onClose} disabled={isSubmitting}>
            <span className="close-icon">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type */}
          <div className="form-group">
            <label className="form-label">{t.type}</label>
            <select 
              className="form-select"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              disabled={isSubmitting}
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Title */}
          <div className="form-group">
            <label className="form-label">{t.title}</label>
            <input 
              type="text" 
              className="form-input"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t.enterTitle}
              required 
              disabled={isSubmitting}
            />
          </div>
          
          {/* Price and Currency */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t.price}</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder={t.examplePrice}
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
                    {option.label} ({option.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Period and Start Date */}
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
          
          {/* Category or Service Type */}
          <div className="form-group">
            <label className="form-label">
              {isService ? t.serviceType : t.category}
            </label>
            <select 
              className="form-select"
              value={isService ? form.service_type : form.category}
              onChange={(e) => handleChange(isService ? 'service_type' : 'category', e.target.value)}
              disabled={isSubmitting}
            >
              {(isService ? serviceTypeOptions[language] : categoryOptions[language]).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Provider (only for services) */}
          {isService && (
            <div className="form-group">
              <label className="form-label">{t.provider}</label>
              <input 
                type="text" 
                className="form-input"
                value={form.provider}
                onChange={(e) => handleChange('provider', e.target.value)}
                placeholder="Enter provider name"
                disabled={isSubmitting}
              />
            </div>
          )}
          
          {/* Reminders */}
          <div className="form-group">
            <label className="form-label">{t.reminders}</label>
            <div className="reminder-section">
              <div className="reminder-checkboxes">
                {[7, 3, 1].map(day => (
                  <label key={day} className="reminder-checkbox">
                    <input 
                      type="radio"
                      name="reminder"
                      checked={form.reminder === day.toString()}
                      onChange={() => handleReminderChange(day.toString())}
                      className="radio-input"
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-label">{day} {t.days}</span>
                  </label>
                ))}
                
                <label className="reminder-checkbox custom-reminder-option">
                  <input 
                    type="radio"
                    name="reminder"
                    checked={form.reminder === 'custom'}
                    onChange={() => handleReminderChange('custom')}
                    className="radio-input"
                    disabled={isSubmitting}
                  />
                  <span className="checkbox-label">{t.custom}</span>
                  <div className="custom-input-container">
                    <input 
                      type="number"
                      className="custom-reminder-input"
                      value={form.customReminder}
                      onChange={(e) => {
                        handleChange('customReminder', e.target.value);
                        if (e.target.value) {
                          handleReminderChange('custom');
                        }
                      }}
                      placeholder={t.number}
                      min="1"
                      max="30"
                      disabled={isSubmitting}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Buttons */}
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
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  {t.saving}
                </>
              ) : (
                t.save
              )}
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
          background: rgba(26, 54, 93, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(26, 54, 93, 0.3);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 28px 0;
          margin-bottom: 24px;
        }

        .modal-title-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          font-size: 24px;
        }

        .modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1a365d;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          cursor: pointer;
          padding: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-button:not(:disabled):hover {
          background: #1a365d;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.15);
        }

        .close-button:not(:disabled):hover .close-icon {
          color: white;
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .close-icon {
          font-size: 20px;
          color: #4a5568;
          font-weight: 300;
          transition: all 0.3s ease;
        }

        .modal-form {
          padding: 0 28px 28px;
          max-height: calc(90vh - 80px);
          overflow-y: auto;
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
          font-weight: 600;
          color: #1a365d;
          font-size: 14px;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          color: #2d3748;
          font-family: inherit;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #1a365d;
          box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
          background: white;
        }

        .form-input:disabled, .form-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input::placeholder {
          color: #a0aec0;
        }

        .reminder-section {
          display: flex;
          align-items: center;
        }

        .reminder-checkboxes {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: nowrap;
          width: 100%;
        }

        .reminder-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px 0;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .reminder-checkbox:hover .checkbox-label {
          color: #1a365d;
        }

        .custom-reminder-option {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .radio-input {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 50%;
          appearance: none;
          margin: 0;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.9);
        }

        .radio-input:checked {
          background: #1a365d;
          border-color: #1a365d;
        }

        .radio-input:checked::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .radio-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkbox-label {
          font-size: 14px;
          color: #4a5568;
          white-space: nowrap;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .custom-input-container {
          flex: 1;
          min-width: 80px;
        }

        .custom-reminder-input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          font-size: 14px;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          color: #2d3748;
          font-family: inherit;
        }

        .custom-reminder-input:focus {
          outline: none;
          border-color: #1a365d;
          box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1);
          background: white;
        }

        .custom-reminder-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .custom-reminder-input::placeholder {
          color: #a0aec0;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
        }

        .btn {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-save {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.2);
        }

        .btn-save:not(:disabled):hover {
          background: linear-gradient(135deg, #2d3748, #1a365d);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.3);
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.9);
          color: #4a5568;
          border: 2px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .btn-cancel:not(:disabled):hover {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          border-color: #1a365d;
          transform: translateY(-2px);
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 16px;
          }
          
          .modal-content {
            max-width: 100%;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 24px 24px 0;
          }
          
          .modal-form {
            padding: 0 24px 24px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .reminder-checkboxes {
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .custom-reminder-option {
            flex: 0 0 100%;
            justify-content: flex-start;
          }
          
          .custom-input-container {
            min-width: 100px;
            margin-left: auto;
          }
          
          .modal-actions {
            flex-direction: column-reverse;
          }
          
          .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .modal-header {
            padding: 20px 20px 0;
          }
          
          .modal-form {
            padding: 0 20px 20px;
          }
          
          .reminder-checkboxes {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .custom-reminder-option {
            width: 100%;
            justify-content: space-between;
          }
          
          .custom-input-container {
            min-width: 80px;
            margin-left: 0;
          }
        }
      `}</style>

      <style jsx global>{`
        .success-notification {
          position: fixed;
          top: 100px;
          right: 32px;
          background: #38a169;
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(56, 161, 105, 0.3);
          z-index: 10000;
          animation: slideInRight 0.3s ease;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .notification-icon {
          font-size: 18px;
        }
        
        .notification-text {
          font-weight: 500;
        }
        
        .success-notification.fade-out {
          animation: slideOutRight 0.3s ease forwards;
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}