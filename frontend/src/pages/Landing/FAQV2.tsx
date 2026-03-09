import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Heart,
  Zap,
  Shield,
  DollarSign,
  Users,
  Smartphone
} from 'lucide-react';

const FAQV2 = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      category: 'Общее',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-rose-500',
      faqs: [
        {
          question: 'Что такое EthosLife?',
          answer: 'EthosLife — это Human Operating System (HOS), комплексная платформа для здоровья, которая объединяет 7 модулей: питание, движение, сон, психология, привычки, медицина и отношения. Всё в одном приложении с AI-коучем.'
        },
        {
          question: 'Это бесплатно?',
          answer: 'Да! Базовая версия бесплатна навсегда и включает 3 модуля на выбор, 5 AI-запросов в день и доступ к сообществу. Premium ($9.99/мес) и Pro ($19.99/мес) дают доступ ко всем функциям.'
        },
        {
          question: 'Как начать?',
          answer: 'Просто зарегистрируйтесь (2 минуты), пройдите онбординг (7 шагов с геймификацией) и начните отслеживать здоровье. Первые 14 дней Premium — бесплатно!'
        },
        {
          question: 'Безопасны ли мои данные?',
          answer: 'Абсолютно. Мы используем шифрование end-to-end, соответствуем GDPR и HIPAA. Ваши данные никогда не продаются третьим лицам.'
        }
      ]
    },
    {
      category: 'Функции',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-emerald-500',
      faqs: [
        {
          question: 'Какие модули здоровья доступны?',
          answer: '7 модулей: Питание (трекинг еды, макросы), Движение (тренировки, активность), Сон (фазы, умный будильник), Психология (mood tracking, CBT), Привычки (трекер, стрики), Медицина (лекарства, анализы), Отношения (социальное здоровье).'
        },
        {
          question: 'Что такое AI-коуч?',
          answer: 'Персональный AI-помощник, который анализирует данные из всех 7 модулей и даёт персональные рекомендации. Например: "Я заметил, что когда вы спите 8+ часов, ваше настроение на 23% лучше."'
        },
        {
          question: 'Работает ли офлайн?',
          answer: 'Да! Мобильные приложения (iOS/Android, запуск Q4 2026) работают офлайн. Данные синхронизируются когда появится интернет.'
        },
        {
          question: 'Есть ли интеграции с устройствами?',
          answer: 'Да! Интегрируем с Apple Health, Google Fit, Fitbit, Garmin, Oura Ring, Whoop (запуск Q1 2027). Автоматическая синхронизация данных.'
        }
      ]
    },
    {
      category: 'Подписки',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-amber-500',
      faqs: [
        {
          question: 'Какие есть тарифы?',
          answer: 'Free (навсегда): 3 модуля, 5 AI-запросов/день. Premium ($9.99/мес): все 7 модулей, безлимитный AI. Pro ($19.99/мес): всё из Premium + персональный AI-коуч, семейный план (5 человек).'
        },
        {
          question: 'Как работает 14-дневный триал?',
          answer: 'После регистрации вы получаете полный доступ к Premium на 14 дней. Карта не требуется. После триала аккаунт переходит на Free план автоматически.'
        },
        {
          question: 'Могу ли я отменить подписку?',
          answer: 'Да, в любой момент в настройках аккаунта. Доступ сохранится до конца оплаченного периода.'
        },
        {
          question: 'Есть ли скидка на годовой план?',
          answer: 'Да! Годовые планы Premium ($99.99) и Pro ($199.99) дают скидку 17% по сравнению с помесячной оплатой.'
        }
      ]
    },
    {
      category: 'Приватность',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-violet-500',
      faqs: [
        {
          question: 'Как защищены мои данные?',
          answer: 'Шифрование end-to-end, хранение в защищённых дата-центрах (AWS), соответствие GDPR (EU) и HIPAA (US). Доступ только у вас.'
        },
        {
          question: 'Продаёте ли вы данные?',
          answer: 'Нет! Ваши данные никогда не продаются. Мы зарабатываем на подписках, а не на продаже данных.'
        },
        {
          question: 'Могу ли я экспортировать данные?',
          answer: 'Да! Вы можете экспортировать все данные в CSV, JSON или PDF в любой момент в настройках.'
        },
        {
          question: 'Что происходит с данными при удалении?',
          answer: 'При удалении аккаунта все данные удаляются безвозвратно в течение 30 дней (GDPR requirement).'
        }
      ]
    },
    {
      category: 'Сообщество',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-500',
      faqs: [
        {
          question: 'Что такое сообщество?',
          answer: 'Социальная сеть внутри EthosLife: лента, посты, группы по интересам, челленджи, таблица лидеров. Поддержка единомышленников!'
        },
        {
          question: 'Можно ли найти специалиста?',
          answer: 'Да! Marketplace специалистов (нутрициологи, тренеры, психологи) и центров здоровья. Бронирование онлайн, видео-консультации.'
        },
        {
          question: 'Как работают челленджи?',
          answer: '7-дневные, 30-дневные, командные. Выполняйте задания, получайте UNITY tokens, соревнуйтесь в таблице лидеров.'
        }
      ]
    },
    {
      category: 'Устройства',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'text-cyan-500',
      faqs: [
        {
          question: 'Есть ли мобильное приложение?',
          answer: 'Бета iOS/Android запускается Q4 2026. Полноценный релиз Q1 2027. Push-уведомления, офлайн режим, все функции веб-версии.'
        },
        {
          question: 'Какие wearables поддерживаются?',
          answer: 'Apple Watch, Fitbit, Garmin, Oura Ring, Whoop (Q1 2027). Автоматическая синхронизация: шаги, пульс, сон, калории.'
        },
        {
          question: 'Будут ли аппаратные продукты?',
          answer: 'Да! Posture Wearables (датчики осанки, $79-129, Q2 2027) и Smart Camera (авто-слежение, $299-399, Q4 2028).'
        }
      ]
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqCategories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Частые Вопросы
            </h1>
            <p className="text-xl text-[#5c5243] mb-10">
              Ответы на популярные вопросы о EthosLife
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#5c5243]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск вопросов..."
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[#e4dfd5] border border-[#c9b8a6]/40 text-[#2d2418] placeholder-[#7a6e5d] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30 focus:border-transparent shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={category.color}>{category.icon}</div>
                <h2 className="text-2xl font-bold text-[#2d2418]">{category.category}</h2>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const index = `${catIndex}-${faqIndex}`;
                  return (
                    <motion.div
                      key={index}
                      className="neu-card overflow-hidden"
                      initial={false}
                    >
                      <button
                        onClick={() => toggleFaq(Number(index))}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#d4ccb8]/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <HelpCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                          <span className="text-lg font-medium text-[#2d2418]">{faq.question}</span>
                        </div>
                        {openIndex === index ? (
                          <ChevronUp className="w-6 h-6 text-[#5c5243] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-[#5c5243] flex-shrink-0" />
                        )}
                      </button>
                      <motion.div
                        initial={false}
                        animate={{
                          height: openIndex === index ? 'auto' : 0,
                          opacity: openIndex === index ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-0 text-[#5c5243] leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neu-card p-12 md:p-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-6">
              Остались вопросы?
            </h2>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Наша команда поддержки готова помочь вам 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.open('mailto:support@ethoslife.com', '_blank')}
                className="px-12 py-5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📧 support@ethoslife.com
              </motion.button>
              <motion.button
                onClick={() => navigate('/register')}
                className="px-12 py-5 bg-white/70 backdrop-blur-sm text-[#5c5243] font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать бесплатно
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQV2;
