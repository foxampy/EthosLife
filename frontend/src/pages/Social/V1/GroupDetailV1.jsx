import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './SocialV1.css';

/**
 * GroupDetailV1 - Страница группы
 * Детальная информация о группе с лентой, участниками и событиями
 */

// ============================================
// MOCK DATA
// ============================================

const getMockGroup = (groupId) => ({
  id: parseInt(groupId),
  name: 'Марафонцы России',
  slug: 'marathon-russia',
  description: 'Сообщество любителей бега на длинные дистанции. Подготовка к марафонам, обмен опытом, совместные тренировки и забеги. Присоединяйтесь к нам, чтобы достичь своих беговых целей вместе с единомышленниками!',
  cover: 'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=1200',
  avatar: '🏃',
  members: 12450,
  onlineMembers: 847,
  posts: 3420,
  category: 'fitness',
  activityLevel: 'very_high',
  isJoined: true,
  isVerified: true,
  createdDate: '2023',
  rules: [
    'Уважайте других участников - никаких оскорблений',
    'Без спама и рекламы сторонних ресурсов',
    'Только тематический контент о беге',
    'Делитесь опытом и помогайте новичкам',
    'Используйте поиск перед созданием темы',
  ],
  moderators: [
    { id: 1, name: 'Александр В.', avatar: '👨‍🚀', role: 'Owner' },
    { id: 2, name: 'Ольга М.', avatar: '🏃‍♀️', role: 'Moderator' },
    { id: 3, name: 'Дмитрий К.', avatar: '🏃', role: 'Moderator' },
  ],
  admins: [
    { id: 1, name: 'Александр В.', avatar: '👨‍🚀' },
  ],
  upcomingEvents: [
    { id: 1, title: 'Московский Марафон 2026', date: '2026-09-20', participants: 234, type: 'race' },
    { id: 2, title: 'Совместная тренировка в Парке Горького', date: '2026-03-15', participants: 45, type: 'workout' },
    { id: 3, title: 'Вебинар: Подготовка к первому марафону', date: '2026-03-22', participants: 189, type: 'online' },
  ],
  tags: ['бег', 'марафон', 'кардио', 'здоровье', 'тренировки', 'спорт'],
  stats: {
    weeklyPosts: 156,
    weeklyGrowth: 234,
    avgEngagement: 78,
    topContributors: 25,
  },
});

const getGroupPosts = () => [
  {
    id: 1,
    user: { name: 'Ольга М.', avatar: '🏃‍♀️', isVerified: true },
    content: { text: 'Подготовка к Московскому марафону в полном разгаре! Кто уже зарегистрировался? 🏃‍♀️' },
    metrics: { likes: 89, comments: 23 },
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isLiked: false,
    isPinned: true,
  },
  {
    id: 2,
    user: { name: 'Александр В.', avatar: '👨‍🚀', isVerified: true },
    content: { text: 'Новичкам: начинайте с малых дистанций. 5К - отличная первая цель! Не гонитесь сразу за марафоном.' },
    metrics: { likes: 156, comments: 34 },
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    isLiked: true,
    isPinned: false,
  },
  {
    id: 3,
    user: { name: 'Мария К.', avatar: '🧘‍♀️', isVerified: false },
    content: { text: 'Вчера пробежала свой первый полумарафон за 2:05! Спасибо группе за поддержку и советы! 🎉' },
    metrics: { likes: 234, comments: 56 },
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
    isLiked: false,
    isPinned: false,
  },
  {
    id: 4,
    user: { name: 'Дмитрий П.', avatar: '🏋️', isVerified: false },
    content: { text: 'Какие кроссовки рекомендуете для подготовки к марафону? Вес 85кг, пронация нейтральная.' },
    metrics: { likes: 45, comments: 67 },
    timestamp: new Date(Date.now() - 1000 * 60 * 480),
    isLiked: false,
    isPinned: false,
  },
  {
    id: 5,
    user: { name: 'Елена С.', avatar: '🥗', isVerified: true },
    content: { text: 'Питание во время марафона - тема важная! Делюсь своим опытом: гели каждые 45 мин + изотоник.' },
    metrics: { likes: 178, comments: 41 },
    timestamp: new Date(Date.now() - 1000 * 60 * 720),
    isLiked: true,
    isPinned: false,
  },
];

