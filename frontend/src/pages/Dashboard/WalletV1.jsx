import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useAuthStore } from '../../store/authStore';

/**
 * WalletV1 - Крипто/фиат кошелёк
 * Управление балансами, стейкинг, конвертация токенов
 */

// ============================================
// MOCK DATA
// ============================================

const TOKENS = {
  USD: { symbol: 'USD', name: 'US Dollar', icon: '💵', color: '#10b981', price: 1 },
  EUR: { symbol: 'EUR', name: 'Euro', icon: '💶', color: '#3b82f6', price: 1.08 },
  USDC: { symbol: 'USDC', name: 'USD Coin', icon: '🪙', color: '#2775ca', price: 1 },
  ETH: { symbol: 'ETH', name: 'Ethereum', icon: '⟠', color: '#627eea', price: 2850 },
  UNITY: { symbol: 'UNITY', name: 'EthosLife Token', icon: '🌱', color: '#10b981', price: 0.45 },
  BTC: { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f7931a', price: 62500 },
};

const generatePortfolioHistory = () => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  return months.map((month, idx) => ({
    month,
    value: 5000 + idx * 800 + Math.random() * 400,
    staked: 2000 + idx * 300,
    liquid: 3000 + idx * 500,
  }));
};

const generateTransactionHistory = () => [
  {
    id: 1,
    type: 'receive',
    token: 'UNITY',
    amount: 500,
    value: 225,
    from: '0x742d...8a9c',
    date: '2026-03-05 14:32',
    status: 'completed',
    hash: '0xabc123...',
  },
  {
    id: 2,
    type: 'stake',
    token: 'UNITY',
    amount: 1000,
    value: 450,
    to: 'Staking Pool',
    date: '2026-03-04 10:15',
    status: 'completed',
    hash: '0xdef456...',
  },
  {
    id: 3,
    type: 'swap',
    token: 'ETH',
    amount: 0.5,
    value: 1425,
    fromToken: 'ETH',
    toToken: 'USDC',
    toAmount: 1420,
    date: '2026-03-03 16:45',
    status: 'completed',
    hash: '0xghi789...',
  },
  {
    id: 4,
    type: 'withdraw',
    token: 'USDC',
    amount: 500,
    value: 500,
    to: '0x8b4f...2c1d',
    date: '2026-03-02 09:20',
    status: 'completed',
    hash: '0xjkl012...',
  },
  {
    id: 5,
    type: 'deposit',
    token: 'USD',
    amount: 1000,
    value: 1000,
    from: 'Bank Transfer',
    date: '2026-03-01 11:00',
    status: 'completed',
    hash: '0xmno345...',
  },
  {
    id: 6,
    type: 'reward',
    token: 'UNITY',
    amount: 75,
    value: 33.75,
    from: 'Staking Rewards',
    date: '2026-02-28 00:00',
    status: 'completed',
    hash: '0xpqr678...',
  },
  {
    id: 7,
    type: 'receive',
    token: 'ETH',
    amount: 0.25,
    value: 712.5,
    from: '0x3c8a...7b2e',
    date: '2026-02-27 18:30',
    status: 'completed',
    hash: '0xstu901...',
  },
  {
    id: 8,
    type: 'swap',
    token: 'USDC',
    amount: 200,
    value: 200,
    fromToken: 'USDC',
    toToken: 'UNITY',
    toAmount: 445,
    date: '2026-02-26 13:15',
    status: 'pending',
    hash: '0xvwx234...',
  },
];

