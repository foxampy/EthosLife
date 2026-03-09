import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Activity, 
  Moon, 
  Utensils, 
  Dumbbell, 
  Users,
  Zap,
  TrendingUp,
  Shield,
  Smartphone,
  Globe,
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const FeaturesV2 = () => {
  const navigate = useNavigate();

  const healthModules = [
    {
      icon: <Utensils className="w-12 h-12" />,
      title: 'Питание',
      description: 'Трекинг еды, подсчёт калорий и макросов, AI-рекомендации по питанию, планирование meals',
      features: ['База продуктов 500K+', 'Сканер штрих-кодов', 'AI-нутрициолог', 'Планы питания'],
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: <Dumbbell className="w-12 h-12" />,
      title: 'Движение',
      description: 'Тренировки, активность, шаги, интеграция с носимых устройств',
      features: ['500+ упражнений', 'Планы тренировок', 'Activity rings', '5+ wearables'],
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: <Moon className="w-12 h-12" />,
      title: 'Сон',
      description: 'Фазы сна, умный будильник, гигиена сна, хронотипы',
      features: ['Sleep tracking', 'Smart alarm', 'Chronotype quiz', 'Sleep programs'],
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: 'Психология',
      description: 'Mood tracking, PHQ-9/GAD-7, CBT инструменты, медитации',
      features: ['Оценки PHQ-9, GAD-7', 'CBT tools', 'Медитации', 'Mood analytics'],
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: 'Привычки',
      description: 'Трекер привычек, стрики, GitHub-style heatmap, достижения',
      features: ['Habit stacking', 'Streaks', 'Heatmap', 'AI coach'],
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Медицина',
      description: 'Лекарства, анализы, приемы, OCR для документов',
      features: ['Medication tracker', 'Lab results', 'Appointments', 'OCR'],
      color: 'from-cyan-500 to-teal-500'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Отношения',
      description: 'Социальное здоровье, качество связей, активность',
      features: ['Connections tracker', 'Quality time', 'Social score', 'Activity ideas'],
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const advancedFeatures = [
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'AI-Коуч',
      description: 'Персональный AI-помощник, который анализирует все 7 модулей и даёт персональные рекомендации',
      details: [
        'Контекстные рекомендации',
        'Мульти-модальный анализ',
        'Explainable AI',
        'Прогрессивная персонализация'
      ]
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'Предиктивная Аналитика',
      description: 'Прогнозирование поведения на 7 дней вперёд с точностью 78%',
      details: [
        'LSTM модели',
        'Раннее предупреждение срывов',
        '62% предотвращённых relapse',
        'Персональные инсайты'
      ]
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: 'Геймификация',
      description: 'Достижения, челленджи, таблица лидеров для максимальной мотивации',
      details: [
        '50+ достижений',
        '7-дневные челленджи',
        'Командные соревнования',
        'UNITY tokens'
      ]
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Сообщество',
      description: 'Поддержка единомышленников, специалистов, групп по интересам',
      details: [
        'Лента и посты',
        'Группы по интересам',
        'Специалисты онлайн',
        'Центры здоровья'
      ]
    },
    {
      icon: <Smartphone className="w-10 h-10" />,
      title: 'Wearables Интеграция',
      description: 'Автоматическая синхронизация с Apple Watch, Fitbit, Garmin, Oura',
      details: [
        'Apple Health',
        'Google Fit',
        'Fitbit, Garmin, Oura',
        '+320% data completeness'
      ]
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: 'Приватность',
      description: 'Ваши данные под надёжной защитой с шифрованием end-to-end',
      details: [
        'E2E шифрование',
        'GDPR compliant',
        'HIPAA compliant',
        'Local processing'
      ]
    }
  ];

  const researchStats = [
    { value: '12', label: 'R&D проектов', icon: <Activity className="w-6 h-6" /> },
    { value: '30K+', label: 'Участников исследований', icon: <Users className="w-6 h-6" /> },
    { value: '9', label: 'Публикаций в 2026', icon: <Globe className="w-6 h-6" /> },
    { value: '60+', label: 'Патентов к 2030', icon: <Shield className="w-6 h-6" /> }
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
              Возможности EthosLife
            </h1>
            <p className="text-xl text-[#5c5243] max-w-3xl mx-auto mb-10">
              Комплексная платформа для здоровья с 7 интегрированными модулями, 
              AI-коучем и научным подходом
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Попробовать бесплатно
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Health Modules */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              7 Модулей Здоровья
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Все аспекты вашего здоровья в одной платформе
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {healthModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-8 hover:shadow-2xl transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#2d2418] mb-3">{module.title}</h3>
                <p className="text-[#5c5243] mb-6 leading-relaxed">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#5c5243]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Продвинутые Функции
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Технологии будущего для вашего здоровья уже сегодня
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-8 hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#2d2418] mb-3">{feature.title}</h3>
                    <p className="text-[#5c5243] mb-4 leading-relaxed">{feature.description}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#5c5243]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {detail}
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

      {/* Research Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Научный Подход
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              12 активных R&D исследований с 30,000+ участников
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {researchStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-3 text-violet-500">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-[#2d2418] mb-1">{stat.value}</div>
                <div className="text-sm text-[#5c5243]">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neu-card p-12 text-center"
          >
            <h3 className="text-3xl font-bold text-[#2d2418] mb-6">
              Evidence-Based Design
            </h3>
            <p className="text-lg text-[#5c5243] mb-8 max-w-3xl mx-auto leading-relaxed">
              Каждая функция EthosLife основана на рецензируемых научных исследованиях из 
              Nature Medicine, The Lancet, Psychological Science и других ведущих журналов.
              Мы проводим собственные R&D исследования для постоянного улучшения платформы.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                onClick={() => navigate('/whitepaper')}
                className="px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Читать White Paper
              </motion.button>
              <motion.button
                onClick={() => navigate('/research')}
                className="px-8 py-4 bg-white/70 backdrop-blur-sm text-[#5c5243] font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                R&D Проекты
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Аппаратные Решения
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Программное + аппаратное обеспечение для максимальных результатов
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="neu-card p-8 text-center hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-6xl mb-6">💻</div>
              <h3 className="text-2xl font-bold text-[#2d2418] mb-3">Posture CV</h3>
              <p className="text-[#5c5243] mb-4">Отслеживание осанки через веб-камеру</p>
              <div className="text-3xl font-bold text-emerald-500 mb-2">Бесплатно</div>
              <p className="text-sm text-[#5c5243]">Q4 2026</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="neu-card p-8 text-center border-2 border-emerald-500 hover:shadow-2xl transition-all duration-300 scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold rounded-full">
                Популярное
              </div>
              <div className="text-6xl mb-6">⌚</div>
              <h3 className="text-2xl font-bold text-[#2d2418] mb-3">Posture Wearables</h3>
              <p className="text-[#5c5243] mb-4">Датчики на пояс и плечо</p>
              <div className="text-3xl font-bold text-emerald-500 mb-2">$79-129</div>
              <p className="text-sm text-[#5c5243]">Q2 2027</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="neu-card p-8 text-center hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-6xl mb-6">📷</div>
              <h3 className="text-2xl font-bold text-[#2d2418] mb-3">Smart Camera</h3>
              <p className="text-[#5c5243] mb-4">Умная камера с авто-слежением</p>
              <div className="text-3xl font-bold text-emerald-500 mb-2">$299-399</div>
              <p className="text-sm text-[#5c5243]">Q4 2028</p>
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
              Попробуйте все возможности
            </h2>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Начните бесплатно сегодня. 14 дней Premium в подарок.
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              className="px-12 py-5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Начать бесплатно сейчас
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesV2;
