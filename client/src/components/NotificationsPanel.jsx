// components/NotificationsPanel.jsx
import React from 'react';

export default function NotificationsPanel({ onClose }) {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Продление подписки',
      message: 'Netflix будет продлен через 3 дня',
      time: '2 часа назад',
      icon: '⚠️'
    },
    {
      id: 2,
      type: 'info',
      title: 'Новая рекомендация',
      message: 'Мы нашли способ сэкономить 15% на ваших подписках',
      time: '1 день назад',
      icon: '💡'
    },
    {
      id: 3,
      type: 'success',
      title: 'Экономия обнаружена',
      message: 'Вы сэкономили 500₽ в этом месяце',
      time: '2 дня назад',
      icon: '💰'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Уведомления</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className="notification-icon">
                {notification.icon}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button className="btn-secondary">Очистить все</button>
          <button className="btn-primary">Настройки уведомлений</button>
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
          width: 480px;
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
        
        .notifications-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        
        .notification-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .notification-item:hover {
          background: rgba(102, 126, 234, 0.05);
        }
        
        .notification-item.warning {
          border-left: 4px solid #ffa726;
        }
        
        .notification-item.info {
          border-left: 4px solid #42a5f5;
        }
        
        .notification-item.success {
          border-left: 4px solid #66bb6a;
        }
        
        .notification-icon {
          font-size: 20px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-content h4 {
          margin: 0 0 4px 0;
          color: #333;
          font-size: 14px;
        }
        
        .notification-content p {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 13px;
          line-height: 1.4;
        }
        
        .notification-time {
          font-size: 11px;
          color: #999;
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