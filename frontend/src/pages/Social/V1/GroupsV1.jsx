import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SocialV1.css';

/**
 * GroupsV1 - Сообщества и группы
 * 3D карточки групп с категориями и живыми счетчиками
 */

// ============================================
// MOCK DATA
// ============================================

const generateGroups = () => [
  {
    id: 1,
    name: 'Марафонцы России',
    slug: 'marathon-russia',
    description: 'Сообщество любителей бега на длинные дистанции. Подготовка к марафонам, обмен опытом, совместные тренировки.',
    cover: 'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=600',
    avatar: '🏃',
    members: 12450,
    onlineMembers: 847,
    posts: 3420,
    category: 'fitness',
    activityLevel: 'very_high',
    isJoined: true,
    isVerified: true,
    createdDate: '2023',
    rules: ['Уважайте других участников', 'Без спама', 'Только тематический контент'],
    moderators: [
      { name: 'Александр В.', avatar: '👨‍🚀' },
      { name: 'Ольга М.', avatar: '🏃‍♀️' },
    ],
    upcomingEvents: 3,
    tags: ['бег', 'марафон', 'кардио', 'здоровье'],
  },
  {
    id: 2,
    name: 'Здоровое Питание',
    slug: 'healthy-nutrition',
    description: 'Рецепты, советы по питанию, макронутриенты, витамины. Делимся опытом и мотивируем друг друга!',
    cover: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
    avatar: '🥗',
    members: 28900,
    onlineMembers: 1234,
    posts: 8750,
    category: 'nutrition',
    activityLevel: 'very_high',
    isJoined: true,
    isVerified: true,
    createdDate: '2022',
    rules: ['Без рекламы', 'Научный подход', 'Уважение к мнению других'],
    moderators: [
      { name: 'Елена С.', avatar: '🥑' },
      { name: 'Нутрициолог Анна', avatar: '🍎' },
    ],
    upcomingEvents: 5,
    tags: ['питание', 'рецепты', 'здоровье', 'витамины'],
  },
  {
    id: 3,
    name: 'Йога и Медитация',
    slug: 'yoga-meditation',
    description: 'Практики йоги, медитации, дыхательные техники. Для начинающих и продвинутых.',
    cover: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600',
    avatar: '🧘',
    members: 15670,
    onlineMembers: 523,
    posts: 2890,
    category: 'mental_health',
    activityLevel: 'high',
    isJoined: false,
    isVerified: true,
    createdDate: '2023',
    rules: ['Тишина во время медитаций', 'Без осуждения', 'Поддержка новичков'],
    moderators: [
      { name: 'Мария К.', avatar: '🧘‍♀️' },
    ],
    upcomingEvents: 2,
    tags: ['йога', 'медитация', 'осознанность', 'баланс'],
  },
  {
    id: 4,
    name: 'Кроссфит PRO',
    slug: 'crossfit-pro',
    description: 'Интенсивные тренировки, WOD, техника упражнений. Для тех кто любит вызовы!',
    cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    avatar: '💪',
    members: 8920,
    onlineMembers: 412,
    posts: 1560,
    category: 'fitness',
    activityLevel: 'high',
    isJoined: false,
    isVerified: false,
    createdDate: '2024',
    rules: ['Техника безопасности', 'Без хвастовства', 'Помощь новичкам'],
    moderators: [
      { name: 'Дмитрий П.', avatar: '🏋️' },
    ],
    upcomingEvents: 1,
    tags: ['кроссфит', 'сила', 'выносливость', 'WOD'],
  },
  {
    id: 5,
    name: 'Биохакинг',
    slug: 'biohacking',
    description: 'Оптимизация здоровья, трекеры, добавки, генетика. Максимальная производительность организма.',
    cover: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    avatar: '🧬',
    members: 6780,
    onlineMembers: 289,
    posts: 1120,
    category: 'mental_health',
    activityLevel: 'medium',
    isJoined: true,
    isVerified: true,
    createdDate: '2023',
    rules: ['Научный подход', 'Без псевдонауки', 'Делитесь данными'],
    moderators: [
      { name: 'Максим Л.', avatar: '🧬' },
      { name: 'Доктор А.', avatar: '👨‍⚕️' },
    ],
    upcomingEvents: 4,
    tags: ['биохакинг', 'оптимизация', 'трекеры', 'долголетие'],
  },
  {
    id: 6,
    name: 'Похудение без диет',
    slug: 'weight-loss-healthy',
    description: 'Здоровое снижение веса через изменение привычек. Без экстремальных диет и срывов.',
    cover: 'https://images.unsplash.com/photo-1493770348160-35af50959b27?w=600',
    avatar: '⚖️',
    members: 34500,
    onlineMembers: 1890,
    posts: 12340,
    category: 'weight_loss',
    activityLevel: 'very_high',
    isJoined: false,
    isVerified: true,
    createdDate: '2022',
    rules: ['Поддержка, не осуждение', 'Без рекламы БАДов', 'Личный пример'],
    moderators: [
      { name: 'Наталья И.', avatar: '🌿' },
      { name: 'Виктория О.', avatar: '🎯' },
    ],
    upcomingEvents: 7,
    tags: ['похудение', 'привычки', 'мотивация', 'здоровье'],
  },
  {
    id: 7,
    name: 'Веганское Сообщество',
    slug: 'vegan-community',
    description: 'Растительное питание, этичное потребление, рецепты, обмен опытом перехода на веганство.',
    cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    avatar: '🌱',
    members: 11230,
    onlineMembers: 456,
    posts: 2340,
    category: 'nutrition',
    activityLevel: 'high',
    isJoined: false,
    isVerified: false,
    createdDate: '2023',
    rules: ['Уважение к выбору других', 'Без агрессии', 'Научный подход'],
    moderators: [
      { name: 'Анна В.', avatar: '🥬' },
    ],
    upcomingEvents: 2,
    tags: ['веганство', 'растения', 'этика', 'рецепты'],
  },
  {
    id: 8,
    name: 'Сон и Восстановление',
    slug: 'sleep-recovery',
    description: 'Качество сна, циркадные ритмы, техники восстановления. Максимальная энергия каждый день.',
    cover: 'https://images.unsplash.com/photo-1541781777631-fa182f8036c0?w=600',
    avatar: '😴',
    members: 9450,
    onlineMembers: 234,
    posts: 1780,
    category: 'mental_health',
    activityLevel: 'medium',
    isJoined: true,
    isVerified: true,
    createdDate: '2023',
    rules: ['Без медицинских советов', 'Личный опыт', 'Поддержка'],
    moderators: [
      { name: 'Андрей Н.', avatar: '😴' },
    ],
    upcomingEvents: 1,
    tags: ['сон', 'восстановление', 'энергия', 'ритмы'],
  },
  {
    id: 9,
    name: 'Силовые Тренировки',
    slug: 'strength-training',
    description: 'Пауэрлифтинг, бодибилдинг, работа с весами. Программы, техника, питание.',
    cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    avatar: '🏋️‍♂️',
    members: 14560,
    onlineMembers: 678,
    posts: 3120,
    category: 'fitness',
    activityLevel: 'high',
    isJoined: false,
    isVerified: true,
    createdDate: '2022',
    rules: ['Техника прежде всего', 'Без токсичности', 'Помощь новичкам'],
    moderators: [
      { name: 'Сергей В.', avatar: '💪' },
      { name: 'Игорь С.', avatar: '🏋️' },
    ],
    upcomingEvents: 3,
    tags: ['сила', 'мышцы', 'пауэрлифтинг', 'бодибилдинг'],
  },
  {
    id: 10,
    name: 'Ментальное Здоровье',
    slug: 'mental-health',
    description: 'Поддержка, психологи, техники управления стрессом. Безопасное пространство.',
    cover: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600',
    avatar: '🧠',
    members: 18900,
    onlineMembers: 890,
    posts: 4560,
    category: 'mental_health',
    activityLevel: 'very_high',
    isJoined: true,
    isVerified: true,
    createdDate: '2022',
    rules: ['Конфиденциальность', 'Без осуждения', 'Профессиональная помощь'],
    moderators: [
      { name: 'Психолог М.', avatar: '👩‍⚕️' },
      { name: 'Юлия М.', avatar: '🧘' },
    ],
    upcomingEvents: 6,
    tags: ['психология', 'стресс', 'тревога', 'поддержка'],
  },
  {
    id: 11,
    name: 'Велоспорт',
    slug: 'cycling',
    description: 'Шоссе, MTB, гравел. Маршруты, тренировки, велотуризм.',
    cover: 'https://images.unsplash.com/photo-1517649763962-0c6230658c3d?w=600',
    avatar: '🚴',
    members: 7890,
    onlineMembers: 345,
    posts: 1450,
    category: 'fitness',
    activityLevel: 'medium',
    isJoined: false,
    isVerified: false,
    createdDate: '2023',
    rules: ['Безопасность', 'Уважение на дорогах', 'Помощь'],
    moderators: [
      { name: 'Павел З.', avatar: '🚴' },
    ],
    upcomingEvents: 4,
    tags: ['велоспорт', 'MTB', 'шоссе', 'туризм'],
  },
  {
    id: 12,
    name: 'Интервальное Голодание',
    slug: 'intermittent-fasting',
    description: 'Схемы 16/8, 18/6, 20/4. Опыт, результаты, научные исследования.',
    cover: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600',
    avatar: '⏰',
    members: 13450,
    onlineMembers: 567,
    posts: 2890,
    category: 'nutrition',
    activityLevel: 'high',
    isJoined: false,
    isVerified: true,
    createdDate: '2023',
    rules: ['Консультация с врачом', 'Без фанатизма', 'Научный подход'],
    moderators: [
      { name: 'Доктор К.', avatar: '👨‍⚕️' },
    ],
    upcomingEvents: 2,
    tags: ['IF', 'голодание', 'метаболизм', 'здоровье'],
  },
];

