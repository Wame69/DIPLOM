// utils/priceComparison.js
// Расширенная база данных реальных цен и альтернатив
export const priceDatabase = {
  // Стриминговые сервисы
  streaming: {
    'Netflix': {
      basic: 299,
      standard: 599,
      premium: 799,
      family: 999, // на 4 человек
      alternatives: [
        { name: 'YouTube Premium', price: 399, features: ['Музыка', 'Видео без рекламы'] },
        { name: 'Apple TV+', price: 299, features: ['Эксклюзивный контент'] },
        { name: 'Amazon Prime', price: 499, features: ['Доставка', 'Музыка', 'Видео'] },
        { name: 'START', price: 399, features: ['Русский контент', 'Сериалы'] },
        { name: 'Кинопоиск HD', price: 299, features: ['Фильмы', 'Сериалы'] }
      ]
    },
    'YouTube Premium': {
      individual: 399,
      family: 699, // на 6 человек
      student: 199,
      alternatives: [
        { name: 'Spotify', price: 299, features: ['Только музыка'] },
        { name: 'Яндекс Музыка', price: 249, features: ['Русский контент'] },
        { name: 'Apple Music', price: 299, features: ['Интеграция с Apple'] },
        { name: 'Deezer', price: 279, features: ['Высокое качество'] }
      ]
    },
    'Spotify': {
      individual: 299,
      duo: 399, // 2 человека
      family: 499, // 6 человек
      student: 149,
      alternatives: [
        { name: 'Apple Music', price: 299, features: ['Интеграция с Apple'] },
        { name: 'YouTube Music', price: 399, features: ['Входит в YouTube Premium'] },
        { name: 'Яндекс Музыка', price: 249, features: ['Русский контент'] },
        { name: 'VK Музыка', price: 199, features: ['Социальные функции'] }
      ]
    },
    'Apple TV+': {
      individual: 299,
      family: 399,
      alternatives: [
        { name: 'Netflix', price: 599, features: ['Большая библиотека'] },
        { name: 'Amazon Prime', price: 499, features: ['Доставка товаров'] },
        { name: 'START', price: 399, features: ['Русский контент'] }
      ]
    },
    'Amazon Prime': {
      monthly: 499,
      annual: 2990, // ~249 в месяц
      alternatives: [
        { name: 'Netflix', price: 599, features: ['Фокус на видео'] },
        { name: 'YouTube Premium', price: 399, features: ['Музыка + видео'] },
        { name: 'Ozon Premium', price: 399, features: ['Российский аналог'] }
      ]
    },
    'START': {
      standard: 399,
      premium: 599,
      alternatives: [
        { name: 'Кинопоиск HD', price: 299, features: ['Похожий контент'] },
        { name: 'Wink', price: 349, features: ['Ростелеком'] },
        { name: 'ivi', price: 199, features: ['Бюджетный вариант'] }
      ]
    },
    'Кинопоиск HD': {
      monthly: 299,
      annual: 2990, // ~249 в месяц
      alternatives: [
        { name: 'START', price: 399, features: ['Эксклюзивы'] },
        { name: 'ivi', price: 199, features: ['Большая библиотека'] },
        { name: 'More TV', price: 249, features: ['ТВ каналы'] }
      ]
    }
  },

  // Программное обеспечение
  software: {
    'Microsoft 365': {
      personal: 799,
      family: 1199, // 6 человек
      alternatives: [
        { name: 'Google Workspace', price: 699, features: ['Облачное хранилище'] },
        { name: 'LibreOffice', price: 0, features: ['Бесплатный аналог'] },
        { name: 'Apple iWork', price: 0, features: ['Бесплатно для Apple'] }
      ]
    },
    'Adobe Creative Cloud': {
      all_apps: 2499,
      photography: 799,
      alternatives: [
        { name: 'Figma', price: 0, features: ['Бесплатный план'] },
        { name: 'Canva Pro', price: 499, features: ['Шаблоны'] },
        { name: 'Affinity Suite', price: 0, features: ['Единоразовая покупка'] },
        { name: 'GIMP', price: 0, features: ['Бесплатный фоторедактор'] }
      ]
    },
    'Google Workspace': {
      business_starter: 699,
      business_standard: 1399,
      business_plus: 2099,
      alternatives: [
        { name: 'Microsoft 365', price: 799, features: ['Офисные приложения'] },
        { name: 'Yandex 360', price: 749, features: ['Российский аналог'] },
        { name: 'Zoho Workplace', price: 599, features: ['Альтернатива'] }
      ]
    },
    '1C': {
      basic: 1500,
      professional: 3000,
      alternatives: [
        { name: 'MyOffice', price: 999, features: ['Российский офис'] },
        { name: 'Google Workspace', price: 699, features: ['Облачные решения'] }
      ]
    },
    'Parallels': {
      standard: 3499,
      pro: 5999,
      alternatives: [
        { name: 'VMware Fusion', price: 0, features: ['Бесплатная версия'] },
        { name: 'VirtualBox', price: 0, features: ['Полностью бесплатно'] },
        { name: 'UTM', price: 0, features: ['Для Mac'] }
      ]
    }
  },

  // Облачные хранилища
  cloud: {
    'Dropbox': {
      plus: 1199,
      professional: 1999,
      alternatives: [
        { name: 'Google One', price: 699, features: ['Интеграция с Google'] },
        { name: 'Яндекс Диск', price: 799, features: ['Русский сервис'] },
        { name: 'iCloud+', price: 799, features: ['Интеграция с Apple'] },
        { name: 'Mega', price: 499, features: ['Шифрование'] }
      ]
    },
    'Google One': {
      basic: 699,
      standard: 1399,
      premium: 2799,
      alternatives: [
        { name: 'iCloud+', price: 799, features: ['Интеграция с Apple'] },
        { name: 'Яндекс Диск', price: 799, features: ['Русский контент'] },
        { name: 'OneDrive', price: 799, features: ['Интеграция с Microsoft'] }
      ]
    },
    'Яндекс Диск': {
      '100GB': 799,
      '1TB': 1990,
      '3TB': 4990,
      alternatives: [
        { name: 'Google One', price: 699, features: ['Глобальный сервис'] },
        { name: 'Mail.ru Облако', price: 699, features: ['Российский сервис'] },
        { name: 'iCloud+', price: 799, features: ['Для Apple устройств'] }
      ]
    },
    'iCloud+': {
      '50GB': 799,
      '200GB': 1399,
      '2TB': 2799,
      alternatives: [
        { name: 'Google One', price: 699, features: ['Кроссплатформенность'] },
        { name: 'Яндекс Диск', price: 799, features: ['Русский сервис'] }
      ]
    }
  },

  // Игровые сервисы
  gaming: {
    'PlayStation Plus': {
      essential: 799,
      extra: 1299,
      premium: 1699,
      alternatives: [
        { name: 'Xbox Game Pass', price: 899, features: ['PC игры'] },
        { name: 'Nintendo Switch Online', price: 499, features: ['Классические игры'] },
        { name: 'Steam', price: 0, features: ['Бесплатные игры'] },
        { name: 'Epic Games Store', price: 0, features: ['Бесплатные игры еженедельно'] }
      ]
    },
    'Xbox Game Pass': {
      pc: 899,
      ultimate: 1299,
      alternatives: [
        { name: 'PlayStation Plus', price: 799, features: ['Эксклюзивы PlayStation'] },
        { name: 'Steam', price: 0, features: ['Самая большая библиотека'] },
        { name: 'EA Play', price: 499, features: ['Игры EA'] }
      ]
    },
    'Nintendo Switch Online': {
      individual: 499,
      family: 899,
      alternatives: [
        { name: 'Xbox Game Pass', price: 899, features: ['Больше игр'] },
        { name: 'PlayStation Plus', price: 799, features: ['Тройка ААА'] }
      ]
    },
    'Steam': {
      free: 0,
      alternatives: [
        { name: 'Epic Games Store', price: 0, features: ['Бесплатные игры'] },
        { name: 'GOG.com', price: 0, features: ['DRM-free игры'] }
      ]
    },
    'World of Warcraft': {
      monthly: 899,
      alternatives: [
        { name: 'Final Fantasy XIV', price: 799, features: ['Японская RPG'] },
        { name: 'Guild Wars 2', price: 0, features: ['Buy-to-play'] },
        { name: 'Elder Scrolls Online', price: 0, features: ['Бесплатный базовый'] }
      ]
    }
  },

  // Образовательные платформы
  education: {
    'Coursera': {
      plus: 3990,
      alternatives: [
        { name: 'Stepik', price: 0, features: ['Бесплатные курсы'] },
        { name: 'Открытое образование', price: 0, features: ['Российские ВУЗы'] },
        { name: 'Udemy', price: 0, features: ['Частые скидки'] }
      ]
    },
    'Udemy': {
      free: 0,
      alternatives: [
        { name: 'Coursera', price: 3990, features: ['Сертификаты'] },
        { name: 'Skillbox', price: 2990, features: ['Русские курсы'] },
        { name: 'Нетология', price: 3490, features: ['Профессии'] }
      ]
    },
    'Skillbox': {
      average: 2990,
      alternatives: [
        { name: 'Нетология', price: 3490, features: ['Live вебинары'] },
        { name: 'GeekBrains', price: 2790, features: ['IT-курсы'] },
        { name: 'Яндекс Практикум', price: 3990, features: ['Трудоустройство'] }
      ]
    },
    'Headspace': {
      monthly: 799,
      annual: 4790,
      alternatives: [
        { name: 'Calm', price: 699, features: ['Медитации'] },
        { name: 'Mindvalley', price: 999, features: ['Личностный рост'] }
      ]
    }
  },

  // Сервисы доставки и еды
  food: {
    'Delivery Club': {
      club: 199,
      alternatives: [
        { name: 'Yandex Food', price: 0, features: ['Акции'] },
        { name: 'Samokat', price: 0, features: ['Быстрая доставка'] }
      ]
    },
    'Yandex Plus': {
      monthly: 299,
      alternatives: [
        { name: 'Delivery Club', price: 199, features: ['Рестораны'] },
        { name: 'SberPrime', price: 199, features: ['Доставка товаров'] }
      ]
    },
    'SberPrime': {
      monthly: 199,
      alternatives: [
        { name: 'Yandex Plus', price: 299, features: ['Такси + Еда'] },
        { name: 'Ozon Premium', price: 399, features: ['Товары'] }
      ]
    }
  },

  // Сервисы такси
  transport: {
    'Yandex Plus': {
      monthly: 299,
      alternatives: [
        { name: 'Citymobil', price: 0, features: ['Акции'] },
        { name: 'Uber', price: 0, features: ['Международный'] }
      ]
    },
    'Uber Pass': {
      monthly: 399,
      alternatives: [
        { name: 'Yandex Plus', price: 299, features: ['Интеграция с другими сервисами'] },
        { name: 'Gett', price: 0, features: ['Бизнес-поездки'] }
      ]
    }
  },

  // Сервисы связи
  mobile: {
    'Tele2': {
      average: 400,
      alternatives: [
        { name: 'MTS', price: 450, features: ['Покрытие'] },
        { name: 'Beeline', price: 420, features: ['Бонусы'] },
        { name: 'Megafon', price: 430, features: ['Интернет'] },
        { name: 'Yota', price: 390, features: ['Гибкие тарифы'] }
      ]
    },
    'MTS': {
      average: 450,
      alternatives: [
        { name: 'Tele2', price: 400, features: ['Цена'] },
        { name: 'Beeline', price: 420, features: ['Качество связи'] }
      ]
    }
  },

  // Доменные и хостинг сервисы
  hosting: {
    'Reg.ru': {
      average: 900,
      alternatives: [
        { name: 'Beget', price: 790, features: ['Российский хостинг'] },
        { name: 'Timeweb', price: 850, features: ['Панель управления'] },
        { name: 'Bluehost', price: 1200, features: ['Международный'] }
      ]
    },
    'Timeweb': {
      average: 850,
      alternatives: [
        { name: 'Reg.ru', price: 900, features: ['Домены'] },
        { name: 'Beget', price: 790, features: ['Стабильность'] }
      ]
    }
  }
};

