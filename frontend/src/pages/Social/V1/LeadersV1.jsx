import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SocialV1.css';

/**
 * LeadersV1 - Лидерборды и рейтинги
 * 3D рейтинг с анимированными счетчиками и трендами
 */

// ============================================
// MOCK DATA
// ============================================

const generateLeaderboardData = () => ({
  weekly: {
    steps: [
      { rank: 1, name: 'Александр В.', username: '@alexvolkov', avatar: '👨‍🚀', score: 156789, trend: 'up', change: 0, level: 42, isVerified: true },
      { rank: 2, name: 'Ольга М.', username: '@olgamor', avatar: '🏃‍♀️', score: 145234, trend: 'up', change: 1, level: 47, isVerified: true },
      { rank: 3, name: 'Дмитрий К.', username: '@dmitryk', avatar: '🏃', score: 138456, trend: 'down', change: -1, level: 38, isVerified: false },
      { rank: 4, name: 'Павел З.', username: '@pavzin', avatar: '🚴', score: 132890, trend: 'up', change: 2, level: 31, isVerified: false },
      { rank: 5, name: 'Мария К.', username: '@mariakoz', avatar: '🧘‍♀️', score: 128567, trend: 'same', change: 0, level: 38, isVerified: true },
      { rank: 6, name: 'Елена С.', username: '@elenasmir', avatar: '🥗', score: 121345, trend: 'down', change: -2, level: 51, isVerified: true },
      { rank: 7, name: 'Наталья И.', username: '@natalyia', avatar: '🌿', score: 115678, trend: 'up', change: 1, level: 56, isVerified: true },
      { rank: 8, name: 'Максим Л.', username: '@maxleb', avatar: '🧬', score: 109234, trend: 'up', change: 3, level: 33, isVerified: false },
      { rank: 9, name: 'Виктория О.', username: '@vikaorl', avatar: '🎯', score: 102567, trend: 'down', change: -1, level: 62, isVerified: true },
      { rank: 10, name: 'Андрей Н.', username: '@andreynov', avatar: '😴', score: 98456, trend: 'same', change: 0, level: 19, isVerified: false },
    ],
    workouts: [
      { rank: 1, name: 'Дмитрий П.', username: '@dmitryp', avatar: '🏋️', score: 45, trend: 'up', change: 0, level: 25, isVerified: false },
      { rank: 2, name: 'Игорь С.', username: '@igorsok', avatar: '🏋️', score: 42, trend: 'up', change: 1, level: 22, isVerified: false },
      { rank: 3, name: 'Сергей В.', username: '@servolk', avatar: '💪', score: 38, trend: 'down', change: -1, level: 22, isVerified: false },
      { rank: 4, name: 'Александр В.', username: '@alexvolkov', avatar: '👨‍🚀', score: 35, trend: 'same', change: 0, level: 42, isVerified: true },
      { rank: 5, name: 'Ольга М.', username: '@olgamor', avatar: '🏃‍♀️', score: 32, trend: 'up', change: 2, level: 47, isVerified: true },
    ],
    sleep: [
      { rank: 1, name: 'Андрей Н.', username: '@andreynov', avatar: '😴', score: 98, trend: 'up', change: 0, level: 19, isVerified: false },
      { rank: 2, name: 'Юлия М.', username: '@julymed', avatar: '🧘', score: 96, trend: 'up', change: 1, level: 49, isVerified: true },
      { rank: 3, name: 'Мария К.', username: '@mariakoz', avatar: '🧘‍♀️', score: 94, trend: 'down', change: -1, level: 38, isVerified: true },
      { rank: 4, name: 'Наталья И.', username: '@natalyia', avatar: '🌿', score: 92, trend: 'same', change: 0, level: 56, isVerified: true },
      { rank: 5, name: 'Елена С.', username: '@elenasmir', avatar: '🥗', score: 90, trend: 'up', change: 1, level: 51, isVerified: true },
    ],
    streaks: [
      { rank: 1, name: 'Виктория О.', username: '@vikaorl', avatar: '🎯', score: 365, trend: 'up', change: 0, level: 62, isVerified: true },
      { rank: 2, name: 'Наталья И.', username: '@natalyia', avatar: '🌿', score: 287, trend: 'up', change: 0, level: 56, isVerified: true },
      { rank: 3, name: 'Елена С.', username: '@elenasmir', avatar: '🥗', score: 234, trend: 'up', change: 0, level: 51, isVerified: true },
      { rank: 4, name: 'Ольга М.', username: '@olgamor', avatar: '🏃‍♀️', score: 189, trend: 'up', change: 0, level: 47, isVerified: true },
      { rank: 5, name: 'Александр В.', username: '@alexvolkov', avatar: '👨‍🚀', score: 156, trend: 'up', change: 0, level: 42, isVerified: true },
    ],
    nutrition: [
      { rank: 1, name: 'Елена С.', username: '@elenasmir', avatar: '🥗', score: 2890, trend: 'up', change: 0, level: 51, isVerified: true },
      { rank: 2, name: 'Наталья И.', username: '@natalyia', avatar: '🌿', score: 2567, trend: 'up', change: 0, level: 56, isVerified: true },
      { rank: 3, name: 'Анна К.', username: '@annakuz', avatar: '🥑', score: 2234, trend: 'up', change: 1, level: 28, isVerified: false },
      { rank: 4, name: 'Мария К.', username: '@mariakoz', avatar: '🧘‍♀️', score: 1987, trend: 'down', change: -1, level: 38, isVerified: true },
      { rank: 5, name: 'Виктория О.', username: '@vikaorl', avatar: '🎯', score: 1756, trend: 'same', change: 0, level: 62, isVerified: true },
    ],
  },
  monthly: {
    steps: [
      { rank: 1, name: 'Ольга М.', username: '@olgamor', avatar: '🏃‍♀️', score: 456789, trend: 'up', change: 1, level: 47, isVerified: true },
      { rank: 2, name: 'Александр В.', username: '@alexvolkov', avatar: '👨‍🚀', score: 445234, trend: 'down', change: -1, level: 42, isVerified: true },
      { rank: 3, name: 'Павел З.', username: '@pavzin', avatar: '🚴', score: 398456, trend: 'up', change: 1, level: 31, isVerified: false },
    ],
  },
  allTime: {
    steps: [
      { rank: 1, name: 'Виктория О.', username: '@vikaorl', avatar: '🎯', score: 1567890, trend: 'same', change: 0, level: 62, isVerified: true },
      { rank: 2, name: 'Наталья И.', username: '@natalyia', avatar: '🌿', score: 1456789, trend: 'same', change: 0, level: 56, isVerified: true },
      { rank: 3, name: 'Елена С.', username: '@elenasmir', avatar: '🥗', score: 1234567, trend: 'same', change: 0, level: 51, isVerified: true },
    ],
  },
});

