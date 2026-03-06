import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoadmapV1 = () => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      period: 'Q1-Q2 2024',
      status: 'completed',
      icon: '🏗️',
      color: 'from-green-400 to-green-600',
      description: 'Заложение фундамента платформы и запуск базовых функций',
      milestones: [
        { title: 'Запуск MVP платформы', description: 'Базовые модули питания и фитнеса', completed: true, date: 'Март 2024' },
        { title: 'Мобильное приложение iOS', description: 'Публикация в App Store', completed: true, date: 'Апрель 2024' },
        { title: 'Мобильное приложение Android', description: 'Публикация в Google Play', completed: true, date: 'Май 2024' },
        { title: 'Первые 1,000 пользователей', description: 'Достижение первой тысячи активных пользователей', completed: true, date: 'Июнь 2024' },
        { title: 'Интеграция с Apple Health', description: 'Синхронизация данных о здоровье', completed: true, date: 'Июнь 2024' },
        { title: 'Интеграция с Google Fit', description: 'Синхронизация с экосистемой Android', completed: true, date: 'Июль 2024' },
      ],
      metrics: { users: '5,000+', revenue: '$50K', rating: '4.6★' },
    },
    {
      phase: 'Phase 2',
      title: 'Expansion',
      period: 'Q3-Q4 2024',
      status: 'in-progress',
      icon: '🚀',
      color: 'from-blue-400 to-blue-600',
      description: 'Расширение функционала и запуск всех 7 модулей',
      milestones: [
        { title: 'Запуск модуля сна', description: 'Анализ фаз сна и умный будильник', completed: true, date: 'Август 2024' },
        { title: 'Модуль ментального здоровья', description: 'Медитации и дыхательные практики', completed: true, date: 'Сентябрь 2024' },
        { title: 'Медицинский модуль', description: 'Электронная медкарта и напоминания', completed: true, date: 'Октябрь 2024' },
        { title: 'Биометрический модуль', description: 'Трекер веса и состава тела', completed: true, date: 'Ноябрь 2024' },
        { title: 'Модуль окружения', description: 'Мониторинг качества среды', completed: false, date: 'Декабрь 2024' },
        { title: 'Запуск токена UNITY', description: 'Листинг на DEX', completed: false, date: 'Декабрь 2024' },
        { title: '10,000 пользователей', description: 'Достижение 10K активных пользователей', completed: true, date: 'Ноябрь 2024' },
      ],
      metrics: { users: '10,000+', revenue: '$200K', rating: '4.8★' },
    },
    {
      phase: 'Phase 3',
      title: 'Growth',
      period: 'Q1-Q2 2025',
      status: 'upcoming',
      icon: '📈',
      color: 'from-purple-400 to-purple-600',
      description: 'Масштабирование и запуск продвинутых функций',
      milestones: [
        { title: 'AI персонализация 2.0', description: 'Улучшенные алгоритмы рекомендаций', completed: false, date: 'Январь 2025' },
        { title: 'Телемедицина', description: 'Консультации врачей в приложении', completed: false, date: 'Февраль 2025' },
        { title: 'Семейный доступ', description: 'До 5 человек в одном аккаунте', completed: false, date: 'Март 2025' },
        { title: 'NFT достижения', description: 'Коллекционные NFT за успехи', completed: false, date: 'Апрель 2025' },
        { title: 'Стейкинг UNITY', description: 'Пассивный доход 15-25% APY', completed: false, date: 'Май 2025' },
        { title: 'Партнёрства с клиниками', description: '50+ клиник в программе', completed: false, date: 'Июнь 2025' },
        { title: '50,000 пользователей', description: 'Достижение 50K активных пользователей', completed: false, date: 'Июнь 2025' },
      ],
      metrics: { users: '50,000+', revenue: '$1M', rating: '4.9★' },
    },
    {
      phase: 'Phase 4',
      title: 'Ecosystem',
      period: 'Q3-Q4 2025',
      status: 'upcoming',
      icon: '🌐',
      color: 'from-yellow-400 to-yellow-600',
      description: 'Создание полноценной экосистемы здоровья',
      milestones: [
        { title: 'API для разработчиков', description: 'Публичный API для интеграций', completed: false, date: 'Июль 2025' },
        { title: 'Marketplace добавок', description: 'Персонализированные рекомендации', completed: false, date: 'Август 2025' },
        { title: 'Страховые партнёрства', description: 'Скидки на страхование здоровья', completed: false, date: 'Сентябрь 2025' },
        { title: 'Корпоративная версия', description: 'EthosLife для компаний', completed: false, date: 'Октябрь 2025' },
        { title: 'White-label решение', description: 'Брендированные версии для клиник', completed: false, date: 'Ноябрь 2025' },
        { title: 'Генетический анализ', description: 'Интеграция с ДНК-тестами', completed: false, date: 'Декабрь 2025' },
        { title: '100,000 пользователей', description: 'Достижение 100K активных пользователей', completed: false, date: 'Декабрь 2025' },
      ],
      metrics: { users: '100,000+', revenue: '$5M', rating: '4.9★' },
    },
    {
      phase: 'Phase 5',
      title: 'Global',
      period: '2026+',
      status: 'future',
      icon: '🌍',
      color: 'from-red-400 to-red-600',
      description: 'Глобальная экспансия и инновации',
      milestones: [
        { title: 'Локализация 10 языков', description: 'Поддержка основных мировых языков', completed: false, date: 'Q1 2026' },
        { title: 'FDA одобрение', description: 'Медицинская сертификация в США', completed: false, date: 'Q2 2026' },
        { title: 'CE маркировка', description: 'Сертификация в Европе', completed: false, date: 'Q2 2026' },
        { title: 'AI диагност', description: 'Предварительная диагностика симптомов', completed: false, date: 'Q3 2026' },
        { title: 'VR фитнес', description: 'Виртуальная реальность для тренировок', completed: false, date: 'Q4 2026' },
        { title: '1,000,000 пользователей', description: 'Достижение 1M активных пользователей', completed: false, date: 'Q4 2026' },
      ],
      metrics: { users: '1,000,000+', revenue: '$20M', rating: '5.0★' },
    },
  ];

  const filteredPhases = activeTab === 'all' 
    ? roadmapPhases 
    : roadmapPhases.filter(p => p.status === activeTab);

  const stats = {
    completed: roadmapPhases.flatMap(p => p.milestones).filter(m => m.completed).length,
    total: roadmapPhases.flatMap(p => p.milestones).length,
    users: '10,000+',
    countries: '150+',
  };

  stats.completed = roadmapPhases.reduce((acc, p) => acc + p.milestones.filter(m => m.completed).length, 0);
  stats.total = roadmapPhases.reduce((acc, p) => acc + p.milestones.length, 0);

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
              <a href="#roadmap" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Roadmap</a>
              <a href="#progress" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Прогресс</a>
              <a href="#metrics" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Метрики</a>
              <button onClick={() => navigate('/tokenomics-v1')} className="neu-button py-2 px-6 text-sm">Токеномика</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-2 bg-[#5c5243] text-[#e4dfd5] rounded-full font-medium">
              📍 Путь к Human Operating System
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Дорожная Карта
            </h1>
            <p className="text-2xl text-[#5c5243] max-w-4xl mx-auto">
              От MVP до глобальной экосистемы здоровья. 
              Прозрачный план развития с конкретными вехами.
            </p>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="neu-card p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.completed}/{stats.total}</div>
              <div className="text-[#5c5243]">Завершено вех</div>
              <div className="mt-4 w-full bg-[#d4ccb8] rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="neu-card p-6 text-center">
              <div className="text-4xl font-bold text-[#2d2418] mb-2">{stats.users}</div>
              <div className="text-[#5c5243]">Пользователей</div>
            </div>
            <div className="neu-card p-6 text-center">
              <div className="text-4xl font-bold text-[#2d2418] mb-2">{stats.countries}</div>
              <div className="text-[#5c5243]">Стран</div>
            </div>
            <div className="neu-card p-6 text-center">
              <div className="text-4xl font-bold text-[#2d2418] mb-2">~85%</div>
              <div className="text-[#5c5243]">По плану</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'all', label: 'Все', icon: '📋' },
              { id: 'completed', label: 'Завершено', icon: '✅' },
              { id: 'in-progress', label: 'В процессе', icon: '🔄' },
              { id: 'upcoming', label: 'Планируется', icon: '📅' },
              { id: 'future', label: 'Будущее', icon: '🔮' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#5c5243] text-[#e4dfd5]'
                    : 'neu-card text-[#2d2418] hover:bg-[#d4ccb8]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {filteredPhases.map((phase, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Line */}
                {idx < filteredPhases.length - 1 && (
                  <div className="absolute left-8 top-24 bottom-0 w-1 bg-[#d4ccb8] md:left-1/2 md:-translate-x-1/2"></div>
                )}

                <div className={`flex flex-col md:flex-row gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Phase Header */}
                  <div className="md:w-1/2 flex md:justify-end">
                    <div className={`neu-card p-6 min-w-[300px] ${phase.status === 'in-progress' ? 'ring-2 ring-blue-500 animate-pulse' : ''}`}>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-3xl`}>
                          {phase.icon}
                        </div>
                        <div>
                          <div className="text-sm text-[#5c5243] font-medium">{phase.phase}</div>
                          <h3 className="text-2xl font-bold text-[#2d2418]">{phase.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-[#5c5243]">{phase.period}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                          phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          phase.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {phase.status === 'completed' ? '✓ Завершено' :
                           phase.status === 'in-progress' ? '🔄 В процессе' :
                           phase.status === 'upcoming' ? '📅 Планируется' :
                           '🔮 Будущее'}
                        </span>
                      </div>
                      <p className="text-[#5c5243]">{phase.description}</p>
                      
                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#d4ccb8]">
                        <div className="text-center">
                          <div className="text-sm text-[#5c5243]">Пользователи</div>
                          <div className="text-lg font-bold text-[#2d2418]">{phase.metrics.users}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-[#5c5243]">Revenue</div>
                          <div className="text-lg font-bold text-[#2d2418]">{phase.metrics.revenue}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-[#5c5243]">Рейтинг</div>
                          <div className="text-lg font-bold text-[#2d2418]">{phase.metrics.rating}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for center alignment */}
                  <div className="hidden md:block md:w-0"></div>

                  {/* Milestones */}
                  <div className="md:w-1/2">
                    <div className="space-y-4">
                      {phase.milestones.map((milestone, mIdx) => (
                        <div
                          key={mIdx}
                          className={`neu-card p-4 flex items-start space-x-4 ${
                            milestone.completed ? 'opacity-100' : 'opacity-70'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            milestone.completed 
                              ? 'bg-green-600 text-white' 
                              : 'bg-[#d4ccb8] text-[#5c5243]'
                          }`}>
                            {milestone.completed ? '✓' : '○'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-[#2d2418]">{milestone.title}</h4>
                              <span className="text-sm text-[#5c5243]">{milestone.date}</span>
                            </div>
                            <p className="text-sm text-[#5c5243] mt-1">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section id="metrics" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Ключевые метрики роста</h2>
            <p className="text-xl text-[#5c5243]">Прогнозируемые показатели по фазам</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {roadmapPhases.map((phase, idx) => (
              <div key={idx} className="neu-card p-6 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-2xl mx-auto mb-4`}>
                  {phase.icon}
                </div>
                <h3 className="font-bold text-[#2d2418] mb-2">{phase.phase}</h3>
                <p className="text-sm text-[#5c5243] mb-4">{phase.period}</p>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-[#2d2418]">{phase.metrics.users}</div>
                  <div className="text-sm text-[#5c5243]">пользователей</div>
                  <div className="text-lg font-bold text-[#2d2418]">{phase.metrics.revenue}</div>
                  <div className="text-sm text-[#5c5243]">выручка</div>
                </div>
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
              Станьте частью нашего пути
            </h2>
            <p className="text-xl text-[#5c5243] mb-8">
              Присоединяйтесь к EthosLife сегодня и получите ранний доступ к новым функциям.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#5c5243] text-[#e4dfd5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3d3226] transition-colors"
              >
                Начать бесплатно →
              </button>
              <button
                onClick={() => navigate('/tokenomics-v1')}
                className="neu-button px-8 py-4 text-lg"
              >
                Узнать о токене
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

export default RoadmapV1;
