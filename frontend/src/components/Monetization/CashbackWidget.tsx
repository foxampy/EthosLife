import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Gift,
  AlertCircle,
  ShoppingBag,
  Stethoscope,
  Users,
  ChevronRight
} from 'lucide-react';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuCard } from '../Neumorphism/NeuCard';

interface CashbackBalance {
  totalBalance: number;
  availableBalance: number;
  lifetimeEarned: number;
  lifetimeUsed: number;
  expiringSoonCount: number;
  expiringSoonAmount: number;
}

interface CashbackTransaction {
  id: string;
  amount: number;
  rate: number;
  sourceType: string;
  description: string;
  status: string;
  usedAmount: number;
  createdAt: string;
  expiresAt: string;
}

interface ExpiringCashback {
  id: string;
  amount: number;
  usedAmount: number;
  remaining: number;
  expiresAt: string;
  description: string;
  sourceType: string;
  daysUntilExpiry: number;
}

export const CashbackWidget: React.FC<{ 
  compact?: boolean;
  onApply?: (amount: number) => void;
  maxApplyAmount?: number;
}> = ({ compact = false, onApply, maxApplyAmount }) => {
  const [balance, setBalance] = useState<CashbackBalance | null>(null);
  const [expiring, setExpiring] = useState<ExpiringCashback[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<CashbackTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'balance' | 'history'>('balance');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyAmount, setApplyAmount] = useState(0);

  useEffect(() => {
    fetchCashbackData();
  }, []);

  const fetchCashbackData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [balanceRes, expiringRes, historyRes] = await Promise.all([
        fetch('/api/cashback/balance', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/cashback/expiring', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/cashback/history?limit=10', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const [balanceData, expiringData, historyData] = await Promise.all([
        balanceRes.json(),
        expiringRes.json(),
        historyRes.json()
      ]);

      if (balanceData.success) {
        setBalance(balanceData.balance);
      }
      if (expiringData.success) {
        setExpiring(expiringData.expiringCashback);
      }
      if (historyData.success) {
        setRecentTransactions(historyData.transactions);
      }
    } catch (error) {
      console.error('Error fetching cashback data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'shop_purchase':
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'consultation':
        return <Stethoscope className="w-4 h-4 text-green-600" />;
      case 'referral_subscription':
      case 'referral_purchase':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <Gift className="w-4 h-4 text-amber-600" />;
    }
  };

  const getSourceLabel = (sourceType: string) => {
    switch (sourceType) {
      case 'shop_purchase':
        return 'Shop Purchase';
      case 'consultation':
        return 'Consultation';
      case 'referral_subscription':
        return 'Referral Subscription';
      case 'referral_purchase':
        return 'Referral Purchase';
      default:
        return sourceType.replace(/_/g, ' ');
    }
  };

  const handleApplyCashback = () => {
    if (onApply && applyAmount > 0) {
      onApply(applyAmount);
      setShowApplyModal(false);
    }
  };

  if (isLoading) {
    return (
      <NeuCard className={`${compact ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-[#d4cfc5] rounded w-1/2" />
          <div className="h-16 bg-[#d4cfc5] rounded" />
        </div>
      </NeuCard>
    );
  }

  if (!balance) {
    return (
      <NeuCard className={`${compact ? 'p-4' : 'p-6'}`}>
        <div className="text-center py-4">
          <Wallet className="w-8 h-8 text-[#5c5243] mx-auto mb-2" />
          <p className="text-sm text-[#5c5243]">Unable to load cashback data</p>
        </div>
      </NeuCard>
    );
  }

  // Compact view for sidebar/widget
  if (compact) {
    return (
      <NeuCard className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-amber-100">
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#5c5243]">Cashback Balance</p>
            <p className="text-xl font-bold text-[#2d2418]">
              ${balance.availableBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {expiring.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              ${expiring[0].remaining.toFixed(2)} expires in {expiring[0].daysUntilExpiry} days
            </p>
          </div>
        )}

        {onApply && balance.availableBalance > 0 && (
          <NeuButton
            size="sm"
            className="w-full"
            onClick={() => {
              setApplyAmount(Math.min(balance.availableBalance, maxApplyAmount || balance.availableBalance));
              setShowApplyModal(true);
            }}
          >
            Apply to Order
            <ArrowRight className="w-3 h-3 ml-1" />
          </NeuButton>
        )}

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#e4dfd5] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-[#2d2418] mb-4">Apply Cashback</h3>
              <p className="text-sm text-[#5c5243] mb-4">
                Available: ${balance.availableBalance.toFixed(2)}
              </p>
              <input
                type="number"
                value={applyAmount}
                onChange={(e) => setApplyAmount(Math.min(
                  parseFloat(e.target.value) || 0,
                  balance.availableBalance,
                  maxApplyAmount || Infinity
                ))}
                className="w-full p-3 rounded-xl bg-[#f0ece3] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] mb-4"
                max={balance.availableBalance}
              />
              <div className="flex gap-2">
                <NeuButton variant="flat" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </NeuButton>
                <NeuButton onClick={handleApplyCashback} className="flex-1">
                  Apply ${applyAmount.toFixed(2)}
                </NeuButton>
              </div>
            </motion.div>
          </div>
        )}
      </NeuCard>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <NeuCard className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-100">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-[#5c5243]">Your Cashback Balance</span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-[#2d2418]">
              ${balance.availableBalance.toFixed(2)}
            </span>
            <span className="text-[#5c5243]">available</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-[#f0ece3]">
              <p className="text-xs text-[#5c5243] mb-1">Total</p>
              <p className="font-bold text-[#2d2418]">${balance.totalBalance.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[#f0ece3]">
              <p className="text-xs text-[#5c5243] mb-1">Earned</p>
              <p className="font-bold text-green-600">${balance.lifetimeEarned.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[#f0ece3]">
              <p className="text-xs text-[#5c5243] mb-1">Used</p>
              <p className="font-bold text-[#2d2418]">${balance.lifetimeUsed.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </NeuCard>

      {/* Expiring Soon Alert */}
      {expiring.length > 0 && (
        <NeuCard className="p-4 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 mb-1">Cashback Expiring Soon</h4>
              <p className="text-sm text-amber-700 mb-3">
                You have ${expiring.reduce((sum, e) => sum + e.remaining, 0).toFixed(2)} 
                expiring within the next 30 days.
              </p>
              <div className="space-y-2">
                {expiring.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50"
                  >
                    <span className="text-sm text-amber-800">{item.description}</span>
                    <span className="text-sm font-medium text-amber-900">
                      ${item.remaining.toFixed(2)} in {item.daysUntilExpiry}d
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </NeuCard>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]">
        <button
          onClick={() => setActiveTab('balance')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'balance'
              ? 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] text-[#2d2418]'
              : 'text-[#5c5243] hover:text-[#2d2418]'
          }`}
        >
          Balance
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'history'
              ? 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] text-[#2d2418]'
              : 'text-[#5c5243] hover:text-[#2d2418]'
          }`}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'balance' && (
          <motion.div
            key="balance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <NeuCard className="p-6">
              <h4 className="font-semibold text-[#2d2418] mb-4">How You Earn</h4>
              <div className="space-y-3">
                {[
                  { icon: ShoppingBag, label: 'Shop Purchases', rate: '5%', color: 'text-blue-600', bg: 'bg-blue-100' },
                  { icon: Stethoscope, label: 'Consultations', rate: '10%', color: 'text-green-600', bg: 'bg-green-100' },
                  { icon: Users, label: 'Referral Subscriptions', rate: '1%', color: 'text-purple-600', bg: 'bg-purple-100' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-[#f0ece3]">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.bg}`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-[#2d2418]">{item.label}</span>
                    </div>
                    <span className="font-bold text-[#2d2418]">{item.rate} cashback</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#5c5243] mt-4">
                * Cashback expires 12 months after being earned. Use it or lose it!
              </p>
            </NeuCard>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <NeuCard className="p-6">
              <h4 className="font-semibold text-[#2d2418] mb-4">Recent Transactions</h4>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#f0ece3]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100">
                          {getSourceIcon(tx.sourceType)}
                        </div>
                        <div>
                          <p className="font-medium text-[#2d2418]">
                            {getSourceLabel(tx.sourceType)}
                          </p>
                          <p className="text-xs text-[#5c5243]">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+${tx.amount.toFixed(2)}</p>
                        <p className="text-xs text-[#5c5243]">{tx.rate}% rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#5c5243]">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No transactions yet. Start earning cashback!</p>
                </div>
              )}
            </NeuCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CashbackWidget;
