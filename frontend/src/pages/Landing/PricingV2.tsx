import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  X, 
  HelpCircle, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  ArrowRight
} from 'lucide-react';

const PricingV2 = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      description: 'Для начала пути к здоровью',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: 'Базовый трекинг здоровья', included: true },
        { text: '3 модуля на выбор', included: true },
        { text: '5 AI-запросов в день', included: true },
        { text: 'Доступ к сообществу', included: true },
        { text: 'Базовая аналитика', included: true },
        { text: 'Интеграции с wearables', included: false },
        { text: 'Персональные планы', included: false },
        { text: 'Приоритетная поддержка', included: false }
      ],
      cta: 'Начать бесплатно',
      popular: false,
      color: 'from-slate-500 to-gray-500'
    },
    {
      name: 'Premium',
      description: 'Для максимальных результатов',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      savings: '17%',
      features: [
        { text: 'Все 7 модулей здоровья', included: true },
        { text: 'Безлимитный AI-коуч', included: true },
        { text: 'Расширенная аналитика', included: true },
        { text: 'Все интеграции', included: true },
        { text: 'Приоритетная поддержка', included: true },
        { text: 'Персональные планы', included: true },
        { text: '14 дней бесплатно', included: true },
        { text: 'Семейный доступ', included: false }
      ],
      cta: 'Попробовать 14 дней',
      popular: true,
      color: 'from-emerald-500 to-cyan-500'
    },
    {
      name: 'Pro',
      description: 'Для профессионалов и семей',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      savings: '17%',
      features: [
        { text: 'Всё из Premium', included: true },
        { text: 'Персональный AI-коуч', included: true },
        { text: '1-on-1 сессии (4/месяц)', included: true },
        { text: 'Семейный план (5 человек)', included: true },
        { text: 'B2B доступ', included: true },
        { text: 'API доступ', included: true },
        { text: 'Ранний доступ к фичам', included: true },
        { text: 'Персональный менеджер', included: true }
      ],
      cta: 'Начать Pro',
      popular: false,
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const faqs = [
    {
      question: 'Могу ли я изменить тариф позже?',
      answer: 'Да, вы можете повысить или понизить тариф в любой момент в настройках аккаунта.'
    },
    {
      question: 'Как работает 14-дневный триал?',
      answer: 'После регистрации вы получаете полный доступ к Premium на 14 дней. Карта не требуется. После триала можете продолжить бесплатно или подписаться.'
    },
    {
      question: 'Что происходит после триала?',
      answer: 'Ваш аккаунт автоматически перейдёт на Free план. Вы можете подписаться на Premium или Pro в любое время.'
    },
    {
      question: 'Есть ли скидка на годовой план?',
      answer: 'Да! Годовые планы Premium и Pro дают скидку 17% по сравнению с помесячной оплатой.'
    },
    {
      question: 'Могу ли я отменить подписку?',
      answer: 'Да, отменить подписку можно в любой момент в настройках. Доступ сохранится до конца оплаченного периода.'
    }
  ];

  const comparisonFeatures = [
    'Трекинг здоровья',
    'AI-коуч',
    'Аналитика',
    'Интеграции',
    'Поддержка',
    'Семейный доступ',
    'API доступ',
    'Персональный менеджер'
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
              Простые и честные цены
            </h1>
            <p className="text-xl text-[#5c5243] max-w-2xl mx-auto mb-10">
              Начните бесплатно. Обновите когда будете готовы.
              <br />
              Никаких скрытых платежей.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-lg font-medium ${billingPeriod === 'monthly' ? 'text-[#2d2418]' : 'text-[#5c5243]'}`}>
                Ежемесячно
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-16 h-8 rounded-full transition-colors ${
                  billingPeriod === 'yearly' ? 'bg-emerald-500' : 'bg-[#5c5243]'
                }`}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: billingPeriod === 'yearly' ? 36 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-lg font-medium ${billingPeriod === 'yearly' ? 'text-[#2d2418]' : 'text-[#5c5243]'}`}>
                Ежегодно
                <span className="ml-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  -17%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative neu-card p-8 ${
                  plan.popular ? 'border-2 border-emerald-500 scale-105' : ''
                }`}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold rounded-full whitespace-nowrap z-10">
                    Популярный выбор
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#2d2418] mb-2">{plan.name}</h3>
                  <p className="text-[#5c5243] mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    {plan.monthlyPrice > 0 ? (
                      <>
                        <span className="text-5xl font-bold text-[#2d2418]">
                          ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-[#5c5243]">
                          /{billingPeriod === 'monthly' ? 'месяц' : 'год'}
                        </span>
                      </>
                    ) : (
                      <span className="text-5xl font-bold text-[#2d2418]">Бесплатно</span>
                    )}
                  </div>
                  {plan.savings && billingPeriod === 'yearly' && (
                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                      Экономия {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-3 ${
                      feature.included ? 'text-[#5c5243]' : 'text-[#5c5243]/50'
                    }`}>
                      {feature.included ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-[#5c5243]/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => navigate('/register')}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-[#5c5243] text-white hover:bg-[#8c7a6b]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Сравнение тарифов
            </h2>
            <p className="text-xl text-[#5c5243]">
              Подробное сравнение всех функций
            </p>
          </motion.div>

          <div className="neu-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#5c5243]/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#2d2418]">Функция</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#2d2418]">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-600">Premium</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#2d2418]">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="border-t border-[#c9b8a6]/30">
                      <td className="px-6 py-4 text-sm text-[#5c5243]">{feature}</td>
                      <td className="px-6 py-4 text-center">
                        {index < 2 ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />
                        ) : (
                          <X className="w-5 h-5 text-[#5c5243]/30 inline" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-emerald-50/50">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4">
              Частые вопросы
            </h2>
            <p className="text-xl text-[#5c5243]">
              Ответы на популярные вопросы о тарифах
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card p-6"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-[#2d2418] mb-2">{faq.question}</h3>
                    <p className="text-[#5c5243] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neu-card p-12 md:p-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-12 h-12 text-emerald-500" />
              <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418]">
                B2B Решения
              </h2>
            </div>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Корпоративное wellness решение для вашей компании
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="neu-pressed p-6">
                <div className="text-3xl font-bold text-emerald-500 mb-2">25%</div>
                <div className="text-sm text-[#5c5243]">Снижение больничных</div>
              </div>
              <div className="neu-pressed p-6">
                <div className="text-3xl font-bold text-emerald-500 mb-2">40%</div>
                <div className="text-sm text-[#5c5243]">Рост продуктивности</div>
              </div>
              <div className="neu-pressed p-6">
                <div className="text-3xl font-bold text-emerald-500 mb-2">$5/мес</div>
                <div className="text-sm text-[#5c5243]">За сотрудника</div>
              </div>
            </div>
            <motion.button
              onClick={() => navigate('/b2b')}
              className="px-12 py-5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Запросить демо для компании
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к 100,000+ пользователей уже сегодня
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              className="px-12 py-5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Начать бесплатно сейчас
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            <p className="mt-6 text-sm text-[#5c5243]">
              Бесплатно • Без кредитной карты • 14 дней Premium в подарок
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingV2;
