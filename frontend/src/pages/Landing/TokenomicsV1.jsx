import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenomicsV1 = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('distribution');
  const [stakingAmount, setStakingAmount] = useState(1000);
  const [stakingPeriod, setStakingPeriod] = useState(12);

  const tokenDistribution = [
    { category: 'Community Rewards', percentage: 35, tokens: 350000000, color: 'bg-green-500', description: 'Награды за стейкинг, рефералы, активность' },
    { category: 'Ecosystem Fund', percentage: 20, tokens: 200000000, color: 'bg-blue-500', description: 'Развитие экосистемы, гранты, партнёрства' },
    { category: 'Team & Advisors', percentage: 15, tokens: 150000000, color: 'bg-purple-500', description: 'Команда и советники (4 года вестинг)' },
    { category: 'Public Sale', percentage: 12, tokens: 120000000, color: 'bg-yellow-500', description: 'Публичная продажа токенов' },
    { category: 'Private Sale', percentage: 10, tokens: 100000000, color: 'bg-red-500', description: 'Приватные инвесторы (2 года вестинг)' },
    { category: 'Liquidity', percentage: 8, tokens: 80000000, color: 'bg-teal-500', description: 'Обеспечение ликвидности на DEX' },
  ];

  const vestingSchedule = [
    { round: 'Seed', allocation: '5%', tokens: 50000000, price: '$0.05', cliff: '6 месяцев', vesting: '24 месяца линейно', tge: '10%', locked: '90%' },
    { round: 'Private', allocation: '10%', tokens: 100000000, price: '$0.08', cliff: '3 месяца', vesting: '18 месяцев линейно', tge: '15%', locked: '85%' },
    { round: 'Public Sale', allocation: '12%', tokens: 120000000, price: '$0.12', cliff: 'Нет', vesting: '12 месяцев линейно', tge: '25%', locked: '75%' },
    { round: 'Team', allocation: '15%', tokens: 150000000, price: '-', cliff: '12 месяцев', vesting: '36 месяцев линейно', tge: '0%', locked: '100%' },
  ];

  const stakingTiers = [
    { tier: 'Bronze', minStake: 100, maxStake: 999, baseApy: 15, bonusMultiplier: 1.0, perks: ['Базовые награды', 'Доступ к стейкингу'] },
    { tier: 'Silver', minStake: 1000, maxStake: 4999, baseApy: 18, bonusMultiplier: 1.2, perks: ['+20% к наградам', 'Приоритетная поддержка', 'Ранний доступ к фичам'] },
    { tier: 'Gold', minStake: 5000, maxStake: 24999, baseApy: 20, bonusMultiplier: 1.5, perks: ['+50% к наградам', 'Персональный менеджер', 'Эксклюзивные ивенты'] },
    { tier: 'Platinum', minStake: 25000, maxStake: null, baseApy: 25, bonusMultiplier: 2.0, perks: ['+100% к наградам', 'Governance права', 'Доля в revenue'] },
  ];

  const burnMechanisms = [
    {
      mechanism: 'Transaction Fees',
      description: '2% от каждой транзакции сжигается автоматически',
      impact: 'Высокий',
      icon: '🔥',
    },
    {
      mechanism: 'Premium Subscriptions',
      description: '50% revenue от подписок идёт на buyback & burn',
      impact: 'Средний',
      icon: '💎',
    },
    {
      mechanism: 'NFT Marketplace',
      description: 'Комиссии с NFT транзакций сжигаются',
      impact: 'Средний',
      icon: '🎨',
    },
    {
      mechanism: 'Quarterly Burns',
      description: 'Ежеквартальное сжигание на основе прибыли',
      impact: 'Высокий',
      icon: '📅',
    },
    {
      mechanism: 'Penalty Burns',
      description: 'Штрафы за ранний анстейкинг сжигаются',
      impact: 'Низкий',
      icon: '⚠️',
    },
  ];

  const utilityFunctions = [
    {
      category: 'Оплата подписок',
      description: 'Оплата Premium и Centers тарифов со скидкой 20%',
      icon: '💳',
    },
    {
      category: 'Стейкинг',
      description: 'Пассивный доход 15-25% APY в зависимости от тира',
      icon: '📈',
    },
    {
      category: 'Governance',
      description: 'Голосование за предложения по развитию платформы',
      icon: '🗳️',
    },
    {
      category: 'Rewards',
      description: 'Награды за достижения, челленджи, рефералов',
      icon: '🏆',
    },
    {
      category: 'NFT Marketplace',
      description: 'Покупка/продажа NFT достижений и коллекций',
      icon: '🎨',
    },
    {
      category: 'Health Data',
      description: 'Монетизация анонимизированных данных здоровья',
      icon: '📊',
    },
    {
      category: 'Telemedicine',
      description: 'Оплата консультаций врачей в UNITY',
      icon: '👨‍⚕️',
    },
    {
      category: 'Insurance',
      description: 'Оплата страховых премий в будущем',
      icon: '🛡️',
    },
  ];

  const calculateStakingRewards = () => {
    const tier = stakingTiers.find(t => 
      stakingAmount >= t.minStake && (t.maxStake === null || stakingAmount <= t.maxStake)
    ) || stakingTiers[0];
    
    const baseReward = stakingAmount * (tier.baseApy / 100);
    const periodReward = baseReward * (stakingPeriod / 12);
    const totalReward = periodReward * tier.bonusMultiplier;
    
    return {
      tier,
      baseReward,
      periodReward,
      totalReward,
      total: stakingAmount + totalReward,
    };
  };

  const stakingCalc = calculateStakingRewards();

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
              <a href="#distribution" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Распределение</a>
              <a href="#vesting" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Вестинг</a>
              <a href="#staking" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Стейкинг</a>
              <a href="#utility" className="text-[#2d2418] hover:text-[#5c5243] transition-colors">Utility</a>
              <button onClick={() => navigate('/whitepaper-v1')} className="neu-button py-2 px-6 text-sm">Whitepaper</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-2 bg-[#5c5243] text-[#e4dfd5] rounded-full font-medium">
              🔥 UNITY Token — $UNITY
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Токеномика UNITY
            </h1>
            <p className="text-2xl text-[#5c5243] max-w-4xl mx-auto">
              Дефляционная модель с множественными механизмами сжигания. 
              1 миллиард токенов с прозрачным распределением.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Общее предложение', value: '1,000,000,000', icon: '📊' },
              { label: 'Циркулирующее', value: '12%', icon: '🔄' },
              { label: 'Сожжено', value: '2.5M+', icon: '🔥' },
              { label: 'Стейкается', value: '45%', icon: '📈' },
            ].map((stat, idx) => (
              <div key={idx} className="neu-card p-6 text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#2d2418] mb-2">{stat.value}</div>
                <div className="text-[#5c5243]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Distribution */}
      <section id="distribution" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Распределение токенов</h2>
            <p className="text-xl text-[#5c5243]">Прозрачное и справедливое распределение 1B токенов</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Pie Chart Visualization */}
            <div className="neu-card p-8">
              <div className="relative w-80 h-80 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {tokenDistribution.reduce((acc, item, idx) => {
                    const offset = acc.offset;
                    const circumference = 2 * Math.PI * 40;
                    const strokeDasharray = (item.percentage / 100) * circumference;
                    const strokeDashoffset = -offset * circumference;
                    
                    acc.elements.push(
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="20"
                        strokeDasharray={`${strokeDasharray} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        className={`${item.color.replace('bg-', 'text-')}`}
                      />
                    );
                    acc.offset += item.percentage / 100;
                    return acc;
                  }, { elements: [], offset: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#2d2418]">1B</div>
                    <div className="text-sm text-[#5c5243]">UNITY</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution List */}
            <div className="space-y-4">
              {tokenDistribution.map((item, idx) => (
                <div key={idx} className="neu-card p-4 hover:scale-102 transition-transform">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="font-semibold text-[#2d2418]">{item.category}</span>
                    </div>
                    <span className="text-xl font-bold text-[#2d2418]">{item.percentage}%</span>
                  </div>
                  <div className="text-sm text-[#5c5243] ml-7">
                    {item.tokens.toLocaleString()} UNITY • {item.description}
                  </div>
                  <div className="ml-7 mt-2">
                    <div className="w-full bg-[#d4ccb8] rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vesting Schedule */}
      <section id="vesting" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">График вестинга</h2>
            <p className="text-xl text-[#5c5243]">Прозрачный график разлока токенов</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full neu-card">
              <thead>
                <tr className="border-b border-[#d4ccb8]">
                  <th className="p-4 text-left text-[#2d2418]">Раунд</th>
                  <th className="p-4 text-center text-[#2d2418]">Аллокация</th>
                  <th className="p-4 text-center text-[#2d2418]">Токены</th>
                  <th className="p-4 text-center text-[#2d2418]">Цена</th>
                  <th className="p-4 text-center text-[#2d2418]">Cliff</th>
                  <th className="p-4 text-center text-[#2d2418]">Вестинг</th>
                  <th className="p-4 text-center text-[#2d2418]">TGE</th>
                  <th className="p-4 text-center text-[#2d2418]">Locked</th>
                </tr>
              </thead>
              <tbody>
                {vestingSchedule.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#d4ccb8]/20' : ''}>
                    <td className="p-4 text-[#2d2418] font-semibold">{row.round}</td>
                    <td className="p-4 text-center text-[#5c5243]">{row.allocation}</td>
                    <td className="p-4 text-center text-[#5c5243]">{row.tokens.toLocaleString()}</td>
                    <td className="p-4 text-center text-[#2d2418] font-medium">{row.price}</td>
                    <td className="p-4 text-center text-[#5c5243]">{row.cliff}</td>
                    <td className="p-4 text-center text-[#5c5243]">{row.vesting}</td>
                    <td className="p-4 text-center text-green-600">{row.tge}</td>
                    <td className="p-4 text-center text-[#5c5243]">{row.locked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vesting Timeline */}
          <div className="mt-12 neu-card p-8">
            <h3 className="text-2xl font-bold text-[#2d2418] mb-6 text-center">Визуализация вестинга</h3>
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#d4ccb8] rounded-full"></div>
              <div className="relative flex justify-between">
                {['TGE', '3M', '6M', '12M', '18M', '24M', '36M', '48M'].map((mark, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-[#5c5243] rounded-full mb-2"></div>
                    <span className="text-sm text-[#5c5243]">{mark}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staking Section */}
      <section id="staking" className="py-20 px-px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Стейкинг Rewards</h2>
            <p className="text-xl text-[#5c5243]">Пассивный доход от 15% до 25% APY</p>
          </div>

          {/* Staking Tiers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stakingTiers.map((tier, idx) => (
              <div key={idx} className={`neu-card p-6 text-center ${idx === 3 ? 'ring-2 ring-yellow-500' : ''}`}>
                <div className="text-4xl mb-4">
                  {idx === 0 ? '🥉' : idx === 1 ? '🥈' : idx === 2 ? '🥇' : '💎'}
                </div>
                <h3 className="text-2xl font-bold text-[#2d2418] mb-2">{tier.tier}</h3>
                <div className="text-4xl font-bold text-green-600 mb-4">{tier.baseApy}% APY</div>
                <div className="text-[#5c5243] mb-4">
                  {tier.minStake.toLocaleString()} - {tier.maxStake ? tier.maxStake.toLocaleString() : '∞'} UNITY
                </div>
                <ul className="space-y-2 text-sm text-[#2d2418]">
                  {tier.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Staking Calculator */}
          <div className="neu-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2d2418] mb-6 text-center">Калькулятор наград</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[#2d2418] font-semibold mb-2">Количество токенов</label>
                <input
                  type="number"
                  value={stakingAmount}
                  onChange={(e) => setStakingAmount(Number(e.target.value))}
                  className="neu-input px-4 py-3 text-lg"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-[#2d2418] font-semibold mb-2">Период стейкинга (месяцев)</label>
                <input
                  type="range"
                  value={stakingPeriod}
                  onChange={(e) => setStakingPeriod(Number(e.target.value))}
                  className="w-full"
                  min="1"
                  max="36"
                />
                <div className="text-center text-[#5c5243] mt-2">{stakingPeriod} месяцев</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#d4ccb8]">
                <div className="text-center">
                  <div className="text-sm text-[#5c5243] mb-1">Ваш тир</div>
                  <div className="text-2xl font-bold text-[#2d2418]">{stakingCalc.tier.tier}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#5c5243] mb-1">APY</div>
                  <div className="text-2xl font-bold text-green-600">{stakingCalc.tier.baseApy}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#5c5243] mb-1">Награды</div>
                  <div className="text-2xl font-bold text-[#2d2418]">{stakingCalc.totalReward.toLocaleString(undefined, { maximumFractionDigits: 0 })} UNITY</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#5c5243] mb-1">Итого</div>
                  <div className="text-2xl font-bold text-green-600">{stakingCalc.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} UNITY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Burn Mechanisms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Механизмы сжигания</h2>
            <p className="text-xl text-[#5c5243]">Автоматическое сокращение предложения</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {burnMechanisms.map((item, idx) => (
              <div key={idx} className="neu-card p-6 text-center hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#2d2418] mb-3">{item.mechanism}</h3>
                <p className="text-sm text-[#5c5243] mb-4">{item.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  item.impact === 'Высокий' ? 'bg-red-100 text-red-800' :
                  item.impact === 'Средний' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Utility Functions */}
      <section id="utility" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d4ccb8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2d2418] mb-4">Функции токена</h2>
            <p className="text-xl text-[#5c5243]">8 способов использования UNITY в экосистеме</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {utilityFunctions.map((item, idx) => (
              <div key={idx} className="neu-card p-6 hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#2d2418] mb-3">{item.category}</h3>
                <p className="text-[#5c5243]">{item.description}</p>
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
              Готовы стать частью экосистемы?
            </h2>
            <p className="text-xl text-[#5c5243] mb-8">
              Купите UNITY токены и начните получать пассивный доход уже сегодня.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#5c5243] text-[#e4dfd5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3d3226] transition-colors"
              >
                Купить UNITY →
              </button>
              <button
                onClick={() => navigate('/whitepaper-v1')}
                className="neu-button px-8 py-4 text-lg"
              >
                Читать Whitepaper
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

export default TokenomicsV1;
