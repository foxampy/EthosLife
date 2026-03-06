import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

/**
 * NotificationsV1 - Центр уведомлений
 * Управление всеми уведомлениями платформы
 */

// ============================================
// MOCK DATA
// ============================================

const generateNotifications = () => [
  {
    id: 1,
    type: 'achievement',
    title: 'Новое достижение!',
    message: 'Вы получили достижение "Ранняя пташка" за 7 утренних тренировок подряд',
    icon: '🏆',
    time: '2 минуты назад',
    read: false,
    priority: 'high',
    action: { label: 'Посмотреть', link: '/achievements-v1' },
    category: 'achievements',
  },
  {
    id: 2,
    type: 'health',
    title: 'Цель по шагам достигнута',
    message: 'Поздравляем! Вы прошли 10,000 шагов сегодня',
    icon: '👟',
    time: '1 час назад',
    read: false,
    priority: 'medium',
    action: { label: 'Отлично!', link: '/activity-v1' },
    category: 'health',
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Пора пить воду',
    message: 'Вы не пили воду уже 2 часа. Не забывайте о водном балансе!',
    icon: '💧',
    time: '2 часа назад',
    read: true,
    priority: 'low',
    action: { label: 'Отметить', link: '/health/nutrition' },
    category: 'reminders',
  },
  {
    id: 4,
    type: 'social',
    title: 'Новый подписчик',
    message: '@health_enthusiast начал следить за вашим прогрессом',
    icon: '👤',
    time: '3 часа назад',
    read: false,
    priority: 'medium',
    action: { label: 'Профиль', link: '/social' },
    category: 'social',
  },
  {
    id: 5,
    type: 'system',
    title: 'Обновление платформы',
    message: 'Доступны новые функции в разделе AI-аналитики',
    icon: '🚀',
    time: '5 часов назад',
    read: true,
    priority: 'low',
    action: { label: 'Попробовать', link: '/ai-chat' },
    category: 'system',
  },
  {
    id: 6,
    type: 'reward',
    title: 'Награда за стейкинг',
    message: 'Вы получили 25 UNITY токенов в качестве награды за стейкинг',
    icon: '🎁',
    time: '1 день назад',
    read: true,
    priority: 'high',
    action: { label: 'Кошелёк', link: '/wallet-v1' },
    category: 'rewards',
  },
  {
    id: 7,
    type: 'health',
    title: 'Превышен лимит калорий',
    message: 'Вы превысили дневной лимит калорий на 150 ккал',
    icon: '⚠️',
    time: '1 день назад',
    read: false,
    priority: 'medium',
    action: { label: 'Дневник', link: '/health/nutrition' },
    category: 'health',
  },
  {
    id: 8,
    type: 'social',
    title: 'Вас упомянули',
    message: '@coach_mike упомянул вас в комментарии: "Отличный прогресс!"',
    icon: '💬',
    time: '2 дня назад',
    read: true,
    priority: 'medium',
    action: { label: 'Ответить', link: '/social' },
    category: 'mentions',
  },
  {
    id: 9,
    type: 'achievement',
    title: 'Серия дней!',
    message: 'Ваша серия входа в приложение составляет 30 дней!',
    icon: '🔥',
    time: '2 дня назад',
    read: true,
    priority: 'high',
    action: { label: 'Продолжить', link: '/dashboard-v1' },
    category: 'achievements',
  },
  {
    id: 10,
    type: 'reminder',
    title: 'Время ложиться спать',
    message: 'Для качественного сна рекомендуется лечь до 23:00',
    icon: '😴',
    time: '3 дня назад',
    read: true,
    priority: 'low',
    action: { label: 'Трекер сна', link: '/health/sleep' },
    category: 'reminders',
  },
  {
    id: 11,
    type: 'system',
    title: 'Безопасность аккаунта',
    message: 'Ваш аккаунт был авторизован на новом устройстве',
    icon: '🔐',
    time: '3 дня назад',
    read: true,
    priority: 'high',
    action: { label: 'Проверить', link: '/settings' },
    category: 'system',
  },
  {
    id: 12,
    type: 'health',
    title: 'Неделя без сахара',
    message: 'Поздравляем! Вы неделю не употребляли добавленный сахар',
    icon: '🎉',
    time: '4 дня назад',
    read: false,
    priority: 'high',
    action: { label: 'Статистика', link: '/health/nutrition' },
    category: 'health',
  },
];

