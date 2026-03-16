/**
 * MessagesUnified - WhatsApp-like messaging interface
 * Conversation list sidebar, active chat, message bubbles
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { ElCard, ElButton, ElInput } from '../../../components/ElCore';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Great job on your workout today! 💪',
    time: '2m ago',
    unread: 2,
    online: true,
    typing: false,
  },
  {
    id: '2',
    name: 'Health Support Group',
    avatar: null,
    lastMessage: 'Mike: Just finished my morning run!',
    time: '15m ago',
    unread: 5,
    online: false,
    typing: false,
    isGroup: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Your test results look great!',
    time: '1h ago',
    unread: 0,
    online: true,
    typing: true,
  },
  {
    id: '4',
    name: 'Mike Roberts',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Want to join the challenge this week?',
    time: '2h ago',
    unread: 0,
    online: false,
    typing: false,
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'Thanks for the recipe! 🥗',
    time: 'Yesterday',
    unread: 0,
    online: true,
    typing: false,
  },
  {
    id: '6',
    name: 'Fitness Buddies',
    avatar: null,
    lastMessage: 'David: Shared a workout video',
    time: 'Yesterday',
    unread: 0,
    online: false,
    typing: false,
    isGroup: true,
  },
  {
    id: '7',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?img=8',
    lastMessage: 'See you at the gym tomorrow!',
    time: '2 days ago',
    unread: 0,
    online: false,
    typing: false,
  },
];

// Mock messages for active conversation
const mockMessages = [
  {
    id: '1',
    senderId: 'them',
    text: 'Hey! How was your workout today?',
    time: '10:30 AM',
    status: 'read',
  },
  {
    id: '2',
    senderId: 'me',
    text: 'It was amazing! I finally hit my 10k steps goal 🎉',
    time: '10:32 AM',
    status: 'read',
  },
  {
    id: '3',
    senderId: 'them',
    text: 'That\'s awesome! I knew you could do it! 💪',
    time: '10:33 AM',
    status: 'read',
  },
  {
    id: '4',
    senderId: 'them',
    text: 'What time did you start?',
    time: '10:33 AM',
    status: 'read',
  },
  {
    id: '5',
    senderId: 'me',
    text: 'Started at 6 AM. The morning air was so fresh!',
    time: '10:35 AM',
    status: 'read',
  },
  {
    id: '6',
    senderId: 'me',
    text: 'Want to join me tomorrow?',
    time: '10:35 AM',
    status: 'delivered',
  },
];

// Conversation List Item
const ConversationItem: React.FC<{
  conversation: typeof mockConversations[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ conversation, isActive, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors ${
        isActive
          ? 'bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30'
          : 'hover:bg-[var(--bone-300)]/50'
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold">
          {conversation.avatar ? (
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            conversation.name.charAt(0).toUpperCase()
          )}
        </div>
        {conversation.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[var(--bone-200)]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text-primary)] truncate">
            {conversation.name}
          </h3>
          <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap ml-2">
            {conversation.time}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {conversation.typing ? (
              <span className="text-[var(--neon-cyan)] italic">typing...</span>
            ) : (
              conversation.lastMessage
            )}
          </p>
          {conversation.unread > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--neon-cyan)] text-white text-xs font-bold min-w-[20px]">
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{
  message: typeof mockMessages[0];
  isMe: boolean;
}> = ({ message, isMe }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
          isMe
            ? 'bg-[var(--neon-cyan)] text-white rounded-br-md'
            : 'bg-[var(--bone-300)] text-[var(--text-primary)] rounded-bl-md'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/70' : 'text-[var(--text-tertiary)]'}`}>
          <span className="text-xs">{message.time}</span>
          {isMe && (
            <>
              {message.status === 'sent' && <Check className="w-3 h-3" />}
              {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
              {message.status === 'read' && <CheckCheck className="w-3 h-3 text-[var(--neon-green)]" />}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Typing Indicator
const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-3"
    >
      <div className="bg-[var(--bone-300)] rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--text-tertiary)]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const MessagesUnified: React.FC = () => {
  const { t } = useTranslation();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = mockConversations.find((c) => c.id === activeConversation);
  const filteredConversations = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'delivered' } : m))
      );
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bone-200)] flex">
      {/* Sidebar - Conversation List */}
      <AnimatePresence mode="wait">
        {(showSidebar || !activeConversation) && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className={`${
              activeConversation ? 'hidden md:flex' : 'flex'
            } w-full md:w-80 lg:w-96 flex-col border-r border-[var(--bone-400)]/30 bg-[var(--bone-200)]`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[var(--bone-400)]/30">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Messages</h1>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--bone-300)]/50"
                >
                  <MoreVertical className="w-5 h-5 text-[var(--text-secondary)]" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bone-300)]/50 border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation === conversation.id}
                  onClick={() => {
                    setActiveConversation(conversation.id);
                    setShowSidebar(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[var(--bone-200)]">
        {activeConversation && activeConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--bone-400)]/30 bg-[var(--bone-200)]/80 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setActiveConversation(null);
                    setShowSidebar(true);
                  }}
                  className="md:hidden p-2 rounded-full hover:bg-[var(--bone-300)]/50"
                >
                  <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
                </motion.button>

                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold">
                    {activeConv.avatar ? (
                      <img
                        src={activeConv.avatar}
                        alt={activeConv.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      activeConv.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {activeConv.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[var(--bone-200)]" />
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">{activeConv.name}</h2>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {activeConv.typing ? 'typing...' : activeConv.online ? 'online' : 'offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--bone-300)]/50 text-[var(--text-secondary)]"
                >
                  <Phone className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--bone-300)]/50 text-[var(--text-secondary)]"
                >
                  <Video className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--bone-300)]/50 text-[var(--text-secondary)]"
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isMe={message.senderId === 'me'}
                />
              ))}
              {activeConv.typing && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--bone-400)]/30">
              <div className="flex items-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full hover:bg-[var(--bone-300)]/50 text-[var(--text-secondary)]"
                >
                  <Paperclip className="w-5 h-5" />
                </motion.button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-[var(--bone-300)]/50 border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bone-400)]/50 text-[var(--text-tertiary)]"
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                </div>

                {inputMessage.trim() ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="p-3 rounded-full bg-[var(--neon-cyan)] text-white shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-[var(--bone-300)] text-[var(--text-secondary)]"
                  >
                    <Mic className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--bone-300)] flex items-center justify-center mb-4">
              <MessageBubbleIcon className="w-12 h-12 text-[var(--text-tertiary)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Your Messages
            </h2>
            <p className="text-[var(--text-secondary)] max-w-sm">
              Select a conversation from the sidebar to start chatting with your health community
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Message bubble icon for empty state
const MessageBubbleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

export default MessagesUnified;