const categories = [
  { id: 'all', label: 'Все', icon: '🌐', color: 'var(--retro-cyan)' },
  { id: 'fitness', label: 'Фитнес', icon: '💪', color: 'var(--retro-highlight)' },
  { id: 'nutrition', label: 'Питание', icon: '🥗', color: 'var(--retro-green)' },
  { id: 'mental_health', label: 'Ментальное', icon: '🧠', color: 'var(--retro-purple)' },
  { id: 'weight_loss', label: 'Похудение', icon: '⚖️', color: 'var(--retro-gold)' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getActivityColor = (level) => {
  switch (level) {
    case 'very_high': return 'var(--retro-highlight)';
    case 'high': return 'var(--retro-orange)';
    case 'medium': return 'var(--retro-gold)';
    default: return 'var(--retro-cyan)';
  }
};

const getActivityLabel = (level) => {
  switch (level) {
    case 'very_high': return 'Очень высокая';
    case 'high': return 'Высокая';
    case 'medium': return 'Средняя';
    default: return 'Низкая';
  }
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Group Card 3D
const GroupCard3D = ({ group }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isJoined, setIsJoined] = useState(group.isJoined);

  return (
    <Link
      to={`/social/group/${group.id}-v1`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="neu-card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: isHovered ? 'translateY(-10px) rotateX(5deg)' : 'translateY(0) rotateX(0)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          perspective: '1000px'
        }}
      >
        {/* Cover Image */}
        <div style={{ 
          position: 'relative',
          height: '140px',
          overflow: 'hidden',
          borderRadius: '20px 20px 0 0'
        }}>
          <img 
            src={group.cover} 
            alt={group.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.5s'
            }} 
          />
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: getActivityColor(group.activityLevel),
              boxShadow: `0 0 10px ${getActivityColor(group.activityLevel)}`,
              animation: 'pulse-glow 1.5s ease-in-out infinite'
            }} />
            {getActivityLabel(group.activityLevel)}
          </div>
          {group.isVerified && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'var(--retro-cyan)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#000'
            }}>
              ✓ Верифицировано
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              border: '2px solid var(--retro-cyan)',
              boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)',
              flexShrink: 0
            }}>
              {group.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#fff',
                marginBottom: '4px',
                lineHeight: '1.3'
              }}>
                {group.name}
              </h3>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {formatNumber(group.members)} участников
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{ 
            fontSize: '13px', 
            color: '#888', 
            lineHeight: '1.5',
            marginBottom: '15px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}>
            {group.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '15px' }}>
            {group.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                style={{ 
                  fontSize: '11px', 
                  color: 'var(--retro-cyan)',
                  background: 'rgba(0, 217, 255, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            marginBottom: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--retro-green)' }}>
                {formatNumber(group.onlineMembers)}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>Онлайн</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--retro-purple)' }}>
                {formatNumber(group.posts)}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>Постов</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--retro-gold)' }}>
                {group.upcomingEvents}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>Событий</div>
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsJoined(!isJoined);
            }}
            className={`neon-button ${isJoined ? 'neu-card-pressed' : ''}`}
            style={{ 
              width: '100%',
              borderColor: isJoined ? 'var(--retro-green)' : 'var(--retro-cyan)',
              color: isJoined ? 'var(--retro-green)' : 'var(--retro-cyan)'
            }}
          >
            {isJoined ? '✓ В группе' : '+ Вступить'}
          </button>
        </div>
      </div>
    </Link>
  );
};

