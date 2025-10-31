
// components/AppSettings.jsx
import React, { useState } from 'react';

export default function AppSettings({ onClose }) {
  const [settings, setSettings] = useState({
    theme: 'auto',
    language: 'ru',
    notifications: true,
    emailReports: true,
    autoBackup: false,
    currency: 'RUB'
  });

  const handleSave = () => {
    // Сохранение настроек
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Настройки приложения</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3>Внешний вид</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label>Тема</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                >
                  <option value="auto">Авто</option>
                  <option value="light">Светлая</option>
                  <option value="dark">Темная</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Язык</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Уведомления</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Push-уведомления</label>
                  <p>Получать уведомления в браузере</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications}
                    onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Email отчеты</label>
                  <p>Еженедельные отчеты на почту</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.emailReports}
                    onChange={(e) => setSettings({...settings, emailReports: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Данные</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label>Валюта</label>
                <select 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="RUB">Рубль (₽)</option>
                  <option value="USD">Доллар ($)</option>
                  <option value="EUR">Евро (€)</option>
                </select>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Авто-бэкап</label>
                  <p>Автоматическое сохранение данных в облако</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Отмена</button>
          <button className="btn-primary" onClick={handleSave}>Сохранить настройки</button>
        </div>
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
        }
        
        .modal-content.large {
          width: 600px;
          max-width: 90vw;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 0;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
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
        
        .settings-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        
        .settings-section {
          margin-bottom: 32px;
        }
        
        .settings-section h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 18px;
        }
        
        .settings-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .setting-item {
          display: flex;
          justify-content: between;
          align-items: center;
          padding: 16px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
        }
        
        .setting-item.toggle {
          justify-content: space-between;
        }
        
        .setting-item:not(.toggle) {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }
        
        .setting-item label {
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }
        
        .setting-info label {
          display: block;
          margin-bottom: 4px;
        }
        
        .setting-info p {
          margin: 0;
          color: #666;
          font-size: 12px;
        }
        
        .setting-item select {
          padding: 12px 16px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }
        
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .slider {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .modal-actions {
          padding: 20px 24px;
          border-top: 1px solid rgba(0,0,0,0.1);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
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
      `}</style>
    </div>
  );
}