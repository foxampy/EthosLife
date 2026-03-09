import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SocialV1.css';

/**
 * ChallengesV1 - Челленджи и соревнования
 * Интерактивные карточки с прогрессом, таймерами и призами
 */

// ============================================
// MOCK DATA
// ============================================

const generateChallenges = () => [
  {
    id: 1,
    title: '30 Дней Йоги',
    description: 'Ежедневная практика йоги по 30 минут. Улучшите гибкость, баланс и ментальное здоровье за месяц.',
    icon: '🧘',
    category: 'fitness',
    difficulty: 'beginner',
    duration: 30,
    durationUnit: 'days',
    participants: 2847,
    maxParticipants: 5000,
    prize: 500,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-31'),
    isJoined: true,
    progress: 67,
    streak: 20,
    isVerified: true,
    organizer: { name: 'Йога Студия', avatar: '🧘‍♀️', isVerified: true },
    tags: ['йога', 'гибкость', 'ежедневно', 'ментальное'],
    requirements: ['Коврик для йоги', '30 минут в день', 'Базовые навыки'],
    rewards: [
      { day: 7, amount: 50, label: 'Неделя 1' },
      { day: 14, amount: 100, label: 'Неделя 2' },
      { day: 21, amount: 150, label: 'Неделя 3' },
      { day: 30, amount: 200, label: 'Финиш' },
    ],
    leaderboard: [
      { rank: 1, name: 'Мария К.', avatar: '🧘‍♀️', progress: 100 },
      { rank: 2, name: 'Ольга М.', avatar: '🏃‍♀️', progress: 95 },
      { rank: 3, name: 'Елена С.', avatar: '🥗', progress: 90 },
    ],
  },
  {
    id: 2,
    title: 'Марафон 1000 Шагов',
    description: 'Наберите 1,000,000 шагов за месяц. Коллективный челлендж для всех любителей ходьбы!',
    icon: '👟',
    category: 'fitness',
    difficulty: 'intermediate',
    duration: 30,
    durationUnit: 'days',
    participants: 8934,
    maxParticipants: 10000,
    prize: 1000,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-31'),
    isJoined: true,
    progress: 45,
    streak: 12,
    isVerified: true,
    organizer: { name: 'Беговой Клуб', avatar: '🏃', isVerified: true },
    tags: ['шаги', 'кардио', 'команда', 'выносливость'],
    requirements: ['Фитнес-трекер', 'Смартфон с GPS', 'Удобная обувь'],
    rewards: [
      { day: 10, amount: 100, label: '10 дней' },
      { day: 20, amount: 300, label: '20 дней' },
      { day: 30, amount: 600, label: 'Финиш' },
    ],
    leaderboard: [
      { rank: 1, name: 'Александр В.', avatar: '👨‍🚀', progress: 100 },
      { rank: 2, name: 'Дмитрий К.', avatar: '🏃', progress: 98 },
      { rank: 3, name: 'Павел З.', avatar: '🚴', progress: 95 },
    ],
  },
  {
    id: 3,
    title: 'Здоровое Питание 21 День',
    description: '21 день чистого питания без сахара, фастфуда и обработанных продуктов. Измените свои привычки!',
    icon: '🥗',
    category: 'nutrition',
    difficulty: 'intermediate',
    duration: 21,
    durationUnit: 'days',
    participants: 5621,
    maxParticipants: 8000,
    prize: 750,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-03-10'),
    endDate: new Date('2026-03-31'),
    isJoined: false,
    progress: 0,
    streak: 0,
    isVerified: true,
    organizer: { name: 'Нутрициолог Анна', avatar: '🥑', isVerified: true },
    tags: ['питание', 'детокс', 'здоровье', 'привычки'],
    requirements: ['План питания', 'Список продуктов', 'Дневник питания'],
    rewards: [
      { day: 7, amount: 100, label: 'Неделя 1' },
      { day: 14, amount: 250, label: 'Неделя 2' },
      { day: 21, amount: 400, label: 'Финиш' },
    ],
    leaderboard: [
      { rank: 1, name: 'Наталья И.', avatar: '🌿', progress: 100 },
      { rank: 2, name: 'Виктория О.', avatar: '🎯', progress: 95 },
      { rank: 3, name: 'Анна К.', avatar: '🥑', progress: 90 },
    ],
  },
  {
    id: 4,
    title: 'Сон 8 Часов',
    description: '30 дней качественного сна по 8 часов каждую ночь. Восстановите энергию и улучшите здоровье.',
    icon: '😴',
    category: 'health',
    difficulty: 'beginner',
    duration: 30,
    durationUnit: 'days',
    participants: 3456,
    maxParticipants: 5000,
    prize: 400,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-31'),
    isJoined: false,
    progress: 0,
    streak: 0,
    isVerified: false,
    organizer: { name: 'Sleep Lab', avatar: '🌙', isVerified: false },
    tags: ['сон', 'восстановление', 'здоровье', 'энергия'],
    requirements: ['Трекер сна', 'Режим дня', 'Тёмная комната'],
    rewards: [
      { day: 7, amount: 50, label: 'Неделя 1' },
      { day: 14, amount: 100, label: 'Неделя 2' },
      { day: 21, amount: 100, label: 'Неделя 3' },
      { day: 30, amount: 150, label: 'Финиш' },
    ],
    leaderboard: [
      { rank: 1, name: 'Андрей Н.', avatar: '😴', progress: 100 },
      { rank: 2, name: 'Максим Л.', avatar: '🧬', progress: 92 },
      { rank: 3, name: 'Игорь С.', avatar: '🏋️', progress: 88 },
    ],
  },
  {
    id: 5,
    title: '100 Отжиманий',
    description: 'Достигните 100 отжиманий за один подход за 8 недель. Программа для любого уровня подготовки.',
    icon: '💪',
    category: 'fitness',
    difficulty: 'advanced',
    duration: 56,
    durationUnit: 'days',
    participants: 4123,
    maxParticipants: 6000,
    prize: 600,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-02-15'),
    endDate: new Date('2026-04-12'),
    isJoined: true,
    progress: 78,
    streak: 45,
    isVerified: true,
    organizer: { name: 'Кроссфит PRO', avatar: '🏋️', isVerified: true },
    tags: ['сила', 'отжимания', 'тренировки', 'вызов'],
    requirements: ['Минимум 10 отжиманий сейчас', 'Коврик', '3-4 тренировки в неделю'],
    rewards: [
      { day: 14, amount: 100, label: '2 недели' },
      { day: 28, amount: 150, label: '4 недели' },
      { day: 42, amount: 150, label: '6 недель' },
      { day: 56, amount: 200, label: 'Финиш' },
    ],
    leaderboard: [
      { rank: 1, name: 'Сергей В.', avatar: '💪', progress: 100 },
      { rank: 2, name: 'Дмитрий П.', avatar: '🏋️', progress: 95 },
      { rank: 3, name: 'Игорь С.', avatar: '🏋️', progress: 90 },
    ],
  },
  {
    id: 6,
    title: 'Медитация 10 Минут',
    description: 'Ежедневная медитация по 10 минут. Уменьшите стресс и улучшите концентрацию за 30 дней.',
    icon: '🧠',
    category: 'mental',
    difficulty: 'beginner',
    duration: 30,
    durationUnit: 'days',
    participants: 6789,
    maxParticipants: 10000,
    prize: 350,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-31'),
    isJoined: false,
    progress: 0,
    streak: 0,
    isVerified: true,
    organizer: { name: 'Mindfulness Center', avatar: '🧘', isVerified: true },
    tags: ['медитация', 'стресс', 'фокус', 'осознанность'],
    requirements: ['Тихое место', '10 минут времени', 'Приложение для медитации'],
    rewards: [
      { day: 7, amount: 50, label: 'Неделя 1' },
      { day: 14, amount: 100, label: 'Неделя 2' },
      { day: 21, amount: 100, label: 'Неделя 3' },
      { day: 30, amount: 100, label: 'Финиш' },
    ],
    leaderboard: [
      { rank: 1, name: 'Юлия М.', avatar: '🧘', progress: 100 },
      { rank: 2, name: 'Мария К.', avatar: '🧘‍♀️', progress: 97 },
      { rank: 3, name: 'Елена С.', avatar: '🥗', progress: 93 },
    ],
  },
  {
    id: 7,
    title: 'Водный Баланс',
    description: 'Пейте 2 литра воды каждый день в течение 30 дней. Улучшите метаболизм и состояние кожи.',
    icon: '💧',
    category: 'health',
    difficulty: 'beginner',
    duration: 30,
    durationUnit: 'days',
    participants: 9234,
    maxParticipants: 15000,
    prize: 300,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-03-05'),
    endDate: new Date('2026-04-04'),
    isJoined: false,
    progress: 0,
    streak: 0,
    isVerified: false,
    organizer: { name: 'Health Coach', avatar: '💧', isVerified: false },
    tags: ['вода', 'гидратация', 'здоровье', 'метаболизм'],
    requirements: ['Бутылка для воды', 'Напоминания', 'Приложение для трекинга'],
    rewards: [
      { day: 7, amount: 40, label: 'Неделя 1' },
      { day: 14, amount: 80, label: 'Неделя 2' },
      { day: 21, amount: 80, label: 'Неделя 3' },
      { day: 30, amount: 100, label: 'Финиш' },
    ],
    leaderboard: [
      { rank: 1, name: 'Ольга М.', avatar: '🏃‍♀️', progress: 100 },
      { rank: 2, name: 'Наталья И.', avatar: '🌿', progress: 98 },
      { rank: 3, name: 'Виктория О.', avatar: '🎯', progress: 95 },
    ],
  },
  {
    id: 8,
    title: 'Велосипед 500 КМ',
    description: 'Проедьте 500 километров на велосипеде за месяц. Исследуйте новые маршруты и заработайте UNITY!',
    icon: '🚴',
    category: 'fitness',
    difficulty: 'advanced',
    duration: 30,
    durationUnit: 'days',
    participants: 1567,
    maxParticipants: 3000,
    prize: 800,
    prizeCurrency: 'UNITY',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-31'),
    isJoined: false,
    progress: 0,
    streak: 0,
    isVerified: true,
    organizer: { name: 'Вело Клуб', avatar: '🚴‍♂️', isVerified: true },
    tags: ['велосипед', 'кардио', 'выносливость', 'приключения'],
    requirements: ['Велосипед', 'Шлем', 'GPS-трекер', '17 км/день'],
    rewards: [
      { day: 10, amount: 150, label: '167 км' },
      { day: 20, amount: 250, label: '333 км' },
      { day: 30, amount: 400, label: '500 км' },
    ],
    leaderboard: [
      { rank: 1, name: 'Павел З.', avatar: '🚴', progress: 100 },
      { rank: 2, name: 'Александр В.', avatar: '👨‍🚀', progress: 85 },
      { rank: 3, name: 'Дмитрий К.', avatar: '🏃', progress: 72 },
    ],
  },
];

