import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesV1 = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('nutrition');
  const [openFaq, setOpenFaq] = useState(null);

  const featureTabs = {
    nutrition: {
      icon: '🥗',
      title: 'Питание',
      subtitle: 'Персонализированная нутрициология на основе AI',
      features: [
        {
          name: 'AI-калькулятор калорий',
          description: 'Алгоритм рассчитывает вашу суточную норму калорий на основе возраста, веса, роста, уровня активности и целей. Точность до 95% по сравнению с клиническими измерениями.',
          icon: '🔢',
        },
        {
          name: 'Трекер макронутриентов',
          description: 'Автоматический подсчёт белков, жиров и углеводов. Визуализация в реальном времени с рекомендациями по корректировке рациона.',
          icon: '📊',
        },
        {
          name: 'Микроэлементы',
          description: 'Отслеживание 27 витаминов и минералов. AI выявляет дефициты и рекомендует продукты для их восполнения.',
          icon: '🧪',
        },
        {
          name: 'Планы питания',
          description: 'Генерация недельных меню с учётом предпочтений, аллергий и бюджета. Автоматический список покупок.',
          icon: '📋',
        },
        {
          name: 'База рецептов',
          description: '10,000+ проверенных рецептов с подробной нутриционной информацией. Фильтрация по ингредиентам, времени приготовления, калорийности.',
          icon: '👨‍🍳',
        },
        {
          name: 'Сканер продуктов',
          description: 'Распознавание продуктов по штрих-коду или фото. Мгновенное добавление в дневник питания.',
          icon: '📷',
        },
      ],
    },
    fitness: {
      icon: '💪',
      title: 'Фитнес',
      subtitle: 'Тренировки адаптируются под ваш прогресс',
      features: [
        {
          name: 'Персональные программы',
          description: 'Планы тренировок для любых целей: похудение, набор массы, выносливость, реабилитация. От 15 минут до 2 часов в день.',
          icon: '📅',
        },
        {
          name: 'Видео-инструкции',
          description: 'HD-видео с правильной техникой выполнения упражнений. Предупреждения о типичных ошибках.',
          icon: '🎬',
        },
        {
          name: 'Трекер активности',
          description: 'Интеграция с Apple Health, Google Fit, Garmin, Fitbit. Автоматический импорт шагов, пульса, калорий.',
          icon: '⌚',
        },
        {
          name: 'Прогресс сил',
          description: 'Отслеживание рабочих весов, повторений, подходов. Графики прогресса по каждому упражнению.',
          icon: '📈',
        },
        {
          name: 'Челленджи',
          description: 'Еженедельные и ежемесячные соревнования с другими пользователями. Рейтинги, награды, достижения.',
          icon: '🏆',
        },
        {
          name: 'Восстановление',
          description: 'Рекомендации по отдыху между тренировками. Интеграция с модулем сна для оптимизации восстановления.',
          icon: '😌',
        },
      ],
    },
    sleep: {
      icon: '😴',
      title: 'Сон',
      subtitle: 'Научный подход к качественному отдыху',
      features: [
        {
          name: 'Анализ фаз сна',
          description: 'Определение фаз: лёгкий, глубокий, REM. Оценка качества сна по 100-балльной шкале.',
          icon: '🌙',
        },
        {
          name: 'Умный будильник',
          description: 'Пробуждение в оптимальную фазу сна. Вы просыпаетесь бодрым, а не разбитым.',
          icon: '⏰',
        },
        {
          name: 'Рекомендации',
          description: 'Персональные советы по улучшению гигиены сна на основе ваших данных и научных исследований.',
          icon: '💡',
        },
        {
          name: 'Звуковые сценарии',
          description: 'Белый шум, дождь, лес, океан. Научно подобранные звуки для быстрого засыпания.',
          icon: '🔊',
        },
        {
          name: 'Интеграция с устройствами',
          description: 'Поддержка Oura Ring, Whoop, Apple Watch, Garmin. Автоматический импорт данных.',
          icon: '📱',
        },
        {
          name: 'Дневник сна',
          description: 'Отслеживание факторов влияния: кофеин, алкоголь, тренировки, стресс. Выявление паттернов.',
          icon: '📔',
        },
      ],
    },
    mental: {
      icon: '🧘',
      title: 'Ментальное здоровье',
      subtitle: 'Баланс разума и эмоций',
      features: [
        {
          name: 'Медитации',
          description: '100+guided медитаций от 3 до 60 минут. Для начинающих и продвинутых. Темы: стресс, сон, фокус, благодарность.',
          icon: '🧘‍♀️',
        },
        {
          name: 'Дыхательные практики',
          description: 'Box breathing, 4-7-8, Wim Hof. Визуальные и звуковые подсказки для правильного ритма.',
          icon: '💨',
        },
        {
          name: 'Daily check-in',
          description: 'Ежедневное отслеживание настроения, энергии, стресса. Выявление триггеров и паттернов.',
          icon: '😊',
        },
        {
          name: 'Journaling',
          description: 'Структурированные дневниковые практики. Подсказки для рефлексии. Анализ записей через AI.',
          icon: '✍️',
        },
        {
          name: 'Стресс-менеджмент',
          description: 'Техники когнитивно-поведенческой терапии. Упражнения для управления тревогой.',
          icon: '🛡️',
        },
        {
          name: 'Ресурсы помощи',
          description: 'База психологов, горячих линий, групп поддержки. Интеграция с сервисами телемедицины.',
          icon: '🤝',
        },
      ],
    },
    medical: {
      icon: '🏥',
      title: 'Медицинский',
      subtitle: 'Ваша здоровье в одном месте',
      features: [
        {
          name: 'Электронная медкарта',
          description: 'Хранение всех медицинских записей: диагнозы, назначения, прививки, госпитализации. Защищённое шифрование.',
          icon: '📁',
        },
        {
          name: 'Напоминания о лекарствах',
          description: 'График приёма препаратов. Уведомления в нужное время. Отслеживание adherence.',
          icon: '💊',
        },
        {
          name: 'Лабораторные анализы',
          description: 'Загрузка результатов анализов. AI-интерпретация с рекомендациями. Отслеживание динамики.',
          icon: '🔬',
        },
        {
          name: 'Консультации врачей',
          description: 'Телемедицина: чат, аудио, видео. Специалисты по всем направлениям. Второе мнение.',
          icon: '👨‍⚕️',
        },
        {
          name: 'Семейный доступ',
          description: 'Управление здоровьем семьи в одном аккаунте. Дети, родители, пожилые родственники.',
          icon: '👨‍👩‍👧‍👦',
        },
        {
          name: 'Экспорт для врача',
          description: 'Генерация PDF-отчётов для посещения врача. Все данные в структурированном виде.',
          icon: '📄',
        },
      ],
    },
    body: {
      icon: '🧬',
      title: 'Биометрия',
      subtitle: 'Точные данные о вашем теле',
      features: [
        {
          name: 'Трекер веса',
          description: 'Графики веса с трендами. Сглаживание колебаний. Прогноз достижения цели.',
          icon: '⚖️',
        },
        {
          name: 'Состав тела',
          description: 'Процент жира, мышц, воды, костной массы. Интеграция с умными весами.',
          icon: '📐',
        },
        {
          name: 'Замеры',
          description: 'Обхват груди, талии, бёдер, конечностей. Визуализация изменений.',
          icon: '📏',
        },
        {
          name: 'Фото прогресса',
          description: 'Сравнение фотографий до/после. Таймлапс трансформации. Приватное хранение.',
          icon: '📸',
        },
        {
          name: 'Здоровье сердца',
          description: 'Пульс в покое, вариабельность, давление. Трекеры для сердечно-сосудистого здоровья.',
          icon: '❤️',
        },
        {
          name: 'Гормональный профиль',
          description: 'Отслеживание гормонов: кортизол, тестостерон, инсулин. Рекомендации по оптимизации.',
          icon: '🧬',
        },
      ],
    },
    environment: {
      icon: '🌿',
      title: 'Окружение',
      subtitle: 'Оптимизация внешней среды',
      features: [
        {
          name: 'Качество воздуха',
          description: 'Интеграция с датчиками AQI. PM2.5, CO2, летучие соединения. Рекомендации по очистке.',
          icon: '💨',
        },
        {
          name: 'Вода',
          description: 'Качество питьевой воды: TDS, pH, жёсткость. Напоминания о потреблении воды.',
          icon: '💧',
        },
        {
          name: 'Шум',
          description: 'Мониторинг уровня шума. Защита слуха. Рекомендации по звукоизоляции.',
          icon: '🔇',
        },
        {
          name: 'Освещение',
          description: 'Интенсивность, цветовая температура. Циркадные ритмы. Рекомендации по свету.',
          icon: '💡',
        },
        {
          name: 'Температура',
          description: 'Оптимальная температура для сна, работы, тренировок. Интеграция с умным домом.',
          icon: '🌡️',
        },
        {
          name: 'Электромагнитное поле',
          description: 'Мониторинг EMF. Рекомендации по снижению воздействия электроники.',
          icon: '📶',
        },
      ],
    },
  };

  const faqs = [
    {
      question: 'Как AI персонализирует рекомендации?',
      answer: 'Наш алгоритм анализирует более 200 параметров: от базовых (возраст, вес) до сложных (генетические маркеры, биометрические данные, поведенческие паттерны). Система обучается на ваших данных и адаптирует рекомендации в реальном времени.',
    },
    {
      question: 'Можно ли использовать EthosLife без премиум-подписки?',
      answer: 'Да, бесплатный тариф включает 2 модуля на выбор с базовым функционалом. Этого достаточно для начала пути к здоровью. Премиум открывает все 7 модулей с полным набором функций.',
    },
    {
      question: 'Как обеспечивается безопасность медицинских данных?',
      answer: 'Мы используем сквозное шифрование AES-256, храним данные в сертифицированных дата-центрах (HIPAA, GDPR). Доступ к медицинской информации возможен только с вашего явного согласия.',
    },
    {
      question: 'Интегрируется ли EthosLife с другими устройствами?',
      answer: 'Да, мы поддерживаем 50+ устройств и сервисов: Apple Watch, Garmin, Fitbit, Oura, Withings, Xiaomi и другие. Полная синхронизация с Apple Health и Google Fit.',
    },
    {
      question: 'Что если у меня есть специфические медицинские ограничения?',
      answer: 'При регистрации вы можете указать медицинские ограничения, аллергии, противопоказания. AI учтёт их при генерации рекомендаций. Для сложных случаев доступна консультация врачей.',
    },
  ];

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
              <a href="#modules" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Модули</a>
              <a href="#details" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Детали</a>
              <a href="#faq" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">FAQ</a>
              <button onClick={() => navigate('/pricing-v1')} className="neu-button py-2 px-6 text-sm">Тарифы</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Возможности Платформы
            </h1>
            <p className="text-2xl text-[#5c5243] max-w-4xl mx-auto">
              100+ функций для комплексного управления здоровьем. 
              Каждый модуль — это отдельное приложение, объединённое в единую экосистему.
            </p>
          </div>

          {/* Feature Tabs */}
          <div id="details" className="mt-16">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {Object.entries(featureTabs).map(([key, tab]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === key
                      ? 'bg-[#5c5243] text-[#e4dfd5]'
                      : 'neu-card text-[#2d2418] hover:bg-[#d4ccb8]'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="neu-card p-8 md:p-12">
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-6xl">{featureTabs[activeTab].icon}</span>
                <div>
                  <h2 className="text-4xl font-bold text-[#2d2418]">{featureTabs[activeTab].title}</h2>
                  <p className="text-xl text-[#5c5243]">{featureTabs[activeTab].subtitle}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureTabs[activeTab].features.map((feature, idx) => (
                  <div key={idx} className="neu-card p-6 hover:scale-105 transition-transform">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-[#2d2418] mb-3">{feature.name}</h3>
                    <p className="text-[#5c5243] leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Интеграции</h2>
            <p className="text-xl text-[#5c5243]">Работаем с вашими любимыми устройствами и сервисами</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {['⌚ Apple Watch', '📱 Google Fit', '🏃 Garmin', '💪 Fitbit', '💍 Oura', '⚖️ Withings'].map((device, idx) => (
              <div key={idx} className="neu-card p-6 text-center hover:scale-105 transition-transform">
                <span className="text-2xl">{device}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Сравнение с другими решениями</h2>
            <p className="text-xl text-[#5c5243]">Почему EthosLife — лучший выбор</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full neu-card">
              <thead>
                <tr className="border-b border-[#d4ccb8]">
                  <th className="p-4 text-left text-[#2d2418]">Функция</th>
                  <th className="p-4 text-center bg-[#5c5243] text-[#e4dfd5] rounded-t-lg">EthosLife</th>
                  <th className="p-4 text-center text-[#2d2418]">Другие</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Модули здоровья', '7 в одном', '1-2'],
                  ['AI персонализация', '✅ Полная', '❌ Частично'],
                  ['Медицинские записи', '✅ Полная интеграция', '❌ Нет'],
                  ['Телемедицина', '✅ Встроена', '❌ Отдельно'],
                  ['Семейный доступ', '✅ До 5 человек', '❌ Платно'],
                  ['Экспорт данных', '✅ PDF/CSV', '⚠️ Ограничен'],
                  ['Поддержка 24/7', '✅ Живые операторы', '⚠️ Боты'],
                  ['Цена', 'от 990₽/мес', 'от 1500₽/мес'],
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#d4ccb8]/20' : ''}>
                    <td className="p-4 text-[#2d2418] font-medium">{row[0]}</td>
                    <td className="p-4 text-center text-green-600 font-semibold">{row[1]}</td>
                    <td className="p-4 text-center text-[#5c5243]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Частые вопросы</h2>
            <p className="text-xl text-[#5c5243]">Ответы на популярные вопросы о возможностях</p>
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
              Готовы попробовать все возможности?
            </h2>
            <p className="text-xl text-[#5c5243] mb-8">
              14 дней бесплатного доступа ко всем 7 модулям. Карта не требуется.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#5c5243] text-[#e4dfd5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3d3226] transition-colors"
              >
                Начать бесплатный триал →
              </button>
              <button
                onClick={() => navigate('/pricing-v1')}
                className="neu-button px-8 py-4 text-lg"
              >
                Смотреть тарифы
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

export default FeaturesV1;
