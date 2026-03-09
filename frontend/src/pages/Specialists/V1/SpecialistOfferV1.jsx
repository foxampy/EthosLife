// ============================================
// SpecialistOfferV1.jsx
// Страница предложения для специалистов
// Путь: /specialists/offer-v1
// Стиль: Ретрофутуризм Неоморфизм
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Check,
  ArrowRight,
  Play,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Calendar,
  MessageSquare,
  Award,
  Heart,
  Clock,
  Target,
  BarChart3,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Video,
  FileText,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Stethoscope,
  X
} from 'lucide-react';

// ============================================
// MOCK DATA
// ============================================

const benefitsData = [
  {
    id: 1,
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Высокий доход',
    description: 'Зарабатывайте до 300 000 ₽ в месяц с гибким графиком работы. Комиссия платформы всего 15%.',
    color: '#00d9ff',
    stats: 'до 300K ₽/мес',
  },
  {
    id: 2,
    icon: <Users className="w-8 h-8" />,
    title: 'Готовая аудитория',
    description: 'Доступ к базе из 10 000+ активных клиентов. Не нужно тратить бюджет на маркетинг.',
    color: '#e94560',
    stats: '10 000+ клиентов',
  },
  {
    id: 3,
    icon: <Calendar className="w-8 h-8" />,
    title: 'Гибкий график',
    description: 'Работайте когда удобно вам. Полная свобода в планировании расписания и приёмов.',
    color: '#9d4edd',
    stats: '100% гибкость',
  },
  {
    id: 4,
    icon: <Award className="w-8 h-8" />,
    title: 'Профессиональный рост',
    description: 'Бесплатное обучение, сертификация, доступ к закрытому сообществу экспертов.',
    color: '#00ff88',
    stats: '50+ курсов',
  },
];

const testimonialsData = [
  {
    id: 1,
    name: 'Др. Анна Михайлова',
    specialty: 'Нутрициолог',
    avatar: '👩‍⚕️',
    rating: 5,
    text: 'За 6 месяцев на платформе я увеличила доход в 3 раза. EthosLife предоставляет всё необходимое для работы: CRM, планировщик, платежи.',
    clients: '150+',
    revenue: '250 000 ₽/мес',
  },
  {
    id: 2,
    name: 'Максим Волков',
    specialty: 'Фитнес-тренер',
    avatar: '🏋️',
    rating: 5,
    text: 'Лучшая платформа для специалистов здоровья. Автоматизация записи, напоминания, аналитика — всё работает как часы.',
    clients: '200+',
    revenue: '320 000 ₽/мес',
  },
  {
    id: 3,
    name: 'Елена Соколова',
    specialty: 'Психолог',
    avatar: '🧠',
    rating: 5,
    text: 'Наконец-то могу сосредоточиться на клиентах, а не на администрировании. Платформа взяла всё на себя.',
    clients: '120+',
    revenue: '180 000 ₽/мес',
  },
];

const pricingPlans = [
  {
    id: 'starter',
    name: 'Старт',
    price: 0,
    period: 'навсегда',
    description: 'Для начала работы',
    features: [
      'До 10 клиентов в месяц',
      'Базовая аналитика',
      'Календарь записей',
      'Чат с клиентами',
      'Профиль специалиста',
    ],
    limitations: [
      'Комиссия 20%',
      'Нет продвижения',
      'Базовая поддержка',
    ],
    color: '#5c5243',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Профи',
    price: 2990,
    period: 'в месяц',
    description: 'Для активных специалистов',
    features: [
      'Безлимитные клиенты',
      'Продвинутая аналитика',
      'Автоматические напоминания',
      'Видео-консультации',
      'Приоритет в поиске',
      'Персональный менеджер',
      'Доступ к курсам',
    ],
    limitations: [
      'Комиссия 15%',
    ],
    color: '#00d9ff',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Элита',
    price: 7990,
    period: 'в месяц',
    description: 'Максимальные возможности',
    features: [
      'Всё из Профи',
      'VIP-поддержка 24/7',
      'Персональный бренд',
      'Реклама в приложении',
      'Участие в ивентах',
      'Сертификация',
      'Групповые программы',
      'API доступ',
    ],
    limitations: [
      'Комиссия 10%',
    ],
    color: '#e94560',
    popular: false,
  },
];

