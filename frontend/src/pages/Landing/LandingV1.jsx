import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingV1 = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statistics = [
    { number: '10,000+', label: 'Пользователей', icon: '👥' },
    { number: '7', label: 'Модулей здоровья', icon: '🎯' },
    { number: '99.9%', label: 'Uptime', icon: '⚡' },
    { number: '24/7', label: 'Поддержка', icon: '🛡️' },
    { number: '150+', label: 'Стран', icon: '🌍' },
    { number: '5M+', label: 'Анализов данных', icon: '📊' },
  ];

  const modules = [
    {
      icon: '🥗',
      title: 'Питание',
      description: 'Персонализированные планы питания на основе ваших целей, предпочтений и биометрических данных. AI-рекомендации по микроэлементам.',
      features: ['Калькулятор калорий', 'Трекер макронутриентов', 'Планы питания', 'Рецепты'],
      color: 'from-green-400 to-green-600',
    },
    {
      icon: '💪',
      title: 'Фитнес',
      description: 'Индивидуальные тренировочные программы с видео-инструкциями. Отслеживание прогресса и адаптация нагрузок.',
      features: ['Тренировки', 'Трекер активности', 'Прогресс', 'Челленджи'],
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: '😴',
      title: 'Сон',
      description: 'Анализ качества сна с рекомендациями по улучшению. Интеграция с умными устройствами для мониторинга.',
      features: ['Трекер сна', 'Анализ фаз', 'Рекомендации', 'Будильник'],
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: '🧘',
      title: 'Ментальное здоровье',
      description: 'Медитации, дыхательные практики и техники управления стрессом. Daily check-in для отслеживания настроения.',
      features: ['Медитации', 'Дыхание', 'Journaling', 'Стресс-менеджмент'],
      color: 'from-pink-400 to-pink-600',
    },
    {
      icon: '🏥',
      title: 'Медицинский',
      description: 'Хранение медицинских записей, напоминания о приёме лекарств, интеграция с лабораториями и врачами.',
      features: ['Медкарта', 'Напоминания', 'Анализы', 'Консультации'],
      color: 'from-red-400 to-red-600',
    },
    {
      icon: '🧬',
      title: 'Биометрия',
      description: 'Отслеживание показателей тела: вес, состав, измерения. Визуализация прогресса с графиками и аналитикой.',
      features: ['Трекер веса', 'Состав тела', 'Замеры', 'Фото прогресса'],
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      icon: '🌿',
      title: 'Окружение',
      description: 'Мониторинг качества воздуха, воды, уровня шума и освещения. Рекомендации по оптимизации среды.',
      features: ['Качество воздуха', 'Вода', 'Шум', 'Свет'],
      color: 'from-teal-400 to-teal-600',
    },
  ];

  const testimonials = [
    {
      name: 'Александр Петров',
      role: 'Предприниматель, 42 года',
      avatar: '👨‍💼',
      text: 'EthosLife полностью изменил мой подход к здоровью. За 6 месяцев я сбросил 15 кг, улучшил сон на 40% и стал гораздо продуктивнее. Это не просто приложение — это операционная система для жизни.',
      rating: 5,
    },
    {
      name: 'Мария Иванова',
      role: 'Врач-терапевт, 38 лет',
      avatar: '👩‍⚕️',
      text: 'Как врач, я рекомендую EthosLife своим пациентам. Платформа предоставляет комплексный подход к здоровью с научной базой. Особенно впечатляет модуль ментального здоровья.',
      rating: 5,
    },
    {
      name: 'Дмитрий Козлов',
      role: 'Спортсмен, 29 лет',
      avatar: '🏃',
      text: 'Использую EthosLife для подготовки к марафонам. Точное отслеживание всех показателей, персонализированные тренировки и восстановление — всё в одном месте. Лучшее что я пробовал.',
      rating: 5,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Спасибо! Email ${email} добавлен в список ожидания.`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#e4dfd5]/80 backdrop-blur-md border-b border-[#d4ccb8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold text-[#2d2418]">EthosLife</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#modules" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Модули</a>
              <a href="#statistics" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Статистика</a>
              <a href="#testimonials" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Отзывы</a>
              <a href="#pricing" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Тарифы</a>
              <button
                onClick={() => navigate('/login')}
                className="neu-button py-2 px-6 text-sm"
              >
                Войти
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-[#5c5243] text-[#e4dfd5] px-6 py-2 rounded-lg font-semibold hover:bg-[#3d3226] transition-colors"
              >
                Начать бесплатно
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#2d2418]"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#e4dfd5] border-t border-[#d4ccb8]">
            <div className="px-4 py-4 space-y-4">
              <a href="#modules" className="block text-[#2d2418]">Модули</a>
              <a href="#statistics" className="block text-[#2d2418]">Статистика</a>
              <a href="#testimonials" className="block text-[#2d2418]">Отзывы</a>
              <a href="#pricing" className="block text-[#2d2418]">Тарифы</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-[#d4ccb8]">
                <button onClick={() => navigate('/login')} className="neu-button py-2 text-sm">Войти</button>
                <button onClick={() => navigate('/register')} className="bg-[#5c5243] text-[#e4dfd5] py-2 rounded-lg font-semibold">Начать бесплатно</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 px-4 py-2 bg-[#d4ccb8] rounded-full text-[#5c5243] font-medium text-sm">
              🚀 Human Operating System v2.0 уже доступна
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-[#2d2418] mb-6 leading-tight">
              EthosLife —<br />
              <span className="bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] bg-clip-text text-transparent">
                Human Operating System
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#5c5243] mb-8 max-w-3xl mx-auto">
              Комплексная платформа для оптимизации всех аспектов вашего здоровья: 
              питание, фитнес, сон, ментальное состояние и биометрия в единой экосистеме.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#5c5243] text-[#e4dfd5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3d3226] transition-all transform hover:scale-105 shadow-lg"
              >
                Начать бесплатный триал →
              </button>
              <button
                onClick={() => navigate('/litepaper-v1')}
                className="neu-button px-8 py-4 text-lg"
              >
                📄 Читать Litepaper
              </button>
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-5xl mx-auto mt-16">
              <div className="neu-card p-8 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-7 gap-4">
                  {modules.map((module, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-4xl hover:scale-110 transition-transform cursor-pointer`}
                    >
                      {module.icon}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-[#5c5243] text-sm">
                    7 модулей • 100+ функций • Единая экосистема
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Доверие в цифрах</h2>
            <p className="text-xl text-[#5c5243]">Нас выбирают тысячи пользователей по всему миру</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statistics.map((stat, idx) => (
              <div
                key={idx}
                className="neu-card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#2d2418] mb-2">{stat.number}</div>
                <div className="text-sm text-[#5c5243]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              7 Модулей Здоровья
            </h2>
            <p className="text-xl text-[#5c5243] max-w-3xl mx-auto">
              Полная экосистема для управления вашим благополучием. 
              Каждый модуль работает независимо и синергично с остальными.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, idx) => (
              <div
                key={idx}
                className="neu-card p-8 hover:scale-105 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform`}>
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#2d2418] mb-3">{module.title}</h3>
                <p className="text-[#5c5243] mb-6 leading-relaxed">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center text-[#2d2418]">
                      <span className="text-green-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/features-v1')}
              className="neu-button px-8 py-4 text-lg"
            >
              Узнать больше о возможностях →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Как это работает
            </h2>
            <p className="text-xl text-[#5c5243]">Три простых шага к оптимальному здоровью</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '📝',
                title: 'Заполните профиль',
                description: 'Расскажите о себе: цели, предпочтения, текущее состояние здоровья. AI создаст ваш персональный профиль.',
              },
              {
                step: '02',
                icon: '🤖',
                title: 'Получите план',
                description: 'Система сгенерирует персонализированный план по всем 7 модулям с конкретными рекомендациями.',
              },
              {
                step: '03',
                icon: '📈',
                title: 'Отслеживайте прогресс',
                description: 'Следите за результатами в реальном времени. AI адаптирует план на основе ваших успехов.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="neu-card p-8 text-center">
                  <div className="text-6xl font-bold text-[#d4ccb8] absolute -top-4 -left-4">{item.step}</div>
                  <div className="text-5xl mb-6 mt-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-[#2d2418] mb-4">{item.title}</h3>
                  <p className="text-[#5c5243] leading-relaxed">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-[#5c5243] z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Истории успеха
            </h2>
            <p className="text-xl text-[#5c5243]">Реальные результаты реальных людей</p>
          </div>

          <div className="neu-card p-8 md:p-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>
            
            <blockquote className="text-xl md:text-2xl text-[#2d2418] text-center mb-8 leading-relaxed">
              "{testimonials[activeTestimonial].text}"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="text-5xl">{testimonials[activeTestimonial].avatar}</div>
              <div className="text-left">
                <div className="font-bold text-[#2d2418]">{testimonials[activeTestimonial].name}</div>
                <div className="text-[#5c5243]">{testimonials[activeTestimonial].role}</div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    idx === activeTestimonial ? 'bg-[#5c5243]' : 'bg-[#d4ccb8]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Простые тарифы
            </h2>
            <p className="text-xl text-[#5c5243]">Начните бесплатно, масштабируйтесь по мере роста</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Free', price: '0₽', period: 'навсегда', features: ['2 модуля', 'Базовая аналитика', '1 устройство'], popular: false },
              { name: 'Pro', price: '990₽', period: 'в месяц', features: ['Все 7 модулей', 'AI рекомендации', 'Безлимитные устройства'], popular: true },
              { name: 'Premium', price: '1990₽', period: 'в месяц', features: ['Приоритетная поддержка', 'Семейный доступ (5)', 'Экспорт данных'], popular: false },
              { name: 'Centers', price: 'Индив.', period: 'по запросу', features: ['Для клиник', 'API доступ', 'White-label'], popular: false },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`neu-card p-6 text-center ${
                  plan.popular ? 'ring-2 ring-[#5c5243] scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="inline-block px-3 py-1 bg-[#5c5243] text-[#e4dfd5] text-sm font-medium rounded-full mb-4">
                    Популярный
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#2d2418] mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-[#2d2418] mb-1">{plan.price}</div>
                <div className="text-[#5c5243] mb-6">{plan.period}</div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-[#2d2418]">
                      <span className="text-green-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-[#5c5243] text-[#e4dfd5] hover:bg-[#3d3226]'
                      : 'neu-button'
                  }`}
                >
                  Выбрать
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/pricing-v1')}
              className="neu-button px-8 py-4 text-lg"
            >
              Сравнить все тарифы →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="neu-card p-12 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5c5243]/10 to-transparent pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-6 relative">
              Готовы трансформировать своё здоровье?
            </h2>
            <p className="text-xl text-[#5c5243] mb-8 relative">
              Присоединяйтесь к 10,000+ пользователей уже сегодня. 
              14 дней бесплатного доступа ко всем функциям.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="neu-input px-6 py-4 text-lg w-full sm:w-80"
                required
              />
              <button
                type="submit"
                className="bg-[#5c5243] text-[#e4dfd5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3d3226] transition-colors"
              >
                Начать бесплатно →
              </button>
            </form>
            
            <p className="text-sm text-[#5c5243] mt-4 relative">
              🔒 Никакого спама. Отписка в один клик.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d2418] text-[#e4dfd5] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-3xl">🌱</span>
                <span className="text-xl font-bold">EthosLife</span>
              </div>
              <p className="text-[#8c7a6b] leading-relaxed">
                Human Operating System для оптимального здоровья и благополучия.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Продукт</h4>
              <ul className="space-y-2">
                <li><a href="/features-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Возможности</a></li>
                <li><a href="/pricing-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Тарифы</a></li>
                <li><a href="/tokenomics-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Токеномика</a></li>
                <li><a href="/roadmap-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Ресурсы</h4>
              <ul className="space-y-2">
                <li><a href="/whitepaper-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Whitepaper</a></li>
                <li><a href="/litepaper-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Litepaper</a></li>
                <li><a href="/about-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">О проекте</a></li>
                <li><a href="/contact-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Контакты</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Правовая информация</h4>
              <ul className="space-y-2">
                <li><a href="/terms-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Условия</a></li>
                <li><a href="/privacy-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Конфиденциальность</a></li>
                <li><a href="/disclaimer-v1" className="text-[#8c7a6b] hover:text-[#e4dfd5]">Отказ от ответственности</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#3d3226] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#8c7a6b] text-sm">
              © 2026 EthosLife. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-2xl hover:scale-110 transition-transform">🐦</a>
              <a href="#" className="text-2xl hover:scale-110 transition-transform">📘</a>
              <a href="#" className="text-2xl hover:scale-110 transition-transform">📸</a>
              <a href="#" className="text-2xl hover:scale-110 transition-transform">💼</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV1;
