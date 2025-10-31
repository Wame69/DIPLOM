// components/EditSubscriptionModal.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function EditSubscriptionModal({ subscription, onClose, onSave }) {
  const [form, setForm] = useState({
    title: subscription.title || '',
    price: subscription.price || '',
    period: subscription.period || 'month',
    category: subscription.category || 'Other',
    start_date: subscription.start_date ? subscription.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
    active: subscription.active !== false
  });
  
  const { language } = useLanguage();

  const translations = {
    ru: {
      editSubscription: 'Редактировать подписку',
      title: 'Название',
      price: 'Цена',
      period: 'Период',
      category: 'Категория',
      startDate: 'Дата начала',
      status: 'Статус',
      active: 'Активна',
      inactive: 'Неактивна',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
      cancel: 'Отмена',
      save: 'Сохранить',
      requiredField: 'Это поле обязательно'
    },
    en: {
      editSubscription: 'Edit Subscription',
      title: 'Title',
      price: 'Price',
      period: 'Period',
      category: 'Category',
      startDate: 'Start Date',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      monthly: 'Monthly',
      yearly: 'Yearly',
      cancel: 'Cancel',
      save: 'Save',
      requiredField: 'This field is required'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.price) {
      alert(t.requiredField);
      return;
    }

    try {
      await onSave({
        ...subscription,
        ...form,
        price: parseFloat(form.price),
        active: form.active
      });
      onClose();
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.editSubscription}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">{t.title} *</label>
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
              <label className="form-label">{t.price} *</label>
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
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.status}</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio"
                  name="active"
                  checked={form.active}
                  onChange={() => handleChange('active', true)}
                />
                <span className="radio-custom"></span>
                {t.active}
              </label>
              <label className="radio-label">
                <input 
                  type="radio"
                  name="active"
                  checked={!form.active}
                  onChange={() => handleChange('active', false)}
                />
                <span className="radio-custom"></span>
                {t.inactive}
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {t.save}
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
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 0;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        
        .close-btn:hover {
          background: rgba(0,0,0,0.05);
        }
        
        .modal-form {
          padding: 24px;
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
          color: #333;
          font-size: 14px;
        }
        
        .form-input, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .radio-group {
          display: flex;
          gap: 20px;
        }
        
        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .radio-label input {
          display: none;
        }
        
        .radio-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #ddd;
          border-radius: 50%;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .radio-label input:checked + .radio-custom {
          border-color: #667eea;
          background: #667eea;
        }
        
        .radio-label input:checked + .radio-custom::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }
        
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
          background: rgba(0,0,0,0.05);
          color: #333;
        }
        
        .btn-secondary:hover {
          background: rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .radio-group {
            flex-direction: column;
            gap: 12px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}