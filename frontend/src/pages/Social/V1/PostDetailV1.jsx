import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './SocialV1.css';

/**
 * PostDetailV1 - Детальная страница поста
 * Полный контент поста с медиа галереей и комментариями
 */

// ============================================
// MOCK DATA
// ============================================

const getMockPost = (postId) => ({
  id: parseInt(postId),
  user: {
    id: 1,
    name: 'Александр Волков',
    username: '@alexvolkov',
    avatar: '👨‍🚀',
    isVerified: true,
    level: 42,
    bio: 'Марафонец | Биохакинг | Путешествия',
    followers: 12450,
    following: 890,
    posts: 234,
    joinDate: '2024',
  },
  content: {
    text: '🚀 Только что завершил свой первый марафон за 3:45! EthosLife помог мне подготовиться лучше, чем я мог представить. Особенно полезны были AI-рекомендации по питанию и восстановлению.\n\nПодготовка заняла 16 недель. Вот что я использовал:\n• Интервальные тренировки 3 раза в неделю\n• Длинные пробежки по выходным\n• Трекинг сна для оптимального восстановления\n• Персонализированный план питания\n\nСпасибо всем кто поддерживал! #марафон #fitness #achievement',
    images: [
      'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
      'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=800',
    ],
    type: 'photo',
  },
  metrics: {
    likes: 234,
    comments: 45,
    shares: 12,
    views: 1250,
    bookmarks: 67,
  },
  isLiked: false,
  isSaved: false,
  timestamp: new Date(Date.now() - 1000 * 60 * 5),
  tags: ['марафон', 'fitness', 'achievement', 'running', 'health'],
  location: 'Москва, Парк Горького',
  weather: { temp: 18, condition: 'Солнечно' },
});