const faqData = [
  {
    id: 1,
    question: 'Как быстро я начну получать клиентов?',
    answer: 'Большинство специалистов получают первых клиентов в течение 3-5 дней после заполнения профиля. Активные специалисты выходят на полную загрузку за 2-4 недели.',
  },
  {
    id: 2,
    question: 'Нужно ли платить комиссию с бесплатных консультаций?',
    answer: 'Нет, комиссия взимается только с оплаченных услуг. Вы можете проводить бесплатные ознакомительные консультации без комиссии.',
  },
  {
    id: 3,
    question: 'Могу ли я работать с другими платформами одновременно?',
    answer: 'Да, мы не требуем эксклюзивности. Однако специалисты с полной загрузкой на EthosLife получают приоритет в продвижении.',
  },
  {
    id: 4,
    question: 'Как происходит выплата заработка?',
    answer: 'Выплаты производятся автоматически каждые 7 дней на ваш расчётный счёт или карту. Минимальная сумма для вывода — 1000 ₽.',
  },
  {
    id: 5,
    question: 'Предоставляете ли вы обучение?',
    answer: 'Да, у нас есть собственная академия с 50+ курсами по различным направлениям. Для тарифов Профи и Элита обучение бесплатное.',
  },
  {
    id: 6,
    question: 'Что если клиент отменит запись?',
    answer: 'При отмене менее чем за 24 часа клиент оплачивает 50% стоимости. При отмене ранее — отмена бесплатна для обеих сторон.',
  },
];

const specialtiesData = [
  { icon: <Apple className="w-6 h-6" />, name: 'Нутрициология' },
  { icon: <Dumbbell className="w-6 h-6" />, name: 'Фитнес' },
  { icon: <Brain className="w-6 h-6" />, name: 'Психология' },
  { icon: <Moon className="w-6 h-6" />, name: 'Сомнология' },
  { icon: <Stethoscope className="w-6 h-6" />, name: 'Медицина' },
  { icon: <Sparkles className="w-6 h-6" />, name: 'Велнес' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * RatingStars - Компонент звёзд рейтинга
 */
const RatingStars = ({ rating, count }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? 'fill-[#f0a500] text-[#f0a500]'
              : 'text-gray-500'
          }`}
        />
      ))}
      {count !== undefined && (
        <span className="text-sm text-gray-400 ml-2">({count})</span>
      )}
    </div>
  );
};

/**
 * NeonButton - Неоновая кнопка
 */
const NeonButton = ({ children, variant = 'cyan', onClick, className = '', type = 'button' }) => {
  const variants = {
    cyan: 'border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff]/10',
    red: 'border-[#e94560] text-[#e94560] hover:bg-[#e94560]/10',
    purple: 'border-[#9d4edd] text-[#9d4edd] hover:bg-[#9d4edd]/10',
    gold: 'border-[#f0a500] text-[#f0a500] hover:bg-[#f0a500]/10',
    green: 'border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative px-6 py-3 rounded-xl font-semibold
        border-2 ${variants[variant]}
        transition-all duration-300
        hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]
        hover:scale-105
        active:scale-95
        ${className}
      `}
      style={{
        boxShadow: variant === 'cyan' 
          ? '0 0 10px rgba(0,217,255,0.3)' 
          : variant === 'red'
          ? '0 0 10px rgba(233,69,96,0.3)'
          : '0 0 10px rgba(157,78,221,0.3)',
      }}
    >
      {children}
    </button>
  );
};

/**
 * BenefitCard - Карточка преимущества
 */
