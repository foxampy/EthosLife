import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Heart, 
  Brain, 
  Shield, 
  Sparkles,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';

const TeamV1 = () => {
  const [activeTab, setActiveTab] = useState('leadership');
  const [hoveredMember, setHoveredMember] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leadership = [
    {
      id: 1,
      name: 'Dr. Alexandra Volkov',
      role: 'CEO & Co-Founder',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      bio: 'Бывший директор по цифровым инновациям в Mayo Clinic. PhD в области биомедицинской информатики из Stanford. 15+ лет опыта в healthcare technology.',
      expertise: ['Digital Health', 'AI/ML', 'Strategic Planning'],
      social: { linkedin: '#', twitter: '#' },
      quote: 'Здоровье — это не пункт назначения, а путь. Мы помогаем людям пройти этот путь с уверенностью.',
      achievements: ['40+ патентов', 'Ex-Google Health', 'Forbes 30 Under 30'],
    },
    {
      id: 2,
      name: 'Marcus Chen',
      role: 'CTO & Co-Founder',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Ранее ведущий инженер в Tesla AI. MS Computer Science MIT. Эксперт в распределенных системах и машинном обучении.',
      expertise: ['System Architecture', 'Blockchain', 'AI Infrastructure'],
      social: { linkedin: '#', twitter: '#', github: '#' },
      quote: 'Технологии должны служить людям, а не наоборот. Мы строим систему, которая понимает человека.',
      achievements: ['Open Source Contributor', 'Speaker at Web3 Summit', '10+ лет в AI'],
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      role: 'Chief Medical Officer',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      bio: 'MD Harvard Medical School, Board Certified в Internal Medicine и Preventive Medicine. Пионер в области прецизионной медицины.',
      expertise: ['Preventive Medicine', 'Nutrition Science', 'Clinical Research'],
      social: { linkedin: '#', researchgate: '#' },
      quote: 'Каждое решение в области здоровья должно быть основано на доказательствах. Мы объединяем науку с технологиями.',
      achievements: ['50+ публикаций', 'NIH Grant Recipient', 'Top Doctor 2024'],
    },
    {
      id: 4,
      name: 'Elena Morozova',
      role: 'Chief Product Officer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      bio: 'Бывший VP Product в Headspace. Эксперт в UX для wellness продуктов. MBA Stanford GSB.',
      expertise: ['Product Strategy', 'User Experience', 'Behavioral Science'],
      social: { linkedin: '#', twitter: '#' },
      quote: 'Продукт должен быть не просто полезным, но и приносить радость от использования.',
      achievements: ['10M+ пользователей', 'Design Award Winner', 'Ex-McKinsey'],
    },
  ];

  const advisors = [
    {
      id: 5,
      name: 'Prof. James Wilson',
      role: 'Medical Advisor',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
      bio: 'Professor of Medicine at Johns Hopkins. Pioneer in digital therapeutics.',
      expertise: ['Clinical Trials', 'Regulatory Affairs'],
    },
    {
      id: 6,
      name: 'Sarah Kim',
      role: 'Technology Advisor',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
      bio: 'Former VP Engineering at Stripe. Expert in scalable systems.',
      expertise: ['Fintech', 'Security', 'Scale'],
    },
    {
      id: 7,
      name: 'Dr. Ahmed Hassan',
      role: 'Research Advisor',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      bio: 'Director of Digital Health Research at Oxford University.',
      expertise: ['Clinical Research', 'Data Science'],
    },
    {
      id: 8,
      name: 'Lisa Thompson',
      role: 'Business Advisor',
      avatar: 'https://images.unsplash.com/photo-1598550476439-c94838987c89?w=400',
      bio: 'Serial entrepreneur. 3 exits in healthtech. Partner at a16z bio fund.',
      expertise: ['Venture Capital', 'M&A', 'Strategy'],
    },
  ];

  const stats = [
    { value: '150+', label: 'Лет опыта', icon: Award },
    { value: '50+', label: 'Публикаций', icon: Target },
    { value: '10+', label: 'Стран', icon: Globe },
    { value: '$50M+', label: 'Привлечено', icon: TrendingUp },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Забота о людях',
      description: 'Каждое наше решение направлено на улучшение качества жизни пользователей.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Научный подход',
      description: 'Все рекомендации основаны на доказательной медицине и последних исследованиях.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sparkles,
      title: 'Инновации',
      description: 'Используем передовые технологии AI и blockchain для создания будущего здоровья.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Zap,
      title: 'Прозрачность',
      description: 'Открытость в методах, данных и результатах. Доверие — наша основа.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#dcd3c6]/80 border-b border-[#c9b8a6]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                E
              </div>
              <span className="font-bold text-xl text-[#2d2418]">EthosLife</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-[#5c5243] hover:text-[#2d2418] transition-colors font-medium">Возможности</Link>
              <Link to="/tokenomics" className="text-[#5c5243] hover:text-[#2d2418] transition-colors font-medium">Токеномика</Link>
              <Link to="/roadmap" className="text-[#5c5243] hover:text-[#2d2418] transition-colors font-medium">Roadmap</Link>
              <Link to="/team" className="text-[#2d2418] font-semibold">Команда</Link>
              <Link to="/pricing" className="text-[#5c5243] hover:text-[#2d2418] transition-colors font-medium">Цены</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="hidden sm:block px-4 py-2 text-[#5c5243] hover:text-[#2d2418] font-medium transition-colors">
                Войти
              </Link>
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Начать сейчас
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00d9ff]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#9d4edd]/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5c5243]/10 text-[#5c5243] mb-6">
              <Users size={18} />
              <span className="text-sm font-medium">Наша команда</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2d2418] mb-6 leading-tight">
              Встречайте команду
              <br />
              <span className="bg-gradient-to-r from-[#5c5243] via-[#8c7a6b] to-[#a69b8c] bg-clip-text text-transparent">
                меняющую здравоохранение
              </span>
            </h1>
            
            <p className="text-xl text-[#5c5243] max-w-3xl mx-auto mb-12">
              Мы — команда экспертов из ведущих мировых компаний в области медицины, 
              технологий и дизайна. Объединяем науку с инновациями для создания будущего здоровья.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-3xl bg-[#e4dfd5] shadow-[8px_8px_16px_rgba(44,40,34,0.1),-8px_-8px_16px_rgba(255,255,255,0.6)]"
                >
                  <Icon className="w-8 h-8 text-[#5c5243] mx-auto mb-3" />
                  <div className="text-3xl font-bold text-[#2d2418] mb-1">{stat.value}</div>
                  <div className="text-sm text-[#5c5243]">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Наши ценности</h2>
            <p className="text-lg text-[#5c5243] max-w-2xl mx-auto">
              Принципы, которыми мы руководствуемся в каждом решении
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-[#e4dfd5] shadow-[8px_8px_16px_rgba(44,40,34,0.1),-8px_-8px_16px_rgba(255,255,255,0.6)] hover:shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)] transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2d2418] mb-3">{value.title}</h3>
                  <p className="text-[#5c5243] leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Руководство</h2>
            <p className="text-lg text-[#5c5243] max-w-2xl mx-auto">
              Лидеры с опытом работы в ведущих мировых компаниях
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {leadership.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
                className="group relative rounded-3xl overflow-hidden bg-[#e4dfd5] shadow-[8px_8px_16px_rgba(44,40,34,0.1),-8px_-8px_16px_rgba(255,255,255,0.6)] hover:shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)] transition-all"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 relative overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-64 sm:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2d2418]/60 to-transparent sm:bg-gradient-to-r"></div>
                  </div>
                  
                  <div className="p-6 sm:p-8 sm:w-3/5">
                    <h3 className="text-2xl font-bold text-[#2d2418] mb-1">{member.name}</h3>
                    <p className="text-[#5c5243] font-medium mb-4">{member.role}</p>
                    
                    <p className="text-[#5c5243] text-sm mb-4 leading-relaxed">{member.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[#d4ccb8] text-[#5c5243]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="p-2 rounded-lg bg-[#d4ccb8] text-[#5c5243] hover:bg-[#5c5243] hover:text-white transition-colors">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="p-2 rounded-lg bg-[#d4ccb8] text-[#5c5243] hover:bg-[#5c5243] hover:text-white transition-colors">
                          <Twitter size={18} />
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} className="p-2 rounded-lg bg-[#d4ccb8] text-[#5c5243] hover:bg-[#5c5243] hover:text-white transition-colors">
                          <Globe size={18} />
                        </a>
                      )}
                    </div>

                    <blockquote className="text-sm text-[#2d2418] italic border-l-4 border-[#5c5243] pl-4">
                      "{member.quote}"
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Советники</h2>
            <p className="text-lg text-[#5c5243] max-w-2xl mx-auto">
              Эксперты мирового уровня, помогающие нам достигать лучших результатов
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-3xl bg-[#e4dfd5] shadow-[8px_8px_16px_rgba(44,40,34,0.1),-8px_-8px_16px_rgba(255,255,255,0.6)] hover:shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)] transition-all group"
              >
                <img
                  src={advisor.avatar}
                  alt={advisor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-[#d4ccb8] group-hover:ring-[#5c5243]/30 transition-all"
                />
                <h3 className="text-lg font-bold text-[#2d2418] mb-1">{advisor.name}</h3>
                <p className="text-[#5c5243] text-sm font-medium mb-3">{advisor.role}</p>
                <p className="text-[#5c5243] text-xs leading-relaxed">{advisor.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-[3rem] bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] text-white shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Присоединяйтесь к нам
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Станьте частью революции в области здоровья и благополучия
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white text-[#5c5243] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Начать бесплатно
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Узнать больше
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#c9b8a6]/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <span className="font-bold text-xl text-[#2d2418]">EthosLife</span>
          </div>
          <p className="text-[#5c5243]">
            © 2026 EthosLife. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TeamV1;