const getGroupMembers = () => [
  { id: 1, name: 'Александр В.', avatar: '👨‍🚀', level: 42, isOnline: true, role: 'Owner' },
  { id: 2, name: 'Ольга М.', avatar: '🏃‍♀️', level: 47, isOnline: true, role: 'Moderator' },
  { id: 3, name: 'Дмитрий К.', avatar: '🏃', level: 38, isOnline: false, role: 'Moderator' },
  { id: 4, name: 'Мария К.', avatar: '🧘‍♀️', level: 35, isOnline: true, role: 'Member' },
  { id: 5, name: 'Елена С.', avatar: '🥗', level: 51, isOnline: false, role: 'Member' },
  { id: 6, name: 'Андрей Н.', avatar: '😴', level: 19, isOnline: true, role: 'Member' },
  { id: 7, name: 'Наталья И.', avatar: '🌿', level: 56, isOnline: false, role: 'Member' },
  { id: 8, name: 'Максим Л.', avatar: '🧬', level: 33, isOnline: true, role: 'Member' },
  { id: 9, name: 'Виктория О.', avatar: '🎯', level: 62, isOnline: false, role: 'Member' },
  { id: 10, name: 'Павел З.', avatar: '🚴', level: 31, isOnline: true, role: 'Member' },
  { id: 11, name: 'Анна К.', avatar: '🥑', level: 28, isOnline: false, role: 'Member' },
  { id: 12, name: 'Игорь С.', avatar: '🏋️', level: 22, isOnline: true, role: 'Member' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Group Header
const GroupHeader = ({ group, onJoinLeave }) => {
  const [isJoined, setIsJoined] = useState(group.isJoined);

  const handleJoinLeave = () => {
    setIsJoined(!isJoined);
    onJoinLeave(!isJoined);
  };

  return (
    <div className="neu-card" style={{ marginBottom: '20px', overflow: 'hidden' }}>
      {/* Cover Image */}
      <div style={{ 
        position: 'relative',
        height: '250px',
        overflow: 'hidden'
      }}>
        <img 
          src={group.cover} 
          alt={group.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: 'brightness(0.7)'
          }} 
        />
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '30px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              border: '4px solid var(--retro-cyan)',
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.4)',
              flexShrink: 0
            }}>
              {group.avatar}
            </div>
            <div style={{ flex: 1, paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#fff',
                  margin: 0,
                  textShadow: '0 0 20px rgba(0,0,0,0.5)'
                }}>
                  {group.name}
                </h1>
                {group.isVerified && (
                  <span style={{ 
                    background: 'var(--retro-cyan)',
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ Верифицировано
                  </span>
                )}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                {formatNumber(group.members)} участников • {formatNumber(group.onlineMembers)} онлайн
              </div>
            </div>
            <button
              onClick={handleJoinLeave}
              className={`neon-button ${isJoined ? 'neu-card-pressed' : 'neon-button-primary'}`}
              style={{ 
                borderColor: isJoined ? 'var(--retro-green)' : 'var(--retro-cyan)',
                color: isJoined ? 'var(--retro-green)' : 'var(--retro-cyan)',
                padding: '14px 32px',
                fontSize: '14px'
              }}
            >
              {isJoined ? '✓ В группе' : '+ Вступить'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '20px',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'var(--retro-cyan)',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
          }}>
            {formatNumber(group.members)}
          </div>
          <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Участников</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'var(--retro-green)',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
          }}>
            {formatNumber(group.onlineMembers)}
          </div>
          <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Онлайн</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'var(--retro-purple)',
            textShadow: '0 0 10px rgba(157, 78, 221, 0.5)'
          }}>
            {formatNumber(group.posts)}
          </div>
          <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Постов</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'var(--retro-gold)',
            textShadow: '0 0 10px rgba(240, 165, 0, 0.5)'
          }}>
            {group.upcomingEvents.length}
          </div>
          <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Событий</div>
        </div>
      </div>
    </div>
  );
};

// Members Grid
const MembersGrid = ({ members }) => {
  const [view, setView] = useState('online'); // online, all, moderators

  const filteredMembers = members.filter(m => {
    if (view === 'online') return m.isOnline;
    if (view === 'moderators') return ['Owner', 'Moderator'].includes(m.role);
    return true;
  });

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ 
          fontFamily: 'Orbitron', 
          fontSize: '16px', 
          color: '#fff',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>👥</span> Участники
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['online', 'moderators', 'all'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 12px',
                background: view === v ? 'var(--retro-cyan)' : 'rgba(0,0,0,0.3)',
                border: 'none',
                borderRadius: '8px',
                color: view === v ? '#000' : '#888',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.3s'
              }}
            >
              {v === 'online' ? 'Онлайн' : v === 'moderators' ? 'Админы' : 'Все'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
        {filteredMembers.map((member) => (
          <div 
            key={member.id}
            style={{ 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
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
              border: member.isOnline ? '2px solid var(--retro-green)' : '2px solid rgba(255,255,255,0.1)',
              boxShadow: member.isOnline ? '0 0 15px rgba(0, 255, 136, 0.4)' : 'none',
              position: 'relative'
            }}>
              {member.avatar}
              {['Owner', 'Moderator'].includes(member.role) && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: member.role === 'Owner' ? 'var(--retro-gold)' : 'var(--retro-purple)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  border: '2px solid var(--retro-bg)'
                }}>
                  {member.role === 'Owner' ? '👑' : '★'}
                </div>
              )}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#fff',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {member.name}
            </div>
            <div style={{ fontSize: '10px', color: '#666' }}>
              Lvl {member.level}
            </div>
          </div>
        ))}
      </div>

      <button 
        className="neon-button" 
        style={{ width: '100%', marginTop: '20px', fontSize: '12px', padding: '10px' }}
      >
        Показать всех участников ({formatNumber(members.length)})
      </button>
    </div>
  );
};

