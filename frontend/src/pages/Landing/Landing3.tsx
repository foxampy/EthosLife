/**
 * Landing V3 - Optimal Ecosystem Presentation
 * Complete story: Health + Social + DAO + Tokens + Economy
 * Style: Deep Neumorphism with full feature integration
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Brain, Activity, Users, Zap, Shield, TrendingUp, Award,
  ArrowRight, Star, Sparkles, Target, Coins, ShoppingBag,
  Stethoscope, Dumbbell, Utensils, Moon, Smile, MessageCircle,
  Vote, Wallet, Gift, Lock, Globe, Smartphone, CheckCircle2,
  PieChart, BarChart3, Layers, Link2, Award as MedalIcon,
  Calendar, Clock, DollarSign, Percent, TrendingDown, Rocket,
} from 'lucide-react';

const Landing3 = () => {
  const navigate = useNavigate();

  const healthModules = [
    { icon: Utensils, title: 'Питание', desc: 'Калории, макросы, вода, рецепты', value: '−12кг за 3 месяца' },
    { icon: Dumbbell, title: 'Фитнес', desc: 'Тренировки, шаги, активность', value: '+45% активности' },
    { icon: Moon, title: 'Сон', desc: 'Фазы, качество, рекомендации', value: '+40% качества' },
    { icon: Smile, title: 'Ментал', desc: 'Настроение, медитация, стресс', value: '−35% стресса' },
    { icon: Stethoscope, title: 'Здоровье', desc: 'Анализы, лекарства, врачи', value: 'Контроль 24/7' },
    { icon: Users, title: 'Отношения', desc: 'Семья, друзья, нетворкинг', value: '500+ связей' },
    { icon: Target, title: 'Привычки', desc: 'Трекер, стики, цели', value: '90% выполнения' },
  ];

  const ecosystemPillars = [
    {
      icon: Heart,
      title: 'Здоровье',
      desc: '7 интегрированных модулей для полного контроля',
      features: ['AI-коучинг', 'Аналитика', 'Рекомендации'],
      gradient: 'from-rose-400 to-pink-500'
    },
    {
      icon: MessageCircle,
      title: 'Социальная Сеть',
      desc: 'Делитесь успехами и находите поддержку',
      features: ['Лента', 'Челленджи', 'Друзья'],
      gradient: 'from-emerald-400 to-green-500'
    },
    {
      icon: Vote,
      title: 'DAO',
      desc: 'Управляйте развитием платформы',
      features: ['Голосования', 'Предложения', 'Решения'],
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Coins,
      title: 'Токеномика',
      desc: 'Зарабатывайте $UNITY за активность',
      features: ['Кэшбек', 'Стейкинг', 'Бонусы'],
      gradient: 'from-amber-400 to-orange-500'
    },
  ];

  const tokenUtility = [
    { icon: ShoppingBag, title: 'Кэшбек в магазинах', desc: 'До 30% токенами', value: '30%' },
    { icon: Gift, title: 'Абонементы', desc: 'Залы, спа, клиники', value: '−50%' },
    { icon: Stethoscope, title: 'Консультации', desc: 'Специалисты за токены', value: '24/7' },
    { icon: Wallet, title: 'Стейкинг', desc: 'Пассивный доход', value: '12-25% APY' },
  ];

  const investmentStages = [
    { stage: 'Pre-Seed', raised: '$500K', valuation: '$5M', status: 'completed', date: 'Q4 2025' },
    { stage: 'Seed', raised: '$2M', valuation: '$10M', status: 'current', date: 'Q2 2026' },
    { stage: 'ICO/IDO', raised: '$10M', valuation: '$50M', status: 'upcoming', date: 'Q4 2026' },
    { stage: 'Series A', raised: '$25M', valuation: '$150M', status: 'upcoming', date: 'Q2 2027' },
  ];

  const mechanics = [
    {
      title: 'Move-to-Earn',
      desc: 'Зарабатывайте токены за шаги и тренировки',
      icon: Activity,
      example: '10,000 шагов = 5 $UNITY/день'
    },
    {
      title: 'Learn-to-Earn',
      desc: 'Получайте токены за обучение здоровью',
      icon: Brain,
      example: 'Курс по питанию = 50 $UNITY'
    },
    {
      title: 'Social-to-Earn',
      desc: 'Зарабатывайте на контенте и рефералах',
      icon: Users,
      example: 'Реферал = 10% от покупок'
    },
    {
      title: 'Stake-to-Earn',
      desc: 'Пассивный доход от стейкинга токенов',
      icon: Coins,
      example: '10,000 $UNITY = 12-25% APY'
    },
  ];

  const partnerships = [
    { category: 'Фитнес залы', count: '100+', benefit: '−50% по токенам' },
    { category: 'Мед-центры', count: '50+', benefit: 'Консультации за $UNITY' },
    { category: 'СПА-салоны', count: '75+', benefit: 'Кэшбек 20%' },
    { category: 'Магазины', count: '200+', benefit: 'Кэшбек до 30%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      
      {/* Hero - Complete Vision */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] mb-6">
              <Rocket className="w-5 h-5 text-[#5c5243]" />
              <span className="text-sm font-medium text-[#5c5243]">EthosLife — Health DAO Ecosystem</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#2d2418] mb-6 leading-tight">
              Здоровье. Сообщество.<br />
              <span className="bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] bg-clip-text text-transparent">
                Токены. Экономика.
              </span><br />
              <span className="text-3xl md:text-5xl">
                DAO Управление.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#5c5243] max-w-4xl mx-auto mb-8">
              Первая в мире экосистема которая объединяет <span className="font-semibold text-[#2d2418]">7 модулей здоровья</span>, 
              <span className="font-semibold text-[#2d2418]"> социальную сеть</span>, 
              <span className="font-semibold text-[#2d2418]"> ИИ-коучинг</span> и 
              <span className="font-semibold text-[#2d2418]"> токеномику</span> для максимальной мотивации и реальных результатов
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/v2')}
                className="px-8 py-4 bg-[#e4dfd5] text-[#2d2418] rounded-2xl font-semibold shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)] transition-all flex items-center gap-2"
              >
                <PieChart className="w-5 h-5" />
                Инвесторам
              </motion.button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { value: '100K+', label: 'Пользователей', icon: Users },
                { value: '7', label: 'Модулей', icon: Layers },
                { value: '$10M', label: 'Цель ICO', icon: DollarSign },
                { value: '25+', label: 'Языков', icon: Globe },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#e4dfd5] rounded-2xl p-4 text-center shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)]"
                >
                  <stat.icon className="w-6 h-6 text-[#5c5243] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#2d2418]">{stat.value}</div>
                  <div className="text-xs text-[#5c5243]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7 Health Modules */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2d2418] mb-4">
              7 Модулей Здоровья
            </h2>
            <p className="text-lg md:text-xl text-[#5c5243] max-w-2xl mx-auto">
              Полный спектр отслеживания и улучшения всех аспектов здоровья
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {healthModules.map((module, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#e4dfd5] rounded-2xl p-5 shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[10px_10px_20px_rgba(44,40,34,0.15),-10px_-10px_20px_rgba(255,255,255,0.7)] transition-all group"
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600">{module.value}</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#2d2418] mb-2">{module.title}</h3>
                <p className="text-xs text-[#5c5243]">{module.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Ecosystem Pillars */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#5c5243]/5 to-[#8c7a6b]/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2d2418] mb-4">
              4 Столпа Экосистемы
            </h2>
            <p className="text-lg md:text-xl text-[#5c5243] max-w-2xl mx-auto">
              Интегрированная система для максимальной мотивации
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemPillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#e4dfd5] rounded-2xl p-6 shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] hover:shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.7)] transition-all group"
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-[4px_4px_8px_rgba(0,0,0,0.2)]`}>
                  <pillar.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#2d2418] mb-2">{pillar.title}</h3>
                <p className="text-sm text-[#5c5243] mb-4">{pillar.desc}</p>
                <div className="space-y-2">
                  {pillar.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-[#5c5243]">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Utility */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Утилити Токена $UNITY
            </h2>
            <p className="text-lg md:text-xl text-[#5c5243] max-w-2xl mx-auto">
              Реальная ценность в каждом применении
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tokenUtility.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-[#e4dfd5] to-[#dcd3c6] rounded-2xl p-6 text-center shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)]"
              >
                <item.icon className="w-10 h-10 text-[#5c5243] mx-auto mb-3" />
                <div className="text-2xl font-bold text-[#5c5243] mb-1">{item.value}</div>
                <div className="text-sm font-medium text-[#2d2418] mb-1">{item.title}</div>
                <div className="text-xs text-[#5c5243]/70">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earn Mechanics */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2d2418] mb-4">
              4 Способа Заработка
            </h2>
            <p className="text-lg md:text-xl text-[#5c5243] max-w-2xl mx-auto">
              Превратите здоровый образ жизни в доход
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {mechanics.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#e4dfd5] rounded-2xl p-6 shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                    <item.icon className="w-7 h-7" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#2d2418] mb-2">{item.title}</h3>
                  <p className="text-[#5c5243] text-sm mb-3">{item.desc}</p>
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-[#d4ccb8] text-xs font-medium text-[#2d2418]">
                    💡 {item.example}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Партнерская Сеть
            </h2>
            <p className="text-lg md:text-xl text-[#5c5243] max-w-2xl mx-auto">
              Используйте токены у партнеров со скидками
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {partnerships.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#e4dfd5] rounded-2xl p-6 text-center shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)]"
              >
                <div className="text-3xl font-bold text-emerald-600 mb-2">{partner.count}</div>
                <div className="text-sm font-medium text-[#2d2418] mb-1">{partner.category}</div>
                <div className="text-xs text-[#5c5243]">{partner.benefit}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Stages */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Инвестиционные Раунды
            </h2>
            <p className="text-lg md:text-xl text-[#5c5243] max-w-2xl mx-auto">
              Прозрачный план роста до $150M оценки
            </p>
          </motion.div>

          <div className="space-y-4">
            {investmentStages.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-[#e4dfd5] rounded-2xl p-6 shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] flex flex-col md:flex-row md:items-center gap-4 ${
                  stage.status === 'current' ? 'ring-2 ring-[#5c5243]' : ''
                }`}
              >
                <div className="flex-shrink-0 w-full md:w-40">
                  <div className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${
                    stage.status === 'completed' ? 'bg-emerald-500 text-white' :
                    stage.status === 'current' ? 'bg-amber-500 text-white animate-pulse' :
                    'bg-[#dcd3c6] text-[#5c5243]'
                  }`}>
                    {stage.stage}
                  </div>
                  <div className="text-xs text-[#5c5243] mt-2">{stage.date}</div>
                </div>
                <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-[#5c5243] mb-1">Привлечено</div>
                    <div className="text-lg font-bold text-[#2d2418]">{stage.raised}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#5c5243] mb-1">Оценка</div>
                    <div className="text-lg font-bold text-[#2d2418]">{stage.valuation}</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs text-[#5c5243] mb-1">Статус</div>
                    <div className={`text-sm font-medium ${
                      stage.status === 'completed' ? 'text-emerald-600' :
                      stage.status === 'current' ? 'text-amber-600' :
                      'text-[#5c5243]'
                    }`}>
                      {stage.status === 'completed' ? '✓ Завершен' :
                       stage.status === 'current' ? '→ Сейчас' :
                       '○ В плане'}
                    </div>
                  </div>
                </div>
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Начните Сейчас. Зарабатывайте. Живите Здорово.
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к 100,000+ пользователей в революции здоровья
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

export default Landing3;