const generateStakingPools = () => [
  {
    id: 1,
    name: 'UNITY Flexible',
    token: 'UNITY',
    apy: 15,
    staked: 2500,
    rewards: 125,
    lockPeriod: '0 дней',
    risk: 'low',
    description: 'Гибкий стейкинг без блокировки',
  },
  {
    id: 2,
    name: 'UNITY 30 Days',
    token: 'UNITY',
    apy: 22,
    staked: 5000,
    rewards: 380,
    lockPeriod: '30 дней',
    risk: 'low',
    description: 'Повышенный APY с 30-дневной блокировкой',
  },
  {
    id: 3,
    name: 'UNITY 90 Days',
    token: 'UNITY',
    apy: 35,
    staked: 10000,
    rewards: 1200,
    lockPeriod: '90 дней',
    risk: 'medium',
    description: 'Максимальный APY для долгосрочных持有телей',
  },
  {
    id: 4,
    name: 'ETH Staking',
    token: 'ETH',
    apy: 5.5,
    staked: 1.5,
    rewards: 0.082,
    lockPeriod: 'До Shanghai',
    risk: 'medium',
    description: 'Нативный стейкинг Ethereum',
  },
  {
    id: 5,
    name: 'USDC Lending',
    token: 'USDC',
    apy: 8.5,
    staked: 3000,
    rewards: 85,
    lockPeriod: '0 дней',
    risk: 'low',
    description: 'Кредитование стейблкоинов',
  },
];

const generateRewardsHistory = () => [
  { date: '01.03', amount: 12.5, token: 'UNITY', value: 5.63 },
  { date: '08.03', amount: 14.2, token: 'UNITY', value: 6.39 },
  { date: '15.03', amount: 15.8, token: 'UNITY', value: 7.11 },
  { date: '22.03', amount: 18.3, token: 'UNITY', value: 8.24 },
  { date: '01.04', amount: 20.1, token: 'UNITY', value: 9.05 },
  { date: '08.04', amount: 22.5, token: 'UNITY', value: 10.13 },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * TokenIcon - Иконка токена
 */
const TokenIcon = ({ token, size = 'md' }) => {
  const tokenData = TOKENS[token] || TOKENS.USD;
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-3xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: `${tokenData.color}20` }}
    >
      {tokenData.icon}
    </div>
  );
};

/**
 * BalanceCard - Карточка баланса токена
 */