const generateNotificationSettings = () => [
  {
    id: 'health_goals',
    label: 'Достижение целей',
    description: 'Уведомления о достижении дневных целей',
    enabled: true,
    category: 'health',
  },
  {
    id: 'reminders',
    label: 'Напоминания',
    description: 'Напоминания о воде, сне, тренировках',
    enabled: true,
    category: 'reminders',
  },
  {
    id: 'achievements',
    label: 'Достижения',
    description: 'Уведомления о новых достижениях',
    enabled: true,
    category: 'achievements',
  },
  {
    id: 'social',
    label: 'Социальные',
    description: 'Подписчики, упоминания, комментарии',
    enabled: true,
    category: 'social',
  },
  {
    id: 'rewards',
    label: 'Награды',
    description: 'Токены, стейкинг, бонусы',
    enabled: true,
    category: 'rewards',
  },
  {
    id: 'system',
    label: 'Системные',
    description: 'Обновления, безопасность, важные сообщения',
    enabled: true,
    category: 'system',
  },
  {
    id: 'marketing',
    label: 'Маркетинг',
    description: 'Акции, новые функции, предложения',
    enabled: false,
    category: 'system',
  },
  {
    id: 'newsletter',
    label: 'Рассылка',
    description: 'Еженедельный дайджест здоровья',
    enabled: false,
    category: 'system',
  },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * NotificationCard - Карточка уведомления
 */
const NotificationCard = ({ notification, onMarkRead, onMarkUnread, onDelete }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return { border: 'border-red-200', bg: 'bg-red-50', dot: 'bg-red-500' };
      case 'medium':
        return { border: 'border-amber-200', bg: 'bg-amber-50', dot: 'bg-amber-500' };
      case 'low':
        return { border: 'border-stone/10', bg: 'bg-sand/30', dot: 'bg-stone' };
      default:
        return { border: 'border-stone/10', bg: 'bg-sand/30', dot: 'bg-stone' };
    }
  };

  const styles = getPriorityStyles(notification.priority);
  const isUnread = !notification.read;

  return (
    <div
      className={`neu-card p-4 transition-all hover:shadow-lg ${
        isUnread ? `${styles.bg} border-l-4 ${styles.border}` : 'opacity-75'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center text-2xl">
            {notification.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`font-semibold text-stone ${isUnread ? '' : 'text-ink-light'}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-ink mt-1">{notification.message}</p>
            </div>
            {isUnread && (
              <div className={`w-2 h-2 ${styles.dot} rounded-full flex-shrink-0 mt-2`} />
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-ink-light">{notification.time}</span>
            <div className="flex items-center space-x-2">
              {notification.action && (
                <Link
                  to={notification.action.link}
                  className="text-xs font-medium text-stone hover:text-ink transition-colors"
                >
                  {notification.action.label} →
                </Link>
              )}
              <div className="flex items-center space-x-1">
                {isUnread ? (
                  <button
                    onClick={() => onMarkRead(notification.id)}
                    className="text-xs px-2 py-1 rounded-lg bg-sand/50 hover:bg-sand transition-all"
                  >
                    ✓
                  </button>
                ) : (
                  <button
                    onClick={() => onMarkUnread(notification.id)}
                    className="text-xs px-2 py-1 rounded-lg bg-sand/50 hover:bg-sand transition-all"
                  >
                    ◐
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.id)}
                  className="text-xs px-2 py-1 rounded-lg bg-sand/50 hover:bg-red-100 hover:text-red-600 transition-all"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * NotificationTab - Вкладка уведомлений
 */
const NotificationTab = ({ active, count, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
      active
        ? 'bg-stone text-bone shadow-md'
        : 'bg-sand/50 text-stone hover:bg-sand'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    {count > 0 && (
      <span className="bg-bone text-stone px-2 py-0.5 rounded-full text-xs">
        {count}
      </span>
    )}
  </button>
);

/**
 * SettingsToggle - Переключатель настроек
 */
const SettingsToggle = ({ setting, onToggle }) => (
  <div className="flex items-center justify-between p-4 neu-card">
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-stone">{setting.label}</span>
        {setting.enabled && (
          <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
            Вкл
          </span>
        )}
      </div>
      <p className="text-sm text-ink-light mt-1">{setting.description}</p>
    </div>
    <button
      onClick={() => onToggle(setting.id)}
      className={`relative w-14 h-8 rounded-full transition-all ${
        setting.enabled ? 'bg-emerald-500' : 'bg-sand'
      }`}
    >
      <div
        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
          setting.enabled ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  </div>
);

/**
 * EmptyState - Пустое состояние
 */
const EmptyState = ({ icon, title, message, action }) => (
  <div className="neu-card p-12 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-stone mb-2">{title}</h3>
    <p className="text-ink-light mb-6">{message}</p>
    {action && (
      <Link to={action.link} className="neu-button px-6 py-3 rounded-xl font-medium">
        {action.label}
      </Link>
    )}
  </div>
);

/**
 * StatsCard - Карточка статистики
 */
const StatsCard = ({ icon, label, value, color }) => (
  <div className="neu-card p-4 text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-ink-light mt-1">{label}</div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const NotificationsV1 = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Initialize data
  useEffect(() => {
    setNotifications(generateNotifications());
    setSettings(generateNotificationSettings());
  }, []);

  // Real-time simulation
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'health',
          title: 'Напоминание о движении',
          message: 'Вы сидите уже 1 час. Пора размяться!',
          icon: '🏃',
          priority: 'low',
          category: 'reminders',
        },
        {
          type: 'social',
          title: 'Новый лайк',
          message: 'Вашему прогрессу поставили лайк',
          icon: '❤️',
          priority: 'low',
          category: 'social',
        },
      ];

      if (Math.random() > 0.7) {
        const newNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        const notification = {
          ...newNotif,
          id: Date.now(),
          time: 'Только что',
          read: false,
          action: { label: 'Посмотреть', link: '/dashboard-v1' },
        };
        setNotifications(prev => [notification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' 
      || (activeTab === 'unread' && !n.read)
      || n.category === activeTab;
    
    const matchesSearch = searchQuery === '' 
      || n.title.toLowerCase().includes(searchQuery.toLowerCase())
      || n.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Counts
  const counts = {
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    health: notifications.filter(n => n.category === 'health').length,
    social: notifications.filter(n => n.category === 'social').length,
    achievements: notifications.filter(n => n.category === 'achievements').length,
    mentions: notifications.filter(n => n.category === 'mentions').length,
    system: notifications.filter(n => n.category === 'system').length,
  };

  // Handlers
  const handleMarkRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const handleMarkUnread = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: false } : n)
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите удалить все уведомления?')) {
      setNotifications([]);
    }
  }, []);

  const handleToggleSetting = useCallback((id) => {
    setSettings(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  }, []);

  return (
    <div className="min-h-screen bg-bone pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone/10 to-sand/20 border-b border-stone/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone mb-2">Уведомления</h1>
              <p className="text-ink-light">Центр уведомлений и настроек</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isRealTimeEnabled
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-sand/50 text-stone'
                }`}
              >
                {isRealTimeEnabled ? '🔔 Live' : '🔕 Pause'}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                ⚙️ Настройки
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            <StatsCard icon="📬" label="Всего" value={counts.all} color="text-stone" />
            <StatsCard icon="📭" label="Непрочитанные" value={counts.unread} color="text-amber-600" />
            <StatsCard icon="💪" label="Здоровье" value={counts.health} color="text-emerald-600" />
            <StatsCard icon="👥" label="Социальные" value={counts.social} color="text-violet-600" />
            <StatsCard icon="🏆" label="Достижения" value={counts.achievements} color="text-amber-600" />
            <StatsCard icon="💬" label="Упоминания" value={counts.mentions} color="text-pink-600" />
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск уведомлений..."
              className="neu-input py-3"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <NotificationTab
              active={activeTab === 'all'}
              count={counts.all}
              onClick={() => setActiveTab('all')}
              icon="📬"
              label="Все"
            />
            <NotificationTab
              active={activeTab === 'unread'}
              count={counts.unread}
              onClick={() => setActiveTab('unread')}
              icon="📭"
              label="Непрочитанные"
            />
            <NotificationTab
              active={activeTab === 'health'}
              count={counts.health}
              onClick={() => setActiveTab('health')}
              icon="💪"
              label="Здоровье"
            />
            <NotificationTab
              active={activeTab === 'social'}
              count={counts.social}
              onClick={() => setActiveTab('social')}
              icon="👥"
              label="Социальные"
            />
            <NotificationTab
              active={activeTab === 'achievements'}
              count={counts.achievements}
              onClick={() => setActiveTab('achievements')}
              icon="🏆"
              label="Достижения"
            />
            <NotificationTab
              active={activeTab === 'mentions'}
              count={counts.mentions}
              onClick={() => setActiveTab('mentions')}
              icon="💬"
              label="Упоминания"
            />
            <NotificationTab
              active={activeTab === 'system'}
              count={counts.system}
              onClick={() => setActiveTab('system')}
              icon="⚙️"
              label="Системные"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="neu-card p-6 mb-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone">Настройки уведомлений</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-2xl text-ink-light hover:text-stone"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {settings.map((setting) => (
                <SettingsToggle
                  key={setting.id}
                  setting={setting}
                  onToggle={handleToggleSetting}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink-light">
            Показано {filteredNotifications.length} из {notifications.length} уведомлений
          </p>
          <div className="flex items-center space-x-2">
            {counts.unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm font-medium text-stone hover:text-ink transition-colors"
              >
                Прочитать все
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Очистить все
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={searchQuery ? '🔍' : '📭'}
            title={searchQuery ? 'Ничего не найдено' : 'Нет уведомлений'}
            message={
              searchQuery
                ? 'Попробуйте изменить поисковый запрос'
                : 'Когда появятся новые уведомления, они появятся здесь'
            }
            action={!searchQuery ? { label: 'На дашборд', link: '/dashboard-v1' } : null}
          />
        )}

        {/* Load More */}
        {filteredNotifications.length >= 10 && (
          <div className="mt-8 text-center">
            <button className="neu-button-secondary px-8 py-3 rounded-xl font-medium transition-all">
              Загрузить ещё
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsV1;