const categories = [
  { id: 'all', label: 'Все', icon: '🎯', color: 'var(--retro-cyan)' },
  { id: 'fitness', label: 'Фитнес', icon: '💪', color: 'var(--retro-highlight)' },
  { id: 'nutrition', label: 'Питание', icon: '🥗', color: 'var(--retro-green)' },
  { id: 'health', label: 'Здоровье', icon: '❤️', color: 'var(--retro-gold)' },
  { id: 'mental', label: 'Ментальное', icon: '🧠', color: 'var(--retro-purple)' },
];

const difficulties = [
  { id: 'all', label: 'Все', color: '#888' },
  { id: 'beginner', label: 'Новичок', color: 'var(--retro-green)' },
  { id: 'intermediate', label: 'Средний', color: 'var(--retro-gold)' },
  { id: 'advanced', label: 'Продвинутый', color: 'var(--retro-highlight)' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getDaysRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'beginner': return 'var(--retro-green)';
    case 'intermediate': return 'var(--retro-gold)';
    case 'advanced': return 'var(--retro-highlight)';
    default: return '#888';
  }
};

const getDifficultyLabel = (difficulty) => {
  switch (difficulty) {
    case 'beginner': return 'Новичок';
    case 'intermediate': return 'Средний';
    case 'advanced': return 'Продвинутый';
    default: return difficulty;
  }
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Countdown Timer
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[
        { value: timeLeft.days, label: 'дн' },
        { value: timeLeft.hours, label: 'ч' },
        { value: timeLeft.minutes, label: 'м' },
        { value: timeLeft.seconds, label: 'с' },
      ].map((item, index) => (
        <div 
          key={index}
          style={{ 
            textAlign: 'center',
            background: 'rgba(0,0,0,0.4)',
            padding: '8px 12px',
            borderRadius: '8px',
            minWidth: '50px'
          }}
        >
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: 'var(--retro-cyan)',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
          }}>
            {String(item.value).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Progress Ring
const ProgressRing = ({ progress, size = 80, strokeWidth = 8, color = 'var(--retro-cyan)' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 1s ease',
            filter: `drop-shadow(0 0 5px ${color})`
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff'
      }}>
        {progress}%
      </div>
    </div>
  );
};

