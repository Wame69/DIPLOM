import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function AddModal({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    period: 'month',
    startDate: new Date().toISOString().split('T')[0],
    category: 'Streaming',
    reminder: '7',
    customReminder: ''
  });

  const { language } = useLanguage();

  const translations = {
    ru: {
      addSubscription: 'Добавить подписку',
      title: 'Название',
      enterTitle: 'Введите название подписки',
      price: 'Цена',
      examplePrice: 'например 299 ₽',
      period: 'Период',
      startDate: 'Дата начала',
      category: 'Категория',
      reminders: 'Напоминания',
      days: 'дн.',
      custom: 'свой',
      number: 'число',
      cancel: 'Отмена',
      save: 'Сохранить',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
      addError: 'Ошибка при добавлении подписки'
    },
    en: {
      addSubscription: 'Add Subscription',
      title: 'Title',
      enterTitle: 'Enter subscription title',
      price: 'Price',
      examplePrice: 'example: 299 ₽',
      period: 'Period',
      startDate: 'Start Date',
      category: 'Category',
      reminders: 'Reminders',
      days: 'days',
      custom: 'custom',
      number: 'number',
      cancel: 'Cancel',
      save: 'Save',
      monthly: 'Monthly',
      yearly: 'Yearly',
      addError: 'Error adding subscription'
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
    const token = localStorage.getItem('ev_token');
    
    try {
      let reminderDays = [];
      
      if (form.reminder === 'custom' && form.customReminder) {
        reminderDays = [parseInt(form.customReminder)];
      } else {
        reminderDays = [parseInt(form.reminder)];
      }
      
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          title: form.title,
          price: parseFloat(form.price) || 0,
          period: form.period,
          startDate: form.startDate,
          category: form.category,
          reminder: JSON.stringify(reminderDays),
          currency: 'RUB'
        })
      });

      if (!res.ok) throw new Error('Ошибка при добавлении');
      
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Ошибка:', error);
      alert(t.addError);
    }
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.addSubscription}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Название */}
          <div className="form-group">
            <label className="form-label">{t.title}</label>
            <input 
              type="text" 
              className="form-input"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t.enterTitle}
              required 
            />
          </div>
          
          {/* Цена */}
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
            />
          </div>
          
          {/* Период и Дата начала в одной строке */}
          <div className="form-row">
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
            
            <div className="form-group">
              <label className="form-label">{t.startDate}</label>
              <input 
                type="date" 
                className="form-input"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required 
              />
            </div>
          </div>
          
          {/* Категория */}
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
          
          {/* Напоминания */}
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
                    />
                    <span className="checkbox-label">{day} {t.days}</span>
                  </label>
                ))}
                
                {/* Свое число с кругом */}
                <label className="reminder-checkbox custom-reminder-option">
                  <input 
                    type="radio"
                    name="reminder"
                    checked={form.reminder === 'custom'}
                    onChange={() => handleReminderChange('custom')}
                    className="radio-input"
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
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Кнопки */}
          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-save">
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
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
          margin-bottom: 20px;
        }

        .modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 28px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #f5f5f5;
          color: #333;
        }

        .modal-form {
          padding: 0 24px 24px;
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
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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
          border: 2px solid #ddd;
          border-radius: 50%;
          appearance: none;
          margin: 0;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .radio-input:checked {
          background: #007bff;
          border-color: #007bff;
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

        .checkbox-label {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
        }

        .custom-input-container {
          flex: 1;
          min-width: 100px;
        }

        .custom-reminder-input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          text-align: center;
          transition: all 0.2s;
          background: white;
        }

        .custom-reminder-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }

        .btn-save {
          background: #007bff;
          color: white;
        }

        .btn-save:hover {
          background: #0056b3;
        }

        .btn-cancel {
          background: white;
          color: #666;
          border: 2px solid #e1e5e9;
        }

        .btn-cancel:hover {
          background: #f8f9fa;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }
          
          .modal-content {
            max-width: 100%;
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
            min-width: 120px;
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
          .modal-form {
            padding: 0 16px 16px;
          }
          
          .modal-header {
            padding: 20px 16px 0;
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
            min-width: 100px;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}