const categories = [
  { id: 'steps', label: 'Шаги', icon: '👟', color: 'var(--retro-cyan)', unit: 'шагов' },
  { id: 'workouts', label: 'Тренировки', icon: '💪', color: 'var(--retro-highlight)', unit: 'тренировок' },
  { id: 'sleep', label: 'Сон', icon: '😴', color: 'var(--retro-purple)', unit: 'качество' },
  { id: 'streaks', label: 'Серии', icon: '🔥', color: 'var(--retro-gold)', unit: 'дней' },
  { id: 'nutrition', label: 'Питание', icon: '🥗', color: 'var(--retro-green)', unit: 'калорий' },
];

const timePeriods = [
  { id: 'weekly', label: 'Неделя', icon: '📅' },
  { id: 'monthly', label: 'Месяц', icon: '📆' },
  { id: 'allTime', label: 'За всё время', icon: '🏆' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

const getRankStyle = (rank) => {
  switch (rank) {
    case 1: return { color: 'var(--retro-gold)', glow: 'rgba(240, 165, 0, 0.5)' };
    case 2: return { color: '#C0C0C0', glow: 'rgba(192, 192, 192, 0.5)' };
    case 3: return { color: '#CD7F32', glow: 'rgba(205, 127, 50, 0.5)' };
    default: return { color: '#888', glow: 'transparent' };
  }
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Animated Counter
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{formatNumber(displayValue)}</span>;
};

// Rank Badge 3D
const RankBadge = ({ rank }) => {
  const style = getRankStyle(rank);

  if (rank <= 3) {
    return (
      <div style={{ 
        width: '50px', 
        height: '50px', 
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${style.color}, ${style.color}88)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#000',
        boxShadow: `0 0 20px ${style.glow}, inset 0 0 10px rgba(255,255,255,0.3)`,
        border: `3px solid ${style.color}`,
        position: 'relative',
        animation: rank === 1 ? 'float 3s ease-in-out infinite' : 'none'
      }}>
        {rank === 1 && '👑'}
        {rank === 2 && '🥈'}
        {rank === 3 && '🥉'}
        <div style={{
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          right: '-5px',
          bottom: '-5px',
          borderRadius: '50%',
          border: `2px solid ${style.color}`,
          opacity: 0.5,
          animation: 'pulse-glow 2s ease-in-out infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{ 
      width: '40px', 
      height: '40px', 
      borderRadius: '50%',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#888',
      border: '2px solid rgba(255,255,255,0.1)'
    }}>
      {rank}
    </div>
  );
};

// Trend Indicator
const TrendIndicator = ({ trend, change }) => {
  if (trend === 'same' || change === 0) {
    return <span style={{ color: '#666', fontSize: '14px' }}>―</span>;
  }

  return (
    <span style={{ 
      color: trend === 'up' ? 'var(--retro-green)' : 'var(--retro-highlight)',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      textShadow: trend === 'up' ? '0 0 5px rgba(0, 255, 136, 0.5)' : '0 0 5px rgba(233, 69, 96, 0.5)'
    }}>
      {trend === 'up' ? '↑' : '↓'}
      {change !== 0 && <span style={{ fontSize: '11px' }}>{Math.abs(change)}</span>}
    </span>
  );
};

// Leaderboard Row
const LeaderboardRow = ({ user, index, category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const style = getRankStyle(user.rank);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px 20px',
        background: isHovered ? 'rgba(0, 217, 255, 0.05)' : 'transparent',
        borderRadius: '12px',
        marginBottom: '8px',
        border: user.rank <= 3 ? `1px solid ${style.color}40` : '1px solid transparent',
        transition: 'all 0.3s',
        cursor: 'pointer',
        transform: isHovered ? 'translateX(5px)' : 'translateX(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rank */}
      <div style={{ minWidth: '50px' }}>
        <RankBadge rank={user.rank} />
      </div>

      {/* Avatar & Name */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        flex: 1
      }}>
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          border: user.rank <= 3 ? `2px solid ${style.color}` : '2px solid rgba(255,255,255,0.1)',
          boxShadow: user.rank <= 3 ? `0 0 15px ${style.glow}` : 'none'
        }}>
          {user.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontWeight: 'bold', 
              color: '#fff',
              fontSize: '14px'
            }}>
              {user.name}
            </span>
            {user.isVerified && (
              <span style={{ color: 'var(--retro-cyan)', fontSize: '12px' }}>✓</span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {user.username} • Lvl {user.level}
          </div>
        </div>
      </div>

      {/* Trend */}
      <div style={{ width: '40px', textAlign: 'center' }}>
        <TrendIndicator trend={user.trend} change={user.change} />
      </div>

      {/* Score */}
      <div style={{ 
        minWidth: '120px',
        textAlign: 'right'
      }}>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: user.rank <= 3 ? style.color : 'var(--retro-cyan)',
          textShadow: user.rank <= 3 ? `0 0 10px ${style.glow}` : '0 0 10px rgba(0, 217, 255, 0.5)'
        }}>
          <AnimatedCounter value={user.score} />
        </div>
        <div style={{ fontSize: '11px', color: '#666' }}>
          {category.unit}
        </div>
      </div>
    </div>
  );
};

