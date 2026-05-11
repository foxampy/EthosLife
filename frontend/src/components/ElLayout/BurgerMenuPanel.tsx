import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  Sparkles,
  Heart,
  Dumbbell,
  Moon,
  Brain,
  Stethoscope,
  Users,
  Target,
  TrendingUp,
  Award,
  Zap,
  User,
  Settings,
  ShoppingBag,
  MessageSquare,
  Map,
  FileText,
  Presentation,
  Star,
  ChevronDown,
  Droplets,
  Activity,
  Flame,
  Globe,
  Home,
} from 'lucide-react';
import { ElLanguageSelector } from './ElLanguageSelector';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface MenuSection {
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Главное',
    icon: LayoutDashboard,
    items: [
      { label: 'Дашборд', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'ИИ-ассистент', icon: Sparkles, href: '/ai/chat' },
      { label: 'Аналитика', icon: TrendingUp, href: '/analytics' },
      { label: 'Геймификация', icon: Award, href: '/gamification' },
    ],
  },
  {
    title: 'Здоровье',
    icon: Heart,
    items: [
      { label: 'Питание', icon: Flame, href: '/health/nutrition' },
      { label: 'Движение', icon: Dumbbell, href: '/health/movement' },
      { label: 'Сон', icon: Moon, href: '/health/sleep' },
      { label: 'Психология', icon: Brain, href: '/health/psychology' },
      { label: 'Медицина', icon: Stethoscope, href: '/health/medicine' },
      { label: 'Привычки', icon: Target, href: '/health/habits' },
      { label: 'Гидратация', icon: Droplets, href: '/health/nutrition' },
    ],
  },
  {
    title: 'Планирование',
    icon: Target,
    items: [
      { label: 'Цели', icon: Star, href: '/goals' },
      { label: 'Трекер привычек', icon: Zap, href: '/health/habits' },
      { label: 'Прогресс', icon: Activity, href: '/analytics' },
    ],
  },
  {
    title: 'Социум',
    icon: Users,
    items: [
      { label: 'Лента', icon: MessageSquare, href: '/social' },
      { label: 'Контакты', icon: Users, href: '/contacts' },
      { label: 'Специалисты', icon: Star, href: '/specialists' },
      { label: 'Центры', icon: Map, href: '/centers' },
    ],
  },
  {
    title: 'Магазин',
    icon: ShoppingBag,
    items: [
      { label: 'Товары и услуги', icon: ShoppingBag, href: '/shop' },
      { label: 'Подписки', icon: Zap, href: '/subscriptions' },
    ],
  },
  {
    title: 'Аккаунт',
    icon: User,
    items: [
      { label: 'Профиль', icon: User, href: '/profile' },
      { label: 'Настройки', icon: Settings, href: '/settings' },
    ],
  },
  {
    title: 'Информация',
    icon: Globe,
    items: [
      { label: 'О платформе', icon: Home, href: '/' },
      { label: 'Возможности', icon: Zap, href: '/features' },
      { label: 'Цены', icon: Star, href: '/pricing' },
      { label: 'Команда', icon: Users, href: '/team' },
      { label: 'Роадмап', icon: Map, href: '/roadmap' },
      { label: 'FAQ', icon: MessageSquare, href: '/faq' },
      { label: 'WhitePaper', icon: FileText, href: '/whitepaper' },
      { label: 'Инвесторам', icon: Presentation, href: '/investor-pitch' },
    ],
  },
];

export const BurgerMenuPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['Главное', 'Здоровье']);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const handleNavigate = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[300px] max-w-[85vw] h-full flex flex-col overflow-hidden"
        style={{
          background: 'var(--bone-200, #e8e0d5)',
          boxShadow: '8px 0 32px rgba(44,40,34,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)' }}
            >
              🌱
            </div>
            <div>
              <p className="font-bold text-[#3d342b] text-base leading-tight">EthosLife</p>
              <p className="text-xs text-[#a09282]">Human OS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ElLanguageSelector variant="minimal" />
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity hover:opacity-70"
              style={{
                background: 'var(--bone-200, #e8e0d5)',
                boxShadow: '3px 3px 6px rgba(44,40,34,0.1), -3px -3px 6px rgba(255,255,255,0.7)',
              }}
            >
              <X className="w-4 h-4 text-[#8c7a6b]" />
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-0.5">
          {menuSections.map((section) => {
            const isOpen = openSections.includes(section.title);
            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                  style={{ background: isOpen ? 'rgba(92,82,67,0.06)' : 'transparent' }}
                >
                  <div className="flex items-center gap-2.5">
                    <section.icon className="w-4 h-4 text-[#5c5243]" />
                    <span className="text-sm font-semibold text-[#3d342b]">{section.title}</span>
                  </div>
                  <ChevronDown
                    className="w-4 h-4 text-[#a09282] transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-3 pb-1 space-y-0.5">
                        {section.items.map((item) => {
                          const active = location.pathname === item.href;
                          return (
                            <button
                              key={`${section.title}-${item.href}-${item.label}`}
                              onClick={() => handleNavigate(item.href)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                              style={{
                                background: active
                                  ? 'linear-gradient(135deg, rgba(92,82,67,0.12), rgba(140,122,107,0.08))'
                                  : 'transparent',
                                color: active ? '#5c5243' : '#8c7a6b',
                              }}
                            >
                              <item.icon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm font-medium">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
