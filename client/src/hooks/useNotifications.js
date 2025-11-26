// hooks/useNotifications.js
import { useState, useEffect, useContext } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [telegramConnected, setTelegramConnected] = useState(false);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch('/api/notifications/history', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications.filter(n => !n.delivered).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch('/api/notifications/settings', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTelegramConnected(data.telegramConnected);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const connectTelegram = async (chatId) => {
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch('/api/notifications/telegram/connect', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatId })
      });

      if (response.ok) {
        setTelegramConnected(true);
        await loadSettings();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error connecting Telegram:', error);
      return { success: false, error: 'Connection failed' };
    }
  };

  const disconnectTelegram = async () => {
    try {
      const token = localStorage.getItem('ev_token');
      const response = await fetch('/api/notifications/telegram/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTelegramConnected(false);
        await loadSettings();
        return { success: true };
      }
    } catch (error) {
      console.error('Error disconnecting Telegram:', error);
      return { success: false, error: 'Disconnection failed' };
    }
  };

  const markAsRead = async (notificationId) => {
    // Можно добавить эндпоинт для отметки прочитанным
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, delivered: 1 } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  return {
    notifications,
    unreadCount,
    telegramConnected,
    connectTelegram,
    disconnectTelegram,
    markAsRead,
    refreshNotifications: loadNotifications,
    refreshSettings: loadSettings
  };
};