const BalanceCard = ({ token, balance, value, onChange }) => {
  const tokenData = TOKENS[token];
  const changeColor = onChange >= 0 ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="neu-card p-5 hover:shadow-lg transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TokenIcon token={token} size="md" />
          <div>
            <div className="font-bold text-stone">{tokenData.name}</div>
            <div className="text-xs text-ink-light">{tokenData.symbol}</div>
          </div>
        </div>
        <div className={`text-sm font-medium ${changeColor}`}>
          {onChange >= 0 ? '+' : ''}{onChange}%
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-stone">
          {balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
        </div>
        <div className="text-sm text-ink-light">
          ≈ ${(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-stone/10 flex items-center justify-between">
        <span className="text-xs text-ink-light">
          Цена: ${tokenData.price.toLocaleString()}
        </span>
        <div className="flex space-x-2">
          <button className="text-xs neu-button-secondary px-3 py-1 rounded-lg transition-all">
            Отправить
          </button>
          <button className="text-xs neu-button px-3 py-1 rounded-lg transition-all">
            Получить
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * PortfolioChart - График портфеля
 */
const PortfolioChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Динамика портфеля</h3>
          <p className="text-xs text-ink-light">История за 6 месяцев</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-xs text-ink-light">Общая</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-violet-500 rounded-full" />
            <span className="text-xs text-ink-light">Стейкинг</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 12000]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            name="Общая стоимость"
          />
          <Area
            type="monotone"
            dataKey="staked"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="none"
            name="В стейкинге"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * AllocationPieChart - Диаграмма распределения
 */
const AllocationPieChart = ({ balances }) => {
  const data = Object.entries(balances)
    .filter(([_, b]) => b.value > 0)
    .map(([token, balance]) => ({
      name: TOKENS[token]?.symbol || token,
      value: balance.value,
      color: TOKENS[token]?.color || '#8c7a6b',
    }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Распределение</h3>
          <p className="text-xs text-ink-light">Доля токенов в портфеле</p>
        </div>
      </div>

      <div className="flex items-center">
        <ResponsiveContainer width="55%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#e4dfd5',
                border: '1px solid #8c7a6b',
                borderRadius: '12px',
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="w-45% space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-ink">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-stone">
                  ${item.value.toLocaleString()}
                </div>
                <div className="text-xs text-ink-light">
                  {((item.value / total) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * TransactionTable - Таблица транзакций
 */
const TransactionTable = ({ transactions, filter }) => {
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const getTypeStyles = (type) => {
    const styles = {
      deposit: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Депозит', icon: '↓' },
      withdraw: { bg: 'bg-red-100', text: 'text-red-600', label: 'Вывод', icon: '↑' },
      swap: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Обмен', icon: '⇄' },
      stake: { bg: 'bg-violet-100', text: 'text-violet-600', label: 'Стейкинг', icon: '🔒' },
      receive: { bg: 'bg-cyan-100', text: 'text-cyan-600', label: 'Получено', icon: '←' },
      send: { bg: 'bg-pink-100', text: 'text-pink-600', label: 'Отправлено', icon: '→' },
      reward: { bg: 'bg-lime-100', text: 'text-lime-600', label: 'Награда', icon: '🎁' },
    };
    return styles[type] || styles.deposit;
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">История транзакций</h3>
        <Link
          to="/wallet-v1/transactions"
          className="text-sm font-semibold text-stone hover:text-ink"
        >
          Все →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-ink-light uppercase tracking-wider">
              <th className="pb-3">Тип</th>
              <th className="pb-3">Токен</th>
              <th className="pb-3">Сумма</th>
              <th className="pb-3">Стоимость</th>
              <th className="pb-3">Дата</th>
              <th className="pb-3">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone/10">
            {filteredTransactions.slice(0, 8).map((tx) => {
              const styles = getTypeStyles(tx.type);
              return (
                <tr key={tx.id} className="hover:bg-sand/30 transition-all">
                  <td className="py-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${styles.bg} ${styles.text}`}>
                      <span className="font-bold">{styles.icon}</span>
                      <span className="text-sm font-medium">{styles.label}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <TokenIcon token={tx.token} size="sm" />
                      <span className="font-medium text-stone">{tx.token}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`font-bold ${tx.type === 'receive' || tx.type === 'deposit' || tx.type === 'reward' ? 'text-emerald-600' : 'text-stone'}`}>
                      {tx.type === 'receive' || tx.type === 'deposit' || tx.type === 'reward' ? '+' : '-'}
                      {tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-ink-light">
                      ${tx.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-ink-light">
                      {new Date(tx.date).toLocaleDateString('ru-RU')}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      tx.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {tx.status === 'completed' ? '✓' : '⏳'} {tx.status === 'completed' ? 'Готово' : 'В процессе'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * StakingCard - Карточка стейкинг пула
 */
const StakingCard = ({ pool, onStake, onUnstake }) => {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-emerald-600 bg-emerald-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-stone bg-sand';
    }
  };

  return (
    <div className="neu-card p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TokenIcon token={pool.token} size="md" />
          <div>
            <h4 className="font-bold text-stone">{pool.name}</h4>
            <p className="text-xs text-ink-light">{pool.description}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskColor(pool.risk)}`}>
          {pool.risk === 'low' ? 'Низкий' : pool.risk === 'medium' ? 'Средний' : 'Высокий'} риск
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-xs text-ink-light mb-1">APY</div>
          <div className="text-xl font-bold text-emerald-600">{pool.apy}%</div>
        </div>
        <div>
          <div className="text-xs text-ink-light mb-1">Заблокировано</div>
          <div className="text-lg font-bold text-stone">
            {pool.staked.toLocaleString()} {pool.token}
          </div>
        </div>
        <div>
          <div className="text-xs text-ink-light mb-1">Награды</div>
          <div className="text-lg font-bold text-emerald-600">
            +{pool.rewards.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-ink-light">
          🔒 {pool.lockPeriod}
        </span>
        <span className="text-xs text-ink-light">
          Мин: 100 {pool.token}
        </span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onStake(pool)}
          className="flex-1 neu-button py-2 rounded-xl text-sm font-medium transition-all"
        >
          Стейкать
        </button>
        <button
          onClick={() => onUnstake(pool)}
          className="flex-1 neu-button-secondary py-2 rounded-xl text-sm font-medium transition-all"
        >
          Вывести
        </button>
      </div>
    </div>
  );
};

/**
 * StakingOverview - Обзор стейкинга
 */
const StakingOverview = ({ pools }) => {
  const totalStaked = pools.reduce((sum, p) => sum + (p.staked * TOKENS[p.token]?.price || 0), 0);
  const totalRewards = pools.reduce((sum, p) => sum + (p.rewards * TOKENS[p.token]?.price || 0), 0);
  const avgApy = pools.reduce((sum, p) => sum + p.apy, 0) / pools.length;

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Стейкинг</h3>
          <p className="text-xs text-ink-light">Пассивный доход</p>
        </div>
        <Link
          to="/wallet-v1/staking"
          className="text-sm font-semibold text-stone hover:text-ink"
        >
          Все пулы →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-sand/30 rounded-xl">
          <div className="text-2xl font-bold text-stone">${totalStaked.toLocaleString()}</div>
          <div className="text-xs text-ink-light">Всего застейкано</div>
        </div>
        <div className="text-center p-4 bg-emerald-50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">+${totalRewards.toFixed(2)}</div>
          <div className="text-xs text-ink-light">Заработано</div>
        </div>
        <div className="text-center p-4 bg-violet-50 rounded-xl">
          <div className="text-2xl font-bold text-violet-600">{avgApy.toFixed(1)}%</div>
          <div className="text-xs text-ink-light">Средний APY</div>
        </div>
      </div>

      <div className="space-y-3">
        {pools.slice(0, 3).map((pool) => (
          <div key={pool.id} className="flex items-center justify-between p-3 bg-sand/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <TokenIcon token={pool.token} size="sm" />
              <div>
                <div className="font-medium text-stone">{pool.name}</div>
                <div className="text-xs text-ink-light">{pool.staked} {pool.token}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-600">{pool.apy}% APY</div>
              <div className="text-xs text-ink-light">+{pool.rewards} {pool.token}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * RewardsChart - График наград
 */
const RewardsChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">История наград</h3>
          <p className="text-xs text-ink-light">Стейкинг вознаграждения</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} name="UNITY" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center">
        <div className="text-sm text-ink-light">Всего получено</div>
        <div className="text-2xl font-bold text-emerald-600">
          {data.reduce((sum, i) => sum + i.amount, 0).toFixed(1)} UNITY
        </div>
      </div>
    </div>
  );
};

/**
 * ConvertModal - Модальное окно конвертации
 */
const ConvertModal = ({ isOpen, onClose, balances }) => {
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('UNITY');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const fromValue = parseFloat(amount) || 0;
  const fromPrice = TOKENS[fromToken]?.price || 1;
  const toPrice = TOKENS[toToken]?.price || 1;
  const toAmount = fromValue * fromPrice / toPrice;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neu-card p-6 w-full max-w-md animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone">Конвертация токенов</h3>
          <button onClick={onClose} className="text-2xl text-ink-light hover:text-stone">×</button>
        </div>

        {/* From */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-stone mb-2">Отдаёте</label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="neu-input flex-1 py-3 text-lg"
              placeholder="0.00"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="neu-button px-4 py-3 rounded-xl font-medium"
            >
              {Object.keys(TOKENS).map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-ink-light mt-1">
            Доступно: {balances[fromToken]?.balance?.toLocaleString() || 0} {fromToken}
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={() => {
              const temp = fromToken;
              setFromToken(toToken);
              setToToken(temp);
            }}
            className="neu-button p-2 rounded-full"
          >
            ⇅
          </button>
        </div>

        {/* To */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone mb-2">Получаете</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={toAmount.toFixed(6)}
              readOnly
              className="neu-input flex-1 py-3 text-lg bg-sand/50"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="neu-button px-4 py-3 rounded-xl font-medium"
            >
              {Object.keys(TOKENS).map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate info */}
        <div className="bg-sand/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-light">Курс обмена</span>
            <span className="font-medium text-stone">
              1 {fromToken} = {(fromPrice / toPrice).toFixed(6)} {toToken}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-ink-light">Комиссия сети</span>
            <span className="font-medium text-stone">$2.50</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 neu-button-secondary py-3 rounded-xl font-medium"
          >
            Отмена
          </button>
          <button
            className="flex-1 neu-button py-3 rounded-xl font-medium"
          >
            Конвертировать
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * DepositModal - Модальное окно депозита
 */
const DepositModal = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState('card');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neu-card p-6 w-full max-w-md animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone">Пополнение</h3>
          <button onClick={onClose} className="text-2xl text-ink-light hover:text-stone">×</button>
        </div>

        {/* Methods */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setMethod('card')}
            className={`p-4 rounded-xl text-center transition-all ${
              method === 'card' ? 'bg-stone text-bone' : 'bg-sand/50 hover:bg-sand'
            }`}
          >
            <div className="text-2xl mb-1">💳</div>
            <div className="text-xs font-medium">Карта</div>
          </button>
          <button
            onClick={() => setMethod('bank')}
            className={`p-4 rounded-xl text-center transition-all ${
              method === 'bank' ? 'bg-stone text-bone' : 'bg-sand/50 hover:bg-sand'
            }`}
          >
            <div className="text-2xl mb-1">🏦</div>
            <div className="text-xs font-medium">Банк</div>
          </button>
          <button
            onClick={() => setMethod('crypto')}
            className={`p-4 rounded-xl text-center transition-all ${
              method === 'crypto' ? 'bg-stone text-bone' : 'bg-sand/50 hover:bg-sand'
            }`}
          >
            <div className="text-2xl mb-1">₿</div>
            <div className="text-xs font-medium">Крипто</div>
          </button>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone mb-2">Сумма (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="neu-input py-4 text-2xl text-center"
            placeholder="$0.00"
          />
        </div>

        {/* Info */}
        <div className="bg-sand/30 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-light">Комиссия</span>
            <span className="font-medium text-stone">2.5%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-light">Время зачисления</span>
            <span className="font-medium text-stone">
              {method === 'card' ? 'Мгновенно' : method === 'bank' ? '1-3 дня' : '~10 мин'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 neu-button-secondary py-3 rounded-xl font-medium">
            Отмена
          </button>
          <button className="flex-1 neu-button py-3 rounded-xl font-medium">
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * WithdrawModal - Модальное окно вывода
 */
const WithdrawModal = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neu-card p-6 w-full max-w-md animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone">Вывод средств</h3>
          <button onClick={onClose} className="text-2xl text-ink-light hover:text-stone">×</button>
        </div>

        {/* Token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-stone mb-2">Токен</label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="neu-input py-3"
          >
            {Object.keys(TOKENS).map((t) => (
              <option key={t} value={t}>{TOKENS[t].name} ({t})</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-stone mb-2">Сумма</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="neu-input py-3"
            placeholder="0.00"
          />
          <div className="text-xs text-ink-light mt-1">
            Доступно: 0 {token}
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone mb-2">Адрес получателя</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="neu-input py-3 font-mono text-sm"
            placeholder="0x..."
          />
        </div>

        {/* Info */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-lg">⚠️</span>
            <div className="text-xs text-amber-800">
              <div className="font-semibold mb-1">Внимание!</div>
              Убедитесь, что адрес корректен. Транзакции в блокчейне необратимы.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 neu-button-secondary py-3 rounded-xl font-medium">
            Отмена
          </button>
          <button className="flex-1 neu-button py-3 rounded-xl font-medium">
            Вывести
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const WalletV1 = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // State
  const [balances, setBalances] = useState({
    USD: { balance: 2450.00, value: 2450.00, change: 0 },
    EUR: { balance: 850.00, value: 918.00, change: 0.5 },
    USDC: { balance: 3500.00, value: 3500.00, change: 0 },
    ETH: { balance: 0.75, value: 2137.50, change: 3.2 },
    UNITY: { balance: 12500, value: 5625.00, change: 12.5 },
    BTC: { balance: 0.02, value: 1250.00, change: -1.8 },
  });

  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stakingPools, setStakingPools] = useState([]);
  const [rewardsHistory, setRewardsHistory] = useState([]);

  useEffect(() => {
    setPortfolioHistory(generatePortfolioHistory());
    setTransactions(generateTransactionHistory());
    setStakingPools(generateStakingPools());
    setRewardsHistory(generateRewardsHistory());
  }, []);

  const totalBalance = useMemo(() => {
    return Object.values(balances).reduce((sum, b) => sum + b.value, 0);
  }, [balances]);

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: '📊' },
    { id: 'tokens', label: 'Токены', icon: '🪙' },
    { id: 'staking', label: 'Стейкинг', icon: '🔒' },
    { id: 'history', label: 'История', icon: '📜' },
  ];

  return (
    <div className="min-h-screen bg-bone pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone/10 to-sand/20 border-b border-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone mb-2">Кошелёк</h1>
              <p className="text-ink-light">Управление активами и стейкинг</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="neu-button px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                ↓ Пополнить
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                ↑ Вывести
              </button>
            </div>
          </div>

          {/* Total Balance */}
          <div className="neu-card p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-light mb-1">Общий баланс</p>
                <p className="text-4xl font-bold text-stone">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-emerald-600 mt-2">
                  ↑ +$1,245.50 (+8.5%) за неделю
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setIsConvertModalOpen(true)}
                  className="neu-button px-6 py-3 rounded-xl font-medium transition-all"
                >
                  ⇄ Конвертировать
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-stone text-bone shadow-md'
                    : 'bg-sand/50 text-stone hover:bg-sand'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PortfolioChart data={portfolioHistory} />
              <AllocationPieChart balances={balances} />
            </div>

            {/* Staking & Rewards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <StakingOverview pools={stakingPools} />
              <RewardsChart data={rewardsHistory} />
            </div>

            {/* Transactions */}
            <TransactionTable transactions={transactions} filter={transactionFilter} />
          </>
        )}

        {/* Tokens Tab */}
        {activeTab === 'tokens' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone">Ваши токены</h2>
              <button className="neu-button px-4 py-2 rounded-xl text-sm font-medium">
                + Добавить токен
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(balances).map(([token, data]) => (
                <BalanceCard
                  key={token}
                  token={token}
                  balance={data.balance}
                  value={data.value}
                  onChange={data.change}
                />
              ))}
            </div>
          </div>
        )}

        {/* Staking Tab */}
        {activeTab === 'staking' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone">Стейкинг пулы</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-ink-light">Сортировка:</span>
                <select className="neu-button px-3 py-2 rounded-xl text-sm">
                  <option>По APY</option>
                  <option>По сумме</option>
                  <option>По риску</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stakingPools.map((pool) => (
                <StakingCard
                  key={pool.id}
                  pool={pool}
                  onStake={() => console.log('Stake', pool)}
                  onUnstake={() => console.log('Unstake', pool)}
                />
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone">История транзакций</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                  className="neu-button px-3 py-2 rounded-xl text-sm"
                >
                  <option value="all">Все</option>
                  <option value="deposit">Депозиты</option>
                  <option value="withdraw">Выводы</option>
                  <option value="swap">Обмены</option>
                  <option value="stake">Стейкинг</option>
                  <option value="reward">Награды</option>
                </select>
                <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm">
                  Экспорт CSV
                </button>
              </div>
            </div>
            <TransactionTable transactions={transactions} filter={transactionFilter} />
          </div>
        )}
      </div>

      {/* Modals */}
      <ConvertModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        balances={balances}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />
    </div>
  );
};

export default WalletV1;
