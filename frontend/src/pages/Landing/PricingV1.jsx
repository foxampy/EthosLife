import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingV1 = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: 'Free',
      description: 'Для начала пути к здоровью',
      icon: '🆓',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: '2 модуля на выбор', included: true },
        { text: 'Базовая аналитика', included: true },
        { text: '1 устройство', included: true },
        { text: '7 дней истории данных', included: true },
        { text: 'Базовые рекомендации', included: true },
        { text: 'Все 7 модулей', included: false },
        { text: 'AI персонализация', included: false },
        { text: 'Приоритетная поддержка', included: false },
        { text: 'Семейный доступ', included: false },
        { text: 'API доступ', included: false },
      ],
      cta: 'Начать бесплатно',
      popular: false,
      color: 'from-gray-400 to-gray-600',
    },
    {
      name: 'Pro',
      description: 'Для серьёзных изменений',
      icon: '⭐',
      monthlyPrice: 990,
      yearlyPrice: 9900,
      savings: '17%',
      features: [
        { text: '2 модуля на выбор', included: true },
        { text: 'Базовая аналитика', included: true },
        { text: '1 устройство', included: true },
        { text: '7 дней истории данных', included: true },
        { text: 'Базовые рекомендации', included: true },
        { text: 'Все 7 модулей', included: true },
        { text: 'AI персонализация', included: true },
        { text: 'Приоритетная поддержка', included: false },
        { text: 'Семейный доступ', included: false },
        { text: 'API доступ', included: false },
      ],
      cta: 'Попробовать Pro',
      popular: true,
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Premium',
      description: 'Максимум возможностей',
      icon: '💎',
      monthlyPrice: 1990,
      yearlyPrice: 19900,
      savings: '17%',
      features: [
        { text: '2 модуля на выбор', included: true },
        { text: 'Базовая аналитика', included: true },
        { text: '1 устройство', included: true },
        { text: '7 дней истории данных', included: true },
        { text: 'Базовые рекомендации', included: true },
        { text: 'Все 7 модулей', included: true },
        { text: 'AI персонализация', included: true },
        { text: 'Приоритетная поддержка', included: true },
        { text: 'Семейный доступ (5 человек)', included: true },
        { text: 'API доступ', included: false },
      ],
      cta: 'Выбрать Premium',
      popular: false,
      color: 'from-purple-400 to-purple-600',
    },
    {
      name: 'Centers',
      description: 'Для клиник и организаций',
      icon: '🏥',
      monthlyPrice: null,
      yearlyPrice: null,
      custom: true,
      features: [
        { text: '2 модуля на выбор', included: true },
        { text: 'Базовая аналитика', included: true },
        { text: '1 устройство', included: true },
        { text: '7 дней истории данных', included: true },
        { text: 'Базовые рекомендации', included: true },
        { text: 'Все 7 модулей', included: true },
        { text: 'AI персонализация', included: true },
        { text: 'Приоритетная поддержка', included: true },
        { text: 'Семейный доступ (5 человек)', included: true },
        { text: 'API доступ', included: true },
      ],
      cta: 'Связаться с нами',
      popular: false,
      color: 'from-green-400 to-green-600',
    },
  ];

  const comparisonData = [
    { feature: 'Все 7 модулей здоровья', free: false, pro: true, premium: true, centers: true },
    { feature: 'AI персонализация', free: false, pro: true, premium: true, centers: true },
    { feature: 'Безлимитная история', free: false, pro: true, premium: true, centers: true },
    { feature: 'Количество устройств', free: '1', pro: '∞', premium: '∞', centers: '∞' },
    { feature: 'Семейный доступ', free: false, pro: false, premium: '5 человек', centers: '50+ человек' },
    { feature: 'Приоритетная поддержка', free: false, pro: false, premium: true, centers: true },
    { feature: 'Персональный менеджер', free: false, pro: false, premium: false, centers: true },
    { feature: 'API доступ', free: false, pro: false, premium: false, centers: true },
    { feature: 'White-label', free: false, pro: false, premium: false, centers: true },
    { feature: 'SLA 99.9%', free: false, pro: false, premium: true, centers: true },
    { feature: 'Интеграция с EMR', free: false, pro: false, premium: false, centers: true },
    { feature: 'Обучение персонала', free: false, pro: false, premium: false, centers: true },
  ];

  const faqs = [
    {
      question: 'Можно ли изменить тариф позже?',
      answer: 'Да, вы можете повысить или понизить тариф в любой момент. При повышении разница в стоимости будет пересчитана пропорционально оставшимся дням периода. При понижении изменения вступят в силу со следующего billing cycle.',
    },
    {
      question: 'Что происходит с моими данными при отмене подписки?',
      answer: 'При отмене платной подписки вы автоматически переходите на Free тариф. Все ваши данные сохраняются. Вы можете экспортировать их в любой момент в форматах PDF или CSV. Удаление данных происходит только по вашему явному запросу.',
    },
    {
      question: 'Есть ли гарантия возврата денег?',
      answer: 'Да, мы предоставляем 30-дневную гарантию возврата денег для всех платных тарифов. Если EthosLife не оправдает ваших ожиданий, просто напишите в поддержку — мы вернём полную сумму без вопросов.',
    },
    {
      question: 'Можно ли оплатить криптовалютой?',
      answer: 'Да, мы принимаем оплату в UNITY (наш токен) с скидкой 20%, а также BTC, ETH, USDT. Для оплаты криптовалютой выберите соответствующий метод при оформлении подписки.',
    },
    {
      question: 'Что входит в семейный доступ?',
      answer: 'Семейный доступ (Premium и Centers) позволяет добавить до 5 (Premium) или 50+ (Centers) участников семьи. Каждый получает отдельный аккаунт с персональными данными. Главный аккаунт может видеть общую статистику и управлять подпиской.',
    },
    {
      question: 'Как работает корпоративный тариф Centers?',
      answer: 'Centers предназначен для клиник, фитнес-центров, страховых компаний. Включает API для интеграции с вашими системами, white-label решение (ваш бренд), персонального менеджера, обучение персонала, SLA. Стоимость зависит от количества пользователей.',
    },
    {
      question: 'Предоставляете ли вы скидки?',
      answer: 'Да, мы предоставляем скидки: 17% при оплате за год, 20% для студентов и пенсионеров, 30% для некоммерческих организаций, специальные условия для корпоративных клиентов от 100 сотрудников.',
    },
  ];

  const handlePlanSelect = (plan) => {
    if (plan.custom) {
      navigate('/contact-v1');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Header */}
      <header className="bg-[#e4dfd5]/80 backdrop-blur-md border-b border-[#d4ccb8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold text-[#2d2418]">EthosLife</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#plans" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Тарифы</a>
              <a href="#comparison" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Сравнение</a>
              <a href="#faq" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">FAQ</a>
              <button onClick={() => navigate('/login')} className="neu-button py-2 px-6 text-sm">Войти</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Простые и прозрачные тарифы
            </h1>
            <p className="text-2xl text-[#5c5243] max-w-3xl mx-auto mb-8">
              Начните бесплатно, масштабируйтесь по мере роста. 
              Никаких скрытых платежей, отмена в любой момент.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-[#2d2418] font-semibold' : 'text-[#5c5243]'}`}>
                Ежемесячно
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="w-16 h-8 bg-[#5c5243] rounded-full relative transition-colors"
              >
                <div className={`w-6 h-6 bg-[#e4dfd5] rounded-full absolute top-1 transition-transform ${
                  billingPeriod === 'yearly' ? 'left-9' : 'left-1'
                }`} />
              </button>
              <span className={`text-lg ${billingPeriod === 'yearly' ? 'text-[#2d2418] font-semibold' : 'text-[#5c5243]'}`}>
                Ежегодно
              </span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                -17%
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div id="plans" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`neu-card p-6 relative ${
                  plan.popular ? 'ring-2 ring-[#5c5243] scale-105 z-10' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#5c5243] text-[#e4dfd5] px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                      Популярный выбор
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-[#2d2418] mb-2">{plan.name}</h3>
                  <p className="text-[#5c5243] text-sm mb-4">{plan.description}</p>
                  
                  {plan.custom ? (
                    <div className="text-4xl font-bold text-[#2d2418] mb-2">Индив.</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-[#2d2418] mb-2">
                        {billingPeriod === 'monthly' 
                          ? `${plan.monthlyPrice}₽` 
                          : `${plan.yearlyPrice}₽`
                        }
                      </div>
                      <div className="text-[#5c5243] text-sm">
                        {billingPeriod === 'monthly' ? 'в месяц' : `${(plan.yearlyPrice / 12).toLocaleString()}₽/мес`}
                      </div>
                      {billingPeriod === 'yearly' && plan.savings && (
                        <div className="text-green-600 text-sm font-medium mt-2">
                          Экономия {plan.savings}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <span className={`mr-3 ${feature.included ? 'text-green-600' : 'text-gray-400'}`}>
                        {feature.included ? '✓' : '✕'}
                      </span>
                      <span className={feature.included ? 'text-[#2d2418]' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-[#5c5243] text-[#e4dfd5] hover:bg-[#3d3226]'
                      : 'neu-button'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Money-back Guarantee */}
          <div className="mt-12 neu-card p-6 text-center">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-4xl">🛡️</span>
              <div>
                <p className="text-lg font-semibold text-[#2d2418]">30-дневная гарантия возврата денег</p>
                <p className="text-[#5c5243]">Если EthosLife не оправдает ожиданий — вернём полную сумму без вопросов</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Подробное сравнение</h2>
            <p className="text-xl text-[#5c5243]">Выберите тариф, который подходит именно вам</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full neu-card">
              <thead>
                <tr className="border-b border-[#d4ccb8]">
                  <th className="p-4 text-left text-[#2d2418] sticky left-0 bg-[#e4dfd5]">Возможности</th>
                  <th className="p-4 text-center text-[#2d2418]">Free</th>
                  <th className="p-4 text-center bg-[#5c5243] text-[#e4dfd5]">Pro</th>
                  <th className="p-4 text-center text-[#2d2418]">Premium</th>
                  <th className="p-4 text-center text-[#2d2418]">Centers</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#d4ccb8]/20' : ''}>
                    <td className="p-4 text-[#2d2418] font-medium sticky left-0 bg-[#e4dfd5]">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.free === 'boolean' 
                        ? (row.free ? <span className="text-green-600 text-xl">✓</span> : <span className="text-gray-400 text-xl">✕</span>)
                        : <span className="text-[#5c5243]">{row.free}</span>
                      }
                    </td>
                    <td className="p-4 text-center bg-[#5c5243]/10">
                      {typeof row.pro === 'boolean' 
                        ? (row.pro ? <span className="text-green-600 text-xl">✓</span> : <span className="text-gray-400 text-xl">✕</span>)
                        : <span className="text-[#2d2418] font-semibold">{row.pro}</span>
                      }
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.premium === 'boolean' 
                        ? (row.premium ? <span className="text-green-600 text-xl">✓</span> : <span className="text-gray-400 text-xl">✕</span>)
                        : <span className="text-[#2d2418] font-semibold">{row.premium}</span>
                      }
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.centers === 'boolean' 
                        ? (row.centers ? <span className="text-green-600 text-xl">✓</span> : <span className="text-gray-400 text-xl">✕</span>)
                        : <span className="text-[#2d2418] font-semibold">{row.centers}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="neu-card p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center relative">
              <div>
                <h2 className="text-4xl font-bold text-[#2d2418] mb-6">Centers для организаций</h2>
                <ul className="space-y-4 mb-8">
                  {[
                    'API для интеграции с вашими системами',
                    'White-label решение с вашим брендом',
                    'Персональный менеджер 24/7',
                    'Обучение персонала',
                    'SLA 99.9% uptime',
                    'Интеграция с EMR/EHR системами',
                    'Кастомные отчёты и аналитика',
                    'Гибкое ценообразование',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-[#2d2418]">
                      <span className="text-green-600 mr-3 text-xl">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/contact-v1')}
                  className="bg-[#5c5243] text-[#e4dfd5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3d3226] transition-colors"
                >
                  Запросить демо →
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '50+', label: 'Клиник' },
                  { number: '100K+', label: 'Пациентов' },
                  { number: '99.9%', label: 'Uptime' },
                  { number: '24/7', label: 'Поддержка' },
                ].map((stat, idx) => (
                  <div key={idx} className="neu-card p-6 text-center">
                    <div className="text-3xl font-bold text-[#2d2418] mb-2">{stat.number}</div>
                    <div className="text-[#5c5243]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Частые вопросы</h2>
            <p className="text-xl text-[#5c5243]">Всё, что нужно знать о тарифах</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="neu-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center"
                >
                  <span className="text-lg font-semibold text-[#2d2418] pr-8">{faq.question}</span>
                  <span className={`text-2xl transition-transform ${openFaq === idx ? 'rotate-45' : ''}`}>
                    {openFaq === idx ? '✕' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-[#5c5243] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="neu-card p-12 text-center">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-[#5c5243] mb-8">
              Присоединяйтесь к 10,000+ пользователей. 14 дней бесплатно.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#5c5243] text-[#e4dfd5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3d3226] transition-colors"
              >
                Начать бесплатный триал →
              </button>
              <button
                onClick={() => navigate('/contact-v1')}
                className="neu-button px-8 py-4 text-lg"
              >
                Связаться с нами
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d2418] text-[#e4dfd5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#8c7a6b]">
            © 2026 EthosLife. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PricingV1;