// Функции для расчета экономии
export const calculateSavings = {
  // Экономия от перехода на семейный тариф
  familyPlan: (currentPrice, familyPrice, users = 1) => {
    const individualCost = currentPrice * users;
    const familyCostPerUser = familyPrice / 4; // стандартно на 4 человек
    return Math.max(0, individualCost - familyPrice);
  },

  // Экономия от годовой оплаты
  annualSavings: (monthlyPrice) => {
    const annualMonthlyCost = monthlyPrice * 12;
    const annualPlanCost = monthlyPrice * 10; // ~20% скидка
    return annualMonthlyCost - annualPlanCost;
  },

  // Экономия от перехода на альтернативу
  alternativeSavings: (currentPrice, alternativePrice) => {
    return Math.max(0, currentPrice - alternativePrice);
  },

  // Экономия от отключения неиспользуемых сервисов
  unusedSavings: (subscriptions, usageData) => {
    return subscriptions.reduce((savings, sub) => {
      const usage = usageData[sub.id] || 0;
      if (usage < 0.1) { // менее 10% использования
        const monthlyPrice = sub.period === 'year' ? sub.price / 12 : sub.price;
        return savings + monthlyPrice;
      }
      return savings;
    }, 0);
  }
};

// Проверка есть ли сервис в базе данных
export const isServiceInDatabase = (serviceName, category) => {
  return priceDatabase[category] && priceDatabase[category][serviceName];
};

