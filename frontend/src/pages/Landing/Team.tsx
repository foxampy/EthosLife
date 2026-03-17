import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Target, 
  Globe, 
  Heart, 
  Brain,
  Zap,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';

const TeamV2 = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: 'Основатель & CEO',
      avatar: '👨‍💼',
      role: 'Vision & Strategy',
      bio: 'Предприниматель с 10+ лет опыта в healthtech. Ранее основал и продал 2 стартапа.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Chief Technology Officer',
      avatar: '👨‍💻',
      role: 'Technical Architecture',
      bio: 'Бывший lead engineer в крупном healthtech. Эксперт в AI/ML и distributed systems.',
      social: { linkedin: '#', github: '#' }
    },
    {
      name: 'Chief Product Officer',
      avatar: '👩‍🎨',
      role: 'Product & Design',
      bio: '10+ лет в product design. Работала в ведущих tech компаниях над health products.',
      social: { linkedin: '#', dribbble: '#' }
    },
    {
      name: 'Chief Medical Officer',
      avatar: '👨‍⚕️',
      role: 'Medical Advisory',
      bio: 'MD, PhD. 20+ лет клинической практики. Эксперт в preventive medicine.',
      social: { linkedin: '#', research: '#' }
    },
    {
      name: 'Head of AI/ML',
      avatar: '👩‍🔬',
      role: 'AI Research',
      bio: 'PhD in Machine Learning. Публикации в Nature, NeurIPS, ICML.',
      social: { linkedin: '#', google: '#' }
    },
    {
      name: 'Head of Growth',
      avatar: '👨‍💼',
      role: 'Marketing & Growth',
      bio: 'Рост 0→10M пользователей в предыдущих стартапах. Эксперт в growth hacking.',
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  const advisors = [
    {
      name: 'Dr. [Name]',
      avatar: '👨‍🎓',
      role: 'Scientific Advisor',
      affiliation: 'Stanford University',
      bio: 'Professor of Digital Health. 100+ публикаций в ведущих журналах.'
    },
    {
      name: 'Dr. [Name]',
      avatar: '👩‍🎓',
      role: 'Medical Advisor',
      affiliation: 'Harvard Medical School',
      bio: 'Chief of Preventive Medicine. Эксперт в lifestyle medicine.'
    },
    {
      name: '[Name]',
      avatar: '👨‍💼',
      role: 'Business Advisor',
      affiliation: 'Ex-CEO HealthTech Corp',
      bio: 'Основал и продал 3 healthtech компании. Investor в 50+ стартапов.'
    },
    {
      name: 'Dr. [Name]',
      avatar: '👩‍🔬',
      role: 'AI Advisor',
      affiliation: 'MIT Media Lab',
      bio: 'Director of Affective Computing. Пионер в AI для здоровья.'
    }
  ];

  const investors = [
    { name: 'Business Angels', count: 5 },
    { name: 'Venture Funds', count: 3 },
    { name: 'Strategic Partners', count: 4 }
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '50+', label: 'Лет опыта команды', color: 'text-emerald-500' },
    { icon: <Award className="w-8 h-8" />, value: '20+', label: 'Публикаций в топ журналах', color: 'text-violet-500' },
    { icon: <Target className="w-8 h-8" />, value: '3', label: 'Успешных exit', color: 'text-amber-500' },
    { icon: <Globe className="w-8 h-8" />, value: '10+', label: 'Стран в команде', color: 'text-blue-500' }
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
              Команда EthosLife
            </h1>
            <p className="text-xl text-[#5c5243] max-w-3xl mx-auto mb-10">
              Объединили лучших экспертов из healthtech, AI, медицины и бизнеса
              <br />
              для создания Human Operating System
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`flex justify-center mb-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-[#2d2418] mb-1">{stat.value}</div>
                <div className="text-sm text-[#5c5243]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Основная Команда
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Лидеры с опытом создания успешных healthtech продуктов
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-8 text-center hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-7xl mb-6">{member.avatar}</div>
                <h3 className="text-xl font-bold text-[#2d2418] mb-2">{member.name}</h3>
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold rounded-full mb-4">
                  {member.role}
                </div>
                <p className="text-[#5c5243] leading-relaxed mb-6">{member.bio}</p>
                <div className="flex justify-center gap-4">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-[#5c5243] hover:text-emerald-500 transition-colors">
                      LinkedIn
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-[#5c5243] hover:text-emerald-500 transition-colors">
                      Twitter
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="text-[#5c5243] hover:text-emerald-500 transition-colors">
                      GitHub
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="py-24 px-4 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Советники
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Ведущие эксперты из науки, медицины и бизнеса
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((advisor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-6 text-center hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-6xl mb-4">{advisor.avatar}</div>
                <h3 className="text-lg font-bold text-[#2d2418] mb-2">{advisor.name}</h3>
                <div className="text-sm text-emerald-600 font-medium mb-3">{advisor.affiliation}</div>
                <p className="text-sm text-[#5c5243] leading-relaxed">{advisor.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Инвесторы и Партнёры
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Нас поддерживают ведущие инвесторы и стратегические партнёры
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {investors.map((investor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-8 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl mb-4">💎</div>
                <div className="text-4xl font-bold text-emerald-500 mb-2">{investor.count}+</div>
                <div className="text-lg font-bold text-[#2d2418] mb-1">{investor.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Наши Ценности
            </h2>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto">
              Принципы, которые направляют нашу работу
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="neu-card p-8 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#2d2418] mb-3">Забота о людях</h3>
              <p className="text-[#5c5243]">Здоровье пользователей — наш главный приоритет</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="neu-card p-8 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#2d2418] mb-3">Инновации</h3>
              <p className="text-[#5c5243]">Постоянно развиваемся и внедряем новое</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="neu-card p-8 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-12 h-12 text-violet-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#2d2418] mb-3">Качество</h3>
              <p className="text-[#5c5243]">Научный подход и доказательная база</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="neu-card p-8 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#2d2418] mb-3">Прозрачность</h3>
              <p className="text-[#5c5243]">Открытость перед пользователями и партнёрами</p>
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
              Присоединяйтесь к нам
            </h2>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Ищем талантливых людей для создания будущего здоровья
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/register')}
                className="px-12 py-5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Стать пользователем
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

export default TeamV2;
