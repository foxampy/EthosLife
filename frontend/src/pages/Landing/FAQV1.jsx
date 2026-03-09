import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Users,
  CreditCard,
  Shield,
  Settings,
  Smartphone,
  Activity,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const FAQV1 = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: 'all', label: 'Все', icon: BookOpen },
    { id: 'general', label: 'Общее', icon: HelpCircle },
    { id: 'subscription', label: 'Подписка', icon: CreditCard },
    { id: 'health', label: 'Здоровье', icon: Activity },
    { id: 'privacy', label: 'Конфиденциальность', icon: Lock },
    { id: 'technical', label: 'Техническое', icon: Settings },
  ];

  const faqs = [
    {
      category: 'general',
      question: 'Что такое EthosLife?',
      answer: 'EthosLife — это комплексная платформа для управления здоровьем, объединяющая AI-коучинг, трекеры здоровья, социальное сообщество и токенизированную экосистему. Мы помогаем пользователям достигать целей в области здоровья через персонализированные рекомендации и поддержку сообщества.',
    },
    {
      category: 'general',
      question: 'Как начать пользоваться EthosLife?',
      answer: 'Просто зарегистрируйтесь на платформе, пройдите первоначальную оценку здоровья и установите свои цели. Наш AI создаст персонализированный план, который будет адаптироваться по мере вашего прогресса. Базовый функционал доступен бесплатно.',
    },
    {
      category: 'general',
      question: 'Какие языки поддерживает платформа?',
      answer: 'EthosLife поддерживает 12 языков: английский, испанский, французский, немецкий, итальянский, португальский, русский, китайский, японский, арабский, хинди и корейский. Мы постоянно работаем над добавлением новых языков.',
    },
    {
      category: 'general',
      question: 'Можно ли использовать EthosLife без премиум-подписки?',
      answer: 'Да! Базовая версия включает трекеры здоровья, AI-чат (3 запроса в день), участие в челленджах и доступ к сообществу. Премиум открывает безлимитный AI, персональные планы и расширенную аналитику.',
    },
    {
      category: 'subscription',
      question: 'Какие планы подписки доступны?',
      answer: 'У нас три уровня: Free (бесплатно), Premium ($9.99/мес) и Pro ($19.99/мес). Premium включает безлимитный AI, все модули здоровья и персональные планы. Pro добавляет 1-on-1 коучинг, генетические отчеты и семейные аккаунты.',
    },
    {
      category: 'subscription',
      question: 'Можно ли отменить подписку в любое время?',
      answer: 'Да, вы можете отменить подписку в любой момент в настройках аккаунта. Доступ к премиум-функциям сохранится до конца оплаченного периода. Возврат средств возможен в течение 14 дней после покупки.',
    },
    {
      category: 'subscription',
      question: 'Предлагаете ли вы семейные скидки?',
      answer: 'Да! План Pro поддерживает до 5 семейных аккаунтов со скидкой 40%. Также есть корпоративные планы для компаний от 10 сотрудников с индивидуальным ценообразованием.',
    },
    {
      category: 'subscription',
      question: 'Что такое UNITY токен и как его получить?',
      answer: 'UNITY — это нативный токен экосистемы EthosLife. Его можно получить за участие в челленджах, достижение целей, рефералов и стейкинг. Токены дают доступ к эксклюзивным функциям и управлению платформой через DAO.',
    },
    {
      category: 'health',
      question: 'Насколько точны рекомендации AI?',
      answer: 'Наш AI обучен на более чем 5 миллионах анонимизированных данных о здоровье и постоянно обновляется. Точность рекомендаций составляет 94% согласно внутренним тестам. Однако AI не заменяет профессиональную медицинскую консультацию.',
    },
    {
      category: 'health',
      question: 'Можно ли импортировать данные из других приложений?',
      answer: 'Да! EthosLife интегрируется с Apple Health, Google Fit, Fitbit, Garmin, MyFitnessPal и Strava. Данные синхронизируются автоматически, обеспечивая полную картину вашего здоровья.',
    },
    {
      category: 'health',
      question: 'Какие модули здоровья доступны?',
      answer: '7 модулей: Питание (трекинг калорий и макросов), Фитнес (тренировки и активность), Сон (анализ фаз и качества), Психология (медитация и ментальное здоровье), Привычки (трекер привычек), Лекарства (напоминания и учет), Отношения (социальное благополучие).',
    },
    {
      category: 'health',
      question: 'Работает ли платформа с медицинскими устройствами?',
      answer: 'Да, мы поддерживаем интеграцию с умными весами, глюкометрами, тонометрами, пульсоксиметрами и другими IoT-устройствами для здоровья. Полный список совместимых устройств доступен в настройках интеграций.',
    },
    {
      category: 'privacy',
      question: 'Как защищены мои данные?',
      answer: 'Мы используем сквозное шифрование, храним данные на защищенных серверах в ЕС и США, соответствуем GDPR и HIPAA. Ваши данные никогда не продаются третьим лицам. Полный контроль над данными остается у вас.',
    },
    {
      category: 'privacy',
      question: 'Могут ли другие пользователи видеть мои данные?',
      answer: 'Вы полностью контролируете видимость данных. Можно сделать профиль публичным, видимым только для друзей или приватным. Детали здоровья по умолчанию приватны и не отображаются в социальном профиле.',
    },
    {
      category: 'privacy',
      question: 'Что происходит с данными при удалении аккаунта?',
      answer: 'При удалении аккаунта все ваши персональные данные удаляются в течение 30 дней. Вы можете экспортировать данные в формате JSON или PDF перед удалением. Анонимизированные агрегированные данные могут сохраняться для исследований.',
    },
    {
      category: 'technical',
      question: 'На каких устройствах работает EthosLife?',
      answer: 'EthosLife доступен как веб-приложение (все браузеры), iOS приложение (App Store), Android приложение (Google Play), а также как PWA для установки на любое устройство. Синхронизация между устройствами автоматическая.',
    },
    {
      category: 'technical',
      question: 'Нужен ли интернет для работы?',
      answer: 'Для полной функциональности требуется интернет. Офлайн-режим позволяет просматривать некоторые данные и делать записи, которые синхронизируются при подключении. AI-функции требуют подключения.',
    },
    {
      category: 'technical',
      question: 'Как связаться с поддержкой?',
      answer: 'Поддержка доступна 24/7 через чат в приложении, email (support@ethoslife.com) или Telegram-бот. Среднее время ответа — 2 часа в рабочее время и 6 часов в выходные.',
    },
    {
      category: 'technical',
      question: 'Можно ли использовать EthosLife для клинических исследований?',
      answer: 'Да, мы предоставляем API и инструменты экспорта данных для исследователей. Для академических проектов доступны специальные условия. Свяжитесь с research@ethoslife.com для деталей.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
              <Link to="/team" className="text-[#5c5243] hover:text-[#2d2418] transition-colors font-medium">Команда</Link>
              <Link to="/faq" className="text-[#2d2418] font-semibold">FAQ</Link>
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

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5c5243]/10 text-[#5c5243] mb-6">
              <HelpCircle size={18} />
              <span className="text-sm font-medium">Часто задаваемые вопросы</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Как мы можем помочь?
            </h1>
            
            <p className="text-xl text-[#5c5243] mb-12">
              Найдите ответы на популярные вопросы о EthosLife
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#5c5243]" />
              <input
                type="text"
                placeholder="Поиск вопросов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] text-[#2d2418] placeholder-[#5c5243] focus:outline-none focus:shadow-[inset_6px_6px_12px_rgba(44,40,34,0.12),inset_-6px_-6px_12px_rgba(255,255,255,0.6)] transition-all text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg'
                      : 'bg-[#e4dfd5] text-[#5c5243] hover:bg-[#d4ccb8]'
                  }`}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <HelpCircle className="w-16 h-16 text-[#5c5243]/30 mx-auto mb-4" />
                <p className="text-xl text-[#5c5243]">Ничего не найдено</p>
                <p className="text-[#5c5243] mt-2">Попробуйте изменить поисковый запрос</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-4"
                >
                  <div
                    className={`rounded-2xl bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.6)] overflow-hidden transition-all ${
                      openIndex === index ? 'shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)]' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#d4ccb8]/50 transition-colors"
                    >
                      <span className="font-semibold text-[#2d2418] text-lg pr-4">
                        {faq.question}
                      </span>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-[#d4ccb8] flex items-center justify-center transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}>
                        <ChevronDown className="w-5 h-5 text-[#5c5243]" />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 text-[#5c5243] leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#d4ccb8]/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[#2d2418] mb-4">
              Не нашли ответ?
            </h2>
            <p className="text-lg text-[#5c5243] mb-8">
              Наша команда поддержки готова помочь вам 24/7
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              <a
                href="mailto:support@ethoslife.com"
                className="p-6 rounded-2xl bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] transition-all group"
              >
                <Mail className="w-8 h-8 text-[#5c5243] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-[#2d2418] mb-1">Email</div>
                <div className="text-sm text-[#5c5243]">support@ethoslife.com</div>
              </a>
              
              <a
                href="#"
                className="p-6 rounded-2xl bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] transition-all group"
              >
                <MessageCircle className="w-8 h-8 text-[#5c5243] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-[#2d2418] mb-1">Чат</div>
                <div className="text-sm text-[#5c5243]">24/7 поддержка</div>
              </a>
              
              <a
                href="#"
                className="p-6 rounded-2xl bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] transition-all group"
              >
                <Users className="w-8 h-8 text-[#5c5243] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-[#2d2418] mb-1">Сообщество</div>
                <div className="text-sm text-[#5c5243]">Форум помощи</div>
              </a>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Начать использовать EthosLife
              <ArrowRight size={20} />
            </Link>
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

export default FAQV1;
