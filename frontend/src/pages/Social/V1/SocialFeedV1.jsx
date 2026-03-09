import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SocialV1.css';

/**
 * SocialFeedV1 - Лента постов в стиле Ретрофутуризм Неоморфизм
 * Максимально детализированный интерфейс с голографическими элементами
 */

// ============================================
// MOCK DATA GENERATORS
// ============================================

const generateMockPosts = () => [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Александр Волков',
      username: '@alexvolkov',
      avatar: '👨‍🚀',
      isVerified: true,
      level: 42,
    },
    content: {
      text: '🚀 Только что завершил свой первый марафон за 3:45! EthosLife помог мне подготовиться лучше, чем я мог представить. Особенно полезны были AI-рекомендации по питанию и восстановлению. #марафон #fitness #achievement',
      images: [
        'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
      ],
      type: 'photo',
    },
    metrics: {
      likes: 234,
      comments: 45,
      shares: 12,
      views: 1250,
    },
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    tags: ['марафон', 'fitness', 'achievement'],
    location: 'Москва, Парк Горького',
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Мария Козлова',
      username: '@mariakoz',
      avatar: '🧘‍♀️',
      isVerified: true,
      level: 38,
    },
    content: {
      text: '🧘‍♀️ Утреннюю медитацию никто не отменял! 30 дней практики подряд - это новый личный рекорд. Чувствую невероятную ясность ума и спокойствие. Рекомендую всем попробовать модуль ментального здоровья в EthosLife! #meditation #mentalhealth #streak',
      images: [],
      type: 'text',
      hologram: {
        enabled: true,
        model: 'meditation-pose',
        color: '#9d4edd',
      },
    },
    metrics: {
      likes: 189,
      comments: 32,
      shares: 8,
      views: 890,
    },
    isLiked: true,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    tags: ['meditation', 'mentalhealth', 'streak'],
    location: 'Санкт-Петербург',
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Дмитрий Петров',
      username: '@dmitryp',
      avatar: '🏋️',
      isVerified: false,
      level: 25,
    },
    content: {
      text: '💪 Новый личный рекорд в становой тяге - 180кг! Год назад мог поднять только 100кг. Систематические тренировки и правильное питание творят чудеса. Спасибо тренеру из сообщества PowerLifting Pro! #powerlifting #gym #pr',
      images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'],
      type: 'photo',
      video: {
        url: 'https://example.com/workout-video.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
        duration: 45,
      },
    },
    metrics: {
      likes: 456,
      comments: 78,
      shares: 23,
      views: 2100,
    },
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    tags: ['powerlifting', 'gym', 'pr'],
    location: 'Екатеринбург, Fitness Palace',
  },
  {
    id: 4,
    user: {
      id: 4,
      name: 'Елена Смирнова',
      username: '@elenasmir',
      avatar: '🥗',
      isVerified: true,
      level: 51,
    },
    content: {
      text: '🥑 Мой новый рецепт протеинового завтрака! 35г белка, 12г клетчатки, всего 450 ккал. Идеально для тех, кто следит за фигурой. Полный рецепт и макронутриенты в приложении! #nutrition #healthyfood #recipe',
      images: [
        'https://images.unsplash.com/photo-1511690656952-34342d5c2895?w=600',
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
        'https://images.unsplash.com/photo-1493770348160-35af50959b27?w=600',
      ],
      type: 'photo',
    },
    metrics: {
      likes: 567,
      comments: 92,
      shares: 45,
      views: 3200,
    },
    isLiked: true,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    tags: ['nutrition', 'healthyfood', 'recipe'],
    location: 'Казань',
  },
  {
    id: 5,
    user: {
      id: 5,
      name: 'Андрей Новиков',
      username: '@andreynov',
      avatar: '😴',
      isVerified: false,
      level: 19,
    },
    content: {
      text: '😴 Наконец-то наладил сон! 8 часов качественного сна каждую ночь в течение 2 недель. Мои результаты: энергия +40%, продуктивность +55%, настроение +60%. Сон - это фундамент здоровья! #sleep #health #wellness',
      images: [],
      type: 'text',
      sleepData: {
        duration: '8h 15m',
        quality: 92,
        deepSleep: '2h 30m',
        remSleep: '2h 45m',
      },
    },
    metrics: {
      likes: 312,
      comments: 56,
      shares: 18,
      views: 1560,
    },
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    tags: ['sleep', 'health', 'wellness'],
    location: 'Новосибирск',
  },
  {
    id: 6,
    user: {
      id: 6,
      name: 'Ольга Морозова',
      username: '@olgamor',
      avatar: '🏃‍♀️',
      isVerified: true,
      level: 47,
    },
    content: {
      text: '🏃‍♀️ 1000км за год! Эта цель казалась недостижимой, но маленькими шагами я её достигла. Спасибо сообществу бегунов EthosLife за поддержку! #running #marathon #milestone',
      images: [
        'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=600',
      ],
      type: 'photo',
      achievement: {
        title: '1000 Kilometers Club',
        icon: '🏆',
        rarity: 'legendary',
      },
    },
    metrics: {
      likes: 789,
      comments: 134,
      shares: 56,
      views: 4500,
    },
    isLiked: true,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    tags: ['running', 'marathon', 'milestone'],
    location: 'Сочи',
  },
  {
    id: 7,
    user: {
      id: 7,
      name: 'Максим Лебедев',
      username: '@maxleb',
      avatar: '🧬',
      isVerified: false,
      level: 33,
    },
    content: {
      text: '🧬 Получил результаты генетического теста! Оказывается, у меня предрасположенность к выносливости, а не к силовым. Теперь понимаю, почему марафоны даются легче чем качалка. #genetics #fitness #biohacking',
      images: [],
      type: 'text',
      geneticData: {
        endurance: 85,
        strength: 45,
        recovery: 72,
        injuryRisk: 'low',
      },
    },
    metrics: {
      likes: 423,
      comments: 89,
      shares: 34,
      views: 2340,
    },
    isLiked: false,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 420), // 7 hours ago
    tags: ['genetics', 'fitness', 'biohacking'],
    location: 'Москва',
  },
  {
    id: 8,
    user: {
      id: 8,
      name: 'Наталья Иванова',
      username: '@natalyia',
      avatar: '🌿',
      isVerified: true,
      level: 56,
    },
    content: {
      text: '🌿 Качество воздуха в моей квартире улучшилось на 35% после установки очистителя и добавления растений. Мониторинг окружения в EthosLife реально помогает! #environment #wellness #airquality',
      images: [
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600',
      ],
      type: 'photo',
      environmentData: {
        aqi: 28,
        co2: 450,
        humidity: 45,
        temperature: 22,
      },
    },
    metrics: {
      likes: 267,
      comments: 41,
      shares: 15,
      views: 1120,
    },
    isLiked: true,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 600), // 10 hours ago
    tags: ['environment', 'wellness', 'airquality'],
    location: 'Владивосток',
  },
  {
    id: 9,
    user: {
      id: 9,
      name: 'Игорь Соколов',
      username: '@igorsok',
      avatar: '💊',
      isVerified: false,
      level: 28,
    },
    content: {
      text: '💊 Напоминания о приёме витаминов в EthosLife - это спасение! 90 дней без пропусков. Уровень витамина D вырос с 15 до 45 ng/ml. #supplements #health #vitamins',
      images: [],
      type: 'text',
      supplementData: {
        streak: 90,
        supplements: ['Vitamin D3', 'Omega-3', 'Magnesium', 'Zinc'],
      },
    },
    metrics: {
      likes: 198,
      comments: 28,
      shares: 9,
      views: 780,
    },
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 720), // 12 hours ago
    tags: ['supplements', 'health', 'vitamins'],
    location: 'Ростов-на-Дону',
  },
  {
    id: 10,
    user: {
      id: 10,
      name: 'Виктория Орлова',
      username: '@vikaorl',
      avatar: '🎯',
      isVerified: true,
      level: 62,
    },
    content: {
      text: '🎯 365 дней трекинга здоровья! Каждый день записывал питание, тренировки, сон и настроение. Итоги года в приложении. Это было лучшее инвестирование времени в себя! #yearend #health #tracking',
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
      ],
      type: 'photo',
      yearStats: {
        workouts: 287,
        avgSleep: '7h 42m',
        avgSteps: 9850,
        healthScore: 87,
      },
    },
    metrics: {
      likes: 1234,
      comments: 201,
      shares: 89,
      views: 6780,
    },
    isLiked: true,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 900), // 15 hours ago
    tags: ['yearend', 'health', 'tracking'],
    location: 'Москва',
  },
  {
    id: 11,
    user: {
      id: 11,
      name: 'Павел Зинченко',
      username: '@pavzin',
      avatar: '🚴',
      isVerified: false,
      level: 31,
    },
    content: {
      text: '🚴 Велосезон закрыт! 2500км за 6 месяцев. Средний темп улучшился с 28 до 32 км/ч. Зимой переключусь на лыжи. #cycling #cardio #season',
      images: ['https://images.unsplash.com/photo-1517649763962-0c6230658c3d?w=600'],
      type: 'photo',
    },
    metrics: {
      likes: 345,
      comments: 52,
      shares: 14,
      views: 1450,
    },
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 1200), // 20 hours ago
    tags: ['cycling', 'cardio', 'season'],
    location: 'Краснодар',
  },
  {
    id: 12,
    user: {
      id: 12,
      name: 'Анна Кузнецова',
      username: '@annakuz',
      avatar: '🏊‍♀️',
      isVerified: true,
      level: 44,
    },
    content: {
      text: '🏊‍♀️ Первый заплыв на 5км в открытой воде! Холодная вода (18°C) была испытанием, но я справилась. Триатлон ждёт! #swimming #triathlon #openwater',
      images: [
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600',
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600',
      ],
      type: 'photo',
    },
    metrics: {
      likes: 478,
      comments: 67,
      shares: 21,
      views: 2230,
    },
    isLiked: true,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 1440), // 24 hours ago
    tags: ['swimming', 'triathlon', 'openwater'],
    location: 'Геленджик',
  },
  {
    id: 13,
    user: {
      id: 13,
      name: 'Сергей Волков',
      username: '@servolk',
      avatar: '🥊',
      isVerified: false,
      level: 22,
    },
    content: {
      text: '🥊 6 месяцев бокса. Что изменилось: реакция +50%, выносливость +70%, уверенность +100%. Бокс - это шахматы в движении! #boxing #martialarts #fitness',
      images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600'],
      type: 'photo',
    },
    metrics: {
      likes: 289,
      comments: 43,
      shares: 11,
      views: 1340,
    },
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 1680), // 28 hours ago
    tags: ['boxing', 'martialarts', 'fitness'],
    location: 'Санкт-Петербург',
  },
  {
    id: 14,
    user: {
      id: 14,
      name: 'Юлия Медведева',
      username: '@julymed',
      avatar: '🧘',
      isVerified: true,
      level: 49,
    },
    content: {
      text: '🧘 Йога-ретрит в горах Алтая завершился! 7 дней без телефона, только практика, природа и самопознание. Вернулась другим человеком. #yoga #retreat #altai',
      images: [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
        'https://images.unsplash.com/photo-1599447421405-0c1a1141649b?w=600',
      ],
      type: 'photo',
    },
    metrics: {
      likes: 623,
      comments: 98,
      shares: 42,
      views: 3450,
    },
    isLiked: true,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 2160), // 36 hours ago
    tags: ['yoga', 'retreat', 'altai'],
    location: 'Алтай',
  },
  {
    id: 15,
    user: {
      id: 15,
      name: 'Роман Титов',
      username: '@romtit',
      avatar: '🏔️',
      isVerified: false,
      level: 36,
    },
    content: {
      text: '🏔️ Эльбрус покорён! 5642м над уровнем моря. Кислорода мало, но вид того стоит. Готовлюсь к Монтблану! #mountaineering #elbrus #climbing',
      images: [
        'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
      ],
      type: 'photo',
      achievement: {
        title: 'Elbrus Summit',
        icon: '🏔️',
        rarity: 'epic',
      },
    },
    metrics: {
      likes: 892,
      comments: 156,
      shares: 67,
      views: 5120,
    },
    isLiked: false,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 2880), // 48 hours ago
    tags: ['mountaineering', 'elbrus', 'climbing'],
    location: 'Эльбрус',
  },
  {
    id: 16,
    user: {
      id: 16,
      name: 'Екатерина Новик',
      username: '@katnov',
      avatar: '🎿',
      isVerified: true,
      level: 53,
    },
    content: {
      text: '🎿 Открыл горнолыжный сезон в Красной Поляне! Первый спуск после травмы колена - волнительно, но всё прошло отлично. Берегите себя! #skiing #krasnayapolyana #comeback',
      images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600'],
      type: 'photo',
    },
    metrics: {
      likes: 412,
      comments: 71,
      shares: 19,
      views: 1890,
    },
    isLiked: true,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 3600), // 60 hours ago
    tags: ['skiing', 'krasnayapolyana', 'comeback'],
    location: 'Красная Поляна',
  },
  {
    id: 17,
    user: {
      id: 17,
      name: 'Артём Соколов',
      username: '@artsok',
      avatar: '🤸',
      isVerified: false,
      level: 27,
    },
    content: {
      text: '🤸 Научился делать сальто назад в 35 лет! Никогда не поздно пробовать новое. Главное - правильный подход и страховка. #gymnastics #fitness #nevergiveup',
      images: [],
      type: 'video',
      video: {
        url: 'https://example.com/salto-video.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
        duration: 30,
      },
    },
    metrics: {
      likes: 534,
      comments: 87,
      shares: 28,
      views: 2670,
    },
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 4320), // 72 hours ago
    tags: ['gymnastics', 'fitness', 'nevergiveup'],
    location: 'Москва',
  },
  {
    id: 18,
    user: {
      id: 18,
      name: 'Дарья Лебедева',
      username: '@darleb',
      avatar: '🏹',
      isVerified: true,
      level: 41,
    },
    content: {
      text: '🏹 Стрельба из лука - новый вид спорта в моей жизни. Оказывается, это отличная тренировка концентрации и верхней части тела. #archery #newsport #focus',
      images: ['https://images.unsplash.com/photo-1595204129850-c8e27280589c?w=600'],
      type: 'photo',
    },
    metrics: {
      likes: 276,
      comments: 39,
      shares: 12,
      views: 1120,
    },
    isLiked: true,
    isSaved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5040), // 84 hours ago
    tags: ['archery', 'newsport', 'focus'],
    location: 'Казань',
  },
  {
    id: 19,
    user: {
      id: 19,
      name: 'Николай Фёдоров',
      username: '@nikfed',
      avatar: '🚣',
      isVerified: false,
      level: 34,
    },
    content: {
      text: '🚣 Сплав на байдарках по Катуни - 5 дней полной перезагрузки. Природа, друзья, вечерние костры и никаких уведомлений! #kayaking #altai #digitaldetox',
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600',
      ],
      type: 'photo',
    },
    metrics: {
      likes: 398,
      comments: 58,
      shares: 22,
      views: 1780,
    },
    isLiked: false,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 5760), // 96 hours ago
    tags: ['kayaking', 'altai', 'digitaldetox'],
    location: 'Алтай, Катунь',
  },
  {
    id: 20,
    user: {
      id: 20,
      name: 'Кристина Орлова',
      username: '@krisorl',
      avatar: '🧗‍♀️',
      isVerified: true,
      level: 58,
    },
    content: {
      text: '🧗‍♀️ Первая категория по скалолазанию получена! 2 года тренировок, сотни падений и один момент триумфа. Следующая цель - КМС! #climbing #bouldering #achievement',
      images: [
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600',
        'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600',
      ],
      type: 'photo',
      achievement: {
        title: 'First Category',
        icon: '🥇',
        rarity: 'rare',
      },
    },
    metrics: {
      likes: 567,
      comments: 94,
      shares: 31,
      views: 2890,
    },
    isLiked: true,
    isSaved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 6480), // 108 hours ago
    tags: ['climbing', 'bouldering', 'achievement'],
    location: 'Москва',
  },
];