const BenefitCard = ({ benefit, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="neu-card p-6 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${benefit.color}20, ${benefit.color}10)`,
          color: benefit.color,
          boxShadow: isHovered ? `0 0 30px ${benefit.color}40` : 'none',
        }}
      >
        {benefit.icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
      <p className="text-gray-400 mb-4">{benefit.description}</p>
      <div
        className="text-2xl font-bold neon-text"
        style={{ color: benefit.color }}
      >
        {benefit.stats}
      </div>
    </div>
  );
};

/**
 * TestimonialCard - Карточка отзыва
 */
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="neu-card p-6 min-w-[350px]">
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-5xl">{testimonial.avatar}</div>
        <div>
          <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
          <p className="text-sm text-gray-400">{testimonial.specialty}</p>
          <RatingStars rating={testimonial.rating} />
        </div>
      </div>
      <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
      <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
        <div>
          <div className="text-2xl font-bold text-[#00d9ff]">{testimonial.clients}</div>
          <div className="text-xs text-gray-400">Клиентов</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#00ff88]">{testimonial.revenue}</div>
          <div className="text-xs text-gray-400">Доход</div>
        </div>
      </div>
    </div>
  );
};

/**
 * PricingCard - Карточка тарифа
 */
const PricingCard = ({ plan, onSelect }) => {
  return (
    <div
      className={`neu-card p-8 relative ${plan.popular ? 'border-2 border-[#00d9ff]' : ''}`}
      style={{
        boxShadow: plan.popular ? '0 0 40px rgba(0,217,255,0.2)' : 'none',
      }}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#00d9ff] text-[#1a1a2e] px-4 py-1 rounded-full text-sm font-bold">
            ПОПУЛЯРНЫЙ
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
        <div className="flex items-baseline justify-center">
          {plan.price > 0 && (
            <span className="text-4xl font-bold" style={{ color: plan.color }}>
              {plan.price.toLocaleString()} ₽
            </span>
          )}
          {plan.price === 0 && (
            <span className="text-4xl font-bold text-[#00ff88]">Бесплатно</span>
          )}
          <span className="text-gray-400 ml-2">/{plan.period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
        {plan.limitations.map((limitation, idx) => (
          <li key={idx} className="flex items-start space-x-3">
            <X className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-500">{limitation}</span>
          </li>
        ))}
      </ul>
      <NeonButton
        variant={plan.popular ? 'cyan' : 'purple'}
        onClick={() => onSelect(plan)}
        className="w-full"
      >
        Выбрать {plan.name}
      </NeonButton>
    </div>
  );
};

/**
 * FAQItem - Элемент FAQ
 */
const FAQItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className="neu-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <span className="text-lg font-semibold text-white pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-[#00d9ff] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0">
          <p className="text-gray-400 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
};

/**
 * ROICalculator - Калькулятор ROI
 */
const ROICalculator = () => {
  const [clients, setClients] = useState(20);
  const [avgPrice, setAvgPrice] = useState(3000);
  const [sessionsPerClient, setSessionsPerClient] = useState(4);

  const monthlyRevenue = clients * avgPrice * sessionsPerClient;
  const commission = monthlyRevenue * 0.15;
  const netRevenue = monthlyRevenue - commission;

  return (
    <div className="neu-card p-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 mr-3 text-[#00d9ff]" />
        Калькулятор дохода
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Клиентов в месяц
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={clients}
            onChange={(e) => setClients(Number(e.target.value))}
            className="w-full accent-[#00d9ff]"
          />
          <div className="text-2xl font-bold text-[#00d9ff] mt-2">{clients}</div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Средняя цена сессии (₽)
          </label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={avgPrice}
            onChange={(e) => setAvgPrice(Number(e.target.value))}
            className="w-full accent-[#e94560]"
          />
          <div className="text-2xl font-bold text-[#e94560] mt-2">{avgPrice.toLocaleString()} ₽</div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Сессий на клиента
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={sessionsPerClient}
            onChange={(e) => setSessionsPerClient(Number(e.target.value))}
            className="w-full accent-[#9d4edd]"
          />
          <div className="text-2xl font-bold text-[#9d4edd] mt-2">{sessionsPerClient}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl" style={{ background: 'rgba(0,217,255,0.05)' }}>
        <div>
          <div className="text-sm text-gray-400 mb-1">Общий доход</div>
          <div className="text-3xl font-bold text-[#00d9ff]">
            {monthlyRevenue.toLocaleString()} ₽
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Чистыми (после 15% комиссии)</div>
          <div className="text-3xl font-bold text-[#00ff88]">
            {netRevenue.toLocaleString()} ₽
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-400">
        * Расчёт приблизительный. Реальный доход зависит от вашей специализации и активности.
      </div>
    </div>
  );
};

/**
 * SignUpForm - Форма регистрации
 */
const SignUpForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Введите имя';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (!formData.specialty) newErrors.specialty = 'Выберите специализацию';
    if (!formData.city) newErrors.city = 'Выберите город';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="neu-card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-4">Заявка отправлена!</h3>
          <p className="text-gray-400 mb-6">
            Наш менеджер свяжется с вами в течение 24 часов для уточнения деталей.
          </p>
          <NeonButton onClick={onClose} variant="cyan">
            Закрыть
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neu-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Стать специалистом</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">ФИО *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-[#0f3460]/50 border ${
                errors.name ? 'border-[#e94560]' : 'border-white/10'
              } text-white focus:border-[#00d9ff] focus:outline-none transition-colors`}
              placeholder="Иванов Иван Иванович"
            />
            {errors.name && <p className="text-[#e94560] text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-[#0f3460]/50 border ${
                errors.email ? 'border-[#e94560]' : 'border-white/10'
              } text-white focus:border-[#00d9ff] focus:outline-none transition-colors`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-[#e94560] text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Телефон *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-[#0f3460]/50 border ${
                errors.phone ? 'border-[#e94560]' : 'border-white/10'
              } text-white focus:border-[#00d9ff] focus:outline-none transition-colors`}
              placeholder="+7 (999) 000-00-00"
            />
            {errors.phone && <p className="text-[#e94560] text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Специализация *</label>
            <select
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-[#0f3460]/50 border ${
                errors.specialty ? 'border-[#e94560]' : 'border-white/10'
              } text-white focus:border-[#00d9ff] focus:outline-none transition-colors`}
            >
              <option value="">Выберите специализацию</option>
              {specialtiesData.map((spec, idx) => (
                <option key={idx} value={spec.name}>{spec.name}</option>
              ))}
            </select>
            {errors.specialty && <p className="text-[#e94560] text-sm mt-1">{errors.specialty}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Опыт работы (лет)</label>
            <input
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0f3460]/50 border border-white/10 text-white focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="3"
              min="0"
              max="50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Город *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-[#0f3460]/50 border ${
                errors.city ? 'border-[#e94560]' : 'border-white/10'
              } text-white focus:border-[#00d9ff] focus:outline-none transition-colors`}
              placeholder="Москва"
            />
            {errors.city && <p className="text-[#e94560] text-sm mt-1">{errors.city}</p>}
          </div>
          <div className="pt-4">
            <NeonButton type="submit" variant="cyan" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </NeonButton>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const SpecialistOfferV1 = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePlanSelect = (plan) => {
    setShowSignUpForm(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-x-hidden">
      {/* Retro Grid Background */}
      <div className="fixed inset-0 retro-grid-bg" />

      {/* Animated Orbs */}
      <div
        className="fixed w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: '#00d9ff',
          top: '10%',
          left: '10%',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
      <div
        className="fixed w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: '#e94560',
          bottom: '10%',
          right: '10%',
          transform: `translateY(${-scrollY * 0.1}px)`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold neon-text">EthosLife</span>
            </div>
            <div className="flex items-center space-x-4">
              <NeonButton variant="cyan" onClick={() => setShowSignUpForm(true)}>
                Стать специалистом
              </NeonButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-[#0f3460]/50 border border-[#00d9ff]/30">
                <span className="text-[#00d9ff] text-sm font-semibold">
                  🚀 Платформа для специалистов здоровья
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="neon-text">EthosLife</span>
                <br />
                <span style={{ color: '#00d9ff' }}>для Специалистов</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Присоединяйтесь к платформе нового поколения. Автоматизация, 
                готовые клиенты и инструменты для роста вашего бизнеса.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <NeonButton variant="cyan" onClick={() => setShowSignUpForm(true)}>
                  Начать бесплатно <ArrowRight className="w-5 h-5 ml-2 inline" />
                </NeonButton>
                <NeonButton variant="purple">
                  <Play className="w-5 h-5 mr-2 inline" /> Демо
                </NeonButton>
              </div>
              <div className="flex items-center space-x-8">
                <div>
                  <div className="text-3xl font-bold text-[#00ff88]">10 000+</div>
                  <div className="text-gray-400">Специалистов</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#f0a500]">500K+</div>
                  <div className="text-gray-400">Консультаций</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#e94560]">98%</div>
                  <div className="text-gray-400">Довольных</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="neu-card p-8 holo-display">
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4 animate-float">👨‍⚕️</div>
                  <h3 className="text-2xl font-bold text-white mb-2">3D Модель Специалиста</h3>
                  <p className="text-gray-400">Интерактивная визуализация</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {specialtiesData.map((spec, idx) => (
                    <div
                      key={idx}
                      className="neu-card-pressed p-4 rounded-xl text-center hover:scale-105 transition-transform"
                    >
                      <div className="text-2xl mb-2" style={{ color: '#00d9ff' }}>{spec.icon}</div>
                      <div className="text-xs text-gray-400">{spec.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Преимущества работы
            </h2>
            <p className="text-xl text-gray-400">
              Всё необходимое для успешной практики в одной платформе
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitsData.map((benefit, index) => (
              <BenefitCard key={benefit.id} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Рассчитайте свой доход
            </h2>
            <p className="text-xl text-gray-400">
              Узнайте, сколько вы можете зарабатывать на платформе
            </p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Истории успеха
            </h2>
            <p className="text-xl text-gray-400">
              Наши специалисты делятся своим опытом
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${activeTestimonial * (350 + 24)}px)` }}
            >
              {testimonialsData.map((testimonial) => (
                <div key={testimonial.id} className="px-3">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeTestimonial ? 'bg-[#00d9ff] w-8' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Тарифные планы
            </h2>
            <p className="text-xl text-gray-400">
              Выберите подходящий план для вашего бизнеса
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} onSelect={handlePlanSelect} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Часто задаваемые вопросы
            </h2>
            <p className="text-xl text-gray-400">
              Ответы на популярные вопросы
            </p>
          </div>
          <div className="space-y-4">
            {faqData.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openFAQ === item.id}
                onToggle={() => setOpenFAQ(openFAQ === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="neu-card p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(0,217,255,0.1), rgba(157,78,221,0.1))' }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text">
              Готовы начать?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Присоединяйтесь к тысячам специалистов, которые уже зарабатывают с EthosLife
            </p>
            <NeonButton variant="cyan" onClick={() => setShowSignUpForm(true)} className="text-lg px-8 py-4">
              Стать специалистом <ArrowRight className="w-6 h-6 ml-2 inline" />
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">🌱</span>
                <span className="text-xl font-bold neon-text">EthosLife</span>
              </div>
              <p className="text-gray-400">
                Платформа для специалистов здоровья нового поколения
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#00d9ff]">О нас</a></li>
                <li><a href="#" className="hover:text-[#00d9ff]">Карьера</a></li>
                <li><a href="#" className="hover:text-[#00d9ff]">Пресса</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#00d9ff]">Помощь</a></li>
                <li><a href="#" className="hover:text-[#00d9ff]">Контакты</a></li>
                <li><a href="#" className="hover:text-[#00d9ff]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>specialists@ethoslife.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+7 (999) 000-00-00</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Москва, Россия</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500">
            © 2026 EthosLife. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Sign Up Modal */}
      {showSignUpForm && <SignUpForm onClose={() => setShowSignUpForm(false)} />}
    </div>
  );
};

export default SpecialistOfferV1;
