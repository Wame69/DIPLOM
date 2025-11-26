// components/NotificationsPanel.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import NotificationSettings from './NotificationSettings.jsx';

export default function NotificationsPanel({ onClose, onClearAll }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { language } = useLanguage();

  const translations = {
    ru: {
      notifications: 'Уведомления',
      clearAll: 'Очистить все',
      notificationSettings: 'Настройки уведомлений',
      markAllRead: 'Отметить все как прочитанные',
      noNotifications: 'Нет уведомлений',
      loading: 'Загрузка...',
      allRead: 'Все уведомления прочитаны',
      today: 'Сегодня',
      yesterday: 'Вчера',
      daysAgo: 'дней назад',
      hoursAgo: 'часов назад',
      minutesAgo: 'минут назад',
      justNow: 'Только что',
      clearConfirm: 'Вы уверены, что хотите удалить все уведомления? Это действие нельзя отменить.',
      clearedSuccess: 'Все уведомления успешно удалены',
      clearError: 'Ошибка при удалении уведомлений',
      clearing: 'Удаление...',
      endpointNotFound: 'Функция удаления не настроена на сервере',
      serverError: 'Ошибка сервера',
      networkError: 'Ошибка сети',
      types: {
        subscription_created: 'Подписка добавлена',
        subscription_updated: 'Подписка обновлена',
        subscription_deleted: 'Подписка удалена',
        payment_reminder: 'Напоминание о платеже',
        telegram_connected: 'Telegram подключен',
        monthly_report: 'Ежемесячный отчет',
        system: 'Системное уведомление'
      }
    },
    en: {
      notifications: 'Notifications',
      clearAll: 'Clear all',
      notificationSettings: 'Notification settings',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
      loading: 'Loading...',
      allRead: 'All notifications read',
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: 'days ago',
      hoursAgo: 'hours ago',
      minutesAgo: 'minutes ago',
      justNow: 'Just now',
      clearConfirm: 'Are you sure you want to delete all notifications? This action cannot be undone.',
      clearedSuccess: 'All notifications have been cleared successfully',
      clearError: 'Error clearing notifications',
      clearing: 'Clearing...',
      endpointNotFound: 'Delete function not configured on server',
      serverError: 'Server error',
      networkError: 'Network error',
      types: {
        subscription_created: 'Subscription added',
        subscription_updated: 'Subscription updated',
        subscription_deleted: 'Subscription deleted',
        payment_reminder: 'Payment reminder',
        telegram_connected: 'Telegram connected',
        monthly_report: 'Monthly report',
        system: 'System notification'
      }
    }
  };

  const t = translations[language];

  // Функция для форматирования времени
  const formatTime = (timestamp) => {
    if (!timestamp) return t.justNow;
    
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins} ${t.minutesAgo}`;
    if (diffHours < 24) return `${diffHours} ${t.hoursAgo}`;
    if (diffDays === 1) return t.yesterday;
    if (diffDays < 7) return `${diffDays} ${t.daysAgo}`;

    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Функция для получения иконки по типу уведомления
  const getNotificationIcon = (type) => {
    const icons = {
      subscription_created: '✅',
      subscription_updated: '✏️',
      subscription_deleted: '🗑️',
      payment_reminder: '⏰',
      telegram_connected: '🤖',
      monthly_report: '📊',
      system: '🔔'
    };
    return icons[type] || '🔔';
  };

  // Функция для получения типа стиля по типу уведомления
  const getNotificationType = (type) => {
    const types = {
      subscription_created: 'success',
      subscription_updated: 'info',
      subscription_deleted: 'warning',
      payment_reminder: 'warning',
      telegram_connected: 'success',
      monthly_report: 'info',
      system: 'info'
    };
    return types[type] || 'info';
  };

  // Загрузка уведомлений с сервера
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ev_token');
      const response = await fetch('/api/notifications/history', {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedNotifications = data.notifications.map(notif => ({
          id: notif.id,
          type: notif.type,
          title: t.types[notif.type] || notif.type,
          message: getNotificationMessage(notif),
          time: formatTime(notif.sent_at),
          timestamp: notif.sent_at,
          icon: getNotificationIcon(notif.type),
          read: notif.read_status === 1,
          subscription_title: notif.subscription_title
        }));

        setNotifications(formattedNotifications);
      } else {
        console.error('Failed to load notifications');
      }

    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Генерация сообщения для уведомления
  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'subscription_created':
        return `Добавлена подписка "${notification.subscription_title || 'без названия'}"`;
      case 'subscription_updated':
        return `Обновлена подписка "${notification.subscription_title || 'без названия'}"`;
      case 'subscription_deleted':
        return `Удалена подписка "${notification.subscription_title || 'без названия'}"`;
      case 'payment_reminder':
        return `Скоро списание за подписку "${notification.subscription_title || 'без названия'}"`;
      case 'telegram_connected':
        return 'Telegram уведомления успешно подключены';
      case 'telegram_disconnected':
        return 'Telegram уведомления отключены';
      case 'monthly_report':
        return 'Доступен ежемесячный отчет по вашим подпискам';
      case 'test':
        return 'Тестовое уведомление от системы Evans';
      default:
        return notification.message || 'Новое уведомление';
    }
  };

  // Очистка всех уведомлений ИЗ БАЗЫ ДАННЫХ
  const handleClearAll = async () => {
    try {
      // Подтверждение удаления
      if (!confirm(t.clearConfirm)) {
        return;
      }

      const token = localStorage.getItem('ev_token');
      
      // Показываем состояние загрузки
      setClearing(true);
      
      console.log('🔄 Starting to clear notifications...');
      
      // Удаляем все уведомления из базы данных
      const response = await fetch('/api/notifications/clear-all', {
        method: 'DELETE',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Server response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Clear successful:', result);
        
        // Очищаем локальное состояние
        setNotifications([]);
        onClearAll?.();
        
        // Показываем сообщение об успехе
        alert(t.clearedSuccess);
      } else {
        console.error('❌ Clear failed with status:', response.status);
        
        let errorMessage = t.clearError;
        
        if (response.status === 404) {
          errorMessage = t.endpointNotFound;
        } else if (response.status >= 500) {
          errorMessage = t.serverError;
        }
        
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          errorMessage += ': ' + (errorData.error || errorData.details || `Status ${response.status}`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage += `: Status ${response.status}`;
        }
        
        alert(errorMessage);
      }

    } catch (error) {
      console.error('❌ Error clearing notifications:', error);
      let errorMessage = t.clearError;
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = t.networkError;
      } else {
        errorMessage += ': ' + error.message;
      }
      
      alert(errorMessage);
    } finally {
      setClearing(false);
    }
  };

  // Отметить все как прочитанные
  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Обновляем локальное состояние
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      } else {
        console.error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Клик по уведомлению
  const handleNotificationClick = async (id) => {
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Обновляем локальное состояние
        setNotifications(notifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Загрузка уведомлений при монтировании
  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (showSettings) {
    return <NotificationSettings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="notifications-panel">
      <div className="panel-header">
        <div className="header-top">
          <div className="title-section">
            <h2 className="panel-title">{t.notifications}</h2>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="header-actions">
          <div className="actions-left">
            {unreadCount > 0 && (
              <button 
                className="action-btn mark-read"
                onClick={handleMarkAllRead}
                disabled={loading || clearing}
              >
                {t.markAllRead}
              </button>
            )}
            
            {notifications.length > 0 && (
              <button 
                className="action-btn clear-all"
                onClick={handleClearAll}
                disabled={loading || clearing}
              >
                {clearing ? t.clearing : t.clearAll}
              </button>
            )}
          </div>
          
          <button 
            className="action-btn settings"
            onClick={() => setShowSettings(true)}
            disabled={loading || clearing}
          >
            {t.notificationSettings}
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t.loading}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>{t.noNotifications}</h3>
            <p>{t.allRead}</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${getNotificationType(notification.type)} ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && handleNotificationClick(notification.id)}
            >
              <div className="notification-icon">
                {notification.icon}
              </div>
              <div className="notification-content">
                <div className="notification-title">
                  {notification.title}
                </div>
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">
                  {notification.time}
                </div>
              </div>
              {!notification.read && (
                <div className="unread-dot"></div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .notifications-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 420px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: -10px 0 50px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-header {
          padding: 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.95);
          flex-shrink: 0;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .panel-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1a365d;
        }

        .unread-badge {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
          line-height: 1;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #718096;
          padding: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .actions-left {
          display: flex;
          gap: 8px;
          flex: 1;
        }

        .action-btn {
          padding: 8px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          color: #4a5568;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover:not(:disabled) {
          background: #1a365d;
          color: white;
          border-color: #1a365d;
          transform: translateY(-1px);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .action-btn.mark-read {
          background: rgba(26, 54, 93, 0.1);
          color: #1a365d;
          border-color: rgba(26, 54, 93, 0.3);
          flex: 1;
          max-width: 200px;
        }

        .action-btn.clear-all {
          background: rgba(229, 62, 62, 0.1);
          color: #e53e3e;
          border-color: rgba(229, 62, 62, 0.3);
          flex: 1;
          max-width: 120px;
        }

        .action-btn.clear-all:hover:not(:disabled) {
          background: #e53e3e;
          color: white;
          border-color: #e53e3e;
        }

        .action-btn.settings {
          background: rgba(66, 153, 225, 0.1);
          color: #4299e1;
          border-color: rgba(66, 153, 225, 0.3);
          min-width: 140px;
        }

        .action-btn.settings:hover:not(:disabled) {
          background: #4299e1;
          color: white;
          border-color: #4299e1;
        }

        .notifications-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #1a365d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #4a5568;
          font-size: 18px;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          position: relative;
          border-left: 4px solid transparent;
        }

        .notification-item.unread {
          background: rgba(26, 54, 93, 0.05);
          border-color: rgba(26, 54, 93, 0.1);
        }

        .notification-item.read {
          background: rgba(255, 255, 255, 0.5);
          opacity: 0.7;
        }

        .notification-item.success {
          border-left-color: #48bb78;
        }

        .notification-item.info {
          border-left-color: #4299e1;
        }

        .notification-item.warning {
          border-left-color: #ed8936;
        }

        .notification-item:hover {
          background: rgba(26, 54, 93, 0.08);
          transform: translateY(-1px);
        }

        .notification-icon {
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 2px;
          width: 24px;
          text-align: center;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .notification-title {
          font-weight: 600;
          color: #1a365d;
          margin-bottom: 6px;
          font-size: 14px;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notification-message {
          color: #4a5568;
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .notification-time {
          font-size: 11px;
          color: #718096;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: #4299e1;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 8px;
        }

        @media (max-width: 480px) {
          .notifications-panel {
            width: 100vw;
          }
          
          .header-actions {
            flex-direction: column;
            gap: 8px;
          }
          
          .actions-left {
            width: 100%;
            justify-content: space-between;
          }
          
          .action-btn {
            flex: 1;
            min-width: auto;
          }
          
          .action-btn.settings {
            width: 100%;
            min-width: auto;
          }
        }

        /* Стили для скроллбара */
        .notifications-list::-webkit-scrollbar {
          width: 6px;
        }

        .notifications-list::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }

        .notifications-list::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .notifications-list::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}