// Events Calendar (Holographic)
const EventsCalendar = ({ events }) => {
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'race': return '🏁';
      case 'workout': return '🏃';
      case 'online': return '💻';
      default: return '📅';
    }
  };

  return (
    <div className="holo-display" style={{ marginBottom: '20px' }}>
      <h3 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '16px', 
        color: 'var(--retro-cyan)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
      }}>
        <span>📅</span> Предстоящие События
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {events.map((event) => (
          <div 
            key={event.id}
            style={{ 
              display: 'flex',
              gap: '15px',
              padding: '15px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
              e.target.style.borderColor = 'var(--retro-cyan)';
              e.target.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0,0,0,0.3)';
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              border: '2px solid var(--retro-cyan)',
              flexShrink: 0
            }}>
              {getEventTypeIcon(event.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                color: '#fff', 
                fontWeight: 'bold', 
                fontSize: '14px',
                marginBottom: '6px'
              }}>
                {event.title}
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                fontSize: '12px', 
                color: '#888' 
              }}>
                <span>📅 {formatDate(event.date)}</span>
                <span>👥 {event.participants} участников</span>
              </div>
            </div>
            <button 
              className="neon-button"
              style={{ fontSize: '11px', padding: '8px 16px', alignSelf: 'center' }}
            >
              RSVP
            </button>
          </div>
        ))}
      </div>

      <button 
        className="neon-button" 
        style={{ width: '100%', marginTop: '20px', fontSize: '12px', padding: '10px' }}
      >
        Календарь событий
      </button>
    </div>
  );
};