// Top 3 Podium
const Top3Podium = ({ users, category }) => {
  if (!users || users.length < 3) return null;

  const [first, second, third] = users;
  const firstStyle = getRankStyle(1);
  const secondStyle = getRankStyle(2);
  const thirdStyle = getRankStyle(3);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-end', 
      gap: '15px',
      padding: '30px 20px',
      marginBottom: '30px'
    }}>
      {/* Second Place */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          margin: '0 auto 15px',
          border: `3px solid ${secondStyle.color}`,
          boxShadow: `0 0 25px ${secondStyle.glow}`,
          position: 'relative'
        }}>
          {second.avatar}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            background: secondStyle.color,
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000'
          }}>
            #2
          </div>
        </div>
        <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>{second.name}</div>
        <div style={{ fontSize: '13px', color: secondStyle.color, textShadow: `0 0 10px ${secondStyle.glow}` }}>
          <AnimatedCounter value={second.score} />
        </div>
        <div style={{ 
          width: '80px',
          height: '100px',
          background: `linear-gradient(180deg, ${secondStyle.color}40, ${secondStyle.color}20)`,
          borderRadius: '8px 8px 0 0',
          marginTop: '15px',
          border: `1px solid ${secondStyle.color}40`,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            fontWeight: 'bold',
            color: secondStyle.color
          }}>
            🥈
          </div>
        </div>
      </div>

      {/* First Place */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '90px', 
          height: '90px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '44px',
          margin: '0 auto 15px',
          border: `4px solid ${firstStyle.color}`,
          boxShadow: `0 0 35px ${firstStyle.glow}`,
          position: 'relative',
          animation: 'float 3s ease-in-out infinite'
        }}>
          {first.avatar}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            background: firstStyle.color,
            padding: '6px 16px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000'
          }}>
            👑 #1
          </div>
        </div>
        <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>{first.name}</div>
        <div style={{ fontSize: '16px', color: firstStyle.color, textShadow: `0 0 15px ${firstStyle.glow}` }}>
          <AnimatedCounter value={first.score} />
        </div>
        <div style={{ 
          width: '100px',
          height: '140px',
          background: `linear-gradient(180deg, ${firstStyle.color}40, ${firstStyle.color}20)`,
          borderRadius: '8px 8px 0 0',
          marginTop: '15px',
          border: `2px solid ${firstStyle.color}40`,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '32px',
            fontWeight: 'bold',
            color: firstStyle.color
          }}>
            🥇
          </div>
        </div>
      </div>

      {/* Third Place */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          margin: '0 auto 15px',
          border: `3px solid ${thirdStyle.color}`,
          boxShadow: `0 0 25px ${thirdStyle.glow}`,
          position: 'relative'
        }}>
          {third.avatar}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            background: thirdStyle.color,
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000'
          }}>
            #3
          </div>
        </div>
        <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>{third.name}</div>
        <div style={{ fontSize: '13px', color: thirdStyle.color, textShadow: `0 0 10px ${thirdStyle.glow}` }}>
          <AnimatedCounter value={third.score} />
        </div>
        <div style={{ 
          width: '80px',
          height: '70px',
          background: `linear-gradient(180deg, ${thirdStyle.color}40, ${thirdStyle.color}20)`,
          borderRadius: '8px 8px 0 0',
          marginTop: '15px',
          border: `1px solid ${thirdStyle.color}40`,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            fontWeight: 'bold',
            color: thirdStyle.color
          }}>
            🥉
          </div>
        </div>
      </div>
    </div>
  );
};

