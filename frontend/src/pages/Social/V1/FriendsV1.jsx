import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SocialV1.css';

/**
 * FriendsV1 - Друзья и подписки
 * Карточки друзей, запросы и рекомендации
 */

// ============================================
// MOCK DATA
// ============================================

const generateFriends = () => [
  {
    id: 1,
    name: 'Александр Волков',
    username: '@alexvolkov',
    avatar: '👨‍🚀',
    level: 42,
    isOnline: true,
    lastActive: new Date(),
    mutualFriends: 23,
    isFollowing: true,
    isFollower: true,
    status: 'Подготовка к марафону 🏃',
    healthScore: 87,
    streak: 156,
  },
  {
    id: 2,
    name: 'Мария Козлова',
    username: '@mariakoz',
    avatar: '🧘‍♀️',
    level: 38,
    isOnline: true,
    lastActive: new Date(),
    mutualFriends: 18,
    isFollowing: true,
    isFollower: true,
    status: 'Йога каждый день 🧘',
    healthScore: 92,
    streak: 89,
  },
  {
    id: 3,
    name: 'Дмитрий Петров',
    username: '@dmitryp',
    avatar: '🏋️',
    level: 25,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    mutualFriends: 12,
    isFollowing: true,
    isFollower: true,
    status: 'Новый PR в становой! 💪',
    healthScore: 78,
    streak: 45,
  },
  {
    id: 4,
    name: 'Елена Смирнова',
    username: '@elenasmir',
    avatar: '🥗',
    level: 51,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 120),
    mutualFriends: 31,
    isFollowing: true,
    isFollower: true,
    status: 'Новый рецепт уже в блоге 🥑',
    healthScore: 95,
    streak: 234,
  },
  {
    id: 5,
    name: 'Ольга Морозова',
    username: '@olgamor',
    avatar: '🏃‍♀️',
    level: 47,
    isOnline: true,
    lastActive: new Date(),
    mutualFriends: 27,
    isFollowing: true,
    isFollower: true,
    status: '1000км за год! 🎉',
    healthScore: 91,
    streak: 189,
  },
  {
    id: 6,
    name: 'Наталья Иванова',
    username: '@natalyia',
    avatar: '🌿',
    level: 56,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 300),
    mutualFriends: 19,
    isFollowing: true,
    isFollower: true,
    status: 'Биохакинг рулит 🧬',
    healthScore: 88,
    streak: 287,
  },
  {
    id: 7,
    name: 'Максим Лебедев',
    username: '@maxleb',
    avatar: '🧬',
    level: 33,
    isOnline: true,
    lastActive: new Date(),
    mutualFriends: 8,
    isFollowing: true,
    isFollower: false,
    status: 'Генетический тест пройден',
    healthScore: 72,
    streak: 67,
  },
  {
    id: 8,
    name: 'Виктория Орлова',
    username: '@vikaorl',
    avatar: '🎯',
    level: 62,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 600),
    mutualFriends: 45,
    isFollowing: true,
    isFollower: true,
    status: '365 дней трекинга! 🔥',
    healthScore: 97,
    streak: 365,
  },
  {
    id: 9,
    name: 'Андрей Новиков',
    username: '@andreynov',
    avatar: '😴',
    level: 19,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 1440),
    mutualFriends: 5,
    isFollowing: true,
    isFollower: true,
    status: 'Наконец-то выспался! 😴',
    healthScore: 65,
    streak: 23,
  },
  {
    id: 10,
    name: 'Павел Зинченко',
    username: '@pavzin',
    avatar: '🚴',
    level: 31,
    isOnline: true,
    lastActive: new Date(),
    mutualFriends: 14,
    isFollowing: true,
    isFollower: true,
    status: 'Велосезон открыт! 🚴',
    healthScore: 82,
    streak: 78,
  },
  {
    id: 11,
    name: 'Анна Кузнецова',
    username: '@annakuz',
    avatar: '🏊‍♀️',
    level: 44,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 2880),
    mutualFriends: 22,
    isFollowing: true,
    isFollower: true,
    status: 'Триатлон ждёт! 🏊',
    healthScore: 89,
    streak: 134,
  },
  {
    id: 12,
    name: 'Юлия Медведева',
    username: '@julymed',
    avatar: '🧘',
    level: 49,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 4320),
    mutualFriends: 16,
    isFollowing: true,
    isFollower: true,
    status: 'Ретрит в Алтае 🏔️',
    healthScore: 94,
    streak: 201,
  },
];

