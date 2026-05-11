import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Target, Brain, Users, TrendingUp, Zap, CheckCircle2, Star } from 'lucide-react';

const features = [
  { icon: Heart, label: 'Здоровье', desc: 'Питание, движение, сон, тело', color: '#f472b6', bg: 'from-rose-400/20 to-pink-400/10' },
  { icon: Target, label: 'Цели и привычки', desc: 'Ставь, следи, достигай', color: '#34d399', bg: 'from-emerald-400/20 to-green-400/10' },
  { icon: Brain, label: 'Психология', desc: 'Ментальное здоровье и рост', color: '#a78bfa', bg: 'from-violet-400/20 to-purple-400/10' },
  { icon: Zap, label: 'ИИ-ассистент', desc: 'Персональные рекомендации 24/7', color: '#fbbf24', bg: 'from-amber-400/20 to-yellow-400/10' },
  { icon: Users, label: 'Социум', desc: 'Друзья, специалисты, команда', color: '#60a5fa', bg: 'from-blue-400/20 to-cyan-400/10' },
  { icon: TrendingUp, label: 'Прогресс', desc: 'Аналитика и геймификация', color: '#fb923c', bg: 'from-orange-400/20 to-amber-400/10' },
];

const stats = [
  { value: '12 000+', label: 'активных пользователей' },
  { value: '240 000', label: 'привычек сформировано' },
  { value: '98 000', label: 'целей достигнуто' },
  { value: '4.9★', label: 'средняя оценка' },
];

const steps = [
  { num: '01', title: 'Создай профиль', desc: 'Расскажи о своих целях и образе жизни' },
  { num: '02', title: 'Составь план', desc: 'ИИ поможет выстроить твою систему' },
  { num: '03', title: 'Отслеживай рост', desc: 'Каждый день — шаг к лучшей версии себя' },
];

const neuCard = {
  background: 'var(--bone-200, #e8e0d5)',
  boxShadow: '8px 8px 16px rgba(44,40,34,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
  borderRadius: '24px',
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #dcd3c6 0%, #e8e0d5 50%, #dcd3c6 100%)' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12 text-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)', boxShadow: '0 8px 32px rgba(92,82,67,0.4)' }}
            >
              🌱
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-medium text-[#5c5243]"
            style={neuCard}>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Human Operating System
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#2d2418] leading-tight mb-4">
            Твоя система<br />
            <span style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              жизни и роста
            </span>
          </h1>

          <p className="text-lg text-[#6b5d52] mb-8 leading-relaxed">
            Одна платформа для здоровья, привычек, целей и прогресса.<br />
            Все сферы жизни — под контролем.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base"
              style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)', boxShadow: '0 8px 24px rgba(92,82,67,0.35)' }}
            >
              Начать бесплатно <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/investor-pitch')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-[#2d2418]"
              style={neuCard}
            >
              Для инвесторов
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="text-center p-4 rounded-2xl" style={neuCard}>
              <p className="text-2xl font-bold text-[#5c5243]">{s.value}</p>
              <p className="text-xs text-[#a09282] mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#2d2418] mb-6">Всё что нужно для роста</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${f.bg} cursor-pointer`}
              style={{ boxShadow: '6px 6px 12px rgba(44,40,34,0.08), -6px -6px 12px rgba(255,255,255,0.6)' }}
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <f.icon className="w-6 h-6 mb-2" style={{ color: f.color }} />
              <p className="font-semibold text-[#2d2418] text-sm">{f.label}</p>
              <p className="text-xs text-[#8c7a6b] mt-0.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#2d2418] mb-6">Как это работает</h2>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
              className="flex items-center gap-4 p-4 rounded-2xl" style={neuCard}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)' }}>
                {s.num}
              </div>
              <div>
                <p className="font-semibold text-[#2d2418]">{s.title}</p>
                <p className="text-sm text-[#6b5d52]">{s.desc}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 max-w-2xl mx-auto text-center">
        <motion.div className="p-8 rounded-3xl" style={neuCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="text-2xl font-bold text-[#2d2418] mb-2">Начни сегодня</h3>
          <p className="text-[#6b5d52] mb-6">Первые 30 дней бесплатно. Без кредитной карты.</p>
          <motion.button
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)', boxShadow: '0 8px 24px rgba(92,82,67,0.35)' }}
          >
            Открыть EthosLife →
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
