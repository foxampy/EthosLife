import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Check, Zap, Crown } from 'lucide-react';

type ShopTab = 'products' | 'services' | 'subscriptions' | 'memberships';

const tabs = [
  { id: 'products' as ShopTab, label: '🛒 Товары' },
  { id: 'services' as ShopTab, label: '💼 Услуги' },
  { id: 'subscriptions' as ShopTab, label: '⭐ Подписки' },
  { id: 'memberships' as ShopTab, label: '🏋️ Абонементы' },
];

const productsData = [
  { id: 'p1', name: 'Умные весы EthosScale', price: '4 990 ₽', emoji: '⚖️', category: 'здоровье', rating: 4.8, reviews: 342 },
  { id: 'p2', name: 'Трекер сна SleepBand', price: '7 490 ₽', emoji: '😴', category: 'здоровье', rating: 4.7, reviews: 189 },
  { id: 'p3', name: 'Дневник привычек (печатный)', price: '990 ₽', emoji: '📓', category: 'планирование', rating: 4.9, reviews: 567 },
  { id: 'p4', name: 'Набор для медитации', price: '2 490 ₽', emoji: '🧘', category: 'здоровье', rating: 4.8, reviews: 234 },
  { id: 'p5', name: 'Протеин Premium', price: '3 290 ₽', emoji: '💪', category: 'спорт', rating: 4.6, reviews: 891 },
  { id: 'p6', name: 'Коврик для йоги', price: '1 990 ₽', emoji: '🟩', category: 'спорт', rating: 4.7, reviews: 445 },
];

const servicesData = [
  { id: 's1', name: 'Консультация нутрициолога', price: '2 500 ₽', duration: '60 мин', emoji: '🥗', rating: 4.9, reviews: 128 },
  { id: 's2', name: 'Персональная тренировка', price: '3 000 ₽', duration: '60 мин', emoji: '💪', rating: 4.8, reviews: 256 },
  { id: 's3', name: 'Сессия с психологом', price: '3 500 ₽', duration: '50 мин', emoji: '🧠', rating: 4.9, reviews: 94 },
  { id: 's4', name: 'Анализ сна и режима', price: '1 800 ₽', duration: '30 мин', emoji: '😴', rating: 4.7, reviews: 67 },
  { id: 's5', name: 'Составление плана питания', price: '4 200 ₽', duration: '90 мин', emoji: '📋', rating: 4.9, reviews: 312 },
];

const subscriptionsData = [
  {
    id: 'sub1', name: 'Basic', price: '490 ₽', period: 'мес',
    features: ['Базовые трекеры здоровья', 'ИИ — 50 запросов в месяц', 'До 5 активных целей', 'Стандартная аналитика'],
    emoji: '🌱', popular: false,
  },
  {
    id: 'sub2', name: 'Pro', price: '990 ₽', period: 'мес',
    features: ['Все трекеры здоровья', 'ИИ — безлимит', 'Безлимит целей и привычек', 'Расширенная аналитика', 'Приоритетная поддержка'],
    emoji: '⚡', popular: true,
  },
  {
    id: 'sub3', name: 'Premium', price: '2 490 ₽', period: 'мес',
    features: ['Всё из Pro', '2 консультации специалистов', 'Персональный план развития', 'Доступ к закрытому сообществу', 'Персональный куратор'],
    emoji: '👑', popular: false,
  },
];

const membershipsData = [
  { id: 'm1', name: 'Абонемент на 10 тренировок', price: '8 500 ₽', validity: '3 месяца', emoji: '🏋️', savings: '' },
  { id: 'm2', name: 'Годовая программа "Здоровье"', price: '24 900 ₽', validity: '12 месяцев', emoji: '🏆', savings: 'Экономия 40%' },
  { id: 'm3', name: 'Пакет консультаций ×5', price: '9 900 ₽', validity: '6 месяцев', emoji: '💊', savings: 'Экономия 20%' },
  { id: 'm4', name: 'Групповые тренировки ×20', price: '6 800 ₽', validity: '2 месяца', emoji: '👥', savings: '' },
];

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

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<ShopTab>('products');
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (id: string) => setCart((prev) => [...prev, id]);
  const isInCart = (id: string) => cart.includes(id);

  return (
    <div className="min-h-screen pb-24 px-4 pt-4" style={{ background: 'linear-gradient(135deg, #dcd3c6 0%, #e8e0d5 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#2d2418]">Магазин</h1>
        {cart.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)', color: 'white' }}>
            <ShoppingCart className="w-4 h-4" />
            {cart.length}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1.5 rounded-2xl mb-4" style={neuInset}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: activeTab === t.id ? 'linear-gradient(135deg, #5c5243, #8c7a6b)' : 'transparent',
              color: activeTab === t.id ? 'white' : '#8c7a6b',
              boxShadow: activeTab === t.id ? '0 4px 8px rgba(92,82,67,0.25)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Products */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-2 gap-3">
          {productsData.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4" style={neuCard}>
              <div className="text-3xl mb-3 text-center">{p.emoji}</div>
              <p className="font-semibold text-[#2d2418] text-sm mb-1 text-center leading-tight">{p.name}</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-[#a09282]">{p.rating} ({p.reviews})</span>
              </div>
              <p className="text-center font-bold text-[#5c5243] mb-3">{p.price}</p>
              <button
                onClick={() => addToCart(p.id)}
                className="w-full py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: isInCart(p.id) ? 'rgba(52,211,153,0.1)' : 'linear-gradient(135deg, #5c5243, #8c7a6b)',
                  color: isInCart(p.id) ? '#10b981' : 'white',
                  boxShadow: isInCart(p.id) ? 'none' : '0 4px 8px rgba(92,82,67,0.2)',
                }}
              >
                {isInCart(p.id) ? '✓ В корзине' : 'В корзину'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Services */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          {servicesData.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4" style={neuCard}>
              <div className="text-3xl flex-shrink-0">{s.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2d2418] text-sm">{s.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-[#a09282]">{s.rating} · {s.duration}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[#5c5243] text-sm">{s.price}</p>
                <button className="mt-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)' }}>
                  Записаться
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-3">
          {subscriptionsData.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 relative overflow-hidden" style={neuCard}>
              {s.popular && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  Популярный
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <p className="font-bold text-[#2d2418] text-lg">{s.name}</p>
                  <p className="text-[#5c5243] font-semibold">{s.price} / {s.period}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {s.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-[#6b5d52]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: s.popular ? 'linear-gradient(135deg, #5c5243, #8c7a6b)' : '#e8e0d5',
                  color: s.popular ? 'white' : '#5c5243',
                  boxShadow: s.popular
                    ? '0 6px 16px rgba(92,82,67,0.3)'
                    : '4px 4px 8px rgba(44,40,34,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                }}>
                Выбрать план
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Memberships */}
      {activeTab === 'memberships' && (
        <div className="space-y-3">
          {membershipsData.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 relative" style={neuCard}>
              <div className="text-3xl flex-shrink-0">{m.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2d2418] text-sm">{m.name}</p>
                <p className="text-xs text-[#a09282] mt-0.5">Действует {m.validity}</p>
                {m.savings && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-emerald-600"
                    style={{ background: 'rgba(52,211,153,0.1)' }}>
                    {m.savings}
                  </span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[#5c5243]">{m.price}</p>
                <button className="mt-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)' }}>
                  Купить
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
