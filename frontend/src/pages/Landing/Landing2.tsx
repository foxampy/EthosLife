/**
 * Landing V2 - Alternative Design
 * Focus: Health Ecosystem Story
 * Style: Deep Neumorphism with gradient accents
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Brain,
  Activity,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Award,
  ArrowRight,
  Star,
  Globe,
  Lock,
  Sparkles,
  Target,
  Coins,
  ShoppingBag,
  Stethoscope,
  Dumbbell,
  Utensils,
  Moon,
  Smile,
  MessageCircle,
  Vote,
  Wallet,
  Gift,
} from 'lucide-react';

const Landing2 = () => {
  const navigate = useNavigate();

  const ecosystemModules = [
    { icon: Utensils, title: 'Питание', desc: 'Трекинг калорий, макросы, рецепты', color: 'from-rose-400 to-pink-500' },
    { icon: Dumbbell, title: 'Движение', desc: 'Тренировки, активность, прогресс', color: 'from-orange-400 to-amber-500' },
    { icon: Moon, title: 'Сон', desc: 'Фазы сна, качество, восстановление', color: 'from-indigo-400 to-purple-500' },
    { icon: Smile, title: 'Психология', desc: 'Настроение, стресс, медитация', color: 'from-violet-400 to-purple-500' },
    { icon: Stethoscope, title: 'Медицина', desc: 'Анализы, лекарства, врачи', color: 'from-blue-400 to-cyan-500' },
    { icon: Users, title: 'Отношения', desc: 'Семья, друзья, сообщество', color: 'from-emerald-400 to-green-500' },
    { icon: Target, title: 'Привычки', desc: 'Трекер, стики, достижения', color: 'from-amber-400 to-orange-500' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'ИИ-Ассистент 24/7',
      desc: 'Персональные рекомендации по всем 7 модулям здоровья',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'Социальная сеть',
      desc: 'Делитесь успехами, находите друзей, участвуйте в челленджах',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      icon: Vote,
      title: 'DAO Управление',
      desc: 'Голосуйте за развитие платформы, предлагайте функции',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Coins,
      title: 'Токен $UNITY',
      desc: 'Зарабатывайте токены за активность, обменивайте на услуги',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: ShoppingBag,
      title: 'Кэшбек до 30%',
      desc: 'Получайте токены за покупки у партнеров',
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      icon: Gift,
      title: 'Абонементы',
      desc: 'Оплачивайте токенами залы, спа, мед-центры',
      gradient: 'from-indigo-500 to-purple-600'
    },
  ];

  const tokenomics = [
    { label: 'Total Supply', value: '1,000,000,000', sub: 'UNITY токенов' },
    { label: 'Seed Round', value: '$0.05', sub: 'Ранние инвесторы' },
    { label: 'ICO/IDO', value: '$0.10', sub: 'Публичная продажа' },
    { label: 'Staking APY', value: '12-25%', sub: 'Годовых' },
  ];

  const roadmap = [
    { quarter: 'Q1 2026', title: 'MVP Запуск', desc: '7 модулей здоровья, базовый AI', status: 'done' },
    { quarter: 'Q2 2026', title: 'Seed Раунд', desc: '$2M привлечено, команда 20+', status: 'done' },
    { quarter: 'Q3 2026', title: 'Social + DAO', desc: 'Социальная сеть, управление', status: 'current' },
    { quarter: 'Q4 2026', title: 'Token Launch', desc: 'ICO/IDO, листинги на CEX/DEX', status: 'upcoming' },
    { quarter: 'Q1 2027', title: 'Партнерства', desc: '100+ залов, клиник, магазинов', status: 'upcoming' },
    { quarter: 'Q2 2027', title: 'Global Expansion', desc: '25 языков, 1M пользователей', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] mb-6">
              <Sparkles className="w-5 h-5 text-[#5c5243]" />
              <span className="text-sm font-medium text-[#5c5243]">EthosLife 3.0 — Health Operating System</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-[#2d2418] mb-6 leading-tight">
              Здоровье. Сообщество.<br />
              <span className="bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] bg-clip-text text-transparent">
                Токены. DAO.
              </span>
            </h1>
            
            <p className="text-xl text-[#5c5243] max-w-3xl mx-auto mb-8">
              Первая экосистема которая объединяет трекинг здоровья, социальную сеть, 
              ИИ-коучинг и токеномику для максимальной мотивации
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Попробовать бесплатно
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/v2')}
                className="px-8 py-4 bg-[#e4dfd5] text-[#2d2418] rounded-2xl font-semibold shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)] transition-all"
              >
                Демо для инвесторов
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '100K+', label: 'Пользователей', icon: Users },
              { value: '7', label: 'Модулей здоровья', icon: Heart },
              { value: '4.9★', label: 'Рейтинг', icon: Star },
              { value: '24/7', label: 'AI поддержка', icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#e4dfd5] rounded-2xl p-6 text-center shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)]"
              >
                <stat.icon className="w-8 h-8 text-[#5c5243] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[#2d2418] mb-1">{stat.value}</div>
                <div className="text-sm text-[#5c5243]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Modules */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              7 Модулей Здоровья
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Полный спектр отслеживания и улучшения здоровья
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ecosystemModules.map((module, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#e4dfd5] rounded-2xl p-6 shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[10px_10px_20px_rgba(44,40,34,0.15),-10px_-10px_20px_rgba(255,255,255,0.7)] transition-all group"
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <module.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#2d2418] mb-2">{module.title}</h3>
                <p className="text-sm text-[#5c5243]">{module.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Tokenomics */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#5c5243]/5 to-[#8c7a6b]/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Экосистема с Токеномикой
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Зарабатывайте токены за здоровый образ жизни
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#e4dfd5] rounded-2xl p-6 shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] hover:shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.7)] transition-all group"
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-[4px_4px_8px_rgba(0,0,0,0.2)]`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#2d2418] mb-3">{feature.title}</h3>
                <p className="text-[#5c5243] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Токеномика $UNITY
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Прозрачная экономика с реальной ценностью
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {tokenomics.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#e4dfd5] rounded-2xl p-6 text-center shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)]"
              >
                <div className="text-2xl md:text-3xl font-bold text-[#2d2418] mb-2">{item.value}</div>
                <div className="text-sm font-medium text-[#5c5243] mb-1">{item.label}</div>
                <div className="text-xs text-[#5c5243]/70">{item.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Дорожная Карта
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              От MVP до глобальной экосистемы
            </p>
          </motion.div>

          <div className="space-y-4">
            {roadmap.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-[#e4dfd5] rounded-2xl p-6 shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] flex flex-col md:flex-row md:items-center gap-4 ${
                  item.status === 'current' ? 'ring-2 ring-[#5c5243]' : ''
                }`}
              >
                <div className="flex-shrink-0 w-full md:w-32">
                  <div className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${
                    item.status === 'done' ? 'bg-emerald-500 text-white' :
                    item.status === 'current' ? 'bg-amber-500 text-white' :
                    'bg-[#dcd3c6] text-[#5c5243]'
                  }`}>
                    {item.quarter}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#2d2418] mb-1">{item.title}</h3>
                  <p className="text-[#5c5243] text-sm">{item.desc}</p>
                </div>
                {item.status === 'current' && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm">
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                      Сейчас
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] rounded-3xl p-12 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Начните Путешествие к Здоровью
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к 100,000+ пользователей которые уже изменили свою жизнь
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-[#5c5243] rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Создать аккаунт
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-[#5c5243] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Попробовать демо
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#c9b8a6]/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[#5c5243]">
          <p>© 2026 EthosLife. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing2;