// Your Position Widget
const YourPositionWidget = ({ leaderboardData, category }) => {
  // Simulate user position (in real app, get from API)
  const userPosition = {
    rank: 47,
    name: 'Вы',
    username: '@you',
    avatar: '👤',
    score: 45678,
    level: 25,
  };

  return (
    <div className="neu-card" style={{ 
      padding: '20px', 
      marginBottom: '25px',
      border: '2px solid var(--retro-cyan)',
      background: 'rgba(0, 217, 255, 0.05)'
    }}>
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
          <span>📍</span> Ваша Позиция
        </h3>
        <span style={{ 
          fontSize: '11px', 
          color: 'var(--retro-cyan)',
          background: 'rgba(0, 217, 255, 0.2)',
          padding: '4px 12px',
          borderRadius: '12px'
        }}>
          Топ {Math.round((userPosition.rank / 10000) * 100)}%
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          border: '3px solid var(--retro-cyan)',
          boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
        }}>
          {userPosition.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>
            {userPosition.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {userPosition.username} • Lvl {userPosition.level}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--retro-cyan)', textShadow: '0 0 15px rgba(0, 217, 255, 0.5)' }}>
            #{userPosition.rank}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--retro-cyan)' }}>
            <AnimatedCounter value={userPosition.score} /> {category.unit}
          </div>
        </div>
      </div>

      {/* Progress to next rank */}
      <div style={{ marginTop: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: '#888' }}>До топ-40</span>
          <span style={{ fontSize: '11px', color: 'var(--retro-cyan)' }}>4,322 {category.unit}</span>
        </div>
        <div style={{ 
          height: '8px', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: '70%',
            height: '100%',
            background: 'var(--gradient-cyber)',
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
          }} />
        </div>
      </div>
    </div>
  );
};