// Challenge Card 3D
const ChallengeCard3D = ({ challenge, onJoin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const daysRemaining = getDaysRemaining(challenge.endDate);

  return (
    <div 
      className="neu-card"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'all 0.4s',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Gradient */}
      <div style={{ 
        background: `linear-gradient(135deg, ${getDifficultyColor(challenge.difficulty)}40, rgba(0,0,0,0.2))`,
        padding: '20px',
        borderBottom: `2px solid ${getDifficultyColor(challenge.difficulty)}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            border: `2px solid ${getDifficultyColor(challenge.difficulty)}`,
            boxShadow: `0 0 20px ${getDifficultyColor(challenge.difficulty)}40`
          }}>
            {challenge.icon}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '11px', 
              color: getDifficultyColor(challenge.difficulty),
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              {getDifficultyLabel(challenge.difficulty)}
            </div>
            {challenge.isVerified && (
              <span style={{ 
                fontSize: '10px', 
                color: 'var(--retro-cyan)',
                background: 'rgba(0, 217, 255, 0.2)',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                ✓ Верифицировано
              </span>
            )}
          </div>
        </div>

        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#fff',
          marginBottom: '8px',
          lineHeight: '1.3'
        }}>
          {challenge.title}
        </h3>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {challenge.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              style={{ 
                fontSize: '11px', 
                color: 'var(--retro-cyan)',
                background: 'rgba(0, 217, 255, 0.1)',
                padding: '3px 8px',
                borderRadius: '6px'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ 
          fontSize: '13px', 
          color: '#888', 
          lineHeight: '1.5',
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {challenge.description}
        </p>

        {/* Duration & Prize */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '12px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          marginBottom: '15px'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>Длительность</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
              {challenge.duration} {challenge.durationUnit === 'days' ? 'дней' : 'недель'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>Приз</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: 'var(--retro-gold)',
              textShadow: '0 0 10px rgba(240, 165, 0, 0.5)'
            }}>
              💎 {challenge.prize}
            </div>
          </div>
        </div>

        {/* Participants */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Участники</span>
            <span style={{ fontSize: '12px', color: '#fff' }}>
              {formatNumber(challenge.participants)} / {formatNumber(challenge.maxParticipants)}
            </span>
          </div>
          <div style={{ 
            height: '8px', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(challenge.participants / challenge.maxParticipants) * 100}%`,
              height: '100%',
              background: 'var(--gradient-cyber)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* User Progress (if joined) */}
        {challenge.isJoined && (
          <div style={{ 
            padding: '15px',
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '12px',
            marginBottom: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--retro-green)' }}>Ваш прогресс</span>
              <span style={{ fontSize: '11px', color: 'var(--retro-green)' }}>🔥 {challenge.streak} дней</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <ProgressRing progress={challenge.progress} size={50} strokeWidth={5} color="var(--retro-green)" />
              <div>
                <div style={{ fontSize: '11px', color: '#888' }}>До конца:</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{daysRemaining} дней</div>
              </div>
            </div>
          </div>
        )}

        {/* Countdown */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>До окончания:</div>
          <CountdownTimer endDate={challenge.endDate} />
        </div>

        {/* Organizer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          padding: '10px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            {challenge.organizer.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {challenge.organizer.name}
              {challenge.organizer.isVerified && <span style={{ color: 'var(--retro-cyan)', fontSize: '10px' }}>✓</span>}
            </div>
            <div style={{ fontSize: '10px', color: '#666' }}>Организатор</div>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={() => onJoin(challenge.id)}
          className={`neon-button ${challenge.isJoined ? 'neu-card-pressed' : ''}`}
          style={{ 
            width: '100%',
            borderColor: challenge.isJoined ? 'var(--retro-green)' : 'var(--retro-cyan)',
            color: challenge.isJoined ? 'var(--retro-green)' : 'var(--retro-cyan)'
          }}
        >
          {challenge.isJoined ? '✓ Участвую' : '🚀 Присоединиться'}
        </button>
      </div>
    </div>
  );
};

// My Challenges Tabs
const MyChallengesTabs = ({ challenges, activeTab, onTabChange }) => {
  const active = challenges.filter(c => c.isJoined);
  const completed = challenges.filter(c => c.progress >= 100);

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '25px' }}>
      <h2 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '20px', 
        color: '#fff',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>🏆</span> Мои Челленджи
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => onTabChange('active')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'active' ? 'var(--gradient-cyber)' : 'rgba(0,0,0,0.3)',
            border: activeTab === 'active' ? '2px solid var(--retro-cyan)' : '2px solid transparent',
            borderRadius: '25px',
            color: activeTab === 'active' ? '#fff' : '#888',
            fontFamily: 'Orbitron',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          🔥 Активные ({active.length})
        </button>
        <button
          onClick={() => onTabChange('completed')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'completed' ? 'var(--gradient-gold)' : 'rgba(0,0,0,0.3)',
            border: activeTab === 'completed' ? '2px solid var(--retro-gold)' : '2px solid transparent',
            borderRadius: '25px',
            color: activeTab === 'completed' ? '#fff' : '#888',
            fontFamily: 'Orbitron',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          ✅ Завершённые ({completed.length})
        </button>
      </div>

      {activeTab === 'active' && active.length > 0 && (
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {active.map((challenge) => (
            <div 
              key={challenge.id}
              style={{
                flexShrink: 0,
                width: '280px',
                padding: '15px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 255, 136, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>{challenge.icon}</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{challenge.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--retro-green)' }}>🔥 {challenge.streak} дней</div>
                </div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#888' }}>Прогресс</span>
                  <span style={{ fontSize: '11px', color: '#fff' }}>{challenge.progress}%</span>
                </div>
                <div style={{ 
                  height: '6px', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${challenge.progress}%`,
                    height: '100%',
                    background: 'var(--gradient-matrix)',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                До конца: <span style={{ color: 'var(--retro-cyan)', fontWeight: 'bold' }}>{getDaysRemaining(challenge.endDate)} дн</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'completed' && completed.length > 0 && (
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {completed.map((challenge) => (
            <div 
              key={challenge.id}
              style={{
                flexShrink: 0,
                width: '200px',
                padding: '15px',
                background: 'rgba(240, 165, 0, 0.1)',
                borderRadius: '12px',
                border: '1px solid var(--retro-gold)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏆</div>
              <div style={{ fontWeight: 'bold', color: 'var(--retro-gold)', fontSize: '13px', marginBottom: '5px' }}>
                {challenge.title}
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                +{challenge.prize} UNITY
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'active' && active.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🎯</span>
          У вас нет активных челленджей
        </div>
      )}
    </div>
  );
};

// Leaderboard Preview
const LeaderboardPreview = ({ challenges }) => {
  const topChallenge = challenges.reduce((prev, current) => 
    (current.participants > prev.participants) ? current : prev
  );

  return (
    <div className="holo-display" style={{ marginBottom: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ 
          fontFamily: 'Orbitron', 
          fontSize: '16px', 
          color: 'var(--retro-gold)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textShadow: '0 0 10px rgba(240, 165, 0, 0.5)'
        }}>
          🏆 Топ Челлендж
        </h3>
        <Link 
          to="/social/leaders-v1"
          style={{ 
            fontSize: '12px', 
            color: 'var(--retro-cyan)',
            textDecoration: 'none'
          }}
        >
          Все лидерборды →
        </Link>
      </div>

      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>{topChallenge.icon}</div>
        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '18px', marginBottom: '8px' }}>
          {topChallenge.title}
        </div>
        <div style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
          {formatNumber(topChallenge.participants)} участников
        </div>

        {/* Top 3 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '10px', marginBottom: '20px' }}>
          {topChallenge.leaderboard.slice(1, 3).map((user, index) => (
            <div key={user.rank} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                margin: '0 auto 8px',
                border: index === 0 ? '2px solid var(--retro-gold)' : '2px solid rgba(255,255,255,0.2)'
              }}>
                {user.avatar}
              </div>
              <div style={{ fontSize: '11px', color: '#fff', marginBottom: '4px' }}>{user.name}</div>
              <div style={{ 
                fontSize: '10px', 
                padding: '2px 8px', 
                borderRadius: '6px',
                background: index === 0 ? 'var(--retro-gold)' : 'rgba(255,255,255,0.2)',
                color: index === 0 ? '#000' : '#fff'
              }}>
                #{user.rank}
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 8px',
              border: '3px solid var(--retro-gold)',
              boxShadow: '0 0 20px rgba(240, 165, 0, 0.5)',
              animation: 'float 3s ease-in-out infinite'
            }}>
              {topChallenge.leaderboard[0].avatar}
            </div>
            <div style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>
              {topChallenge.leaderboard[0].name}
            </div>
            <div style={{ 
              fontSize: '11px', 
              padding: '3px 10px', 
              borderRadius: '8px',
              background: 'var(--retro-gold)',
              color: '#000',
              fontWeight: 'bold'
            }}>
              👑 #1
            </div>
          </div>
        </div>

        <Link 
          to={`/social/challenges/${topChallenge.id}-v1`}
          className="neon-button neon-button-gold"
          style={{ fontSize: '12px', padding: '10px 24px' }}
        >
          Смотреть челлендж
        </Link>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ChallengesV1 = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [myChallengesTab, setMyChallengesTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockChallenges = generateChallenges();
      setChallenges(mockChallenges);
      setFilteredChallenges(mockChallenges);
      setIsLoading(false);
    };
    loadChallenges();
  }, []);

  useEffect(() => {
    let filtered = [...challenges];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(c => c.category === activeCategory);
    }

    if (activeDifficulty !== 'all') {
      filtered = filtered.filter(c => c.difficulty === activeDifficulty);
    }

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredChallenges(filtered);
  }, [activeCategory, activeDifficulty, searchQuery, challenges]);

  const handleJoin = (challengeId) => {
    setChallenges(challenges.map(c => {
      if (c.id === challengeId) {
        return { ...c, isJoined: !c.isJoined, progress: c.isJoined ? 0 : 5 };
      }
      return c;
    }));
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
              fontSize: '24px', 
              fontWeight: 'bold',
              background: 'var(--gradient-neon)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              fontFamily: 'Orbitron'
            }}>
              🎯 Челленджи
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск челленджей..."
                style={{ 
                  padding: '10px 15px 10px 40px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  borderRadius: '25px',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  width: '250px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--retro-cyan)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
              />
              <span style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '16px'
              }}>
                🔍
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Main Column */}
        <main>
          {/* My Challenges */}
          <MyChallengesTabs 
            challenges={challenges} 
            activeTab={myChallengesTab}
            onTabChange={setMyChallengesTab}
          />

          {/* Filters */}
          <div className="neu-card" style={{ padding: '15px 20px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {/* Category Filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '8px 16px',
                      background: activeCategory === cat.id ? `${cat.color}20` : 'rgba(0,0,0,0.3)',
                      border: activeCategory === cat.id ? `2px solid ${cat.color}` : '2px solid transparent',
                      borderRadius: '20px',
                      color: activeCategory === cat.id ? cat.color : '#888',
                      fontFamily: 'Orbitron',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Difficulty Filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setActiveDifficulty(diff.id)}
                    style={{
                      padding: '8px 16px',
                      background: activeDifficulty === diff.id ? `${diff.color}20` : 'rgba(0,0,0,0.3)',
                      border: activeDifficulty === diff.id ? `2px solid ${diff.color}` : '2px solid transparent',
                      borderRadius: '20px',
                      color: activeDifficulty === diff.id ? diff.color : '#888',
                      fontFamily: 'Orbitron',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s'
                    }}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div style={{ 
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ color: '#888', fontSize: '14px' }}>
              Найдено: <span style={{ color: 'var(--retro-cyan)', fontWeight: 'bold' }}>{filteredChallenges.length}</span> челленджей
            </div>
            <select style={{ 
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none'
            }}>
              <option value="popular">Популярные</option>
              <option value="new">Новые</option>
              <option value="ending">Завершаются</option>
              <option value="prize">По призу</option>
            </select>
          </div>

          {/* Challenges Grid */}
          {isLoading ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
              gap: '25px' 
            }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="neu-card" style={{ height: '550px', padding: '20px' }}>
                  <div className="skeleton" style={{ height: '120px', borderRadius: '12px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '10px' }} />
                  <div className="skeleton" style={{ height: '60px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ height: '40px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ height: '80px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ height: '40px', width: '100%' }} />
                </div>
              ))}
            </div>
          ) : filteredChallenges.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
              gap: '25px' 
            }}>
              {filteredChallenges.map((challenge) => (
                <ChallengeCard3D 
                  key={challenge.id} 
                  challenge={challenge} 
                  onJoin={handleJoin}
                />
              ))}
            </div>
          ) : (
            <div className="neu-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <span style={{ fontSize: '80px', display: 'block', marginBottom: '20px' }}>🔍</span>
              <h3 style={{ color: '#fff', fontFamily: 'Orbitron', marginBottom: '10px' }}>
                Челленджи не найдены
              </h3>
              <p style={{ color: '#666' }}>
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <LeaderboardPreview challenges={challenges} />

          {/* Stats Widget */}
          <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ 
              fontFamily: 'Orbitron', 
              fontSize: '16px', 
              color: '#fff',
              marginBottom: '20px'
            }}>
              📊 Статистика
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>Всего челленджей</span>
                <span style={{ color: 'var(--retro-cyan)', fontWeight: 'bold' }}>{challenges.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>Участвую</span>
                <span style={{ color: 'var(--retro-green)', fontWeight: 'bold' }}>{challenges.filter(c => c.isJoined).length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>Завершено</span>
                <span style={{ color: 'var(--retro-gold)', fontWeight: 'bold' }}>{challenges.filter(c => c.progress >= 100).length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>Заработано UNITY</span>
                <span style={{ color: 'var(--retro-gold)', fontWeight: 'bold', textShadow: '0 0 10px rgba(240, 165, 0, 0.5)' }}>
                  💎 {challenges.filter(c => c.progress >= 100).reduce((sum, c) => sum + c.prize, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Create Challenge CTA */}
          <div className="neu-card" style={{ 
            padding: '25px', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2), rgba(157, 78, 221, 0.2))',
            border: '1px solid var(--retro-highlight)'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🚀</span>
            <h3 style={{ color: '#fff', fontFamily: 'Orbitron', marginBottom: '10px' }}>
              Создайте свой челлендж
            </h3>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
              Пригласите друзей и мотивируйте друг друга
            </p>
            <button className="neon-button neon-button-primary" style={{ width: '100%' }}>
              Создать челлендж
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChallengesV1;