const getMockComments = () => [
  {
    id: 1,
    user: { name: 'Мария Козлова', username: '@mariakoz', avatar: '🧘‍♀️', isVerified: true, level: 38 },
    content: 'Поздравляю! Это невероятное достижение! 🎉 Я тоже готовлюсь к своему первому марафону, твой пост очень мотивирует!',
    likes: 24,
    replies: [
      {
        id: 11,
        user: { name: 'Александр Волков', username: '@alexvolkov', avatar: '👨‍🚀', isVerified: true, level: 42 },
        content: 'Спасибо! Главное - постепенность и регулярность. У тебя всё получится! 💪',
        likes: 8,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: 12,
        user: { name: 'Дмитрий П.', username: '@dmitryp', avatar: '🏋️', isVerified: false, level: 25 },
        content: 'Присоединяюсь к поздравлениям! Какой план тренировок использовал?',
        likes: 5,
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isLiked: false,
  },
  {
    id: 2,
    user: { name: 'Елена Смирнова', username: '@elenasmir', avatar: '🥗', isVerified: true, level: 51 },
    content: 'Отличный результат! А как ты питался во время забега? Планирую свой первый марафон через 2 месяца.',
    likes: 18,
    replies: [
      {
        id: 21,
        user: { name: 'Александр Волков', username: '@alexvolkov', avatar: '👨‍🚀', isVerified: true, level: 42 },
        content: 'Во время забега использовал гели каждые 45 минут + изотоник. До забега - паста за 3 часа. Детали в моем профиле!',
        likes: 12,
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isLiked: true,
  },
  {
    id: 3,
    user: { name: 'Ольга Морозова', username: '@olgamor', avatar: '🏃‍♀️', isVerified: true, level: 47 },
    content: '3:45 для первого марафона - это отлично! Я свой первый за 4:15 пробежала. Есть куда расти! 🏃‍♂️',
    likes: 15,
    replies: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isLiked: false,
  },
  {
    id: 4,
    user: { name: 'Фитнес Клуб "Атлант"', username: '@atlant_gym', avatar: '🏋️', isVerified: true, level: 55 },
    content: 'Поздравляем от всего клуба! Ждём тебя на награждении в эту субботу! 🏆',
    likes: 32,
    replies: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    isLiked: false,
  },
  {
    id: 5,
    user: { name: 'Андрей Новиков', username: '@andreynov', avatar: '😴', isVerified: false, level: 19 },
    content: 'Вдохновляешь! Начал бегать 3 месяца назад, марафон кажется чем-то невозможным. Но глядя на тебя - всё реально!',
    likes: 9,
    replies: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isLiked: false,
  },
  {
    id: 6,
    user: { name: 'Наталья Иванова', username: '@natalyia', avatar: '🌿', isVerified: true, level: 56 },
    content: 'А как восстанавливался после финиша? Массаж, крио, что-то ещё?',
    likes: 7,
    replies: [
      {
        id: 61,
        user: { name: 'Александр Волков', username: '@alexvolkov', avatar: '👨‍🚀', isVerified: true, level: 42 },
        content: 'Первые 30 мин - растяжка и изотоник. Вечером - массаж и контрастный душ. На следующий день - лёгкая прогулка.',
        likes: 6,
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    isLiked: false,
  },
];

const getRelatedPosts = () => [
  {
    id: 101,
    title: 'Как я подготовился к своему первому полумарафону',
    author: 'Мария К.',
    avatar: '🧘‍♀️',
    likes: 189,
    image: 'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?w=300',
  },
  {
    id: 102,
    title: 'Топ-10 ошибок начинающих бегунов',
    author: 'Дмитрий П.',
    avatar: '🏋️',
    likes: 456,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
  },
  {
    id: 103,
    title: 'Питание перед забегом: полное руководство',
    author: 'Елена С.',
    avatar: '🥗',
    likes: 312,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300',
  },
  {
    id: 104,
    title: 'Восстановление после марафона: 7 дней',
    author: 'Ольга М.',
    avatar: '🏃‍♀️',
    likes: 278,
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=300',
  },
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

// ============================================
// SUB-COMPONENTS
// ============================================

// Media Gallery Component
const MediaGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Main Image */}
      <div 
        style={{ 
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
        onClick={() => setIsLightboxOpen(true)}
      >
        <img 
          src={images[currentIndex]} 
          alt="" 
          style={{ 
            width: '100%', 
            maxHeight: '500px', 
            objectFit: 'cover',
            transition: 'transform 0.5s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                padding: '10px 15px',
                borderRadius: '50%',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 217, 255, 0.8)';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.6)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                padding: '10px 15px',
                borderRadius: '50%',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 217, 255, 0.8)';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.6)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ›
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            color: '#fff',
            backdropFilter: 'blur(10px)'
          }}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                flexShrink: 0,
                width: '80px',
                height: '80px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: currentIndex === index ? '2px solid var(--retro-cyan)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s',
                opacity: currentIndex === index ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== index) {
                  e.target.style.opacity = '0.8';
                  e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== index) {
                  e.target.style.opacity = '0.6';
                  e.target.style.borderColor = 'transparent';
                }
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '32px',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              zIndex: 10000
            }}
          >
            ✕
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            style={{
              position: 'absolute',
              left: '30px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '32px',
              padding: '15px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              zIndex: 10000
            }}
          >
            ‹
          </button>
          
          <img 
            src={images[currentIndex]} 
            alt="" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain' 
            }} 
          />
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            style={{
              position: 'absolute',
              right: '30px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '32px',
              padding: '15px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              zIndex: 10000
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

// Comment Component with Nested Replies
const Comment = ({ comment, onLike, onReply }) => {
  const [showReplies, setShowReplies] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          border: '2px solid rgba(255,255,255,0.1)',
          flexShrink: 0
        }}>
          {comment.user.avatar}
        </div>
        
        <div style={{ flex: 1 }}>
          {/* Comment Header */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '15px', 
            borderRadius: '16px',
            borderTopLeftRadius: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
                  {comment.user.name}
                </span>
                {comment.user.isVerified && (
                  <span style={{ color: 'var(--retro-cyan)', fontSize: '14px' }}>✓</span>
                )}
                <span style={{ fontSize: '11px', color: '#666' }}>
                  {comment.user.username}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#666' }}>
                {formatTimeAgo(comment.timestamp)}
              </span>
            </div>
            
            <div style={{ color: '#e0e0e0', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {comment.content}
            </div>
          </div>

          {/* Comment Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginTop: '8px', 
            paddingLeft: '12px' 
          }}>
            <button
              onClick={() => onLike(comment.id)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: comment.isLiked ? 'var(--retro-highlight)' : '#666', 
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.3s'
              }}
            >
              {comment.isLiked ? '❤️' : '🤍'} {comment.likes}
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--retro-cyan)', 
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Ответить
            </button>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: '#666', 
              cursor: 'pointer',
              fontSize: '13px'
            }}>
              Пожаловаться
            </button>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '12px',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Ответ ${comment.user.name}...`}
                style={{ 
                  flex: 1,
                  padding: '10px 15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  borderRadius: '20px',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  outline: 'none'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              <button
                onClick={handleReply}
                className="neon-button"
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                ➤
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ 
          marginTop: '15px', 
          paddingLeft: '52px',
          borderLeft: '2px solid rgba(0, 217, 255, 0.2)'
        }}>
          <button
            onClick={() => setShowReplies(!showReplies)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--retro-cyan)',
              cursor: 'pointer',
              fontSize: '12px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {showReplies ? '▼' : '▶'} {comment.replies.length} {showReplies ? 'ответов' : 'ответ'}
          </button>
          
          {showReplies && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {comment.replies.map((reply) => (
                <div key={reply.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {reply.user.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      background: 'rgba(0,0,0,0.15)', 
                      padding: '12px', 
                      borderRadius: '12px',
                      borderTopLeftRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>
                            {reply.user.name}
                          </span>
                          {reply.user.isVerified && (
                            <span style={{ color: 'var(--retro-cyan)', fontSize: '12px' }}>✓</span>
                          )}
                        </div>
                        <span style={{ fontSize: '10px', color: '#666' }}>
                          {formatTimeAgo(reply.timestamp)}
                        </span>
                      </div>
                      <div style={{ color: '#e0e0e0', fontSize: '13px', lineHeight: '1.4' }}>
                        {reply.content}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      marginTop: '6px', 
                      paddingLeft: '10px' 
                    }}>
                      <button style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#666', 
                        cursor: 'pointer',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        🤍 {reply.likes}
                      </button>
                      <button style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--retro-cyan)', 
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}>
                        Ответить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Author Info Card
const AuthorInfoCard = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="neu-card" style={{ padding: '25px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          margin: '0 auto 15px',
          border: '3px solid var(--retro-cyan)',
          boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)',
          position: 'relative'
        }}>
          {user.avatar}
          {user.isVerified && (
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              background: 'var(--retro-cyan)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              border: '3px solid var(--retro-bg)',
              boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
            }}>
              ✓
            </div>
          )}
        </div>
        
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: 'bold', 
          color: '#fff',
          marginBottom: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {user.name}
          {user.isVerified && <span style={{ color: 'var(--retro-cyan)' }}>✓</span>}
        </h2>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
          {user.username}
        </div>
        <div style={{ 
          background: 'var(--gradient-cyber)',
          padding: '6px 16px',
          borderRadius: '20px',
          display: 'inline-block',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          ⚡ Уровень {user.level}
        </div>
      </div>

      {/* Bio */}
      <p style={{ 
        color: '#e0e0e0', 
        textAlign: 'center', 
        lineHeight: '1.6',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        {user.bio}
      </p>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '15px',
        marginBottom: '20px',
        padding: '15px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'var(--retro-cyan)',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
          }}>
            {formatNumber(user.posts)}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Посты</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'var(--retro-purple)',
            textShadow: '0 0 10px rgba(157, 78, 221, 0.5)'
          }}>
            {formatNumber(user.followers)}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Подписчики</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'var(--retro-green)',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
          }}>
            {formatNumber(user.following)}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Подписки</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`neon-button ${isFollowing ? 'neu-card-pressed' : ''}`}
          style={{ 
            flex: 1,
            borderColor: isFollowing ? '#666' : 'var(--retro-cyan)',
            color: isFollowing ? '#666' : 'var(--retro-cyan)'
          }}
        >
          {isFollowing ? '✓ Подписан' : '+ Подписаться'}
        </button>
        <button className="neon-button neon-button-primary" style={{ flex: 1 }}>
          💬 Сообщение
        </button>
      </div>

      {/* Join Date */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '15px' 
      }}>
        В EthosLife с {user.joinDate}
      </div>
    </div>
  );
};