// Rewards Preview Widget
const RewardsPreviewWidget = () => {
  const rewards = [
    { rank: '1-3', reward: 5000, icon: '🏆', color: 'var(--retro-gold)' },
    { rank: '4-10', reward: 2000, icon: '🥈', color: '#C0C0C0' },
    { rank: '11-50', reward: 1000, icon: '🥉', color: '#CD7F32' },
    { rank: '51-100', reward: 500, icon: '🎖️', color: 'var(--retro-cyan)' },
  ];

  return (
    <div className="holo-display" style={{ marginBottom: '25px' }}>
      <h3 style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '16px', 
        color: 'var(--retro-gold)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textShadow: '0 0 10px rgba(240, 165, 0, 0.5)'
      }}>
        💎 Награды Недели
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rewards.map((item, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px',
              border: `1px solid ${item.color}40`
            }}
          >
            <div style={{ fontSize: '24px' }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#888' }}>Места {item.rank}</div>
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: item.color,
              textShadow: `0 0 10px ${item.color}60`
            }}>
              💎 {item.reward.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '12px',
        background: 'rgba(240, 165, 0, 0.1)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--retro-gold)', marginBottom: '4px' }}>
          До конца сезона
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--retro-gold)', textShadow: '0 0 10px rgba(240, 165, 0, 0.5)' }}>
          4 дня 12 часов
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const LeadersV1 = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [activePeriod, setActivePeriod] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('steps');
  const [activeTab, setActiveTab] = useState('global'); // global, friends
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLeaderboardData(generateLeaderboardData());
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getCurrentLeaderboard = () => {
    if (!leaderboardData) return [];
    const periodData = leaderboardData[activePeriod] || leaderboardData.weekly;
    return periodData[activeCategory] || periodData.steps;
  };

  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];
  const currentLeaderboard = getCurrentLeaderboard();

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
              🏆 Лидерборды
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="neon-button" style={{ fontSize: '12px', padding: '8px 16px' }}>
              📊 Статистика
            </button>
            <button className="neon-button neon-button-gold" style={{ fontSize: '12px', padding: '8px 16px' }}>
              💎 Мои награды
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
          {/* Time Period Tabs */}
          <div className="neu-card" style={{ padding: '15px 20px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {timePeriods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setActivePeriod(period.id)}
                  style={{
                    padding: '12px 24px',
                    background: activePeriod === period.id ? 'var(--gradient-gold)' : 'rgba(0,0,0,0.3)',
                    border: activePeriod === period.id ? '2px solid var(--retro-gold)' : '2px solid transparent',
                    borderRadius: '25px',
                    color: activePeriod === period.id ? '#fff' : '#888',
                    fontFamily: 'Orbitron',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <span>{period.icon}</span>
                  <span>{period.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="neu-card" style={{ padding: '15px 20px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '12px 20px',
                    background: activeCategory === cat.id ? `${cat.color}20` : 'rgba(0,0,0,0.3)',
                    border: activeCategory === cat.id ? `2px solid ${cat.color}` : '2px solid transparent',
                    borderRadius: '25px',
                    color: activeCategory === cat.id ? cat.color : '#888',
                    fontFamily: 'Orbitron',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Your Position */}
          <YourPositionWidget 
            leaderboardData={currentLeaderboard} 
            category={currentCategory}
          />

          {/* Top 3 Podium */}
          {isLoading ? (
            <div className="neu-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                border: '4px solid rgba(0, 217, 255, 0.2)',
                borderTop: '4px solid var(--retro-cyan)',
                borderRadius: '50%',
                animation: 'spin-slow 1s linear infinite',
                margin: '0 auto',
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)'
              }} />
            </div>
          ) : (
            <Top3Podium users={currentLeaderboard.slice(0, 3)} category={currentCategory} />
          )}

          {/* Leaderboard List */}
          <div className="neu-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ 
                fontFamily: 'Orbitron', 
                fontSize: '18px', 
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📋</span> Полный Рейтинг
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setActiveTab('global')}
                  style={{
                    padding: '8px 16px',
                    background: activeTab === 'global' ? 'var(--retro-cyan)' : 'rgba(0,0,0,0.3)',
                    border: 'none',
                    borderRadius: '20px',
                    color: activeTab === 'global' ? '#000' : '#888',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🌍 Все
                </button>
                <button
                  onClick={() => setActiveTab('friends')}
                  style={{
                    padding: '8px 16px',
                    background: activeTab === 'friends' ? 'var(--retro-green)' : 'rgba(0,0,0,0.3)',
                    border: 'none',
                    borderRadius: '20px',
                    color: activeTab === 'friends' ? '#000' : '#888',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  👥 Друзья
                </button>
              </div>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} style={{ display: 'flex', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <div className="skeleton" style={{ flex: 1, height: '20px' }} />
                    <div className="skeleton" style={{ width: '100px', height: '30px' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {currentLeaderboard.slice(3).map((user, index) => (
                  <LeaderboardRow 
                    key={user.rank} 
                    user={user} 
                    index={index + 3}
                    category={currentCategory}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <RewardsPreviewWidget />

          {/* Quick Stats */}
          <div className="neu-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ 
              fontFamily: 'Orbitron', 
              fontSize: '16px', 
              color: '#fff',
              marginBottom: '20px'
            }}>
              📈 Ваш Прогресс
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>На этой неделе</span>
                  <span style={{ fontSize: '12px', color: 'var(--retro-green)' }}>+12%</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '65%',
                    height: '100%',
                    background: 'var(--gradient-matrix)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>В этом месяце</span>
                  <span style={{ fontSize: '12px', color: 'var(--retro-green)' }}>+28%</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '78%',
                    height: '100%',
                    background: 'var(--gradient-neon)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="neu-card" style={{ padding: '20px' }}>
            <h3 style={{ 
              fontFamily: 'Orbitron', 
              fontSize: '16px', 
              color: '#fff',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🏅 Достижения
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['🥇', '🏃', '🔥', '💪', '😴', '🥗'].map((icon, index) => (
                <div 
                  key={index}
                  style={{ 
                    textAlign: 'center',
                    padding: '10px',
                    background: index < 3 ? 'rgba(240, 165, 0, 0.1)' : 'rgba(0,0,0,0.2)',
                    borderRadius: '10px',
                    border: index < 3 ? '1px solid var(--retro-gold)' : '1px solid transparent'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>{icon}</div>
                  <div style={{ fontSize: '10px', color: index < 3 ? 'var(--retro-gold)' : '#666' }}>
                    {index < 3 ? 'Получено' : 'Закрыто'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LeadersV1;