// Получение данных о сервисе
export const getServiceData = (serviceName, category) => {
  if (!isServiceInDatabase(serviceName, category)) {
    return null;
  }
  return priceDatabase[category][serviceName];
};

// Анализ дублирующихся сервисов (только для известных сервисов)
export const analyzeDuplicates = (subscriptions) => {
  const categories = {};
  const duplicates = [];

  // Фильтруем только известные сервисы
  const knownSubscriptions = subscriptions.filter(sub => 
    isServiceInDatabase(sub.title, sub.category)
  );

  knownSubscriptions.forEach(sub => {
    const category = sub.category || 'other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(sub);
  });

  Object.entries(categories).forEach(([category, items]) => {
    if (items.length > 1 && ['streaming', 'music', 'software'].includes(category)) {
      const totalMonthly = items.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + (item.period === 'year' ? price / 12 : price);
      }, 0);

      // Находим лучшую альтернативу (самый дорогой сервис или комбинацию)
      const mostExpensive = Math.max(...items.map(item => 
        item.period === 'year' ? item.price / 12 : item.price
      ));

      duplicates.push({
        category,
        services: items,
        totalMonthly,
        potentialSavings: totalMonthly - mostExpensive, // Оставляем только один
        recommendation: `Оставьте только один сервис в категории ${category}`,
        allServicesKnown: true
      });
    }
  });

  return duplicates;
};

