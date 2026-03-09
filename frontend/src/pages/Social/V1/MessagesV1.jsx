import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SocialV1.css';

/**
 * MessagesV1 - Личные сообщения
 * Real-time чат с градиентными пузырями, emoji и голосовыми сообщениями
 */

// ============================================
// MOCK DATA
// ============================================

const generateConversations = () => [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Мария Козлова',
      username: '@mariakoz',
      avatar: '🧘‍♀️',
      isOnline: true,
      isTyping: false,
      level: 38,
    },
    lastMessage: {
      text: 'Отличная тренировка сегодня! Завтра идёшь с нами на йогу?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
      isFromMe: false,
    },
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Александр Волков',
      username: '@alexvolkov',
      avatar: '👨‍🚀',
      isOnline: true,
      isTyping: true,
      level: 42,
    },
    lastMessage: {
      text: 'Скинул тебе план подготовки к марафону. Посмотри, пожалуйста!',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Елена Смирнова',
      username: '@elenasmir',
      avatar: '🥗',
      isOnline: false,
      isTyping: false,
      level: 51,
    },
    lastMessage: {
      text: 'Вот рецепт того протеинового завтрака, о котором я говорила 🥑',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
  },
  {
    id: 4,
    user: {
      id: 4,
      name: 'Дмитрий Петров',
      username: '@dmitryp',
      avatar: '🏋️',
      isOnline: false,
      isTyping: false,
      level: 25,
    },
    lastMessage: {
      text: 'Спасибо за совет по становой! Удалось добавить 10кг 💪',
      timestamp: new Date(Date.now() - 1000 * 60 * 300),
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
  },
  {
    id: 5,
    user: {
      id: 5,
      name: 'Ольга Морозова',
      username: '@olgamor',
      avatar: '🏃‍♀️',
      isOnline: true,
      isTyping: false,
      level: 47,
    },
    lastMessage: {
      text: 'Я уже на месте, где ты?',
      timestamp: new Date(Date.now() - 1000 * 60 * 600),
      isRead: true,
      isFromMe: true,
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
  },
  {
    id: 6,
    user: {
      id: 6,
      name: 'Наталья Иванова',
      username: '@natalyia',
      avatar: '🌿',
      isOnline: false,
      isTyping: false,
      level: 56,
    },
    lastMessage: {
      text: 'Как тебе новый курс по биохакингу?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1440),
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
  },
  {
    id: 7,
    user: {
      id: 7,
      name: 'Максим Лебедев',
      username: '@maxleb',
      avatar: '🧬',
      isOnline: false,
      isTyping: false,
      level: 33,
    },
    lastMessage: {
      text: 'Данные генетического теста пришли, смотри что интересно...',
      timestamp: new Date(Date.now() - 1000 * 60 * 2880),
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
  },
  {
    id: 8,
    user: {
      id: 8,
      name: 'Виктория Орлова',
      username: '@vikaorl',
      avatar: '🎯',
      isOnline: true,
      isTyping: false,
      level: 62,
    },
    lastMessage: {
      text: 'Поздравляю с достижением 365 дней! 🎉',
      timestamp: new Date(Date.now() - 1000 * 60 * 4320),
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
  },
];

const generateMessages = (conversationId) => {
  const baseMessages = [
    {
      id: 1,
      text: 'Привет! Как твои успехи с тренировками?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isFromMe: false,
      isRead: true,
      type: 'text',
    },
    {
      id: 2,
      text: 'Привет! Всё отлично, уже вижу результаты 💪',
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      isFromMe: true,
      isRead: true,
      type: 'text',
    },
    {
      id: 3,
      text: 'Это здорово! Что именно изменил в программе?',
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      isFromMe: false,
      isRead: true,
      type: 'text',
    },
    {
      id: 4,
      text: 'Добавил больше белка и начал спать по 8 часов',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isFromMe: true,
      isRead: true,
      type: 'text',
    },
    {
      id: 5,
      text: 'Сон - это фундамент! Без него никуда 😴',
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      isFromMe: false,
      isRead: true,
      type: 'text',
    },
    {
      id: 6,
      text: 'Полностью согласен. Кстати, ты не хочешь сходить на совместную тренировку в субботу?',
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      isFromMe: true,
      isRead: true,
      type: 'text',
    },
    {
      id: 7,
      text: 'С удовольствием! Во сколько?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isFromMe: false,
      isRead: true,
      type: 'text',
    },
    {
      id: 8,
      text: 'Давай в 10 утра в Парке Горького?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isFromMe: true,
      isRead: true,
      type: 'text',
    },
    {
      id: 9,
      text: 'Отлично, договорились! 🏃‍♀️',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isFromMe: false,
      isRead: true,
      type: 'text',
    },
    {
      id: 10,
      text: '👍',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isFromMe: true,
      isRead: true,
      type: 'text',
    },
  ];

  // Add some variety based on conversationId
  if (conversationId === 1) {
    return [
      ...baseMessages,
      {
        id: 11,
        text: 'Отличная тренировка сегодня! Завтра идёшь с нами на йогу?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isFromMe: false,
        isRead: false,
        type: 'text',
      },
    ];
  }

  return baseMessages;
};

const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', '❤️', '🔥', '🎉', '💪', '🏆', '🥗', '😴', '🧘', '🏃', '💤', '🎯', '✨'];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)}м`;
  if (diff < 86400) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });
};

const formatFullTime = (date) => {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Emoji Picker 3D
const EmojiPicker = ({ onSelect, onClose }) => {
  return (
    <div 
      className="neu-card"
      style={{ 
        position: 'absolute',
        bottom: '70px',
        left: '20px',
        width: '320px',
        padding: '15px',
        zIndex: 100,
        animation: 'scaleIn 0.2s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Emoji</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            style={{
              fontSize: '24px',
              background: 'rgba(0,0,0,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 217, 255, 0.2)';
              e.target.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0,0,0,0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Voice Message Recorder
const VoiceMessageRecorder = ({ onSend, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        // Simulate audio levels
        setAudioLevels(Array.from({ length: 20 }, () => Math.random() * 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording and send
      onSend({ type: 'voice', duration, url: 'mock-audio-url' });
      setDuration(0);
      onClose();
    } else {
      setIsRecording(true);
    }
  };

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="neu-card"
      style={{ 
        position: 'absolute',
        bottom: '70px',
        right: '20px',
        padding: '20px',
        zIndex: 100,
        animation: 'scaleIn 0.2s ease-out'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {isRecording ? (
          <>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'var(--retro-highlight)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 15px',
              cursor: 'pointer',
              animation: 'pulse-glow 1s ease-in-out infinite',
              boxShadow: '0 0 30px rgba(233, 69, 96, 0.6)'
            }}
            onClick={handleToggleRecording}
            >
              ⏹️
            </div>
            <div style={{ fontSize: '24px', color: 'var(--retro-highlight)', fontWeight: 'bold', marginBottom: '10px' }}>
              {formatDuration(duration)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px', height: '40px' }}>
              {audioLevels.map((level, index) => (
                <div
                  key={index}
                  style={{
                    width: '4px',
                    height: `${Math.max(10, level)}%`,
                    background: 'var(--retro-highlight)',
                    borderRadius: '2px',
                    transition: 'height 0.1s'
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--retro-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 15px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)'
            }}
            onClick={handleToggleRecording}
            >
              🎤
            </div>
            <div style={{ color: '#fff', fontSize: '14px' }}>Нажмите для записи</div>
          </>
        )}
      </div>
    </div>
  );
};

// Message Bubble
const MessageBubble = ({ message, showAvatar, isLastFromSender }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: message.isFromMe ? 'flex-end' : 'flex-start',
        marginBottom: isLastFromSender ? '4px' : '12px',
        alignItems: 'flex-end',
        gap: '8px'
      }}
    >
      {!message.isFromMe && showAvatar && (
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
          👤
        </div>
      )}
      {!message.isFromMe && !showAvatar && <div style={{ width: '32px' }} />}

      <div
        style={{
          maxWidth: '70%',
          padding: '12px 16px',
          borderRadius: '18px',
          borderBottomRightRadius: message.isFromMe ? '4px' : '18px',
          borderBottomLeftRadius: message.isFromMe ? '18px' : '4px',
          background: message.isFromMe 
            ? 'linear-gradient(135deg, var(--retro-cyan), var(--retro-purple))'
            : 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))',
          color: '#fff',
          position: 'relative',
          boxShadow: message.isFromMe 
            ? '0 0 20px rgba(0, 217, 255, 0.3)'
            : '0 0 20px rgba(0,0,0,0.3)'
        }}
      >
        {message.type === 'voice' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '150px' }}>
            <span style={{ fontSize: '20px' }}>🎤</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2px' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    height: `${10 + Math.random() * 20}px`,
                    background: 'rgba(255,255,255,0.6)',
                    borderRadius: '2px'
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
              {message.duration}
            </span>
          </div>
        ) : (
          <div style={{ fontSize: '14px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
            {message.text}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          gap: '4px',
          marginTop: '6px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.6)'
        }}>
          {formatFullTime(message.timestamp)}
          {message.isFromMe && (
            <span style={{ color: message.isRead ? 'var(--retro-cyan)' : '#888' }}>
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Conversation Item
const ConversationItem = ({ conversation, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 15px',
        background: isActive ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        position: 'relative',
        border: isActive ? '1px solid rgba(0, 217, 255, 0.3)' : '1px solid transparent'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(0, 217, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          border: conversation.user.isOnline ? '2px solid var(--retro-green)' : '2px solid rgba(255,255,255,0.1)',
          boxShadow: conversation.user.isOnline ? '0 0 15px rgba(0, 255, 136, 0.4)' : 'none'
        }}>
          {conversation.user.avatar}
        </div>
        {conversation.user.isOnline && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--retro-green)',
            border: '2px solid var(--retro-bg)',
            boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)'
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ 
            fontWeight: 'bold', 
            color: '#fff',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {conversation.user.name}
          </span>
          <span style={{ fontSize: '11px', color: '#666' }}>
            {formatTime(conversation.lastMessage.timestamp)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '13px', 
            color: conversation.lastMessage.isFromMe ? '#888' : '#aaa',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }}>
            {conversation.lastMessage.isFromMe && 'Вы: '}
            {conversation.lastMessage.text}
          </span>
          {conversation.unreadCount > 0 && (
            <span style={{ 
              background: 'var(--retro-highlight)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '10px',
              minWidth: '20px',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(233, 69, 96, 0.5)'
            }}>
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Pin Indicator */}
      {conversation.isPinned && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '12px',
          color: 'var(--retro-gold)'
        }}>
          📌
        </div>
      )}
    </div>
  );
};

// Typing Indicator
const TypingIndicator = () => {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '12px 16px' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--retro-cyan)',
            animation: 'pulse-glow 0.6s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

// File Upload Drag & Drop
const FileUploadArea = ({ onFileSelect, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
    onFileSelect(e.dataTransfer.files[0]);
    onClose();
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        position: 'absolute',
        bottom: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        padding: '40px 20px',
        background: 'rgba(0, 217, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: isDragging ? '2px dashed var(--retro-cyan)' : '2px dashed rgba(0, 217, 255, 0.3)',
        textAlign: 'center',
        zIndex: 100,
        animation: 'scaleIn 0.2s ease-out'
      }}
    >
      <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>📎</span>
      <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
        Перетащите файл сюда
      </div>
      <div style={{ color: '#888', fontSize: '13px' }}>
        или нажмите для выбора
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const MessagesV1 = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, unread, archived
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadConversations = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockConversations = generateConversations();
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
        setMessages(generateMessages(mockConversations[0].id));
      }
    };
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now(),
        text: messageInput,
        timestamp: new Date(),
        isFromMe: true,
        isRead: false,
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
      
      // Simulate reply
      setTimeout(() => {
        const replyMessage = {
          id: Date.now() + 1,
          text: 'Звучит отлично! 👍',
          timestamp: new Date(),
          isFromMe: false,
          isRead: true,
          type: 'text',
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 2000);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessageInput(messageInput + emoji);
    setShowEmojiPicker(false);
  };

  const handleVoiceMessage = (voiceData) => {
    const newMessage = {
      id: Date.now(),
      duration: `${voiceData.duration} сек`,
      timestamp: new Date(),
      isFromMe: true,
      isRead: false,
      type: 'voice',
    };
    setMessages([...messages, newMessage]);
  };

  const filteredConversations = conversations.filter(conv => {
    if (activeTab === 'unread') return conv.unreadCount > 0;
    if (activeTab === 'archived') return conv.isArchived;
    return !conv.isArchived;
  }).filter(conv => {
    if (!searchQuery) return true;
    return conv.user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Group messages by sender for avatar display
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = messages[index - 1];
    const isSameSender = prevMessage && prevMessage.isFromMe === message.isFromMe;
    const isLastFromSender = !messages[index + 1] || messages[index + 1].isFromMe !== message.isFromMe;
    
    acc.push({
      ...message,
      showAvatar: !isSameSender || index === 0,
      isLastFromSender
    });
    return acc;
  }, []);

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
              💬 Сообщения
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="neon-button" style={{ fontSize: '12px', padding: '8px 16px' }}>
              ⚙️ Настройки
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '20px',
        height: 'calc(100vh - 80px)',
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Sidebar - Conversations */}
        <aside className="neu-card" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search */}
          <div style={{ padding: '15px', borderBottom: '1px solid rgba(0, 217, 255, 0.1)' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                style={{ 
                  width: '100%',
                  padding: '12px 15px 12px 40px',
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
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', padding: '10px 15px', gap: '8px', borderBottom: '1px solid rgba(0, 217, 255, 0.1)' }}>
            {[
              { id: 'all', label: 'Все', count: conversations.length },
              { id: 'unread', label: 'Непрочитанные', count: conversations.filter(c => c.unreadCount > 0).length },
              { id: 'archived', label: 'Архив', count: conversations.filter(c => c.isArchived).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: activeTab === tab.id ? 'var(--retro-cyan)' : 'rgba(0,0,0,0.2)',
                  border: 'none',
                  borderRadius: '8px',
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

          {/* Conversations List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 15px' }}>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation?.id === conversation.id}
                onClick={() => {
                  setActiveConversation(conversation);
                  setMessages(generateMessages(conversation.id));
                }}
              />
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="neu-card" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px 20px',
                borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--retro-accent), var(--retro-primary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    border: activeConversation.user.isOnline ? '2px solid var(--retro-green)' : '2px solid rgba(255,255,255,0.1)'
                  }}>
                    {activeConversation.user.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>
                      {activeConversation.user.name}
                    </div>
                    <div style={{ fontSize: '12px', color: activeConversation.user.isTyping ? 'var(--retro-green)' : '#888' }}>
                      {activeConversation.user.isTyping ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span className="animate-glow-flicker">печатает</span>
                          <TypingIndicator />
                        </span>
                      ) : (
                        activeConversation.user.isOnline ? 'Онлайн' : 'Был(а) недавно'
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="neon-button" style={{ fontSize: '12px', padding: '8px 12px' }}>📞</button>
                  <button className="neon-button" style={{ fontSize: '12px', padding: '8px 12px' }}>📹</button>
                  <button className="neon-button" style={{ fontSize: '12px', padding: '8px 12px' }}>⋯</button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '20px' 
              }}>
                {groupedMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    showAvatar={message.showAvatar}
                    isLastFromSender={message.isLastFromSender}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{ 
                padding: '15px 20px',
                borderTop: '1px solid rgba(0, 217, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className="neon-button"
                    style={{ fontSize: '18px', padding: '12px' }}
                  >
                    📎
                  </button>
                  
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Напишите сообщение..."
                      style={{ 
                        width: '100%',
                        padding: '14px 50px 14px 20px',
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
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      😊
                    </button>
                  </div>

                  <button
                    onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                    className="neon-button"
                    style={{ fontSize: '18px', padding: '12px' }}
                  >
                    🎤
                  </button>

                  <button
                    onClick={handleSendMessage}
                    className="neon-button neon-button-primary"
                    style={{ fontSize: '18px', padding: '12px' }}
                    disabled={!messageInput.trim()}
                  >
                    ➤
                  </button>
                </div>
              </div>

              {/* Popovers */}
              {showEmojiPicker && (
                <EmojiPicker 
                  onSelect={handleEmojiSelect} 
                  onClose={() => setShowEmojiPicker(false)} 
                />
              )}
              {showVoiceRecorder && (
                <VoiceMessageRecorder 
                  onSend={handleVoiceMessage}
                  onClose={() => setShowVoiceRecorder(false)}
                />
              )}
              {showFileUpload && (
                <FileUploadArea 
                  onFileSelect={(file) => console.log('File selected:', file)}
                  onClose={() => setShowFileUpload(false)}
                />
              )}
            </>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#666'
            }}>
              <span style={{ fontSize: '80px', marginBottom: '20px' }}>💬</span>
              <h3 style={{ color: '#fff', fontFamily: 'Orbitron', marginBottom: '10px' }}>
                Выберите чат
              </h3>
              <p style={{ color: '#888' }}>
                Выберите собеседника из списка слева
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MessagesV1;