// Related Posts Carousel
const RelatedPostsCarousel = ({ posts }) => {
  return (
    <div className="neu-card" style={{ padding: '20px' }}>
      <h3 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '16px', 
        color: '#fff',
        marginBottom: '20px'
      }}>
        🔗 Похожие посты
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/social/post/${post.id}-v1`}
            style={{
              textDecoration: 'none',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.2)',
              transition: 'transform 0.3s, box-shadow 0.3s'
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
            <div style={{ position: 'relative' }}>
              <img 
                src={post.image} 
                alt="" 
                style={{ 
                  width: '100%', 
                  height: '120px', 
                  objectFit: 'cover' 
                }} 
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.7)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ❤️ {formatNumber(post.likes)}
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ 
                fontSize: '13px', 
                color: '#fff', 
                lineHeight: '1.4',
                marginBottom: '8px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {post.title}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>{post.avatar}</span>
                <span>{post.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Share Modal
const ShareModal = ({ post, onClose }) => {
  const shareOptions = [
    { id: 'copy', icon: '📋', label: 'Копировать ссылку', color: 'var(--retro-cyan)' },
    { id: 'telegram', icon: '✈️', label: 'Telegram', color: '#0088cc' },
    { id: 'vk', icon: 'VK', label: 'ВКонтакте', color: '#0077FF' },
    { id: 'twitter', icon: '🐦', label: 'Twitter', color: '#1DA1F2' },
    { id: 'whatsapp', icon: '📱', label: 'WhatsApp', color: '#25D366' },
    { id: 'email', icon: '📧', label: 'Email', color: 'var(--retro-purple)' },
  ];

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
          maxWidth: '400px',
          padding: '25px',
          animation: 'scaleIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ 
            fontFamily: 'Orbitron', 
            fontSize: '18px', 
            color: '#fff',
            margin: 0
          }}>
            Поделиться
          </h3>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                // Handle share
                onClose();
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '20px 10px',
                background: 'rgba(0,0,0,0.2)',
                border: `1px solid ${option.color}40`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = `${option.color}20`;
                e.target.style.borderColor = option.color;
                e.target.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.2)';
                e.target.style.borderColor = `${option.color}40`;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '28px' }}>{option.icon}</span>
              <span style={{ fontSize: '12px', color: '#fff' }}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const PostDetailV1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setPost(getMockPost(id));
      setComments(getMockComments());
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  const handleLike = () => {
    setPost({
      ...post,
      isLiked: !post.isLiked,
      metrics: {
        ...post.metrics,
        likes: post.isLiked ? post.metrics.likes - 1 : post.metrics.likes + 1
      }
    });
  };

  const handleSave = () => {
    setPost({ ...post, isSaved: !post.isSaved });
  };

  const handleCommentLike = (commentId) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  const handleReply = (commentId, content) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, {
            id: Date.now(),
            user: { name: 'Вы', username: '@you', avatar: '👤', isVerified: false, level: 1 },
            content,
            likes: 0,
            timestamp: new Date()
          }]
        };
      }
      return c;
    }));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: { name: 'Вы', username: '@you', avatar: '👤', isVerified: false, level: 1 },
        content: newComment,
        likes: 0,
        replies: [],
        timestamp: new Date(),
        isLiked: false
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
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

  if (!post) {
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
          <h2 style={{ color: '#fff', fontFamily: 'Orbitron' }}>Пост не найден</h2>
          <button 
            className="neon-button"
            onClick={() => navigate('/social-v1')}
          >
            ← Назад к ленте
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
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate('/social-v1')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              color: 'var(--retro-cyan)',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Orbitron'
            }}
          >
            ← Назад
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="neon-button"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              🔍
            </button>
            <button 
              className="neon-button neon-button-primary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
              onClick={() => setShowShareModal(true)}
            >
              🔗 Поделиться
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Post Content */}
        <main>
          {/* Post Card */}
          <div className="neu-card" style={{ padding: '30px', marginBottom: '20px' }}>
            {/* Author Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  border: '3px solid var(--retro-cyan)',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'
                }}>
                  {post.user.avatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '18px' }}>
                      {post.user.name}
                    </span>
                    {post.user.isVerified && (
                      <span style={{ color: 'var(--retro-cyan)', fontSize: '16px' }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {post.user.username} • {formatTimeAgo(post.timestamp)}
                  </div>
                  {post.location && (
                    <div style={{ fontSize: '12px', color: 'var(--retro-cyan)', marginTop: '4px' }}>
                      📍 {post.location}
                      {post.weather && ` • ${post.weather.temp}°C, ${post.weather.condition}`}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ 
                color: '#e0e0e0', 
                lineHeight: '1.8', 
                fontSize: '16px',
                whiteSpace: 'pre-wrap',
                marginBottom: '20px'
              }}>
                {post.content.text}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      style={{ 
                        color: 'var(--retro-cyan)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Media Gallery */}
              <MediaGallery images={post.content.images} />
            </div>

            {/* Metrics Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '15px 0',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  <span style={{ color: 'var(--retro-highlight)', fontWeight: 'bold' }}>{formatNumber(post.metrics.likes)}</span> лайков
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  <span style={{ color: 'var(--retro-cyan)', fontWeight: 'bold' }}>{formatNumber(post.metrics.comments)}</span> комментариев
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  <span style={{ color: 'var(--retro-purple)', fontWeight: 'bold' }}>{formatNumber(post.metrics.shares)}</span> репостов
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#888' }}>
                <span style={{ color: 'var(--retro-green)', fontWeight: 'bold' }}>{formatNumber(post.metrics.views)}</span> просмотров
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={handleLike}
                className={`like-button ${post.isLiked ? 'liked' : ''}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  transition: 'all 0.3s'
                }}
              >
                <span className="heart-icon" style={{ 
                  fontSize: '24px', 
                  color: post.isLiked ? 'var(--retro-highlight)' : '#888',
                  transition: 'all 0.3s'
                }}>
                  {post.isLiked ? '❤️' : '🤍'}
                </span>
                <span style={{ 
                  color: post.isLiked ? 'var(--retro-highlight)' : '#888', 
                  fontSize: '15px',
                  fontWeight: 'bold'
                }}>
                  {post.isLiked ? 'Нравится' : 'Лайк'}
                </span>
              </button>

              <button
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0, 217, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <span style={{ fontSize: '24px', color: 'var(--retro-cyan)' }}>💬</span>
                <span style={{ color: 'var(--retro-cyan)', fontSize: '15px', fontWeight: 'bold' }}>
                  Комментировать
                </span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(157, 78, 221, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <span style={{ fontSize: '24px', color: 'var(--retro-purple)' }}>🔗</span>
                <span style={{ color: 'var(--retro-purple)', fontSize: '15px', fontWeight: 'bold' }}>
                  Поделиться
                </span>
              </button>

              <button
                onClick={handleSave}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(240, 165, 0, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <span style={{ fontSize: '24px', color: post.isSaved ? 'var(--retro-gold)' : '#888' }}>
                  {post.isSaved ? '🔖' : '📑'}
                </span>
                <span style={{ color: post.isSaved ? 'var(--retro-gold)' : '#888', fontSize: '15px', fontWeight: 'bold' }}>
                  {post.isSaved ? 'Сохранено' : 'Сохранить'}
                </span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="neu-card" style={{ padding: '30px' }}>
            <h3 style={{ 
              fontFamily: 'Orbitron', 
              fontSize: '18px', 
              color: '#fff',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              💬 Комментарии 
              <span style={{ color: '#666', fontSize: '14px' }}>({comments.length})</span>
            </h3>

            {/* Add Comment */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                border: '2px solid var(--retro-cyan)',
                flexShrink: 0
              }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Написать комментарий..."
                  rows={3}
                  style={{ 
                    width: '100%',
                    padding: '15px',
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    onClick={handleAddComment}
                    className="neon-button neon-button-primary"
                    style={{ fontSize: '13px', padding: '10px 24px' }}
                    disabled={!newComment.trim()}
                  >
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div>
              {comments.map((comment) => (
                <Comment 
                  key={comment.id} 
                  comment={comment} 
                  onLike={handleCommentLike}
                  onReply={handleReply}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <AuthorInfoCard user={post.user} />
          <div style={{ marginTop: '20px' }}>
            <RelatedPostsCarousel posts={getRelatedPosts()} />
          </div>
        </aside>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal post={post} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default PostDetailV1;
