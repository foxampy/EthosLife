import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Star, MessageCircle, ShoppingBag, Check } from 'lucide-react';

const neuCard = {
  background: '#e8e0d5',
  boxShadow: '8px 8px 16px rgba(44,40,34,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
  borderRadius: '20px',
};

const neuInset = {
  background: '#e8e0d5',
  boxShadow: 'inset 3px 3px 6px rgba(44,40,34,0.08), inset -3px -3px 6px rgba(255,255,255,0.6)',
  borderRadius: '16px',
};

interface Contact {
  id: string;
  type: 'friend' | 'specialist';
  name: string;
  avatar: string;
  lastActivity?: string;
  specialty?: string;
  rating?: number;
  isSubscribed?: boolean;
}

const mockContacts: Contact[] = [
  { id: '1', type: 'friend', name: 'Алексей Смирнов', avatar: '🧑', lastActivity: '5 мин назад' },
  { id: '2', type: 'friend', name: 'Мария Иванова', avatar: '👩', lastActivity: '1 ч назад' },
  { id: '3', type: 'friend', name: 'Дмитрий Козлов', avatar: '👨', lastActivity: '2 ч назад' },
  { id: '4', type: 'friend', name: 'Анна Петрова', avatar: '🧕', lastActivity: 'вчера' },
  { id: '5', type: 'specialist', name: 'Елена Соколова', avatar: '👩‍⚕️', specialty: 'Нутрициолог', rating: 4.9, isSubscribed: true },
  { id: '6', type: 'specialist', name: 'Игорь Морозов', avatar: '🧑‍⚕️', specialty: 'Фитнес-тренер', rating: 4.7, isSubscribed: false },
  { id: '7', type: 'specialist', name: 'Ольга Новикова', avatar: '👩‍🔬', specialty: 'Психолог', rating: 4.8, isSubscribed: false },
];

export default function ContactsPage() {
  const [tab, setTab] = useState<'friends' | 'specialists'>('friends');
  const [search, setSearch] = useState('');

  const friends = mockContacts.filter(
    (c) => c.type === 'friend' && c.name.toLowerCase().includes(search.toLowerCase())
  );
  const specialists = mockContacts.filter(
    (c) => c.type === 'specialist' && c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-4" style={{ background: 'linear-gradient(135deg, #dcd3c6 0%, #e8e0d5 100%)' }}>
      <h1 className="text-xl font-bold text-[#2d2418] mb-4">Контакты</h1>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-3 mb-4" style={neuInset}>
        <Search className="w-4 h-4 text-[#a09282] flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск..."
          className="flex-1 bg-transparent outline-none text-sm text-[#2d2418] placeholder-[#a09282]"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1.5 rounded-2xl" style={neuInset}>
        {(['friends', 'specialists'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === t ? 'linear-gradient(135deg, #5c5243, #8c7a6b)' : 'transparent',
              color: tab === t ? 'white' : '#8c7a6b',
              boxShadow: tab === t ? '0 4px 12px rgba(92,82,67,0.25)' : 'none',
            }}
          >
            {t === 'friends' ? `Друзья (${friends.length})` : `Специалисты (${specialists.length})`}
          </button>
        ))}
      </div>

      {/* Friends list */}
      {tab === 'friends' && (
        <div className="space-y-2">
          {friends.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4"
              style={neuCard}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'rgba(92,82,67,0.08)' }}
              >
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2d2418]">{c.name}</p>
                <p className="text-xs text-[#a09282]">активен {c.lastActivity}</p>
              </div>
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#e8e0d5', boxShadow: '3px 3px 6px rgba(44,40,34,0.1), -3px -3px 6px rgba(255,255,255,0.7)' }}
              >
                <MessageCircle className="w-4 h-4 text-[#8c7a6b]" />
              </button>
            </motion.div>
          ))}

          <motion.button
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-[#8c7a6b] text-sm font-medium"
            style={{ border: '2px dashed rgba(92,82,67,0.2)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <UserPlus className="w-4 h-4" /> Добавить друга
          </motion.button>
        </div>
      )}

      {/* Specialists list */}
      {tab === 'specialists' && (
        <div className="space-y-3">
          {specialists.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4"
              style={neuCard}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(92,82,67,0.1), rgba(140,122,107,0.05))' }}
                >
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#2d2418]">{c.name}</p>
                  <p className="text-sm text-[#6b5d52]">{c.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-amber-600">{c.rating}</span>
                    <span className="text-xs text-[#a09282] ml-1">· 128 отзывов</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                  style={{
                    background: c.isSubscribed
                      ? 'rgba(52,211,153,0.1)'
                      : 'linear-gradient(135deg, #5c5243, #8c7a6b)',
                    color: c.isSubscribed ? '#10b981' : 'white',
                    boxShadow: c.isSubscribed ? 'none' : '0 4px 12px rgba(92,82,67,0.25)',
                  }}
                >
                  {c.isSubscribed
                    ? <><Check className="w-3.5 h-3.5" /> Подписан</>
                    : 'Подписаться'
                  }
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5"
                  style={{
                    background: '#e8e0d5',
                    boxShadow: '3px 3px 6px rgba(44,40,34,0.1), -3px -3px 6px rgba(255,255,255,0.7)',
                    color: '#8c7a6b',
                  }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Услуги
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
