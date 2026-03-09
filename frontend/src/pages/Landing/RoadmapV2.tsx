import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Heart,
  Brain,
  Activity
} from 'lucide-react';

const RoadmapV2 = () => {
  const navigate = useNavigate();

  const phases = [
    {
      period: '2026 Q2',
      title: 'Foundation & Launch',
      status: 'current',
      progress: 75,
      items: [
        { text: 'Деплой на Vercel + Render', done: true },
        { text: 'Premium UI дизайн-система', done: true },
        { text: '12 R&D проектов запущено', done: true },
        { text: '1,000 beta пользователей', done: false },
        { text: 'Product Hunt запуск', done: false }
      ],
      color: 'from-emerald-500 to-cyan-500'
    },
    {
      period: '2026 Q3',
      title: 'Health Modules v2 + AI',
      status: 'upcoming',
      progress: 30,
      items: [
        { text: 'Все 7 модулей здоровья v2', done: false },
        { text: 'AI Coach v2 (context-aware)', done: false },
        { text: 'Wearables интеграция (5+)', done: false },
        { text: 'Marketplace (specialists)', done: false },
        { text: 'Social features v2', done: false }
      ],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      period: '2026 Q4',
      title: 'Marketplace + Mobile',
      status: 'planned',
      progress: 0,
      items: [
        { text: 'Payment processing (Stripe)', done: false },
        { text: 'Video consultations', done: false },
        { text: 'Mobile apps beta (iOS/Android)', done: false },
        { text: 'Posture wearables prototype', done: false },
        { text: '100K users milestone', done: false }
      ],
      color: 'from-violet-500 to-purple-500'
    },
    {
      period: '2027 Q1',
      title: 'Hardware & Advanced AI',
      status: 'planned',
      progress: 0,
      items: [
        { text: 'Mobile apps launch', done: false },
        { text: 'Predictive analytics', done: false },
        { text: 'Posture wearables pilot', done: false },
        { text: 'Advanced AI features', done: false },
        { text: '500K users', done: false }
      ],
      color: 'from-amber-500 to-orange-500'
    },
    {
      period: '2027 Q2',
      title: 'Wearables Launch',
      status: 'planned',
      progress: 0,
      items: [
        { text: 'Posture wearables commercial', done: false },
        { text: 'FDA Class II submission', done: false },
        { text: '1M users milestone', done: false },
        { text: '$10M ARR', done: false },
        { text: 'IPO preparation', done: false }
      ],
      color: 'from-rose-500 to-pink-500'
    },
    {
      period: '2027 Q3-Q4',
      title: 'Scale & International',
      status: 'planned',
      progress: 0,
      items: [
        { text: 'Smart camera launch', done: false },
        { text: 'FDA clearance received', done: false },
        { text: '10 languages', done: false },
        { text: '5M users', done: false },
        { text: '$50M ARR', done: false }
      ],
      color: 'from-slate-500 to-gray-500'
    }
  ];

  const metrics = [
    { icon: <Users className="w-8 h-8" />, value: '100K+', label: 'Пользователей (2026)', color: 'text-emerald-500' },
    { icon: <Heart className="w-8 h-8" />, value: '7', label: 'Модулей здоровья', color: 'text-rose-500' },
    { icon: <Zap className="w-8 h-8" />, value: '12', label: 'R&D проектов', color: 'text-violet-500' },
    { icon: <Award className="w-8 h-8" />, value: '60+', label: 'Патентов к 2030', color: 'text-amber-500' }
  ];

  const revenueProjection = [
    { year: '2026', revenue: 0.9, users: 100 },
    { year: '2027', revenue: 9, users: 500 },
    { year: '2028', revenue: 41, users: 2000 },
    { year: '2029', revenue: 112, users: 5000 },
    { year: '2030', revenue: 293, users: 15000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Дорожная Карта EthosLife
            </h1>
            <p className="text-xl text-[#5c5243] max-w-3xl mx-auto mb-10">
              От MVP до глобальной Human Operating System
              <br />
              План развития 2026-2030
            </p>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`flex justify-center mb-3 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-[#2d2418] mb-1">{metric.value}</div>
                <div className="text-sm text-[#5c5243]">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-violet-500 to-slate-500" />

            {/* Phases */}
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${phase.color} transform -translate-x-1/2 z-10 ring-4 ring-white`} />

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <div className="neu-card p-6">
                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${phase.color} text-white text-sm font-bold rounded-full mb-3`}>
                      {phase.period}
                    </div>
                    <h3 className="text-2xl font-bold text-[#2d2418] mb-4">{phase.title}</h3>
                    
                    {/* Progress Bar */}
                    {phase.status === 'current' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-[#5c5243] mb-2">
                          <span>Прогресс</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#d4ccb8] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${phase.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${phase.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <ul className={`space-y-2 ${index % 2 === 0 ? 'md:flex md:flex-col md:items-end' : ''}`}>
                      {phase.items.map((item, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm ${
                          item.done ? 'text-emerald-600' : 'text-[#5c5243]'
                        } ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          {item.done ? (
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[#5c5243]/30 flex-shrink-0" />
                          )}
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Projection */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Финансовые Прогнозы
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              План роста выручки и пользовательской базы
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <div className="neu-card p-8">
              <h3 className="text-2xl font-bold text-[#2d2418] mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                Выручка ($M)
              </h3>
              <div className="space-y-4">
                {revenueProjection.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-bold text-[#5c5243]">{item.year}</div>
                    <div className="flex-1 h-8 bg-[#d4ccb8] rounded-lg overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.revenue / 3) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm font-bold text-[#2d2418]">${item.revenue}M</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Chart */}
            <div className="neu-card p-8">
              <h3 className="text-2xl font-bold text-[#2d2418] mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-violet-500" />
                Пользователи (K)
              </h3>
              <div className="space-y-4">
                {revenueProjection.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-bold text-[#5c5243]">{item.year}</div>
                    <div className="flex-1 h-8 bg-[#d4ccb8] rounded-lg overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.users / 150) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm font-bold text-[#2d2418]">{item.users}K</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Milestones */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Ключевые Вехи
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Важнейшие достижения на пути к лидерству на рынке
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="neu-card p-8 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-[#2d2418] mb-3">2026 Q2</h3>
              <p className="text-[#5c5243] mb-4">MVP Launch</p>
              <div className="text-3xl font-bold text-emerald-500">1,000</div>
              <div className="text-sm text-[#5c5243]">Beta пользователей</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="neu-card p-8 text-center border-2 border-emerald-500"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-[#2d2418] mb-3">2027 Q2</h3>
              <p className="text-[#5c5243] mb-4">Wearables Launch</p>
              <div className="text-3xl font-bold text-emerald-500">1M</div>
              <div className="text-sm text-[#5c5243]">Пользователей</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="neu-card p-8 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-[#2d2418] mb-3">2030</h3>
              <p className="text-[#5c5243] mb-4">IPO / Exit</p>
              <div className="text-3xl font-bold text-emerald-500">$1-5B</div>
              <div className="text-sm text-[#5c5243]">Оценка компании</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neu-card p-12 md:p-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-6">
              Присоединяйтесь к нашему пути
            </h2>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Станьте частью революции в индустрии здоровья уже сегодня
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/register')}
                className="px-12 py-5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать бесплатно
              </motion.button>
              <motion.button
                onClick={() => navigate('/investor-demo')}
                className="px-12 py-5 bg-white/70 backdrop-blur-sm text-[#5c5243] font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Инвесторам
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RoadmapV2;