const generateFriendRequests = () => [
  {
    id: 101,
    name: 'Сергей Волков',
    username: '@servolk',
    avatar: '🥊',
    level: 22,
    mutualFriends: 8,
    requestType: 'incoming',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    message: 'Привет! Вижу у нас общие интересы в боксе 🥊',
  },
  {
    id: 102,
    name: 'Кристина Орлова',
    username: '@krisorl',
    avatar: '🧗‍♀️',
    level: 58,
    mutualFriends: 15,
    requestType: 'incoming',
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
    message: 'Давай дружить! Люблю скалолазание как и ты 🧗‍♀️',
  },
  {
    id: 103,
    name: 'Николай Фёдоров',
    username: '@nikfed',
    avatar: '🚣',
    level: 34,
    mutualFriends: 6,
    requestType: 'incoming',
    timestamp: new Date(Date.now() - 1000 * 60 * 720),
    message: null,
  },
  {
    id: 104,
    name: 'Дарья Лебедева',
    username: '@darleb',
    avatar: '🏹',
    level: 41,
    mutualFriends: 11,
    requestType: 'outgoing',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440),
  },
  {
    id: 105,
    name: 'Артём Соколов',
    username: '@artsok',
    avatar: '🤸',
    level: 27,
    mutualFriends: 4,
    requestType: 'outgoing',
    timestamp: new Date(Date.now() - 1000 * 60 * 2880),
  },
];