const generateTrendingTopics = () => [
  { id: 1, tag: '#fitness', posts: 12450, trend: '+15%', color: '#e94560' },
  { id: 2, tag: '#nutrition', posts: 8920, trend: '+22%', color: '#00ff88' },
  { id: 3, tag: '#meditation', posts: 6780, trend: '+18%', color: '#9d4edd' },
  { id: 4, tag: '#running', posts: 5430, trend: '+12%', color: '#00d9ff' },
  { id: 5, tag: '#yoga', posts: 4890, trend: '+25%', color: '#f0a500' },
  { id: 6, tag: '#sleep', posts: 3210, trend: '+8%', color: '#00d9ff' },
  { id: 7, tag: '#mentalhealth', posts: 2980, trend: '+30%', color: '#e94560' },
  { id: 8, tag: '#biohacking', posts: 2450, trend: '+35%', color: '#00ff88' },
];

const generateSuggestions = () => [
  { id: 101, name: 'Фитнес Бот', username: '@fitnessbot', avatar: '🤖', mutualFriends: 45, reason: 'Тренируется в том же зале' },
  { id: 102, name: 'Нутрициолог Анна', username: '@nutrianna', avatar: '🥑', mutualFriends: 23, reason: 'Эксперт по питанию' },
  { id: 103, name: 'Йога Студия', username: '@yogastudio', avatar: '🧘', mutualFriends: 67, reason: 'Популярно в вашем городе' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} дн назад`;
  return date.toLocaleDateString('ru-RU');
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Unity Balance Widget
const UnityBalanceWidget = () => {
  const [balance, setBalance] = useState(1250.75);
  const [staked, setStaked] = useState(500);
  const [rewards, setRewards] = useState(75.25);

  return (
    <div className="holo-display" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ 
          fontFamily: 'Orbitron', 
          fontSize: '16px', 
          color: 'var(--retro-cyan)',
          textShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
          margin: 0 
        }}>
          💎 UNITY BALANCE
        </h3>
        <span style={{ 
          fontSize: '12px', 
          color: 'var(--retro-green)',
          textShadow: '0 0 5px rgba(0, 255, 136, 0.5)'
        }}>
          +{((rewards / staked) * 100).toFixed(1)}% APY
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Balance</div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'var(--retro-cyan)',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
          }}>
            {balance.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Staked</div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'var(--retro-purple)'
          }}>
            {staked.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Rewards</div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'var(--retro-green)'
          }}>
            +{rewards.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Daily Streak Widget
const DailyStreakWidget = () => {
  const [days, setDays] = useState(47);
  const [milestone, setMilestone] = useState(30);
  const nextMilestone = 60;

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ 
          fontSize: '40px', 
          filter: 'drop-shadow(0 0 10px rgba(255, 107, 107, 0.5))',
          animation: 'float 3s ease-in-out infinite'
        }}>
          🔥
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Daily Streak</div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            background: 'var(--gradient-fire)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {days} дней
          </div>
          <div style={{ fontSize: '12px', color: 'var(--retro-gold)', marginTop: '5px' }}>
            Следующая цель: {nextMilestone} дней → +500 UNITY
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div style={{ 
        marginTop: '15px', 
        height: '8px', 
        background: 'rgba(0,0,0,0.3)', 
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${((days % 30) / 30) * 100}%`,
          height: '100%',
          background: 'var(--gradient-fire)',
          borderRadius: '4px',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 10px rgba(255, 107, 53, 0.5)'
        }} />
      </div>
    </div>
  );
};

