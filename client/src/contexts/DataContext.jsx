import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getServiceRecommendations, 
  calculateSavings,
  isServiceInDatabase 
} from '../utils/priceComparison';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [services, setServices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Получение токена авторизации
  const getAuthToken = () => {
    return localStorage.getItem('ev_token');
  };

  // API вызовы к бэкенду
  const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  // Загрузка данных с бэкенда
  const loadDataFromBackend = async () => {
    try {
      setLoading(true);
      
      // Загружаем подписки
      const subsData = await apiRequest('/subscriptions');
      setSubscriptions(subsData);

      // Загружаем уведомления
      const notifsData = await apiRequest('/notifications/history?limit=50');
      setNotifications(notifsData.notifications || []);

      // Проверяем статус Telegram
      const telegramStatus = await apiRequest('/telegram/status');
      setTelegramConnected(!!telegramStatus.userConnected);
      setTelegramChatId(telegramStatus.userChatId);

    } catch (error) {
      console.error('Failed to load data from backend:', error);
      // Fallback to localStorage если бэкенд недоступен
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback: загрузка из localStorage
  const loadFromLocalStorage = () => {
    const savedSubs = localStorage.getItem('user_subscriptions');
    const savedServices = localStorage.getItem('user_services');
    const savedNotifs = localStorage.getItem('user_notifications');
    const telegramData = localStorage.getItem('telegram_connection');

    if (savedSubs) setSubscriptions(JSON.parse(savedSubs));
    if (savedServices) setServices(JSON.parse(savedServices));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    if (telegramData) {
      const data = JSON.parse(telegramData);
      setTelegramConnected(data.connected);
      setTelegramChatId(data.chatId);
    }
  };

  // Сохранение в localStorage (fallback)
  useEffect(() => {
    localStorage.setItem('user_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('user_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Инициализация
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      loadDataFromBackend();
    } else {
      loadFromLocalStorage();
    }
  }, []);

  // Добавление подписки (с отправкой на бэкенд)
  const addSubscription = async (subscriptionData) => {
    try {
      // Отправляем на бэкенд
      const newSub = await apiRequest('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });

      // Обновляем локальное состояние
      setSubscriptions(prev => [...prev, newSub]);

      console.log('✅ Subscription created with backend notification');
      return newSub;

    } catch (error) {
      console.error('Failed to create subscription:', error);
      
      // Fallback: создаем локально
      const localSub = {
        id: Date.now(),
        ...subscriptionData,
        created_at: new Date().toISOString(),
        next_payment: calculateNextPayment(subscriptionData.period, subscriptionData.start_date),
        active: true,
        type: 'subscription',
        isKnownService: isServiceInDatabase(subscriptionData.title, subscriptionData.category)
      };
      
      setSubscriptions(prev => [...prev, localSub]);
      
      // Локальное уведомление
      addNotification({
        type: 'subscription_added',
        title: 'Подписка добавлена (локально)',
        message: `Добавлена подписка: ${subscriptionData.title}`,
        subscriptionId: localSub.id,
        read: false,
        timestamp: new Date().toISOString()
      });

      return localSub;
    }
  };

  // Удаление подписки (с отправкой на бэкенд)
  const deleteSubscription = async (id) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    
    try {
      // Отправляем на бэкенд
      await apiRequest(`/subscriptions/${id}`, {
        method: 'DELETE',
      });

      // Обновляем локальное состояние
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));

      console.log('✅ Subscription deleted with backend notification');

    } catch (error) {
      console.error('Failed to delete subscription:', error);
      
      // Fallback: удаляем локально
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      
      // Локальное уведомление
      addNotification({
        type: 'subscription_removed',
        title: 'Подписка удалена (локально)',
        message: `Удалена подписка: ${subscription?.title}`,
        subscriptionId: id,
        read: false,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Добавление услуги
  const addService = (serviceData) => {
    // Пока используем локальное сохранение для услуг
    const newService = {
      id: Date.now(),
      ...serviceData,
      created_at: new Date().toISOString(),
      next_payment: calculateNextPayment(serviceData.period, serviceData.start_date),
      active: true,
      type: 'service',
      isKnownService: isServiceInDatabase(serviceData.title, serviceData.service_type)
    };
    
    setServices(prev => [...prev, newService]);
    
    addNotification({
      type: 'service_added',
      title: 'Услуга добавлена',
      message: `Добавлена услуга: ${serviceData.title}`,
      serviceId: newService.id,
      read: false,
      timestamp: new Date().toISOString()
    });

    return newService;
  };

  // Обновление подписки
  const updateSubscription = async (id, updates) => {
    try {
      // Отправляем на бэкенд
      const updatedSub = await apiRequest(`/subscriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      // Обновляем локальное состояние
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === id ? { 
            ...updatedSub,
            isKnownService: isServiceInDatabase(updates.title || sub.title, updates.category || sub.category)
          } : sub
        )
      );

      return updatedSub;

    } catch (error) {
      console.error('Failed to update subscription:', error);
      
      // Fallback: обновляем локально
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === id ? { 
            ...sub, 
            ...updates,
            isKnownService: isServiceInDatabase(updates.title || sub.title, updates.category || sub.category)
          } : sub
        )
      );
    }
  };

  // Обновление услуги
  const updateService = (id, updates) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { 
          ...service, 
          ...updates,
          isKnownService: isServiceInDatabase(updates.title || service.title, updates.service_type || service.service_type)
        } : service
      )
    );
  };

  // Удаление услуги
  const deleteService = (id) => {
    const service = services.find(s => s.id === id);
    setServices(prev => prev.filter(s => s.id !== id));
    
    addNotification({
      type: 'service_removed',
      title: 'Услуга удалена',
      message: `Удалена услуга: ${service?.title}`,
      serviceId: id,
      read: false,
      timestamp: new Date().toISOString()
    });
  };

  // Добавление уведомления
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  // Отметка уведомлений как прочитанных
  const markNotificationsAsRead = (ids) => {
    setNotifications(prev =>
      prev.map(notif =>
        ids.includes(notif.id) ? { ...notif, read: true } : notif
      )
    );
  };

  // Очистка всех уведомлений (полная очистка из БД)
  const clearAllNotifications = async () => {
    try {
      // Отправляем запрос на полную очистку в БД
      await apiRequest('/notifications/clear-all', {
        method: 'DELETE',
      });
      
      // Очищаем локальное состояние
      setNotifications([]);
      
      console.log('✅ All notifications cleared from backend and locally');
      
    } catch (error) {
      console.error('Failed to clear notifications from backend:', error);
      
      // Fallback: очищаем только локально
      setNotifications([]);
      console.log('✅ Notifications cleared locally only');
    }
  };

  // Подключение Telegram
  const connectTelegram = async (chatId) => {
    try {
      // Отправляем на бэкенд
      await apiRequest('/notifications/telegram/connect', {
        method: 'POST',
        body: JSON.stringify({ chatId }),
      });

      setTelegramConnected(true);
      setTelegramChatId(chatId);
      
      localStorage.setItem('telegram_connection', JSON.stringify({
        connected: true,
        chatId: chatId
      }));
      
      addNotification({
        type: 'telegram_connected',
        title: 'Telegram подключен',
        message: 'Уведомления будут приходить в Telegram',
        read: false,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Failed to connect Telegram:', error);
      alert('Ошибка подключения Telegram');
    }
  };

  // Отключение Telegram
  const disconnectTelegram = async () => {
    try {
      await apiRequest('/notifications/telegram/disconnect', {
        method: 'POST',
      });

      setTelegramConnected(false);
      setTelegramChatId(null);
      localStorage.removeItem('telegram_connection');

    } catch (error) {
      console.error('Failed to disconnect Telegram:', error);
    }
  };

  // Расчет следующей даты платежа
  const calculateNextPayment = (billingCycle, startDate) => {
    const date = new Date(startDate);
    switch (billingCycle) {
      case 'year':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'month':
      default:
        date.setMonth(date.getMonth() + 1);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  // Получение статистики
  const getStats = () => {
    const allItems = [...subscriptions, ...services].filter(item => item.active !== false);
    
    const totalMonthly = allItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + (item.period === 'year' ? price / 12 : price);
    }, 0);

    const byCategory = allItems.reduce((acc, item) => {
      const category = item.category || item.service_type || 'other';
      const price = parseFloat(item.price) || 0;
      const monthlyPrice = item.period === 'year' ? price / 12 : price;
      
      if (!acc[category]) acc[category] = 0;
      acc[category] += monthlyPrice;
      return acc;
    }, {});

    // Статистика по известным/неизвестным сервисам
    const knownServices = allItems.filter(item => item.isKnownService);
    const unknownServices = allItems.filter(item => !item.isKnownService);

    return {
      totalMonthly: Math.round(totalMonthly),
      byCategory,
      activeSubscriptions: subscriptions.filter(sub => sub.active !== false).length,
      activeServices: services.filter(service => service.active !== false).length,
      totalItems: allItems.length,
      knownServices: knownServices.length,
      unknownServices: unknownServices.length,
      knownServicesPercentage: allItems.length > 0 ? Math.round((knownServices.length / allItems.length) * 100) : 0
    };
  };

  // Получение рекомендаций AI с реальными сравнениями
  const getAIRecommendations = () => {
    const allItems = [...subscriptions, ...services].filter(item => item.active !== false);
    const recommendations = [];

    // Получаем рекомендации из системы сравнения цен
    const serviceRecommendations = getServiceRecommendations(allItems);

    // 1. Рекомендации для известных сервисов
    serviceRecommendations.known.duplicates.forEach(dup => {
      recommendations.push({
        id: `duplicate-${dup.category}-${Date.now()}`,
        type: 'savings',
        title: 'Дублирующиеся сервисы',
        description: `У вас ${dup.services.length} сервиса в категории "${dup.category}". Объедините их чтобы сэкономить ${Math.round(dup.potentialSavings)}₽ в месяц.`,
        savings: Math.round(dup.potentialSavings),
        impact: 'high',
        category: dup.category,
        actionType: 'optimize',
        services: dup.services.map(s => s.title),
        basedOnRealData: true
      });
    });

    serviceRecommendations.known.alternatives.forEach(alt => {
      recommendations.push({
        id: `alternative-${alt.currentService}-${Date.now()}`,
        type: 'savings',
        title: 'Более дешевая альтернатива',
        description: `${alt.alternative} стоит ${alt.alternativePrice}₽ вместо ${alt.currentPrice}₽ за ${alt.currentService}. Экономия: ${alt.savings}₽ в месяц.`,
        savings: alt.savings,
        impact: 'medium',
        category: 'alternative',
        actionType: 'switch',
        features: alt.features,
        basedOnRealData: true
      });
    });

    // 2. Анализ годовых подписок для известных сервисов
    const knownItems = allItems.filter(item => item.isKnownService);
    knownItems.forEach(item => {
      if (item.period === 'month' && item.price > 500) {
        const annualSavings = calculateSavings.annualSavings(item.price);
        if (annualSavings > 500) {
          recommendations.push({
            id: `annual-${item.id}`,
            type: 'savings',
            title: 'Годовая подписка выгоднее',
            description: `Перейдите на годовую оплату ${item.title} и сэкономьте ${Math.round(annualSavings)}₽ в год.`,
            savings: Math.round(annualSavings / 12), // месячная экономия
            impact: 'medium',
            category: item.category,
            actionType: 'optimize',
            basedOnRealData: true
          });
        }
      }
    });

    // 3. Общие рекомендации для неизвестных сервисов
    if (serviceRecommendations.unknown.count > 0) {
      const unknownMonthly = serviceRecommendations.unknown.subscriptions.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + (item.period === 'year' ? price / 12 : price);
      }, 0);

      recommendations.push({
        id: 'unknown-services',
        type: 'info',
        title: 'Неизвестные сервисы',
        description: `У вас ${serviceRecommendations.unknown.count} сервисов не в нашей базе. Мы не можем предложить оптимизацию для них.`,
        savings: 0,
        impact: 'low',
        category: 'info',
        actionType: 'review',
        basedOnRealData: false
      });
    }

    // 4. Общая статистика
    const stats = getStats();
    if (stats.knownServicesPercentage < 50 && stats.totalItems > 3) {
      recommendations.push({
        id: 'improve-coverage',
        type: 'info',
        title: 'Улучшите покрытие аналитики',
        description: `Только ${stats.knownServicesPercentage}% ваших подписок в нашей базе. Добавляйте популярные сервисы для точных рекомендаций.`,
        savings: 0,
        impact: 'low',
        category: 'info',
        actionType: 'info',
        basedOnRealData: false
      });
    }

    return recommendations;
  };

  // Проверка предстоящих платежей
  const checkUpcomingPayments = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const allItems = [...subscriptions, ...services];
    const upcoming = allItems.filter(item => {
      if (item.active === false) return false;
      if (!item.next_payment) return false;
      
      const paymentDate = new Date(item.next_payment);
      return paymentDate <= sevenDaysFromNow && paymentDate >= now;
    });

    // Создаем уведомления о предстоящих платежах
    upcoming.forEach(item => {
      const daysUntil = Math.ceil((new Date(item.next_payment) - now) / (1000 * 60 * 60 * 24));
      
      // Проверяем, нет ли уже такого уведомления
      const existingNotification = notifications.find(notif => 
        (notif.subscriptionId === item.id || notif.serviceId === item.id) && 
        notif.type === 'upcoming_payment' &&
        !notif.read
      );

      if (!existingNotification) {
        addNotification({
          type: 'upcoming_payment',
          title: 'Предстоящий платеж',
          message: `Через ${daysUntil} дней списание за ${item.title} - ${item.price}₽`,
          subscriptionId: item.type === 'subscription' ? item.id : undefined,
          serviceId: item.type === 'service' ? item.id : undefined,
          read: false,
          timestamp: new Date().toISOString()
        });
      }
    });

    return upcoming;
  };

  // Ежедневная проверка
  useEffect(() => {
    const checkPayments = () => {
      checkUpcomingPayments();
    };

    // Проверяем каждый день
    checkPayments();
    const interval = setInterval(checkPayments, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [subscriptions, services]);

  const value = {
    subscriptions,
    services,
    notifications,
    telegramConnected,
    telegramChatId,
    loading,
    addSubscription,
    addService,
    updateSubscription,
    updateService,
    deleteSubscription,
    deleteService,
    addNotification,
    markNotificationsAsRead,
    clearAllNotifications,
    connectTelegram,
    disconnectTelegram,
    getStats,
    getAIRecommendations,
    checkUpcomingPayments,
    isServiceInDatabase,
    reloadData: loadDataFromBackend
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};