const generateSuggestions = () => [
  {
    id: 201,
    name: 'Игорь Соколов',
    username: '@igorsok',
    avatar: '💊',
    level: 28,
    mutualFriends: 12,
    reason: '12 общих друзей',
    interests: ['supplements', 'health', 'biohacking'],
  },
  {
    id: 202,
    name: 'Екатерина Новик',
    username: '@katnov',
    avatar: '🎿',
    level: 53,
    mutualFriends: 18,
    reason: 'Занимается лыжами рядом с вами',
    interests: ['skiing', 'cardio', 'outdoor'],
  },
  {
    id: 203,
    name: 'Роман Титов',
    username: '@romtit',
    avatar: '🏔️',
    level: 36,
    mutualFriends: 9,
    reason: 'Любит альпинизм',
    interests: ['climbing', 'mountaineering', 'adventure'],
  },
  {
    id: 204,
    name: 'Фитнес Бот',
    username: '@fitnessbot',
    avatar: '🤖',
    level: 100,
    mutualFriends: 0,
    reason: 'Популярный аккаунт',
    interests: ['fitness', 'ai', 'coaching'],
    isVerified: true,
  },
  {
    id: 205,
    name: 'Нутрициолог Анна',
    username: '@nutrianna',
    avatar: '🥑',
    level: 75,
    mutualFriends: 23,
    reason: 'Эксперт по питанию',
    interests: ['nutrition', 'health', 'coaching'],
    isVerified: true,
  },
  {
    id: 206,
    name: 'Йога Студия',
    username: '@yogastudio',
    avatar: '🧘',
    level: 60,
    mutualFriends: 34,
    reason: 'Популярно в вашем городе',
    interests: ['yoga', 'meditation', 'wellness'],
    isVerified: true,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'онлайн';
  if (diff < 3600) return `${Math.floor(diff / 60)}м назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч назад`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}дн назад`;
  return date.toLocaleDateString('ru-RU');
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getHealthScoreColor = (score) => {
  if (score >= 90) return 'var(--retro-green)';
  if (score >= 70) return 'var(--retro-gold)';
  if (score >= 50) return 'var(--retro-orange)';
  return 'var(--retro-highlight)';
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Friend Card
const FriendCard = ({ friend, onMessage, onUnfriend }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="neu-card"
      style={{
        padding: '20px',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Health Score Ring */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        width: '40px',
        height: '40px'
      }}>
        <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke={getHealthScoreColor(friend.healthScore)}
            strokeWidth="4"
            fill="none"
            strokeDasharray={2 * Math.PI * 16}
            strokeDashoffset={2 * Math.PI * 16 * (1 - friend.healthScore / 100)}
            strokeLinecap="round"
            style={{ 
              filter: `drop-shadow(0 0 5px ${getHealthScoreColor(friend.healthScore)})`
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          {friend.healthScore}
        </div>
      </div>

      {/* Avatar */}
      <div style={{ position: 'relative', marginBottom: '15px' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          margin: '0 auto',
          border: friend.isOnline ? '3px solid var(--retro-green)' : '3px solid rgba(255,255,255,0.1)',
          boxShadow: friend.isOnline ? '0 0 20px rgba(0, 255, 136, 0.4)' : 'none'
        }}>
          {friend.avatar}
        </div>
        {friend.isOnline && (
          <div style={{
            position: 'absolute',
            bottom: '5px',
            right: '50%',
            transform: 'translateX(50px)',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: 'var(--retro-green)',
            border: '2px solid var(--retro-bg)',
            boxShadow: '0 0 10px rgba(0, 255, 136, 0.6)'
          }} />
        )}
      </div>

      {/* Info */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px', marginBottom: '4px' }}>
          {friend.name}
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          {friend.username}
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: friend.isOnline ? 'var(--retro-green)' : '#888',
          marginBottom: '8px'
        }}>
          {formatTimeAgo(friend.lastActive)}
        </div>
        {friend.status && (
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--retro-cyan)',
            padding: '6px 12px',
            background: 'rgba(0, 217, 255, 0.1)',
            borderRadius: '12px',
            display: 'inline-block'
          }}>
            {friend.status}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '12px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '10px',
        marginBottom: '15px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--retro-gold)' }}>
            {friend.level}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>Уровень</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--retro-highlight)' }}>
            🔥 {friend.streak}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>Серия</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--retro-purple)' }}>
            {friend.mutualFriends}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>Общих</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onMessage(friend)}
          className="neon-button"
          style={{ flex: 1, fontSize: '12px', padding: '10px' }}
        >
          💬
        </button>
        <button
          onClick={() => onUnfriend(friend)}
          style={{ 
            flex: 1,
            padding: '10px',
            background: 'transparent',
            border: '1px solid rgba(233, 69, 96, 0.3)',
            borderRadius: '8px',
            color: 'var(--retro-highlight)',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--retro-highlight)';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--retro-highlight)';
          }}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

// Friend Request Card
const FriendRequestCard = ({ request, onAccept, onDecline }) => {
  const isIncoming = request.requestType === 'incoming';

  return (
    <div className="neu-card" style={{ padding: '15px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          {request.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
            {request.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
            {request.username} • {request.mutualFriends} общих друзей
          </div>
          {request.message && (
            <div style={{ 
              fontSize: '12px', 
              color: '#888', 
              fontStyle: 'italic',
              padding: '8px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px'
            }}>
              "{request.message}"
            </div>
          )}
          {isIncoming && (
            <div style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>
              {formatTimeAgo(request.timestamp)}
            </div>
          )}
        </div>
        {isIncoming ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onAccept(request.id)}
              className="neon-button neon-button-green"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              ✓
            </button>
            <button
              onClick={() => onDecline(request.id)}
              style={{ 
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--retro-highlight)',
                borderRadius: '8px',
                color: 'var(--retro-highlight)',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div style={{ 
            padding: '6px 12px',
            background: 'rgba(240, 165, 0, 0.2)',
            border: '1px solid var(--retro-gold)',
            borderRadius: '8px',
            color: 'var(--retro-gold)',
            fontSize: '11px'
          }}>
            Ожидание...
          </div>
        )}
      </div>
    </div>
  );
};

// Suggestion Card
const SuggestionCard = ({ suggestion, onFollow, onDismiss }) => {
  return (
    <div className="neu-card" style={{ padding: '15px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          border: '2px solid rgba(255,255,255,0.1)',
          position: 'relative'
        }}>
          {suggestion.avatar}
          {suggestion.isVerified && (
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              background: 'var(--retro-cyan)',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
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
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {suggestion.name}
            {suggestion.isVerified && <span style={{ color: 'var(--retro-cyan)', fontSize: '12px' }}>✓</span>}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {suggestion.reason}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--retro-cyan)', marginTop: '4px' }}>
            Lvl {suggestion.level}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onFollow(suggestion.id)}
            className="neon-button"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            +
          </button>
          <button
            onClick={() => onDismiss(suggestion.id)}
            style={{ 
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: '#666',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Friend Modal
const AddFriendModal = ({ onClose, onAdd }) => {
  const [searchType, setSearchType] = useState('username'); // username, email
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    // Simulate API search
    setTimeout(() => {
      setSearchResult({
        id: 999,
        name: 'Новый Пользователь',
        username: '@newuser',
        avatar: '👤',
        level: 10,
        mutualFriends: 3,
        isFound: true,
      });
      setIsSearching(false);
    }, 1000);
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
          maxWidth: '450px',
          padding: '30px',
          animation: 'scaleIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ 
            fontFamily: 'Orbitron', 
            fontSize: '20px', 
            color: '#fff',
            margin: 0
          }}>
            ➕ Добавить друга
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

        {/* Search Type Toggle */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setSearchType('username')}
            style={{
              flex: 1,
              padding: '10px',
              background: searchType === 'username' ? 'var(--retro-cyan)' : 'rgba(0,0,0,0.3)',
              border: 'none',
              borderRadius: '8px',
              color: searchType === 'username' ? '#000' : '#888',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            По имени пользователя
          </button>
          <button
            onClick={() => setSearchType('email')}
            style={{
              flex: 1,
              padding: '10px',
              background: searchType === 'email' ? 'var(--retro-cyan)' : 'rgba(0,0,0,0.3)',
              border: 'none',
              borderRadius: '8px',
              color: searchType === 'email' ? '#000' : '#888',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            По email
          </button>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type={searchType === 'email' ? 'email' : 'text'}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchType === 'email' ? 'example@email.com' : '@username'}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="neon-button neon-button-primary"
          style={{ width: '100%', padding: '14px', marginBottom: '20px' }}
          disabled={!searchValue.trim() || isSearching}
        >
          {isSearching ? 'Поиск...' : '🔍 Найти'}
        </button>

        {/* Search Result */}
        {searchResult && (
          <div className="neu-card" style={{ padding: '15px', background: 'rgba(0, 255, 136, 0.05)', border: '1px solid var(--retro-green)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px'
              }}>
                {searchResult.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#fff' }}>{searchResult.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{searchResult.username} • {searchResult.mutualFriends} общих</div>
              </div>
              <button
                onClick={() => {
                  onAdd(searchResult);
                  onClose();
                }}
                className="neon-button neon-button-green"
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                + Добавить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Widget
const FriendsStatsWidget = ({ friends, requests }) => {
  const totalFriends = friends.length;
  const onlineFriends = friends.filter(f => f.isOnline).length;
  const incomingRequests = requests.filter(r => r.requestType === 'incoming').length;

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '25px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--retro-cyan)',
            textShadow: '0 0 15px rgba(0, 217, 255, 0.5)'
          }}>
            {totalFriends}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Друзей</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--retro-green)',
            textShadow: '0 0 15px rgba(0, 255, 136, 0.5)'
          }}>
            {onlineFriends}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Онлайн</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--retro-gold)',
            textShadow: '0 0 15px rgba(240, 165, 0, 0.5)'
          }}>
            {incomingRequests}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Запросов</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--retro-purple)',
            textShadow: '0 0 15px rgba(157, 78, 221, 0.5)'
          }}>
            {formatNumber(friends.reduce((sum, f) => sum + f.mutualFriends, 0))}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Связей</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const FriendsV1 = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, online, favorites
  const [requestsTab, setRequestsTab] = useState('incoming'); // incoming, outgoing
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setFriends(generateFriends());
      setRequests(generateFriendRequests());
      setSuggestions(generateSuggestions());
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleAcceptRequest = (requestId) => {
    setRequests(requests.filter(r => r.id !== requestId));
    // Add to friends in real app
  };

  const handleDeclineRequest = (requestId) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const handleFollowSuggestion = (suggestionId) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const handleDismissSuggestion = (suggestionId) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const handleMessage = (friend) => {
    // Navigate to messages
    console.log('Message to:', friend);
  };

  const handleUnfriend = (friend) => {
    setFriends(friends.filter(f => f.id !== friend.id));
  };

  const filteredFriends = friends.filter(f => {
    if (activeTab === 'online') return f.isOnline;
    if (activeTab === 'favorites') return f.streak >= 100;
    return true;
  }).filter(f => {
    if (!searchQuery) return true;
    return f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
              👫 Друзья
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="neon-button neon-button-primary"
              style={{ fontSize: '13px', padding: '10px 20px' }}
              onClick={() => setShowAddModal(true)}
            >
              + Добавить
            </button>
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
          {/* Stats */}
          <FriendsStatsWidget friends={friends} requests={requests} />

          {/* Search & Filter */}
          <div className="neu-card" style={{ padding: '15px 20px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск друзей..."
                  style={{ 
                    width: '100%',
                    padding: '10px 15px 10px 40px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    borderRadius: '25px',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '14px',
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

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'all', label: 'Все', count: friends.length },
                  { id: 'online', label: 'Онлайн', count: friends.filter(f => f.isOnline).length },
                  { id: 'favorites', label: 'Активные', count: friends.filter(f => f.streak >= 100).length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '8px 16px',
                      background: activeTab === tab.id ? 'var(--retro-cyan)' : 'rgba(0,0,0,0.3)',
                      border: 'none',
                      borderRadius: '20px',
                      color: activeTab === tab.id ? '#000' : '#888',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Friends Grid */}
          {isLoading ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="neu-card" style={{ padding: '20px', height: '350px' }}>
                  <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px' }} />
                  <div className="skeleton" style={{ height: '20px', width: '60%', margin: '0 auto 10px' }} />
                  <div className="skeleton" style={{ height: '15px', width: '40%', margin: '0 auto 20px' }} />
                  <div className="skeleton" style={{ height: '60px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ height: '40px' }} />
                </div>
              ))}
            </div>
          ) : filteredFriends.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              {filteredFriends.map((friend) => (
                <FriendCard 
                  key={friend.id} 
                  friend={friend}
                  onMessage={handleMessage}
                  onUnfriend={handleUnfriend}
                />
              ))}
            </div>
          ) : (
            <div className="neu-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <span style={{ fontSize: '80px', display: 'block', marginBottom: '20px' }}>🔍</span>
              <h3 style={{ color: '#fff', fontFamily: 'Orbitron', marginBottom: '10px' }}>
                Друзья не найдены
              </h3>
              <p style={{ color: '#666' }}>
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          {/* Friend Requests */}
          <div className="neu-card" style={{ padding: '20px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ 
                fontFamily: 'Orbitron', 
                fontSize: '16px', 
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                📨 Запросы
              </h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => setRequestsTab('incoming')}
                  style={{
                    padding: '4px 10px',
                    background: requestsTab === 'incoming' ? 'var(--retro-cyan)' : 'rgba(0,0,0,0.3)',
                    border: 'none',
                    borderRadius: '6px',
                    color: requestsTab === 'incoming' ? '#000' : '#888',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Вход. ({requests.filter(r => r.requestType === 'incoming').length})
                </button>
                <button
                  onClick={() => setRequestsTab('outgoing')}
                  style={{
                    padding: '4px 10px',
                    background: requestsTab === 'outgoing' ? 'var(--retro-gold)' : 'rgba(0,0,0,0.3)',
                    border: 'none',
                    borderRadius: '6px',
                    color: requestsTab === 'outgoing' ? '#000' : '#888',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Исход. ({requests.filter(r => r.requestType === 'outgoing').length})
                </button>
              </div>
            </div>

            <div>
              {requests.filter(r => r.requestType === requestsTab).length > 0 ? (
                requests.filter(r => r.requestType === requestsTab).map((request) => (
                  <FriendRequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAcceptRequest}
                    onDecline={handleDeclineRequest}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  Нет запросов
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="neu-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ 
                fontFamily: 'Orbitron', 
                fontSize: '16px', 
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                💡 Рекомендации
              </h3>
              <button style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--retro-cyan)', 
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                Все
              </button>
            </div>

            <div>
              {suggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onFollow={handleFollowSuggestion}
                  onDismiss={handleDismissSuggestion}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <AddFriendModal 
          onClose={() => setShowAddModal(false)}
          onAdd={(friend) => {
            setFriends([...friends, { ...friend, isFollowing: true, isFollower: false }]);
          }}
        />
      )}
    </div>
  );
};

export default FriendsV1;