// Activity Ring Widget
const ActivityRingWidget = () => {
  const rings = [
    { label: 'Calories', value: 450, goal: 600, color: '#e94560', icon: '🔥' },
    { label: 'Steps', value: 8500, goal: 10000, color: '#00ff88', icon: '👟' },
    { label: 'Active Min', value: 45, goal: 60, color: '#00d9ff', icon: '⏱️' },
  ];

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '14px', 
        color: '#fff',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>📊</span> Activity Rings
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {rings.map((ring, index) => {
          const percentage = (ring.value / ring.goal) * 100;
          const circumference = 2 * Math.PI * 35;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke={ring.color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ 
                      transition: 'stroke-dashoffset 1s ease',
                      filter: `drop-shadow(0 0 5px ${ring.color})`
                    }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '20px'
                }}>
                  {ring.icon}
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '8px' }}>{ring.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: ring.color }}>
                {ring.value}/{ring.goal >= 1000 ? `${ring.goal/1000}K` : ring.goal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Notifications Widget
const NotificationsWidget = ({ onClose }) => {
  const notifications = [
    { id: 1, type: 'like', user: 'Александр В.', content: 'понравился ваш пост', time: '5м', read: false },
    { id: 2, type: 'comment', user: 'Мария К.', content: 'прокомментировала ваш пост', time: '15м', read: false },
    { id: 3, type: 'follow', user: 'Дмитрий П.', content: 'начал следить за вами', time: '1ч', read: true },
    { id: 4, type: 'achievement', user: 'Вы', content: 'получили достижение "Марафонец"', time: '2ч', read: true },
    { id: 5, type: 'challenge', user: 'Система', content: 'Новый челлендж доступен!', time: '3ч', read: true },
  ];

  return (
    <div className="neu-card" style={{ 
      position: 'fixed', 
      top: '80px', 
      right: '20px', 
      width: '350px', 
      zIndex: 1000,
      maxHeight: '500px',
      overflow: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px',
        borderBottom: '1px solid rgba(0, 217, 255, 0.2)'
      }}>
        <h3 style={{ 
          fontFamily: 'Orbitron', 
          fontSize: '14px', 
          color: 'var(--retro-cyan)',
          margin: 0 
        }}>
          🔔 Уведомления
        </h3>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#888', 
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>
      
      <div>
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            style={{ 
              padding: '12px 15px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: !notif.read ? 'rgba(0, 217, 255, 0.05)' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = !notif.read ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.02)'}
            onMouseLeave={(e) => e.target.style.background = !notif.read ? 'rgba(0, 217, 255, 0.05)' : 'transparent'}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                fontSize: '24px',
                filter: !notif.read ? 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.5))' : 'none'
              }}>
                {notif.type === 'like' && '❤️'}
                {notif.type === 'comment' && '💬'}
                {notif.type === 'follow' && '👤'}
                {notif.type === 'achievement' && '🏆'}
                {notif.type === 'challenge' && '🎯'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#ddd' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{notif.user}</span>{' '}
                  <span style={{ color: '#888' }}>{notif.content}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{notif.time}</div>
              </div>
              {!notif.read && (
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: 'var(--retro-cyan)',
                  boxShadow: '0 0 8px rgba(0, 217, 255, 0.8)',
                  flexShrink: 0
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ padding: '12px 15px', textAlign: 'center' }}>
        <button className="neon-button" style={{ fontSize: '12px', padding: '8px 16px' }}>
          Пометить все как прочитанные
        </button>
      </div>
    </div>
  );
};

