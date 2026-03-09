import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Gift,
  Zap
} from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism/NeuCard';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface CryptoWidgetProps {
  unityBalance: number;
  unityPrice: number;
  priceChange24h: number;
  stakedAmount: number;
  stakingAPY: number;
  pendingRewards: number;
  totalValue: number;
  transactions?: Array<{
    id: string;
    type: 'send' | 'receive' | 'stake' | 'unstake' | 'reward';
    amount: number;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
  }>;
  className?: string;
  onStakeClick?: () => void;
  onUnstakeClick?: () => void;
  onSendClick?: () => void;
  onReceiveClick?: () => void;
}

export const CryptoWidget: React.FC<CryptoWidgetProps> = ({
  unityBalance,
  unityPrice,
  priceChange24h,
  stakedAmount,
  stakingAPY,
  pendingRewards,
  totalValue,
  transactions = [],
  className,
  onStakeClick,
  onUnstakeClick,
  onSendClick,
  onReceiveClick,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins}м`;
    if (diffHours < 24) return `${diffHours}ч`;
    if (diffDays < 7) return `${diffDays}д`;
    return date.toLocaleDateString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-4 h-4" />;
      case 'receive': return <ArrowDownRight className="w-4 h-4" />;
      case 'stake': return <Lock className="w-4 h-4" />;
      case 'unstake': return <Unlock className="w-4 h-4" />;
      case 'reward': return <Gift className="w-4 h-4" />;
      default: return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'send': return 'text-red-500';
      case 'receive': return 'text-green-500';
      case 'stake': return 'text-blue-500';
      case 'unstake': return 'text-purple-500';
      case 'reward': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <NeuCard className={className}>
      <NeuCardHeader
        title="UNITY Токены"
        icon={<Coins className="w-5 h-5 text-[#5c5243]" />}
        action={
          <NeuButton variant="flat" size="sm">
            История
          </NeuButton>
        }
      />
      {/* Total Balance */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] text-white shadow-xl">
        <div className="text-sm opacity-80 mb-1">Общий баланс</div>
        <div className="text-4xl font-bold mb-2">{formatCurrency(totalValue)}</div>
        <div className="flex items-center gap-2 text-sm">
          <span>{formatNumber(unityBalance)} UNITY</span>
          <span className="opacity-60">•</span>
          <span className="flex items-center gap-1">
            {priceChange24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {priceChange24h >= 0 ? '+' : ''}{priceChange24h}%
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <NeuButton
          variant="elevated"
          size="sm"
          onClick={onSendClick}
          className="flex-col py-3 h-auto"
        >
          <ArrowUpRight className="w-5 h-5 mb-1 text-red-500" />
          <span className="text-xs">Отправить</span>
        </NeuButton>
        
        <NeuButton
          variant="elevated"
          size="sm"
          onClick={onReceiveClick}
          className="flex-col py-3 h-auto"
        >
          <ArrowDownRight className="w-5 h-5 mb-1 text-green-500" />
          <span className="text-xs">Получить</span>
        </NeuButton>
        
        <NeuButton
          variant="elevated"
          size="sm"
          onClick={onStakeClick}
          className="flex-col py-3 h-auto"
        >
          <Lock className="w-5 h-5 mb-1 text-blue-500" />
          <span className="text-xs">Стейкинг</span>
        </NeuButton>
        
        <NeuButton
          variant="elevated"
          size="sm"
          onClick={onUnstakeClick}
          className="flex-col py-3 h-auto"
        >
          <Zap className="w-5 h-5 mb-1 text-amber-500" />
          <span className="text-xs">Клейм</span>
        </NeuButton>
      </div>

      {/* Staking Info */}
      <div className="mb-6 p-4 rounded-2xl bg-[#d4ccb8]/50 shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-[#5c5243]">В стейкинге</span>
          </div>
          <span className="text-lg font-bold text-[#2d2418]">{formatNumber(stakedAmount)} UNITY</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-[#5c5243]">Награды</span>
          </div>
          <span className="text-lg font-bold text-green-600">+{formatNumber(pendingRewards)} UNITY</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-[#5c5243]">APY</span>
          </div>
          <span className="text-lg font-bold text-[#2d2418]">{stakingAPY}%</span>
        </div>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#5c5243]">Последние транзакции</span>
            <NeuButton variant="flat" size="xs">Все</NeuButton>
          </div>
          
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx, index) => (
              <motion.div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#dcd3c6]/50 hover:bg-[#d4ccb8] transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] flex items-center justify-center ${getTransactionColor(tx.type)}`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#2d2418] capitalize">{tx.type}</div>
                    <div className="text-xs text-[#5c5243]">{formatTimeAgo(tx.timestamp)}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${
                  tx.type === 'receive' || tx.type === 'reward' || tx.type === 'unstake' 
                    ? 'text-green-600' 
                    : 'text-red-500'
                }`}>
                  {tx.type === 'receive' || tx.type === 'reward' || tx.type === 'unstake' ? '+' : '-'}
                  {formatNumber(tx.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </NeuCard>
  );
};