// Group Rules
const GroupRules = ({ rules }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
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
          <span>📜</span> Правила Группы
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--retro-cyan)',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rules.slice(0, isExpanded ? rules.length : 3).map((rule, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex',
              gap: '12px',
              padding: '12px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              alignItems: 'flex-start'
            }}
          >
            <span style={{ 
              color: 'var(--retro-highlight)',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {index + 1}.
            </span>
            <span style={{ color: '#e0e0e0', fontSize: '13px', lineHeight: '1.5' }}>
              {rule}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Moderators Card
const ModeratorsCard = ({ moderators }) => {
  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '16px', 
        color: '#fff',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>👑</span> Администрация
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {moderators.map((mod) => (
          <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              border: mod.role === 'Owner' ? '2px solid var(--retro-gold)' : '2px solid var(--retro-purple)',
              boxShadow: mod.role === 'Owner' ? '0 0 15px rgba(240, 165, 0, 0.4)' : '0 0 15px rgba(157, 78, 221, 0.4)'
            }}>
              {mod.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
                  {mod.name}
                </span>
                <span style={{ 
                  fontSize: '10px', 
                  padding: '3px 8px', 
                  borderRadius: '6px',
                  background: mod.role === 'Owner' ? 'var(--retro-gold)' : 'var(--retro-purple)',
                  color: '#000',
                  fontWeight: 'bold'
                }}>
                  {mod.role}
                </span>
              </div>
            </div>
            <button 
              className="neon-button"
              style={{ fontSize: '10px', padding: '6px 12px' }}
            >
              💬
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Post Card (Simplified)
const GroupPostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.metrics.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
      {post.isPinned && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '12px',
          color: 'var(--retro-gold)',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <span>📌</span> Закреплённый пост
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          {post.user.avatar}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
              {post.user.name}
            </span>
            {post.user.isVerified && (
              <span style={{ color: 'var(--retro-cyan)', fontSize: '12px' }}>✓</span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {formatTimeAgo(post.timestamp)}
          </div>
        </div>
      </div>

      <p style={{ 
        color: '#e0e0e0', 
        lineHeight: '1.6', 
        fontSize: '14px',
        marginBottom: '15px',
        whiteSpace: 'pre-wrap'
      }}>
        {post.content.text}
      </p>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        paddingTop: '15px', 
        borderTop: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <button
          onClick={handleLike}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isLiked ? 'var(--retro-highlight)' : '#888',
            fontSize: '13px',
            transition: 'color 0.3s'
          }}
        >
          {isLiked ? '❤️' : '🤍'} {likes}
        </button>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--retro-cyan)',
          fontSize: '13px'
        }}>
          💬 {post.metrics.comments}
        </button>
      </div>
    </div>
  );
};

// Create Post Input
const CreatePostInput = () => {
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (content.trim()) {
      // In real app, send to API
      setContent('');
    }
  };

  return (
    <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
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
          👤
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Поделитесь новостью с группой..."
            rows={3}
            style={{ 
              width: '100%',
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--retro-cyan)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="neon-button" style={{ fontSize: '11px', padding: '6px 12px' }}>📷</button>
              <button className="neon-button" style={{ fontSize: '11px', padding: '6px 12px' }}>🎥</button>
              <button className="neon-button" style={{ fontSize: '11px', padding: '6px 12px' }}>📊</button>
            </div>
            <button 
              className="neon-button neon-button-primary"
              style={{ fontSize: '12px', padding: '8px 20px' }}
              onClick={handlePost}
              disabled={!content.trim()}
            >
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const GroupDetailV1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('feed'); // feed, about, events, members
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setGroup(getMockGroup(id));
      setPosts(getGroupPosts());
      setMembers(getGroupMembers());
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  const handleJoinLeave = (isJoined) => {
    setGroup({ ...group, isJoined });
  };

  if (isLoading) {
    return (
      <div className="social-v1-container">
        <div className="retro-grid-bg" />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh' 
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid rgba(0, 217, 255, 0.2)',
            borderTop: '4px solid var(--retro-cyan)',
            borderRadius: '50%',
            animation: 'spin-slow 1s linear infinite',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)'
          }} />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="social-v1-container">
        <div className="retro-grid-bg" />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: '20px'
        }}>
          <span style={{ fontSize: '80px' }}>🚫</span>
          <h2 style={{ color: '#fff', fontFamily: 'Orbitron' }}>Группа не найдена</h2>
          <button 
            className="neon-button"
            onClick={() => navigate('/social/groups-v1')}
          >
            ← К сообществам
          </button>
        </div>
      </div>
    );
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={() => navigate('/social/groups-v1')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--retro-cyan)',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Назад
            </button>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              border: '2px solid var(--retro-cyan)'
            }}>
              {group.avatar}
            </div>
            <span style={{ 
              fontWeight: 'bold', 
              color: '#fff',
              fontSize: '18px',
              fontFamily: 'Orbitron'
            }}>
              {group.name}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="neon-button" style={{ fontSize: '12px', padding: '8px 16px' }}>
              🔍
            </button>
            <button className="neon-button" style={{ fontSize: '12px', padding: '8px 16px' }}>
              🔔
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
          {/* Group Header */}
          <GroupHeader group={group} onJoinLeave={handleJoinLeave} />

          {/* Tabs */}
          <div className="neu-card" style={{ padding: '10px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
              {[
                { id: 'feed', label: 'Лента', icon: '📰' },
                { id: 'about', label: 'О группе', icon: 'ℹ️' },
                { id: 'events', label: 'События', icon: '📅' },
                { id: 'members', label: 'Участники', icon: '👥' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 20px',
                    background: activeTab === tab.id ? 'var(--gradient-cyber)' : 'rgba(0,0,0,0.3)',
                    border: activeTab === tab.id ? '2px solid var(--retro-cyan)' : '2px solid transparent',
                    borderRadius: '25px',
                    color: activeTab === tab.id ? '#fff' : '#888',
                    fontFamily: 'Orbitron',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'feed' && (
            <>
              <CreatePostInput />
              {posts.map((post) => (
                <GroupPostCard key={post.id} post={post} />
              ))}
            </>
          )}

          {activeTab === 'about' && (
            <div className="neu-card" style={{ padding: '25px' }}>
              <h3 style={{ 
                fontFamily: 'Orbitron', 
                fontSize: '18px', 
                color: '#fff',
                marginBottom: '15px'
              }}>
                О Группе
              </h3>
              <p style={{ 
                color: '#e0e0e0', 
                lineHeight: '1.8', 
                fontSize: '15px',
                marginBottom: '20px'
              }}>
                {group.description}
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '10px' }}>Теги:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {group.tags.map((tag, index) => (
                    <span 
                      key={index}
                      style={{ 
                        color: 'var(--retro-cyan)',
                        background: 'rgba(0, 217, 255, 0.1)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <GroupRules rules={group.rules} />
              <ModeratorsCard moderators={group.moderators} />
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <EventsCalendar events={group.upcomingEvents} />
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <MembersGrid members={members} />
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <MembersGrid members={members.slice(0, 8)} />
          <EventsCalendar events={group.upcomingEvents.slice(0, 2)} />
          <ModeratorsCard moderators={group.moderators} />
        </aside>
      </div>
    </div>
  );
};

export default GroupDetailV1;