// Поиск более дешевых альтернатив (только для известных сервисов)
export const findCheaperAlternatives = (subscriptions) => {
  const alternatives = [];

  // Фильтруем только известные сервисы
  const knownSubscriptions = subscriptions.filter(sub => 
    isServiceInDatabase(sub.title, sub.category)
  );

  knownSubscriptions.forEach(sub => {
    const serviceData = getServiceData(sub.title, sub.category);
    if (serviceData) {
      const currentMonthly = sub.period === 'year' ? sub.price / 12 : sub.price;
      
      // Ищем более дешевые альтернативы
      serviceData.alternatives?.forEach(alt => {
        if (alt.price < currentMonthly * 0.8) { // На 20% дешевле
          alternatives.push({
            currentService: sub.title,
            alternative: alt.name,
            currentPrice: Math.round(currentMonthly),
            alternativePrice: alt.price,
            savings: Math.round(currentMonthly - alt.price),
            features: alt.features,
            serviceKnown: true
          });
        }
      });

      // Проверяем семейные тарифы
      if (serviceData.family && currentMonthly > serviceData.family / 4) {
        alternatives.push({
          currentService: sub.title,
          alternative: `Семейный тариф ${sub.title}`,
          currentPrice: Math.round(currentMonthly),
          alternativePrice: Math.round(serviceData.family / 4),
          savings: Math.round(currentMonthly - serviceData.family / 4),
          features: ['До 4 пользователей'],
          serviceKnown: true
        });
      }
    }
  });

  return alternatives;
};

// Общий анализ для рекомендаций
export const getServiceRecommendations = (subscriptions) => {
  const knownSubscriptions = subscriptions.filter(sub => 
    isServiceInDatabase(sub.title, sub.category)
  );

  const unknownSubscriptions = subscriptions.filter(sub => 
    !isServiceInDatabase(sub.title, sub.category)
  );

  return {
    known: {
      duplicates: analyzeDuplicates(knownSubscriptions),
      alternatives: findCheaperAlternatives(knownSubscriptions),
      count: knownSubscriptions.length
    },
    unknown: {
      subscriptions: unknownSubscriptions,
      count: unknownSubscriptions.length
    }
  };
};