// Create Post Component
const CreatePost = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [postType, setPostType] = useState('text');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isHologram, setIsHologram] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handleImageUpload = () => {
    // Simulation of image upload
    const mockImages = [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
      'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=600',
    ];
    setSelectedImages([...selectedImages, mockImages[selectedImages.length % mockImages.length]]);
  };

  const handlePost = () => {
    if (content.trim() || selectedImages.length > 0) {
      onPost({
        content,
        images: selectedImages,
        type: postType,
        hologram: isHologram,
      });
      setContent('');
      setSelectedImages([]);
      setIsExpanded(false);
      setCharCount(0);
    }
  };

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          border: '2px solid var(--retro-cyan)',
          boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)'
        }}>
          👤
        </div>
        
        <div style={{ flex: 1 }}>
          {!isExpanded ? (
            <div 
              onClick={() => setIsExpanded(true)}
              style={{ 
                padding: '15px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.3)'}
            >
              Поделитесь своими достижениями...
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Что у вас нового? Расскажите о своих достижениях, целях или мыслях..."
                maxLength={maxChars}
                style={{ 
                  width: '100%',
                  minHeight: '120px',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--retro-cyan)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
              />
              
              {/* Character count */}
              <div style={{ 
                textAlign: 'right', 
                fontSize: '12px', 
                color: charCount > maxChars * 0.9 ? 'var(--retro-highlight)' : '#666',
                marginTop: '8px'
              }}>
                {charCount}/{maxChars}
              </div>

              {/* Selected images preview */}
              {selectedImages.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                  gap: '10px', 
                  marginTop: '15px' 
                }}>
                  {selectedImages.map((img, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={img} 
                        alt="" 
                        style={{ 
                          width: '100%', 
                          height: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 217, 255, 0.2)'
                        }} 
                      />
                      <button
                        onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'rgba(0,0,0,0.7)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '15px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleImageUpload}
                    className="neon-button"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    📷 Фото
                  </button>
                  <button
                    onClick={() => setPostType(postType === 'text' ? 'video' : 'text')}
                    className="neon-button"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    🎥 Видео
                  </button>
                  <button
                    onClick={() => setIsHologram(!isHologram)}
                    className={`neon-button ${isHologram ? 'neon-button-purple' : ''}`}
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    🌟 Голограмма {isHologram && '✓'}
                  </button>
                  <button
                    className="neon-button"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    😊 Emoji
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setIsExpanded(false)}
                    style={{ 
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: '#888',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--retro-highlight)';
                      e.target.style.color = 'var(--retro-highlight)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.target.style.color = '#888';
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handlePost}
                    className="neon-button neon-button-primary"
                    style={{ fontSize: '12px', padding: '8px 24px' }}
                    disabled={!content.trim() && selectedImages.length === 0}
                  >
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, onLike, onSave, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'Мария К.', avatar: '🧘‍♀️', content: 'Отличный результат! Так держать! 💪', likes: 12, time: '2м' },
    { id: 2, user: 'Дмитрий П.', avatar: '🏋️', content: 'Вдохновляешь! Я тоже хочу начать готовиться к марафону', likes: 8, time: '5м' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        user: 'Вы',
        avatar: '👤',
        content: newComment,
        likes: 0,
        time: 'только что'
      }]);
      setNewComment('');
      onComment(post.id);
    }
  };

  return (
    <div 
      className="neu-card"
      style={{ 
        padding: '20px', 
        marginBottom: '20px',
        opacity: isHovered ? 1 : 0.95,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            border: '2px solid var(--retro-cyan)',
            boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)',
            position: 'relative'
          }}>
            {post.user.avatar}
            {post.user.isVerified && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: 'var(--retro-cyan)',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                border: '2px solid var(--retro-bg)'
              }}>
                ✓
              </div>
            )}
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>
                {post.user.name}
              </span>
              {post.user.isVerified && (
                <span style={{ color: 'var(--retro-cyan)', fontSize: '14px' }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {post.user.username} • {formatTimeAgo(post.timestamp)}
              {post.location && (
                <span style={{ marginLeft: '8px' }}>
                  📍 {post.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <button style={{ 
          background: 'transparent', 
          border: 'none', 
          color: '#666', 
          cursor: 'pointer',
          fontSize: '18px',
          padding: '5px'
        }}>
          ⋯
        </button>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '15px' }}>
        <p style={{ 
          color: '#e0e0e0', 
          lineHeight: '1.6', 
          fontSize: '15px',
          whiteSpace: 'pre-wrap'
        }}>
          {post.content.text}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                style={{ 
                  color: 'var(--retro-cyan)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--retro-highlight)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--retro-cyan)'}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Images */}
        {post.content.images && post.content.images.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${post.content.images.length > 2 ? 3 : post.content.images.length}, 1fr)`,
            gap: '10px',
            marginTop: '15px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {post.content.images.map((img, index) => (
              <div 
                key={index} 
                style={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  cursor: 'pointer'
                }}
              >
                <img 
                  src={img} 
                  alt="" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                {index === 0 && post.content.images.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#fff'
                  }}>
                    +{post.content.images.length - 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hologram indicator */}
        {post.content.hologram?.enabled && (
          <div style={{ 
            marginTop: '15px',
            padding: '15px',
            background: 'rgba(157, 78, 221, 0.1)',
            border: '1px solid rgba(157, 78, 221, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              fontSize: '30px',
              animation: 'float 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 10px rgba(157, 78, 221, 0.5))'
            }}>
              🧘
            </div>
            <div>
              <div style={{ color: 'var(--retro-purple)', fontWeight: 'bold', fontSize: '13px' }}>
                3D Hologram Available
              </div>
              <div style={{ color: '#888', fontSize: '12px' }}>
                Нажмите для просмотра в AR
              </div>
            </div>
          </div>
        )}

        {/* Achievement badge */}
        {post.content.achievement && (
          <div style={{ 
            marginTop: '15px',
            padding: '15px',
            background: `linear-gradient(135deg, rgba(${post.content.achievement.rarity === 'legendary' ? '240, 165, 0' : post.content.achievement.rarity === 'epic' ? '157, 78, 221' : '0, 217, 255'}, 0.1), rgba(0,0,0,0.2))`,
            border: `2px solid ${post.content.achievement.rarity === 'legendary' ? 'var(--retro-gold)' : post.content.achievement.rarity === 'epic' ? 'var(--retro-purple)' : 'var(--retro-cyan)'}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ 
              fontSize: '40px',
              filter: `drop-shadow(0 0 15px ${post.content.achievement.rarity === 'legendary' ? 'var(--retro-gold)' : post.content.achievement.rarity === 'epic' ? 'var(--retro-purple)' : 'var(--retro-cyan)'})`,
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}>
              {post.content.achievement.icon}
            </div>
            <div>
              <div style={{ 
                color: post.content.achievement.rarity === 'legendary' ? 'var(--retro-gold)' : post.content.achievement.rarity === 'epic' ? 'var(--retro-purple)' : 'var(--retro-cyan)',
                fontWeight: 'bold',
                fontSize: '14px',
                textShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}>
                🏆 {post.content.achievement.title}
              </div>
              <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>
                {post.content.achievement.rarity} Achievement
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        padding: '12px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ fontSize: '13px', color: '#888' }}>
          <span style={{ color: 'var(--retro-highlight)', fontWeight: 'bold' }}>{formatNumber(post.metrics.likes)}</span> лайков
        </div>
        <div style={{ fontSize: '13px', color: '#888' }}>
          <span style={{ color: 'var(--retro-cyan)', fontWeight: 'bold' }}>{formatNumber(post.metrics.comments)}</span> комментариев
        </div>
        <div style={{ fontSize: '13px', color: '#888' }}>
          <span style={{ color: 'var(--retro-purple)', fontWeight: 'bold' }}>{formatNumber(post.metrics.shares)}</span> репостов
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
        <button
          onClick={() => onLike(post.id)}
          className={`like-button ${post.isLiked ? 'liked' : ''}`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}
        >
          <span className="heart-icon" style={{ 
            fontSize: '20px', 
            color: post.isLiked ? 'var(--retro-highlight)' : '#888',
            transition: 'all 0.3s'
          }}>
            {post.isLiked ? '❤️' : '🤍'}
          </span>
          <span style={{ color: post.isLiked ? 'var(--retro-highlight)' : '#888', fontSize: '14px' }}>
            Лайк
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(0, 217, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <span style={{ fontSize: '20px', color: 'var(--retro-cyan)' }}>💬</span>
          <span style={{ color: 'var(--retro-cyan)', fontSize: '14px' }}>Коммент</span>
        </button>

        <button
          onClick={() => onShare(post.id)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(157, 78, 221, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <span style={{ fontSize: '20px', color: 'var(--retro-purple)' }}>🔗</span>
          <span style={{ color: 'var(--retro-purple)', fontSize: '14px' }}>Поделиться</span>
        </button>

        <button
          onClick={() => onSave(post.id)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(240, 165, 0, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <span style={{ fontSize: '20px', color: post.isSaved ? 'var(--retro-gold)' : '#888' }}>
            {post.isSaved ? '🔖' : '📑'}
          </span>
          <span style={{ color: post.isSaved ? 'var(--retro-gold)' : '#888', fontSize: '14px' }}>
            {post.isSaved ? 'Сохранено' : 'Сохранить'}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ 
          marginTop: '15px', 
          paddingTop: '15px', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {/* Add Comment */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              border: '2px solid var(--retro-cyan)'
            }}>
              👤
            </div>
            <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Написать комментарий..."
                style={{ 
                  flex: 1,
                  padding: '10px 15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  borderRadius: '20px',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="neon-button"
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                ➤
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {comment.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    background: 'rgba(0,0,0,0.2)', 
                    padding: '12px', 
                    borderRadius: '12px',
                    borderTopLeftRadius: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>
                        {comment.user}
                      </span>
                      <span style={{ fontSize: '11px', color: '#666' }}>{comment.time}</span>
                    </div>
                    <div style={{ color: '#e0e0e0', fontSize: '14px', lineHeight: '1.4' }}>
                      {comment.content}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    marginTop: '6px', 
                    paddingLeft: '12px' 
                  }}>
                    <button style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#666', 
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      🤍 {comment.likes}
                    </button>
                    <button style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#666', 
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      Ответить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Trending Topics Sidebar
const TrendingTopics = () => {
  const topics = generateTrendingTopics();

  return (
    <div className="neu-card" style={{ padding: '20px' }}>
      <h3 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '16px', 
        color: '#fff',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '20px' }}>🔥</span> Trending Topics
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {topics.map((topic, index) => (
          <div 
            key={topic.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '10px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
              e.target.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: 'rgba(255,255,255,0.2)',
              minWidth: '24px'
            }}>
              #{index + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                color: topic.color,
                fontWeight: 'bold',
                fontSize: '14px',
                textShadow: `0 0 10px ${topic.color}40`
              }}>
                {topic.tag}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {formatNumber(topic.posts)} постов
              </div>
            </div>
            <div style={{ 
              color: 'var(--retro-green)',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(0, 255, 136, 0.5)'
            }}>
              {topic.trend}
            </div>
          </div>
        ))}
      </div>

      <button 
        className="neon-button" 
        style={{ 
          width: '100%', 
          marginTop: '20px',
          fontSize: '12px',
          padding: '10px'
        }}
      >
        Показать все тренды
      </button>
    </div>
  );
};

// Suggestions Widget
const SuggestionsWidget = () => {
  const suggestions = generateSuggestions();

  return (
    <div className="neu-card" style={{ padding: '20px', marginTop: '20px' }}>
      <h3 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '16px', 
        color: '#fff',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '20px' }}>👥</span> Рекомендации
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {suggestions.map((user) => (
          <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              border: '2px solid var(--retro-cyan)'
            }}>
              {user.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {user.mutualFriends} общих друзей
              </div>
              <div style={{ fontSize: '11px', color: 'var(--retro-cyan)', marginTop: '4px' }}>
                {user.reason}
              </div>
            </div>
            <button 
              className="neon-button"
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Filter Tabs
const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'Все', icon: '📰' },
    { id: 'following', label: 'Подписки', icon: '👥' },
    { id: 'popular', label: 'Популярное', icon: '🔥' },
    { id: 'trending', label: 'Тренды', icon: '📈' },
  ];

  return (
    <div className="neu-card" style={{ padding: '15px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            style={{
              padding: '10px 20px',
              background: activeFilter === filter.id ? 'var(--gradient-cyber)' : 'rgba(0,0,0,0.3)',
              border: activeFilter === filter.id ? '2px solid var(--retro-cyan)' : '2px solid transparent',
              borderRadius: '25px',
              color: activeFilter === filter.id ? '#fff' : '#888',
              fontFamily: 'Orbitron',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== filter.id) {
                e.target.style.background = 'rgba(0, 217, 255, 0.1)';
                e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== filter.id) {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.borderColor = 'transparent';
              }
            }}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Live Activity Indicator
const LiveActivityIndicator = () => {
  const [activeUsers, setActiveUsers] = useState(12847);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 20) - 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '8px 16px',
      background: 'rgba(0, 255, 136, 0.1)',
      borderRadius: '20px',
      border: '1px solid rgba(0, 255, 136, 0.3)'
    }}>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '50%', 
        background: 'var(--retro-green)',
        boxShadow: '0 0 10px rgba(0, 255, 136, 0.8)',
        animation: 'pulse-glow 1.5s ease-in-out infinite'
      }} />
      <span style={{ 
        color: 'var(--retro-green)', 
        fontSize: '12px',
        fontWeight: 'bold',
        textShadow: '0 0 5px rgba(0, 255, 136, 0.5)'
      }}>
        {activeUsers.toLocaleString()} онлайн
      </span>
    </div>
  );
};

