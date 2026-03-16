/**
 * WalletUnified - User Wallet & Token Page
 * EthosLife Account Management
 * 
 * Features:
 * - Large balance display with token name
 * - Action buttons (Add Funds, Withdraw, Transfer, History)
 * - Recent transactions list
 * - Rewards/achievements that earned tokens
 * - Token earning opportunities
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowLeftRight,
  History,
  TrendingUp,
  TrendingDown,
  Gift,
  Trophy,
  Zap,
  Star,
  ChevronRight,
  Copy,
  ExternalLink,
  Info,
  X,
  Check,
  ArrowDownLeft,
  ArrowUpLeft,
  RotateCcw,
  Target,
  Award,
  Flame,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ElCard, ElButton, ElInput } from '../../components/ElCore';

// ============================================
// TYPES
// ============================================
interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer_in' | 'transfer_out';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  icon?: React.ReactNode;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  tokens: number;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
  progress?: number;
  total?: number;
}

// ============================================
// MOCK DATA
// ============================================
const mockBalance = {
  amount: 2450.75,
  tokenName: 'VITAL',
  tokenSymbol: 'VTL',
  usdValue: 245.08,
  change24h: 12.5,
  changePositive: true,
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earn',
    amount: 50,
    description: 'Daily Streak Bonus',
    date: '2 hours ago',
    status: 'completed',
    icon: <Flame className="w-4 h-4 text-orange-500" />,
  },
  {
    id: '2',
    type: 'earn',
    amount: 150,
    description: 'Weekly Goal Achievement',
    date: 'Yesterday',
    status: 'completed',
    icon: <Trophy className="w-4 h-4 text-[var(--neon-amber)]" />,
  },
  {
    id: '3',
    type: 'spend',
    amount: 25,
    description: 'Premium Feature Unlock',
    date: '3 days ago',
    status: 'completed',
    icon: <Zap className="w-4 h-4 text-[var(--neon-cyan)]" />,
  },
  {
    id: '4',
    type: 'transfer_in',
    amount: 500,
    description: 'From @john_doe',
    date: '1 week ago',
    status: 'completed',
  },
  {
    id: '5',
    type: 'earn',
    amount: 75,
    description: 'Community Challenge Winner',
    date: '1 week ago',
    status: 'completed',
    icon: <Award className="w-4 h-4 text-[var(--neon-purple)]" />,
  },
  {
    id: '6',
    type: 'spend',
    amount: 100,
    description: 'Gift Card Purchase',
    date: '2 weeks ago',
    status: 'completed',
    icon: <Gift className="w-4 h-4 text-rose-500" />,
  },
];

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Daily Check-in',
    description: 'Log in daily to earn tokens',
    tokens: 10,
    icon: <Star className="w-5 h-5" />,
    color: 'from-amber-400 to-orange-500',
    completed: true,
  },
  {
    id: '2',
    title: 'Step Master',
    description: 'Walk 10,000 steps today',
    tokens: 50,
    icon: <Target className="w-5 h-5" />,
    color: 'from-emerald-400 to-teal-500',
    completed: false,
    progress: 7500,
    total: 10000,
  },
  {
    id: '3',
    title: 'Sleep Champion',
    description: 'Get 8 hours of sleep',
    tokens: 30,
    icon: <Zap className="w-5 h-5" />,
    color: 'from-purple-400 to-indigo-500',
    completed: false,
    progress: 6,
    total: 8,
  },
  {
    id: '4',
    title: 'Social Butterfly',
    description: 'Connect with 5 friends',
    tokens: 100,
    icon: <Award className="w-5 h-5" />,
    color: 'from-rose-400 to-pink-500',
    completed: false,
    progress: 3,
    total: 5,
  },
];

// ============================================
// COMPONENTS
// ============================================

const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
  const iconMap = {
    earn: <ArrowDownLeft className="w-4 h-4 text-[var(--neon-green)]" />,
    spend: <ArrowUpLeft className="w-4 h-4 text-[var(--neon-red)]" />,
    transfer_in: <ArrowDownLeft className="w-4 h-4 text-[var(--neon-cyan)]" />,
    transfer_out: <ArrowUpLeft className="w-4 h-4 text-[var(--neon-amber)]" />,
  };

  const bgMap = {
    earn: 'bg-[var(--neon-green)]/10',
    spend: 'bg-[var(--neon-red)]/10',
    transfer_in: 'bg-[var(--neon-cyan)]/10',
    transfer_out: 'bg-[var(--neon-amber)]/10',
  };

  return (
    <div className={`w-10 h-10 rounded-xl ${bgMap[type]} flex items-center justify-center`}>
      {iconMap[type]}
    </div>
  );
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isPositive = transaction.type === 'earn' || transaction.type === 'transfer_in';
  const amountPrefix = isPositive ? '+' : '-';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bone-200)] hover:bg-[var(--bone-300)] transition-colors"
    >
      {transaction.icon ? (
        <div className="w-10 h-10 rounded-xl bg-[var(--bone-300)] flex items-center justify-center">
          {transaction.icon}
        </div>
      ) : (
        <TransactionIcon type={transaction.type} />
      )}
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[var(--text-primary)] truncate">{transaction.description}</p>
        <p className="text-sm text-[var(--text-secondary)]">{transaction.date}</p>
      </div>
      
      <div className="text-right">
        <p className={`font-bold ${isPositive ? 'text-[var(--neon-green)]' : 'text-[var(--text-primary)]'}`}>
          {amountPrefix}{transaction.amount} {mockBalance.tokenSymbol}
        </p>
        <span className={`text-xs ${
          transaction.status === 'completed' ? 'text-[var(--neon-green)]' :
          transaction.status === 'pending' ? 'text-[var(--neon-amber)]' :
          'text-[var(--neon-red)]'
        }`}>
          {transaction.status}
        </span>
      </div>
    </motion.div>
  );
};

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}> = ({ icon, label, onClick, variant = 'secondary' }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
      variant === 'primary'
        ? 'bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] text-white shadow-lg'
        : 'bg-[var(--bone-300)] text-[var(--text-primary)] hover:bg-[var(--bone-400)]'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
      variant === 'primary' ? 'bg-white/20' : 'bg-[var(--bone-200)]'
    }`}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </motion.button>
);

const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className={`relative p-4 rounded-2xl ${
      reward.completed
        ? 'bg-gradient-to-br ' + reward.color
        : 'bg-[var(--bone-300)]'
    }`}
  >
    <div className={`${reward.completed ? 'text-white' : 'text-[var(--text-primary)]'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          reward.completed ? 'bg-white/20' : 'bg-[var(--bone-200)]'
        }`}>
          {reward.icon}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
          reward.completed
            ? 'bg-white/20 text-white'
            : 'bg-[var(--neon-amber)]/20 text-[var(--neon-amber)]'
        }`}>
          +{reward.tokens} VTL
        </div>
      </div>
      
      <h4 className="font-bold mb-1">{reward.title}</h4>
      <p className={`text-sm mb-3 ${reward.completed ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
        {reward.description}
      </p>
      
      {reward.completed ? (
        <div className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4" />
          <span className="text-sm">Completed</span>
        </div>
      ) : reward.progress !== undefined && reward.total !== undefined ? (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className={reward.completed ? 'text-white/80' : 'text-[var(--text-secondary)]'}>
              Progress
            </span>
            <span className="font-medium">
              {reward.progress.toLocaleString()} / {reward.total.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--bone-400)]/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(reward.progress / reward.total) * 100}%` }}
              className={`h-full rounded-full ${
                reward.completed ? 'bg-white' : 'bg-gradient-to-r ' + reward.color
              }`}
            />
          </div>
        </div>
      ) : null}
    </div>
  </motion.div>
);

const AddFundsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'crypto'>('card');

  if (!isOpen) return null;

  const presetAmounts = [50, 100, 250, 500];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <ElCard variant="glass" padding="lg" className="rounded-t-3xl sm:rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Add Funds</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--bone-300)] flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Amount (VTL)
                </label>
                <ElInput
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  fullWidth
                />
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="py-2 rounded-xl bg-[var(--bone-300)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bone-400)] transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10'
                        : 'border-transparent bg-[var(--bone-300)]'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-medium text-[var(--text-primary)]">Card</div>
                  </button>
                  <button
                    onClick={() => setSelectedMethod('crypto')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === 'crypto'
                        ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10'
                        : 'border-transparent bg-[var(--bone-300)]'
                    }`}
                  >
                    <div className="text-2xl mb-2">₿</div>
                    <div className="font-medium text-[var(--text-primary)]">Crypto</div>
                  </button>
                </div>
              </div>

              <ElButton variant="gradient" fullWidth disabled={!amount}>
                Continue
              </ElButton>
            </div>
          </ElCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TransferModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <ElCard variant="glass" padding="lg" className="rounded-t-3xl sm:rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Transfer</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--bone-300)] flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            <div className="space-y-4">
              <ElInput
                label="Recipient Username or Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="@username or 0x..."
                fullWidth
              />

              <ElInput
                label="Amount (VTL)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                fullWidth
              />

              <div className="p-4 rounded-2xl bg-[var(--bone-300)]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Available Balance</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {mockBalance.amount} {mockBalance.tokenSymbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Network Fee</span>
                  <span className="font-medium text-[var(--text-primary)]">0.5 VTL</span>
                </div>
              </div>

              <ElButton variant="gradient" fullWidth disabled={!recipient || !amount}>
                Send Tokens
              </ElButton>
            </div>
          </ElCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const WalletUnified: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'transactions' | 'rewards'>('transactions');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Wallet</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-[var(--bone-300)] shadow-neu flex items-center justify-center"
          >
            <Info className="w-5 h-5 text-[var(--text-secondary)]" />
          </motion.button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Balance Card */}
        <ElCard variant="elevated" glowColor="cyan" className="mb-6">
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-[var(--text-secondary)] font-medium">{mockBalance.tokenName}</span>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-2"
            >
              <span className="text-5xl font-bold text-[var(--text-primary)]">
                {mockBalance.amount.toLocaleString()}
              </span>
              <span className="text-2xl text-[var(--text-secondary)] ml-2">{mockBalance.tokenSymbol}</span>
            </motion.div>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-[var(--text-secondary)]">≈ ${mockBalance.usdValue.toFixed(2)} USD</span>
              <span className={`flex items-center gap-1 ${mockBalance.changePositive ? 'text-[var(--neon-green)]' : 'text-[var(--neon-red)]'}`}>
                {mockBalance.changePositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {mockBalance.changePositive ? '+' : ''}{mockBalance.change24h}%
              </span>
            </div>
          </div>

          {/* Token Info */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--bone-300)]/50">
            <span className="text-xs text-[var(--text-secondary)]">Token Address</span>
            <code className="text-xs text-[var(--text-primary)] font-mono">0x71C...9A2B</code>
            <button className="p-1 rounded hover:bg-[var(--bone-400)] transition-colors">
              <Copy className="w-3 h-3 text-[var(--text-secondary)]" />
            </button>
            <button className="p-1 rounded hover:bg-[var(--bone-400)] transition-colors">
              <ExternalLink className="w-3 h-3 text-[var(--text-secondary)]" />
            </button>
          </div>
        </ElCard>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <ActionButton
            icon={<Plus className="w-5 h-5" />}
            label="Add"
            onClick={() => setShowAddFunds(true)}
            variant="primary"
          />
          <ActionButton
            icon={<ArrowUpRight className="w-5 h-5" />}
            label="Withdraw"
            onClick={() => {}}
          />
          <ActionButton
            icon={<ArrowLeftRight className="w-5 h-5" />}
            label="Transfer"
            onClick={() => setShowTransfer(true)}
          />
          <ActionButton
            icon={<History className="w-5 h-5" />}
            label="History"
            onClick={() => setActiveTab('transactions')}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white'
                : 'bg-[var(--bone-300)] text-[var(--text-secondary)]'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeTab === 'rewards'
                ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white'
                : 'bg-[var(--bone-300)] text-[var(--text-secondary)]'
            }`}
          >
            Earn Rewards
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'transactions' ? (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--text-primary)]">Recent Transactions</h3>
                <button className="text-sm text-[var(--neon-cyan)] flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {mockTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Quick Stats */}
              <ElCard variant="inset">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[var(--neon-amber)]">1.2k</p>
                    <p className="text-xs text-[var(--text-secondary)]">Tokens Earned</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--neon-cyan)]">15</p>
                    <p className="text-xs text-[var(--text-secondary)]">Challenges Won</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--neon-green)]">42</p>
                    <p className="text-xs text-[var(--text-secondary)]">Day Streak</p>
                  </div>
                </div>
              </ElCard>

              {/* Daily Rewards */}
              <div>
                <h3 className="font-bold text-[var(--text-primary)] mb-3">Daily Opportunities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockRewards.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                </div>
              </div>

              {/* Referral Card */}
              <ElCard variant="elevated" className="bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-cyan)]/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-cyan)] flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--text-primary)]">Refer Friends</h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Earn 100 VTL for each friend who joins
                    </p>
                  </div>
                  <ElButton variant="gradient" size="sm">
                    Invite
                  </ElButton>
                </div>
              </ElCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AddFundsModal isOpen={showAddFunds} onClose={() => setShowAddFunds(false)} />
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} />
    </div>
  );
};

export default WalletUnified;