// My Groups Section
const MyGroupsSection = ({ groups }) => {
  const myGroups = groups.filter(g => g.isJoined);

  if (myGroups.length === 0) return null;

  return (
    <div className="neu-card" style={{ padding: '25px', marginBottom: '25px' }}>
      <h2 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '20px', 
        color: '#fff',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>⭐</span> Мои Группы
      </h2>

      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
        {myGroups.map((group) => (
          <Link
            key={group.id}
            to={`/social/group/${group.id}-v1`}
            style={{
              flexShrink: 0,
              width: '200px',
              textDecoration: 'none',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 217, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ position: 'relative', height: '100px' }}>
              <img 
                src={group.cover} 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.7)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#fff'
              }}>
                {formatNumber(group.members)}
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#fff',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {group.name}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {formatNumber(group.onlineMembers)} онлайн
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Create Group Modal
const CreateGroupModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fitness',
    isPrivate: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="neu-card"
        style={{ 
          width: '90%', 
          maxWidth: '500px',
          padding: '30px',
          animation: 'scaleIn 0.3s ease-out',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ 
            fontFamily: 'Orbitron', 
            fontSize: '22px', 
            color: '#fff',
            margin: 0
          }}>
            🚀 Создать Группу
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px' }}>
              Название группы *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Например: Бегуны Москвы"
              required
              style={{ 
                width: '100%',
                padding: '14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '15px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--retro-cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px' }}>
              Описание *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Опишите цель группы..."
              rows={4}
              required
              style={{ 
                width: '100%',
                padding: '14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '15px',
                resize: 'vertical',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--retro-cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px' }}>
              Категория *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ 
                width: '100%',
                padding: '14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {categories.filter(c => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id} style={{ background: '#1a1a2e' }}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ 
            marginBottom: '25px',
            padding: '15px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Приватная группа</div>
              <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                Только по приглашению
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
              className={`neon-button ${formData.isPrivate ? 'neon-button-purple' : ''}`}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              {formData.isPrivate ? '✓ Включено' : '○ Выключено'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ 
                flex: 1,
                padding: '14px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#888',
                cursor: 'pointer',
                fontSize: '15px',
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
              type="submit"
              className="neon-button neon-button-primary"
              style={{ flex: 1, padding: '14px' }}
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Category Tabs
const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="neu-card" style={{ padding: '15px 20px', marginBottom: '25px' }}>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            style={{
              padding: '12px 24px',
              background: activeCategory === category.id ? `${category.color}20` : 'rgba(0,0,0,0.3)',
              border: activeCategory === category.id ? `2px solid ${category.color}` : '2px solid transparent',
              borderRadius: '25px',
              color: activeCategory === category.id ? category.color : '#888',
              fontFamily: 'Orbitron',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== category.id) {
                e.target.style.background = `${category.color}10`;
                e.target.style.borderColor = `${category.color}40`;
                e.target.style.color = category.color;
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category.id) {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.borderColor = 'transparent';
                e.target.style.color = '#888';
              }
            }}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Stats Widget
const GroupsStatsWidget = ({ groups }) => {
  const totalMembers = groups.reduce((sum, g) => sum + g.members, 0);
  const totalPosts = groups.reduce((sum, g) => sum + g.posts, 0);
  const myGroupsCount = groups.filter(g => g.isJoined).length;

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '25px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--retro-cyan)',
            textShadow: '0 0 15px rgba(0, 217, 255, 0.5)'
          }}>
            {groups.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Всего групп</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--retro-green)',
            textShadow: '0 0 15px rgba(0, 255, 136, 0.5)'
          }}>
            {formatNumber(totalMembers)}
          </div>
          <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Участников</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--retro-purple)',
            textShadow: '0 0 15px rgba(157, 78, 221, 0.5)'
          }}>
            {myGroupsCount}
          </div>
          <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Мои группы</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const GroupsV1 = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadGroups = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockGroups = generateGroups();
      setGroups(mockGroups);
      setFilteredGroups(mockGroups);
      setIsLoading(false);
    };
    loadGroups();
  }, []);

  useEffect(() => {
    let filtered = [...groups];

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(g => g.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredGroups(filtered);
  }, [activeCategory, searchQuery, groups]);

  const handleCreateGroup = (formData) => {
    // In real app, send to API
    console.log('Creating group:', formData);
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
              👥 Сообщества
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск групп..."
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
            <button 
              className="neon-button neon-button-primary"
              style={{ fontSize: '13px', padding: '10px 20px' }}
              onClick={() => setShowCreateModal(true)}
            >
              + Создать
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Stats */}
        <GroupsStatsWidget groups={groups} />

        {/* My Groups */}
        <MyGroupsSection groups={groups} />

        {/* Category Tabs */}
        <CategoryTabs 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />

        {/* Results Count */}
        <div style={{ 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: '#888', fontSize: '14px' }}>
            Найдено: <span style={{ color: 'var(--retro-cyan)', fontWeight: 'bold' }}>{filteredGroups.length}</span> групп
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
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
              <option value="active">Активные</option>
              <option value="new">Новые</option>
              <option value="members">По участникам</option>
            </select>
          </div>
        </div>

        {/* Groups Grid */}
        {isLoading ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '25px' 
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="neu-card" style={{ height: '400px', padding: '20px' }}>
                <div className="skeleton" style={{ height: '140px', borderRadius: '12px', marginBottom: '20px' }} />
                <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '10px' }} />
                <div className="skeleton" style={{ height: '15px', width: '40%', marginBottom: '20px' }} />
                <div className="skeleton" style={{ height: '60px', marginBottom: '20px' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : filteredGroups.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '25px' 
          }}>
            {filteredGroups.map((group) => (
              <GroupCard3D key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="neu-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '80px', display: 'block', marginBottom: '20px' }}>🔍</span>
            <h3 style={{ color: '#fff', fontFamily: 'Orbitron', marginBottom: '10px' }}>
              Группы не найдены
            </h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Попробуйте изменить параметры поиска или создайте новую группу
            </p>
            <button 
              className="neon-button neon-button-primary"
              onClick={() => setShowCreateModal(true)}
            >
              + Создать группу
            </button>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal 
          onClose={() => setShowCreateModal(false)} 
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default GroupsV1;
