// components/AppSettings.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function AppSettings({ onClose, onSave }) {
  const [settings, setSettings] = useState({
    theme: 'auto',
    language: 'ru',
    notifications: true,
    emailReports: true,
    autoBackup: false,
    currency: 'RUB',
    voiceCommands: true,
    aiAssistant: true
  });

  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const translations = {
    ru: {
      appSettings: 'Настройки приложения',
      appearance: 'Внешний вид',
      theme: 'Тема',
      language: 'Язык',
      currency: 'Валюта',
      notifications: 'Уведомления',
      pushNotifications: 'Push-уведомления',
      pushDesc: 'Получать уведомления в браузере',
      emailReports: 'Email отчеты',
      emailDesc: 'Еженедельные отчеты на почту',
      features: 'Функции',
      voiceCommands: 'Голосовые команды',
      voiceDesc: 'Управление приложением с помощью голоса',
      aiAssistant: 'AI Помощник',
      aiDesc: 'Умные рекомендации и аналитика',
      data: 'Данные',
      autoBackup: 'Авто-бэкап',
      backupDesc: 'Автоматическое сохранение данных в облако',
      exportData: 'Эспорт данных',
      resetSettings: 'Сбросить настройки',
      cancel: 'Отмена',
      saveSettings: 'Сохранить настройки',
      themeOptions: {
        auto: 'Авто',
        light: 'Светлая',
        dark: 'Темная'
      },
      currencyOptions: {
        RUB: 'Рубль (₽)',
        USD: 'Доллар ($)',
        EUR: 'Евро (€)'
      }
    },
    en: {
      appSettings: 'App Settings',
      appearance: 'Appearance',
      theme: 'Theme',
      language: 'Language',
      currency: 'Currency',
      notifications: 'Notifications',
      pushNotifications: 'Push notifications',
      pushDesc: 'Receive notifications in browser',
      emailReports: 'Email reports',
      emailDesc: 'Weekly reports by email',
      features: 'Features',
      voiceCommands: 'Voice commands',
      voiceDesc: 'Control app with voice',
      aiAssistant: 'AI Assistant',
      aiDesc: 'Smart recommendations and analytics',
      data: 'Data',
      autoBackup: 'Auto-backup',
      backupDesc: 'Automatic cloud backup',
      exportData: 'Export data',
      resetSettings: 'Reset settings',
      cancel: 'Cancel',
      saveSettings: 'Save settings',
      themeOptions: {
        auto: 'Auto',
        light: 'Light',
        dark: 'Dark'
      },
      currencyOptions: {
        RUB: 'Ruble (₽)',
        USD: 'Dollar ($)',
        EUR: 'Euro (€)'
      }
    }
  };

  const t = translations[language];

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleReset = () => {
    if (confirm(language === 'ru' ? 'Вы уверены, что хотите сбросить все настройки?' : 'Are you sure you want to reset all settings?')) {
      setSettings({
        theme: 'auto',
        language: 'ru',
        notifications: true,
        emailReports: true,
        autoBackup: false,
        currency: 'RUB',
        voiceCommands: true,
        aiAssistant: true
      });
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evans-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    alert(language === 'ru' ? 'Настройки экспортированы!' : 'Settings exported!');
  };

  const handleLanguageChange = () => {
    toggleLanguage();
    setSettings(prev => ({
      ...prev,
      language: language === 'ru' ? 'en' : 'ru'
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.appSettings}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3>{t.appearance}</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label>{t.theme}</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                >
                  <option value="auto">{t.themeOptions.auto}</option>
                  <option value="light">{t.themeOptions.light}</option>
                  <option value="dark">{t.themeOptions.dark}</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>{t.language}</label>
                <select 
                  value={settings.language}
                  onChange={handleLanguageChange}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="setting-item">
                <label>{t.currency}</label>
                <select 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="RUB">{t.currencyOptions.RUB}</option>
                  <option value="USD">{t.currencyOptions.USD}</option>
                  <option value="EUR">{t.currencyOptions.EUR}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>{t.notifications}</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>{t.pushNotifications}</label>
                  <p>{t.pushDesc}</p>
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
                  <label>{t.emailReports}</label>
                  <p>{t.emailDesc}</p>
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
            <h3>{t.features}</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>{t.voiceCommands}</label>
                  <p>{t.voiceDesc}</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.voiceCommands}
                    onChange={(e) => setSettings({...settings, voiceCommands: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>{t.aiAssistant}</label>
                  <p>{t.aiDesc}</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.aiAssistant}
                    onChange={(e) => setSettings({...settings, aiAssistant: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>{t.data}</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>{t.autoBackup}</label>
                  <p>{t.backupDesc}</p>
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

              <div className="setting-item actions">
                <button className="btn-outline" onClick={handleExport}>
                  {t.exportData}
                </button>
                <button className="btn-outline danger" onClick={handleReset}>
                  {t.resetSettings}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            {t.cancel}
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {t.saveSettings}
          </button>
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
          max-height: 80vh;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 0;
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
          color: #1a365d;
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
          color: #1a365d;
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
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: #f7fafc;
        }
        
        .setting-item.toggle {
          justify-content: space-between;
        }
        
        .setting-item:not(.toggle) {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }

        .setting-item.actions {
          flex-direction: row;
          justify-content: space-between;
          gap: 12px;
        }
        
        .setting-item label {
          font-weight: 600;
          color: #1a365d;
          font-size: 14px;
        }
        
        .setting-info label {
          display: block;
          margin-bottom: 4px;
        }
        
        .setting-info p {
          margin: 0;
          color: #4a5568;
          font-size: 12px;
        }
        
        .setting-item select {
          padding: 12px 16px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          color: #2d3748;
        }
        
        .setting-item select:focus {
          outline: none;
          border-color: #1a365d;
        }
        
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
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
          border-radius: 34px;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .slider {
          background-color: #1a365d;
        }
        
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        
        .btn-outline {
          padding: 12px 20px;
          border: 2px solid #1a365d;
          background: transparent;
          color: #1a365d;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          flex: 1;
          font-size: 14px;
        }
        
        .btn-outline.danger {
          border-color: #e53e3e;
          color: #e53e3e;
        }
        
        .btn-outline:hover {
          background: #1a365d;
          color: white;
          transform: translateY(-1px);
        }
        
        .btn-outline.danger:hover {
          background: #e53e3e;
          color: white;
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
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.3);
        }
        
        .btn-secondary {
          background: rgba(0,0,0,0.05);
          color: #333;
        }
        
        .btn-secondary:hover {
          background: rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .modal-content.large {
            width: 95vw;
          }
          
          .settings-content {
            padding: 16px;
          }
          
          .setting-item.actions {
            flex-direction: column;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;  
          }
        }
      `}</style>
    </div>
  );
}