// Infinite Scroll Loader
const InfiniteScrollLoader = () => (
  <div style={{ 
    padding: '30px', 
    textAlign: 'center',
    color: '#666'
  }}>
    <div style={{ 
      display: 'inline-block',
      width: '40px',
      height: '40px',
      border: '3px solid rgba(0, 217, 255, 0.2)',
      borderTop: '3px solid var(--retro-cyan)',
      borderRadius: '50%',
      animation: 'spin-slow 1s linear infinite',
      boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'
    }} />
    <div style={{ marginTop: '15px', fontSize: '14px' }}>
      Загрузка постов...
    </div>
  </div>
);

// Toast Notification
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      padding: '16px 24px',
      background: type === 'success' ? 'rgba(0, 255, 136, 0.9)' : type === 'error' ? 'rgba(233, 69, 96, 0.9)' : 'rgba(0, 217, 255, 0.9)',
      borderRadius: '12px',
      color: '#fff',
      fontWeight: 'bold',
      boxShadow: `0 0 30px ${type === 'success' ? 'rgba(0, 255, 136, 0.5)' : type === 'error' ? 'rgba(233, 69, 96, 0.5)' : 'rgba(0, 217, 255, 0.5)'}`,
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease-out',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <span style={{ fontSize: '20px' }}>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      {message}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const SocialFeedV1 = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState(null);
  const feedRef = useRef(null);
  const [page, setPage] = useState(1);

  // Load initial posts
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPosts = generateMockPosts();
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  // Filter posts
  useEffect(() => {
    let filtered = [...posts];
    
    switch (activeFilter) {
      case 'following':
        filtered = filtered.filter(p => p.user.isVerified);
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.metrics.likes - a.metrics.likes);
        break;
      case 'trending':
        filtered = filtered.sort((a, b) => b.metrics.views - a.metrics.views);
        break;
      default:
        break;
    }
    
    setFilteredPosts(filtered);
  }, [activeFilter, posts]);

  // Infinite scroll simulation
  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
          // Load more posts
          loadMorePosts();
        }
      }
    };

    const ref = feedRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [page]);

  const loadMorePosts = () => {
    // Simulate loading more posts
    setPage(prev => prev + 1);
    // In real app, fetch more posts from API
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          metrics: {
            ...post.metrics,
            likes: post.isLiked ? post.metrics.likes - 1 : post.metrics.likes + 1
          }
        };
      }
      return post;
    }));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    }));
    setToast({ 
      message: posts.find(p => p.id === postId)?.isSaved ? 'Удалено из сохранённых' : 'Сохранено в закладки', 
      type: 'info' 
    });
  };

  const handleComment = (postId) => {
    setToast({ message: 'Комментарий добавлен', type: 'success' });
  };

  const handleShare = (postId) => {
    setToast({ message: 'Ссылка скопирована в буфер обмена', type: 'success' });
  };

  const handleNewPost = (postData) => {
    const newPost = {
      id: Date.now(),
      user: {
        id: 0,
        name: 'Вы',
        username: '@you',
        avatar: '👤',
        isVerified: false,
        level: 1,
      },
      content: postData,
      metrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
      },
      isLiked: false,
      isSaved: false,
      timestamp: new Date(),
      tags: [],
    };
    
    setPosts([newPost, ...posts]);
    setToast({ message: 'Пост опубликован', type: 'success' });
  };

  return (
    <div className="social-v1-container">
      {/* Retro Grid Background */}
      <div className="retro-grid-bg" />

      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        background: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 217, 255, 0.2)',
        padding: '15px 0'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/social-v1" style={{ 
              fontSize: '28px', 
              fontWeight: 'bold',
              background: 'var(--gradient-neon)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              fontFamily: 'Orbitron'
            }}>
              ⚡ EthosLife Social
            </Link>
            <LiveActivityIndicator />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              className="neon-button"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              🔍 Поиск
            </button>
            <button 
              className="neon-button neon-button-primary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
            </button>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              border: '2px solid var(--retro-cyan)',
              cursor: 'pointer'
            }}>
              👤
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <NotificationsWidget onClose={() => setShowNotifications(false)} />
      )}

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Feed Column */}
        <div 
          ref={feedRef}
          style={{ 
            minHeight: 'calc(100vh - 150px)',
            overflowY: 'auto',
            paddingRight: '10px'
          }}
        >
          {/* Widgets Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            <UnityBalanceWidget />
            <DailyStreakWidget />
            <ActivityRingWidget />
          </div>

          {/* Create Post */}
          <CreatePost onPost={handleNewPost} />

          {/* Filter Tabs */}
          <FilterTabs 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />

          {/* Posts Feed */}
          {isLoading ? (
            <InfiniteScrollLoader />
          ) : (
            <>
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onSave={handleSave}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
              <InfiniteScrollLoader />
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <TrendingTopics />
          <SuggestionsWidget />

          {/* Quick Links */}
          <div className="neu-card" style={{ padding: '20px', marginTop: '20px' }}>
            <h3 style={{ 
              fontFamily: 'Orbitron', 
              fontSize: '16px', 
              color: '#fff',
              marginBottom: '15px'
            }}>
              🧭 Навигация
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/social/groups-v1" style={{ 
                padding: '12px',
                background: 'rgba(0, 217, 255, 0.1)',
                borderRadius: '10px',
                color: 'var(--retro-cyan)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 217, 255, 0.2)';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 217, 255, 0.1)';
                e.target.style.transform = 'translateX(0)';
              }}>
                <span style={{ fontSize: '18px' }}>👥</span>
                <span>Сообщества</span>
              </Link>
              <Link to="/social/challenges-v1" style={{ 
                padding: '12px',
                background: 'rgba(233, 69, 96, 0.1)',
                borderRadius: '10px',
                color: 'var(--retro-highlight)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(233, 69, 96, 0.2)';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(233, 69, 96, 0.1)';
                e.target.style.transform = 'translateX(0)';
              }}>
                <span style={{ fontSize: '18px' }}>🎯</span>
                <span>Челленджи</span>
              </Link>
              <Link to="/social/leaders-v1" style={{ 
                padding: '12px',
                background: 'rgba(240, 165, 0, 0.1)',
                borderRadius: '10px',
                color: 'var(--retro-gold)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(240, 165, 0, 0.2)';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(240, 165, 0, 0.1)';
                e.target.style.transform = 'translateX(0)';
              }}>
                <span style={{ fontSize: '18px' }}>🏆</span>
                <span>Лидерборды</span>
              </Link>
              <Link to="/social/messages-v1" style={{ 
                padding: '12px',
                background: 'rgba(157, 78, 221, 0.1)',
                borderRadius: '10px',
                color: 'var(--retro-purple)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(157, 78, 221, 0.2)';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(157, 78, 221, 0.1)';
                e.target.style.transform = 'translateX(0)';
              }}>
                <span style={{ fontSize: '18px' }}>💬</span>
                <span>Сообщения</span>
              </Link>
              <Link to="/social/friends-v1" style={{ 
                padding: '12px',
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '10px',
                color: 'var(--retro-green)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 255, 136, 0.2)';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                e.target.style.transform = 'translateX(0)';
              }}>
                <span style={{ fontSize: '18px' }}>👫</span>
                <span>Друзья</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default SocialFeedV1;
