import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVersion } from '../../contexts/VersionContext';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Heart,
  Brain,
  Activity,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Globe,
  Smartphone,
  Lock
} from 'lucide-react';

const LandingV2 = () => {
  const navigate = useNavigate();
  const { isV2, toggleVersion } = useVersion();
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('landing.modules.nutrition.title'),
      description: t('landing.modules.nutrition.description'),
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: t('landing.modules.mental.title'),
      description: t('landing.modules.mental.description'),
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: t('analytics.title'),
      description: t('analytics.trends'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('social.title'),
      description: t('landing.features.marketplace'),
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('landing.features.aiCoach'),
      description: t('landing.features.gamification'),
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('settings.privacy'),
      description: t('settings.connectedDevices'),
      color: 'from-slate-500 to-gray-500'
    }
  ];
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Сообщество',
      description: 'Поддержка единомышленников и специалистов',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Геймификация',
      description: 'Достижения, челленджи, таблица лидеров',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Приватность',
      description: 'Ваши данные под надёжной защитой',
      color: 'from-slate-500 to-gray-500'
    }
  ];

  const stats = [
    { value: '100K+', label: 'Пользователей', icon: <Users className="w-6 h-6" /> },
    { value: '4.9★', label: 'Рейтинг', icon: <Star className="w-6 h-6" /> },
    { value: '67%', label: 'Улучшение здоровья', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '24/7', label: 'AI поддержка', icon: <Zap className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: 'Мария К.',
      role: 'Предприниматель',
      avatar: '👩',
      text: 'EthosLife изменил мой подход к здоровью. За 3 месяца потеряла 12кг и улучшила сон на 40%!',
      rating: 5
    },
    {
      name: 'Александр В.',
      role: 'Нутрициолог',
      avatar: '👨‍⚕️',
      text: 'Использую для работы с клиентами. 40+ постоянных клиентов через платформу за 2 месяца.',
      rating: 5
    },
    {
      name: 'Елена Р.',
      role: 'HR Директор',
      avatar: '👩‍💼',
      text: 'Внедрили для сотрудников. Продуктивность выросла на 25%, больничные снизились на 30%.',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      period: 'навсегда',
      description: 'Для начала пути',
      features: [
        'Базовый трекинг здоровья',
        '3 модуля на выбор',
        '5 AI-запросов в день',
        'Доступ к сообществу',
        'Базовая аналитика'
      ],
      cta: 'Начать бесплатно',
      popular: false
    },
    {
      name: 'Premium',
      price: '9.99',
      period: 'в месяц',
      description: 'Для максимальных результатов',
      features: [
        'Все 7 модулей здоровья',
        'Безлимитный AI-коуч',
        'Расширенная аналитика',
        'Все интеграции',
        'Приоритетная поддержка',
        'Персональные планы'
      ],
      cta: 'Попробовать 14 дней',
      popular: true
    },
    {
      name: 'Pro',
      price: '19.99',
      period: 'в месяц',
      description: 'Для профессионалов',
      features: [
        'Всё из Premium',
        'Персональный AI-коуч',
        '1-on-1 сессии со специалистами',
        'Семейный план (5 человек)',
        'B2B доступ',
        'API доступ'
      ],
      cta: 'Начать Pro',
      popular: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5c5243] via-[#8c7a6b] to-[#a89880] flex items-center justify-center text-white font-bold text-2xl shadow-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                🌱
              </motion.div>
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-[#2d2418]">EthosLife</h1>
                <p className="text-lg text-[#5c5243]">Human Operating System</p>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-[#2d2418] mb-6 max-w-4xl mx-auto">
              Здоровье — это ежедневная привычка.
              <br />
              <span className="text-gradient-emerald">
                Мы делаем эту привычку лёгкой, выгодной и эффективной.
              </span>
            </h2>

            <p className="text-lg md:text-xl text-[#5c5243] mb-10 max-w-2xl mx-auto">
              7 модулей здоровья. 1 платформа. 0 переключений.
              <br />
              Всё ваше здоровье — от генетики до социальных связей — в одном интерфейсе.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => navigate('/register')}
                className="group px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/features')}
                className="px-8 py-4 bg-white/70 backdrop-blur-sm text-[#5c5243] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Демо видео
              </motion.button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-[#5c5243]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Бесплатно навсегда</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Без кредитной карты</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>2 минуты на регистрацию</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="neu-card p-6 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex justify-center mb-3 text-emerald-500">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#2d2418] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#5c5243]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Всё для вашего здоровья
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              7 интегрированных модулей работают вместе для достижения ваших целей
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-8 hover:shadow-2xl transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#2d2418] mb-3">{feature.title}</h3>
                <p className="text-[#5c5243] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Простые тарифы
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Начните бесплатно. Обновите когда будете готовы.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative neu-card p-8 ${plan.popular ? 'border-2 border-emerald-500 scale-105' : ''}`}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold rounded-full">
                    Популярный выбор
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#2d2418] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold text-[#2d2418]">${plan.price}</span>
                    <span className="text-[#5c5243]">/{plan.period}</span>
                  </div>
                  <p className="text-[#5c5243]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[#5c5243]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => navigate('/register')}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-[#5c5243] text-white hover:bg-[#8c7a6b]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Истории успеха
            </h2>
            <p className="text-xl text-[#5c5243]">
              Более 100,000 пользователей уже изменили свою жизнь
            </p>
          </motion.div>

          <motion.div
            className="neu-card p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={activeTestimonial}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">{testimonials[activeTestimonial].avatar}</div>
              <div>
                <div className="text-xl font-bold text-[#2d2418]">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-[#5c5243]">{testimonials[activeTestimonial].role}</div>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
            </div>
            <p className="text-lg text-[#5c5243] leading-relaxed italic">
              "{testimonials[activeTestimonial].text}"
            </p>
          </motion.div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeTestimonial
                    ? 'bg-[#5c5243] w-8'
                    : 'bg-[#5c5243]/30'
                }`}
              />
            ))}
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
              Начните свой путь к здоровью сегодня
            </h2>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к 100,000+ пользователей, которые уже изменили свою жизнь с EthosLife
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              className="px-12 py-5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Начать бесплатно сейчас
            </motion.button>
            <p className="mt-6 text-sm text-[#5c5243]">
              Бесплатно • Без кредитной карты • 2 минуты
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#c9b8a6]/30 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold">
                🌱
              </div>
              <span className="text-lg font-bold text-[#2d2418]">EthosLife</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#5c5243]">
              <a href="/features" className="hover:text-[#2d2418] transition-colors">Возможности</a>
              <a href="/pricing" className="hover:text-[#2d2418] transition-colors">Цены</a>
              <a href="/team" className="hover:text-[#2d2418] transition-colors">Команда</a>
              <a href="/faq" className="hover:text-[#2d2418] transition-colors">FAQ</a>
              <a href="/blog" className="hover:text-[#2d2418] transition-colors">Блог</a>
            </div>
            <div className="text-sm text-[#5c5243]">
              © 2026 EthosLife. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
