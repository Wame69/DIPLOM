// components/AvailableSubscriptions.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function AvailableSubscriptions({ onAddSubscription }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();

  const translations = {
    ru: {
      availableSubscriptions: 'Доступные подписки',
      searchPlaceholder: 'Поиск подписок...',
      filterAll: 'Все',
      addSubscription: 'Добавить',
      cost: 'Стоимость',
      period: 'Период',
      freeTrial: 'Бесплатный период',
      popularInRussia: 'Популярно в России',
      popular: 'Популярно',
      free: 'Бесплатно',
      perMonth: 'в месяц',
      perYear: 'в год',
      days: 'дней',
      categories: {
        streaming: 'Стриминг',
        music: 'Музыка',
        software: 'Софт',
        games: 'Игры',
        education: 'Образование',
        other: 'Другое'
      },
      features: 'Особенности',
      subscriptions: {
        yandexPlus: {
          title: 'Яндекс Плюс',
          description: 'Фильмы, сериалы, музыка и кешбэк баллами',
          features: ['Более 1000 фильмов', 'Миллионы треков', 'Кешбэк баллами']
        },
        ivi: {
          title: 'IVI',
          description: 'Кино и сериалы с первым российским производством',
          features: ['Эксклюзивные сериалы', '4K качество', 'Оффлайн просмотр']
        },
        okko: {
          title: 'Okko',
          description: 'Кинотеатр с премьерами и эксклюзивами',
          features: ['Премьеры одновременно с кино', 'Мультикино', 'Детский режим']
        },
        wink: {
          title: 'Wink',
          description: 'ТВ, кино и сериалы от Ростелекома',
          features: ['ТВ-каналы', 'Умные рекомендации', 'Мультиэкран']
        },
        moreTv: {
          title: 'More.tv',
          description: 'Стриминговый сервис с эксклюзивным контентом',
          features: ['Эксклюзивные проекты', 'Без рекламы', 'Мультиплатформенность']
        },
        start: {
          title: 'Start',
          description: 'Платформа с сериалами и фильмами',
          features: ['Уникальные сериалы', '4K HDR', 'Скачивание контента']
        },
        yandexMusic: {
          title: 'Яндекс Музыка',
          description: 'Миллионы треков и персональные рекомендации',
          features: ['Без рекламы', 'Оффлайн прослушивание', 'Персональные плейлисты']
        },
        vkMusic: {
          title: 'VK Музыка',
          description: 'Музыкальная подписка от ВКонтакте',
          features: ['Огромная библиотека', 'Умные плейлисты', 'Без ограничений']
        },
        zvuk: {
          title: 'Zvuk',
          description: 'Музыкальный стриминг с высоким качеством',
          features: ['Hi-Res аудио', 'Эксклюзивные релизы', 'Подкасты']
        },
        boom: {
          title: 'Boom',
          description: 'Музыкальная платформа от МТС',
          features: ['60 млн треков', 'Персональные подборки', 'Высокое качество']
        },
        kaspersky: {
          title: 'Kaspersky',
          description: 'Комплексная защита для всех устройств',
          features: ['Антивирус', 'VPN', 'Родительский контроль']
        },
        myOffice: {
          title: 'MyOffice',
          description: 'Офисный пакет для работы с документами',
          features: ['Полная совместимость', 'Русская поддержка', 'Облачное хранение']
        },
        drWeb: {
          title: 'Dr.Web',
          description: 'Антивирусная защита от российского разработчика',
          features: ['Защита от вирусов', 'Антиспам', 'Файрвол']
        },
        adobe: {
          title: 'Adobe Creative Cloud',
          description: 'Полный пакет программ для творчества',
          features: ['Photoshop', 'Illustrator', 'Premiere Pro']
        },
        worldOfTanks: {
          title: 'World of Tanks',
          description: 'Премиум аккаунт для легендарной игры',
          features: ['+50% к опыту', '+50% к кредитам', 'Эксклюзивная техника']
        },
        xboxGamePass: {
          title: 'Xbox Game Pass',
          description: 'Подписка на сотни игр для ПК и консолей',
          features: ['100+ игр', 'Эксклюзивы Microsoft', 'Облачный гейминг']
        },
        playstationPlus: {
          title: 'PlayStation Plus',
          description: 'Онлайн-возможности и коллекция игр для PS',
          features: ['Онлайн-игра', 'Ежемесячные игры', 'Эксклюзивы']
        },
        steam: {
          title: 'Steam',
          description: 'Крупнейшая платформа для компьютерных игр',
          features: ['Тысячи игр', 'Сообщество', 'Регулярные распродажи']
        },
        skillbox: {
          title: 'Skillbox',
          description: 'Онлайн-курсы по программированию и дизайну',
          features: ['Рассрочка', 'Трудоустройство', 'Диплом']
        },
        netology: {
          title: 'Нетология',
          description: 'Образовательная платформа для digital-профессий',
          features: ['Менторство', 'Проекты в портфолио', 'Карьерный центр']
        },
        geekbrains: {
          title: 'GeekBrains',
          description: 'IT-образование от Mail.ru Group',
          features: ['Практические навыки', 'Стажировка', 'Сертификат']
        },
        coursera: {
          title: 'Coursera',
          description: 'Онлайн-курсы от ведущих университетов мира',
          features: ['Сертификаты', 'Университетские программы', 'Гибкий график']
        },
        yandexFood: {
          title: 'Яндекс Еда+',
          description: 'Подписка на доставку еды с выгодными условиями',
          features: ['Бесплатная доставка', 'Кешбэк до 10%', 'Приоритетный заказ']
        },
        deliveryClub: {
          title: 'Delivery Club',
          description: 'Премиум подписка на доставку еды',
          features: ['0₽ доставка', 'Двойные баллы', 'Эксклюзивные акции']
        },
        ozonPremium: {
          title: 'Ozon Premium',
          description: 'Премиум подписка на маркетплейс',
          features: ['Бесплатная доставка', 'Кешбэк до 10%', 'Ранний доступ к скидкам']
        },
        wildberries: {
          title: 'Wildberries Premium',
          description: 'Подписка на маркетплейс с премиум условиями',
          features: ['Бесплатная доставка', 'Ускоренная доставка', 'Приоритетная выдача']
        },
        aliexpress: {
          title: 'AliExpress Plus',
          description: 'Премиум подписка на международный маркетплейс',
          features: ['Бесплатная доставка', 'Защита покупателя', 'Эксклюзивные купоны']
        },
        sberPrime: {
          title: 'СберПрайм',
          description: 'Комплексная подписка от Сбера',
          features: ['Доставка еды', 'Такси', 'Медиа', 'Кешбэк']
        }
      }
    },
    en: {
      availableSubscriptions: 'Available Subscriptions',
      searchPlaceholder: 'Search subscriptions...',
      filterAll: 'All',
      addSubscription: 'Add',
      cost: 'Cost',
      period: 'Period',
      freeTrial: 'Free trial',
      popularInRussia: 'Popular in Russia',
      popular: 'Popular',
      free: 'Free',
      perMonth: 'per month',
      perYear: 'per year',
      days: 'days',
      categories: {
        streaming: 'Streaming',
        music: 'Music',
        software: 'Software',
        games: 'Games',
        education: 'Education',
        other: 'Other'
      },
      features: 'Features',
      subscriptions: {
        yandexPlus: {
          title: 'Yandex Plus',
          description: 'Movies, series, music and cashback with points',
          features: ['Over 1000 movies', 'Millions of tracks', 'Cashback with points']
        },
        ivi: {
          title: 'IVI',
          description: 'Movies and series with first Russian productions',
          features: ['Exclusive series', '4K quality', 'Offline viewing']
        },
        okko: {
          title: 'Okko',
          description: 'Cinema with premieres and exclusives',
          features: ['Premieres simultaneously with cinema', 'Multi-cinema', 'Kids mode']
        },
        wink: {
          title: 'Wink',
          description: 'TV, movies and series from Rostelecom',
          features: ['TV channels', 'Smart recommendations', 'Multi-screen']
        },
        moreTv: {
          title: 'More.tv',
          description: 'Streaming service with exclusive content',
          features: ['Exclusive projects', 'No ads', 'Multi-platform']
        },
        start: {
          title: 'Start',
          description: 'Platform with series and movies',
          features: ['Unique series', '4K HDR', 'Content download']
        },
        yandexMusic: {
          title: 'Yandex Music',
          description: 'Millions of tracks and personalized recommendations',
          features: ['No ads', 'Offline listening', 'Personal playlists']
        },
        vkMusic: {
          title: 'VK Music',
          description: 'Music subscription from VKontakte',
          features: ['Huge library', 'Smart playlists', 'No restrictions']
        },
        zvuk: {
          title: 'Zvuk',
          description: 'Music streaming with high quality',
          features: ['Hi-Res audio', 'Exclusive releases', 'Podcasts']
        },
        boom: {
          title: 'Boom',
          description: 'Music platform from MTS',
          features: ['60 million tracks', 'Personal selections', 'High quality']
        },
        kaspersky: {
          title: 'Kaspersky',
          description: 'Comprehensive protection for all devices',
          features: ['Antivirus', 'VPN', 'Parental control']
        },
        myOffice: {
          title: 'MyOffice',
          description: 'Office suite for working with documents',
          features: ['Full compatibility', 'Russian support', 'Cloud storage']
        },
        drWeb: {
          title: 'Dr.Web',
          description: 'Antivirus protection from Russian developer',
          features: ['Virus protection', 'Anti-spam', 'Firewall']
        },
        adobe: {
          title: 'Adobe Creative Cloud',
          description: 'Complete package of creative software',
          features: ['Photoshop', 'Illustrator', 'Premiere Pro']
        },
        worldOfTanks: {
          title: 'World of Tanks',
          description: 'Premium account for legendary game',
          features: ['+50% experience', '+50% credits', 'Exclusive vehicles']
        },
        xboxGamePass: {
          title: 'Xbox Game Pass',
          description: 'Subscription to hundreds of games for PC and consoles',
          features: ['100+ games', 'Microsoft exclusives', 'Cloud gaming']
        },
        playstationPlus: {
          title: 'PlayStation Plus',
          description: 'Online features and game collection for PS',
          features: ['Online play', 'Monthly games', 'Exclusives']
        },
        steam: {
          title: 'Steam',
          description: 'Largest platform for computer games',
          features: ['Thousands of games', 'Community', 'Regular sales']
        },
        skillbox: {
          title: 'Skillbox',
          description: 'Online courses in programming and design',
          features: ['Installment plan', 'Employment assistance', 'Diploma']
        },
        netology: {
          title: 'Netology',
          description: 'Educational platform for digital professions',
          features: ['Mentoring', 'Portfolio projects', 'Career center']
        },
        geekbrains: {
          title: 'GeekBrains',
          description: 'IT education from Mail.ru Group',
          features: ['Practical skills', 'Internship', 'Certificate']
        },
        coursera: {
          title: 'Coursera',
          description: 'Online courses from leading world universities',
          features: ['Certificates', 'University programs', 'Flexible schedule']
        },
        yandexFood: {
          title: 'Yandex Food+',
          description: 'Food delivery subscription with benefits',
          features: ['Free delivery', 'Up to 10% cashback', 'Priority order']
        },
        deliveryClub: {
          title: 'Delivery Club',
          description: 'Premium food delivery subscription',
          features: ['0₽ delivery', 'Double points', 'Exclusive promotions']
        },
        ozonPremium: {
          title: 'Ozon Premium',
          description: 'Premium marketplace subscription',
          features: ['Free delivery', 'Up to 10% cashback', 'Early access to discounts']
        },
        wildberries: {
          title: 'Wildberries Premium',
          description: 'Marketplace subscription with premium conditions',
          features: ['Free delivery', 'Express delivery', 'Priority pickup']
        },
        aliexpress: {
          title: 'AliExpress Plus',
          description: 'Premium international marketplace subscription',
          features: ['Free delivery', 'Buyer protection', 'Exclusive coupons']
        },
        sberPrime: {
          title: 'SberPrime',
          description: 'Comprehensive subscription from Sber',
          features: ['Food delivery', 'Taxi', 'Media', 'Cashback']
        }
      }
    }
  };

  const t = translations[language];

  const availableSubscriptions = [
    // Стриминг
    { 
      id: 1, 
      title: t.subscriptions.yandexPlus.title, 
      category: 'streaming', 
      price: 299, 
      period: 'month', 
      description: t.subscriptions.yandexPlus.description, 
      features: t.subscriptions.yandexPlus.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: true, 
      logo: '🎬', 
      color: '#FF0000' 
    },
    { 
      id: 2, 
      title: t.subscriptions.ivi.title, 
      category: 'streaming', 
      price: 399, 
      period: 'month', 
      description: t.subscriptions.ivi.description, 
      features: t.subscriptions.ivi.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: true, 
      logo: '📺', 
      color: '#00B4FF' 
    },
    { 
      id: 10, 
      title: t.subscriptions.okko.title, 
      category: 'streaming', 
      price: 299, 
      period: 'month', 
      description: t.subscriptions.okko.description, 
      features: t.subscriptions.okko.features, 
      freeTrial: language === 'ru' ? '14 дней' : '14 days', 
      popular: false, 
      logo: '🎭', 
      color: '#FF3B30' 
    },
    { 
      id: 11, 
      title: t.subscriptions.wink.title, 
      category: 'streaming', 
      price: 299, 
      period: 'month', 
      description: t.subscriptions.wink.description, 
      features: t.subscriptions.wink.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: false, 
      logo: '📡', 
      color: '#00B4FF' 
    },
    { 
      id: 13, 
      title: t.subscriptions.moreTv.title, 
      category: 'streaming', 
      price: 199, 
      period: 'month', 
      description: t.subscriptions.moreTv.description, 
      features: t.subscriptions.moreTv.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: false, 
      logo: '📱', 
      color: '#8B5CF6' 
    },
    { 
      id: 14, 
      title: t.subscriptions.start.title, 
      category: 'streaming', 
      price: 249, 
      period: 'month', 
      description: t.subscriptions.start.description, 
      features: t.subscriptions.start.features, 
      freeTrial: language === 'ru' ? '14 дней' : '14 days', 
      popular: false, 
      logo: '⭐', 
      color: '#F59E0B' 
    },

    // Музыка
    { 
      id: 3, 
      title: t.subscriptions.yandexMusic.title, 
      category: 'music', 
      price: 169, 
      period: 'month', 
      description: t.subscriptions.yandexMusic.description, 
      features: t.subscriptions.yandexMusic.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: true, 
      logo: '🎵', 
      color: '#FF0000' 
    },
    { 
      id: 4, 
      title: t.subscriptions.vkMusic.title, 
      category: 'music', 
      price: 149, 
      period: 'month', 
      description: t.subscriptions.vkMusic.description, 
      features: t.subscriptions.vkMusic.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: false, 
      logo: '🎶', 
      color: '#0077FF' 
    },
    { 
      id: 12, 
      title: t.subscriptions.zvuk.title, 
      category: 'music', 
      price: 199, 
      period: 'month', 
      description: t.subscriptions.zvuk.description, 
      features: t.subscriptions.zvuk.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: false, 
      logo: '🎧', 
      color: '#1DB954' 
    },
    { 
      id: 15, 
      title: t.subscriptions.boom.title, 
      category: 'music', 
      price: 149, 
      period: 'month', 
      description: t.subscriptions.boom.description, 
      features: t.subscriptions.boom.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: false, 
      logo: '🎼', 
      color: '#10B981' 
    },

    // Софт
    { 
      id: 5, 
      title: t.subscriptions.kaspersky.title, 
      category: 'software', 
      price: 1199, 
      period: 'year', 
      description: t.subscriptions.kaspersky.description, 
      features: t.subscriptions.kaspersky.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: true, 
      logo: '🛡️', 
      color: '#00A8E0' 
    },
    { 
      id: 6, 
      title: t.subscriptions.myOffice.title, 
      category: 'software', 
      price: 1990, 
      period: 'year', 
      description: t.subscriptions.myOffice.description, 
      features: t.subscriptions.myOffice.features, 
      freeTrial: language === 'ru' ? '14 дней' : '14 days', 
      popular: false, 
      logo: '📊', 
      color: '#0078D4' 
    },
    { 
      id: 16, 
      title: t.subscriptions.drWeb.title, 
      category: 'software', 
      price: 1290, 
      period: 'year', 
      description: t.subscriptions.drWeb.description, 
      features: t.subscriptions.drWeb.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: false, 
      logo: '🕷️', 
      color: '#DC2626' 
    },
    { 
      id: 17, 
      title: t.subscriptions.adobe.title, 
      category: 'software', 
      price: 2490, 
      period: 'month', 
      description: t.subscriptions.adobe.description, 
      features: t.subscriptions.adobe.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: true, 
      logo: '🎨', 
      color: '#FF0000' 
    },

    // Игры
    { 
      id: 7, 
      title: t.subscriptions.worldOfTanks.title, 
      category: 'games', 
      price: 379, 
      period: 'month', 
      description: t.subscriptions.worldOfTanks.description, 
      features: t.subscriptions.worldOfTanks.features, 
      freeTrial: language === 'ru' ? '3 дня' : '3 days', 
      popular: true, 
      logo: '🎮', 
      color: '#FF6B00' 
    },
    { 
      id: 18, 
      title: t.subscriptions.xboxGamePass.title, 
      category: 'games', 
      price: 599, 
      period: 'month', 
      description: t.subscriptions.xboxGamePass.description, 
      features: t.subscriptions.xboxGamePass.features, 
      freeTrial: language === 'ru' ? '14 дней' : '14 days', 
      popular: true, 
      logo: '🎯', 
      color: '#107C10' 
    },
    { 
      id: 19, 
      title: t.subscriptions.playstationPlus.title, 
      category: 'games', 
      price: 799, 
      period: 'month', 
      description: t.subscriptions.playstationPlus.description, 
      features: t.subscriptions.playstationPlus.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: true, 
      logo: '⚡', 
      color: '#003791' 
    },
    { 
      id: 20, 
      title: t.subscriptions.steam.title, 
      category: 'games', 
      price: 0, 
      period: 'month', 
      description: t.subscriptions.steam.description, 
      features: t.subscriptions.steam.features, 
      freeTrial: null, 
      popular: true, 
      logo: '🌀', 
      color: '#1B2838' 
    },

    // Образование
    { 
      id: 8, 
      title: t.subscriptions.skillbox.title, 
      category: 'education', 
      price: 2890, 
      period: 'month', 
      description: t.subscriptions.skillbox.description, 
      features: t.subscriptions.skillbox.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: true, 
      logo: '🎓', 
      color: '#6C5CE7' 
    },
    { 
      id: 9, 
      title: t.subscriptions.netology.title, 
      category: 'education', 
      price: 3250, 
      period: 'month', 
      description: t.subscriptions.netology.description, 
      features: t.subscriptions.netology.features, 
      freeTrial: language === 'ru' ? '14 дней' : '14 days', 
      popular: false, 
      logo: '💻', 
      color: '#1A365D' 
    },
    { 
      id: 21, 
      title: t.subscriptions.geekbrains.title, 
      category: 'education', 
      price: 2750, 
      period: 'month', 
      description: t.subscriptions.geekbrains.description, 
      features: t.subscriptions.geekbrains.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: false, 
      logo: '👨‍💻', 
      color: '#4F46E5' 
    },
    { 
      id: 22, 
      title: t.subscriptions.coursera.title, 
      category: 'education', 
      price: 3990, 
      period: 'month', 
      description: t.subscriptions.coursera.description, 
      features: t.subscriptions.coursera.features, 
      freeTrial: language === 'ru' ? '7 дней' : '7 days', 
      popular: true, 
      logo: '📚', 
      color: '#0056D2' 
    },

    // Другое
    { 
      id: 23, 
      title: t.subscriptions.yandexFood.title, 
      category: 'other', 
      price: 199, 
      period: 'month', 
      description: t.subscriptions.yandexFood.description, 
      features: t.subscriptions.yandexFood.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: true, 
      logo: '🍕', 
      color: '#FFCC00' 
    },
    { 
      id: 24, 
      title: t.subscriptions.deliveryClub.title, 
      category: 'other', 
      price: 149, 
      period: 'month', 
      description: t.subscriptions.deliveryClub.description, 
      features: t.subscriptions.deliveryClub.features, 
      freeTrial: language === 'ru' ? '14 дней' : '14 days', 
      popular: false, 
      logo: '🚴', 
      color: '#00B2FF' 
    },
    { 
      id: 25, 
      title: t.subscriptions.ozonPremium.title, 
      category: 'other', 
      price: 599, 
      period: 'year', 
      description: t.subscriptions.ozonPremium.description, 
      features: t.subscriptions.ozonPremium.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: true, 
      logo: '📦', 
      color: '#005BFF' 
    },
    { 
      id: 26, 
      title: t.subscriptions.wildberries.title, 
      category: 'other', 
      price: 499, 
      period: 'year', 
      description: t.subscriptions.wildberries.description, 
      features: t.subscriptions.wildberries.features, 
      freeTrial: null, 
      popular: false, 
      logo: '🛒', 
      color: '#7100B2' 
    },
    { 
      id: 27, 
      title: t.subscriptions.aliexpress.title, 
      category: 'other', 
      price: 399, 
      period: 'year', 
      description: t.subscriptions.aliexpress.description, 
      features: t.subscriptions.aliexpress.features, 
      freeTrial: language === 'ru' ? '15 дней' : '15 days', 
      popular: true, 
      logo: '🌐', 
      color: '#FF6A00' 
    },
    { 
      id: 28, 
      title: t.subscriptions.sberPrime.title, 
      category: 'other', 
      price: 199, 
      period: 'month', 
      description: t.subscriptions.sberPrime.description, 
      features: t.subscriptions.sberPrime.features, 
      freeTrial: language === 'ru' ? '30 дней' : '30 days', 
      popular: true, 
      logo: '🏦', 
      color: '#21A038' 
    }
  ];

  const filteredSubscriptions = availableSubscriptions.filter(sub => {
    const matchesCategory = selectedCategory === 'all' || sub.category === selectedCategory;
    const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: t.filterAll },
    { id: 'streaming', name: t.categories.streaming },
    { id: 'music', name: t.categories.music },
    { id: 'software', name: t.categories.software },
    { id: 'games', name: t.categories.games },
    { id: 'education', name: t.categories.education },
    { id: 'other', name: t.categories.other }
  ];

  const handleAddClick = (subscription) => {
    const subscriptionData = {
      title: subscription.title,
      price: subscription.price,
      period: subscription.period,
      category: subscription.category,
      description: subscription.description
    };
    onAddSubscription(subscriptionData);
  };

  return (
    <div className="available-subscriptions">
      <div className="subscriptions-header">
        <div className="header-main">
          <h1>{t.availableSubscriptions}</h1>
          <div className="popular-badge">
            <span className="badge-icon">🔥</span>
            <span>{t.popularInRussia}</span>
          </div>
        </div>
        
        <div className="header-controls">
          <div className="search-box">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="subscriptions-grid">
        {filteredSubscriptions.map((sub) => (
          <div key={sub.id} className="subscription-card">
            <div className="card-header">
              <div className="subscription-logo">
                <div 
                  className="logo-icon"
                  style={{ backgroundColor: sub.color }}
                >
                  {sub.logo}
                </div>
              </div>
              <div className="subscription-info">
                <h3 className="subscription-title">{sub.title}</h3>
                {sub.popular && (
                  <div className="popular-tag">
                    <span>🔥 {t.popular}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="subscription-description">
              <p>{sub.description}</p>
            </div>
            
            <div className="subscription-features">
              <h4>{t.features}:</h4>
              <ul>
                {sub.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="subscription-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">{t.cost}</span>
                  <span className="detail-value price">
                    {sub.price === 0 ? t.free : `${sub.price} ₽`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t.period}</span>
                  <span className="detail-value">
                    {sub.period === 'year' ? t.perYear : t.perMonth}
                  </span>
                </div>
              </div>
              
              {sub.freeTrial && (
                <div className="free-trial">
                  <span className="trial-icon">🎁</span>
                  <span>{t.freeTrial}: {sub.freeTrial}</span>
                </div>
              )}
            </div>
            
            <div className="card-footer">
              <button 
                className="add-btn development-btn"
                onClick={() => handleAddClick(sub)}
                disabled
              >
                <span className="btn-icon">⏳</span>
                {t.addSubscription}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .available-subscriptions { max-width: 1200px; margin:0 auto; padding:20px; position:relative; }
        .subscriptions-header { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 20px; padding: 24px; margin-bottom: 32px; border: 1px solid rgba(226,232,240,0.8); box-shadow:0 8px 32px rgba(0,0,0,0.08); }
        .header-main { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
        .header-main h1 { margin:0; color:#1a365d; font-size:32px; font-weight:700; }
        .popular-badge { background: linear-gradient(135deg,#ff6b6b,#ee5a24); padding:8px 16px; border-radius:12px; color:white; display:flex; align-items:center; gap:8px; font-weight:600; font-size:14px; }
        .badge-icon { font-size:16px; }
        .header-controls { display:flex; flex-direction:column; gap:16px; }
        .search-box { position:relative; max-width:400px; }
        .search-box input { width:100%; padding:12px 40px 12px 16px; border:1px solid rgba(226,232,240,0.8); border-radius:12px; background:#f7fafc; color:#2d3748; font-size:14px; transition: all 0.3s ease; }
        .search-box input:focus { outline:none; border-color:#1a365d; box-shadow:0 0 0 3px rgba(26,54,93,0.1); }
        .search-box input::placeholder { color:#a0aec0; }
        .search-icon { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#a0aec0; }
        .category-filters { display:flex; gap:8px; flex-wrap:wrap; }
        .category-filter { padding:10px 16px; border:1px solid rgba(226,232,240,0.8); border-radius:12px; background:#f7fafc; color:#4a5568; cursor:pointer; transition: all 0.3s ease; font-size:14px; font-weight:500; }
        .category-filter:hover { background: rgba(26,54,93,0.1); color:#1a365d; }
        .category-filter.active { background: linear-gradient(135deg,#1a365d,#2d3748); color:white; border-color:#1a365d; }
        .subscriptions-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(350px,1fr)); gap:24px; }
        .subscription-card { background: rgba(255,255,255,0.95); backdrop-filter:blur(20px); border:1px solid rgba(226,232,240,0.8); border-radius:16px; padding:24px; transition: all 0.3s ease; color:#2d3748; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
        .subscription-card:hover { transform:translateY(-5px); box-shadow:0 12px 40px rgba(0,0,0,0.15); border-color:rgba(26,54,93,0.3); }
        .card-header { display:flex; align-items:flex-start; gap:12px; margin-bottom:16px; }
        .subscription-logo { flex-shrink:0; }
        .logo-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; color:white; box-shadow:0 4px 12px rgba(0,0,0,0.15); }
        .subscription-info { flex:1; }
        .subscription-title { font-size:18px; font-weight:600; margin:0 0 8px 0; color:#1a365d; }
        .popular-tag { display:inline-block; background: rgba(255,107,107,0.1); color:#e53e3e; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:600; }
        .subscription-description { margin-bottom:16px; }
        .subscription-description p { margin:0; color:#4a5568; line-height:1.5; font-size:14px; }
        .subscription-features { margin-bottom:20px; }
        .subscription-features h4 { margin:0 0 8px 0; font-size:14px; color:#1a365d; font-weight:600; }
        .subscription-features ul { margin:0; padding-left:16px; }
        .subscription-features li { font-size:13px; color:#4a5568; margin-bottom:4px; line-height:1.4; }
        .subscription-details { margin-bottom:20px; }
        .detail-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px; }
        .detail-item { display:flex; flex-direction:column; }
        .detail-label { font-size:11px; color:#718096; margin-bottom:4px; text-transform:uppercase; font-weight:600; }
        .detail-value { font-size:14px; font-weight:500; color:#2d3748; }
        .price { color:#1a365d; font-weight:700; }
        .free-trial { display:flex; align-items:center; gap:8px; background: rgba(72,187,120,0.1); padding:8px 12px; border-radius:8px; font-size:13px; color:#38a169; font-weight:500; }
        .trial-icon { font-size:14px; }
        .card-footer { border-top:1px solid rgba(226,232,240,0.8); padding-top:16px; }
        .add-btn { width:100%; background: linear-gradient(135deg,#1a365d,#2d3748); border:none; color:white; padding:12px 20px; border-radius:12px; cursor:pointer; font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.3s ease; font-size:14px; }
        .add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(26,54,93,0.25); }
        .development-btn { background: linear-gradient(135deg,#a0aec0,#718096) !important; cursor:not-allowed !important; opacity:0.7; }
        .development-btn:hover { transform:none !important; box-shadow:none !important; }
        @media (max-width:768px) {
          .available-subscriptions { padding:16px; }
          .header-main { flex-direction:column; align-items:flex-start; gap:16px; }
          .category-filters { justify-content:center; }
          .subscriptions-grid { grid-template-columns:1fr; }
          .detail-row { grid-template-columns:1fr; gap:8px; }
        }
      `}</style>
    </div>
  );
}