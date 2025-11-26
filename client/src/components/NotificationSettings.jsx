// components/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function NotificationSettings({ onClose }) {
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { language } = useLanguage();

  const API_BASE_URL = 'http://localhost:4000';

  const translations = {
    ru: {
      title: 'Настройки уведомлений',
      telegram: 'Telegram уведомления',
      connected: 'Подключено',
      disconnected: 'Отключено',
      connect: 'Подключить',
      disconnect: 'Отключить',
      chatIdPlaceholder: 'Введите ваш Chat ID',
      instructions: 'Как получить Chat ID:',
      instruction1: 'Найдите @evans_notifications_bot в Telegram',
      instruction2: 'Отправьте команду /start',
      instruction3: 'Скопируйте ваш ID из ответа бота',
      instruction4: 'Введите его ниже',
      success: 'Уведомления успешно подключены!',
      error: 'Ошибка подключения',
      close: 'Закрыть',
      testNotification: 'Тестовое уведомление'
    },
    en: {
      title: 'Notification Settings',
      telegram: 'Telegram Notifications',
      connected: 'Connected',
      disconnected: 'Disconnected',
      connect: 'Connect',
      disconnect: 'Disconnect',
      chatIdPlaceholder: 'Enter your Chat ID',
      instructions: 'How to get Chat ID:',
      instruction1: 'Find @evans_notifications_bot in Telegram',
      instruction2: 'Send /start command',
      instruction3: 'Copy your ID from bot response',
      instruction4: 'Enter it below',
      success: 'Notifications connected successfully!',
      error: 'Connection error',
      close: 'Close',
      testNotification: 'Test Notification'
    }
  };

  const t = translations[language];

  // Загрузка текущих настроек
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('ev_token');
      if (!token) {
        setMessage('❌ Необходимо войти в систему');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.telegramConnected);
        setTelegramChatId(data.telegramChatId || '');
      } else if (response.status === 401) {
        setMessage('❌ Сессия истекла. Войдите заново.');
        localStorage.removeItem('ev_token');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage('❌ Ошибка загрузки настроек');
    }
  };

  const handleConnect = async () => {
    if (!telegramChatId.trim()) {
      setMessage('Пожалуйста, введите Chat ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ev_token');
      if (!token) {
        setMessage('❌ Необходимо войти в систему');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/notifications/telegram/connect`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatId: telegramChatId.trim() })
      });

      const result = await response.json();

      if (response.ok) {
        setIsConnected(true);
        setMessage('✅ ' + t.success);
      } else {
        setMessage(`❌ ${result.error || t.error}`);
      }
    } catch (error) {
      setMessage(`❌ ${t.error}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch(`${API_BASE_URL}/api/notifications/telegram/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsConnected(false);
        setTelegramChatId('');
        setMessage('✅ Telegram отключен');
      } else {
        setMessage('❌ Ошибка отключения');
      }
    } catch (error) {
      setMessage('❌ Ошибка отключения');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch(`${API_BASE_URL}/api/test-notification`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('✅ Тестовое уведомление отправлено!');
      } else {
        setMessage(`❌ Ошибка: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <div className="setting-section">
            <h3>🔔 {t.telegram}</h3>
            
            <div className="status-indicator">
              <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? t.connected : t.disconnected}
              </span>
            </div>

            {!isConnected ? (
              <div className="connection-form">
                <div className="instructions">
                  <h4>{t.instructions}</h4>
                  <ol>
                    <li>{t.instruction1}</li>
                    <li>{t.instruction2}</li>
                    <li>{t.instruction3}</li>
                    <li>{t.instruction4}</li>
                  </ol>
                </div>
                
                <input
                  type="text"
                  placeholder={t.chatIdPlaceholder}
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="chat-id-input"
                />
                
                <button 
                  onClick={handleConnect}
                  disabled={loading || !telegramChatId.trim()}
                  className="connect-btn"
                >
                  {loading ? 'Подключение...' : t.connect}
                </button>
              </div>
            ) : (
              <div className="connected-info">
                <p>✅ Chat ID: {telegramChatId}</p>
                <div className="connected-actions">
                  <button 
                    onClick={handleTestNotification}
                    className="test-btn"
                  >
                    {t.testNotification}
                  </button>
                  <button 
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="disconnect-btn"
                  >
                    {loading ? 'Отключение...' : t.disconnect}
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-primary">
            {t.close}
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
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 0;
          width: 500px;
          max-width: 90vw;
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
          color: #1a365d;
          font-size: 24px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .settings-content {
          padding: 24px;
          flex: 1;
          overflow-y: auto;
        }
        
        .setting-section {
          margin-bottom: 24px;
        }
        
        .setting-section h3 {
          margin: 0 0 16px 0;
          color: #1a365d;
        }
        
        .status-indicator {
          margin-bottom: 20px;
        }
        
        .status {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .status.connected {
          background: #c6f6d5;
          color: #22543d;
        }
        
        .status.disconnected {
          background: #fed7d7;
          color: #742a2a;
        }
        
        .connection-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .instructions {
          background: #f7fafc;
          padding: 16px;
          border-radius: 12px;
        }
        
        .instructions h4 {
          margin: 0 0 12px 0;
          color: #4a5568;
          font-size: 14px;
        }
        
        .instructions ol {
          margin: 0;
          padding-left: 20px;
          color: #4a5568;
          font-size: 13px;
          line-height: 1.5;
        }
        
        .instructions li {
          margin-bottom: 4px;
        }
        
        .chat-id-input {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
        }
        
        .chat-id-input:focus {
          border-color: #1a365d;
        }
        
        .connect-btn, .disconnect-btn, .test-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .connect-btn {
          background: #1a365d;
          color: white;
        }
        
        .connect-btn:hover:not(:disabled) {
          background: #2d3748;
        }
        
        .disconnect-btn {
          background: #e53e3e;
          color: white;
        }
        
        .disconnect-btn:hover:not(:disabled) {
          background: #c53030;
        }
        
        .test-btn {
          background: #38a169;
          color: white;
        }
        
        .test-btn:hover {
          background: #2f855a;
        }
        
        .connect-btn:disabled, .disconnect-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .connected-info {
          padding: 16px;
          background: #f0fff4;
          border-radius: 12px;
          border: 1px solid #9ae6b4;
        }
        
        .connected-actions {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }
        
        .message {
          padding: 12px 16px;
          border-radius: 12px;
          margin-top: 16px;
          font-size: 14px;
        }
        
        .message.success {
          background: #c6f6d5;
          color: #22543d;
          border: 1px solid #9ae6b4;
        }
        
        .message.error {
          background: #fed7d7;
          color: #742a2a;
          border: 1px solid #feb2b2;
        }
        
        .modal-actions {
          padding: 20px 24px;
          border-top: 1px solid rgba(0,0,0,0.1);
          display: flex;
          justify-content: flex-end;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.3);
        }
      `}</style>
    </div>
  );
}