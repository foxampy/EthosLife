import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Copy, 
  Check, 
  Gift, 
  TrendingUp, 
  DollarSign,
  Share2,
  Wallet,
  ChevronRight,
  Crown
} from 'lucide-react';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuCard } from '../Neumorphism/NeuCard';

interface ReferralStats {
  code: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  levelBreakdown: { level: number; count: string }[];
  recentReferrals: {
    referred_id: string;
    full_name: string;
    email: string;
    created_at: string;
  }[];
  monthlyEarnings: { month: string; total: string }[];
}

interface CommissionStructure {
  [key: number]: number;
}

export const ReferralWidget: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [commissionStructure, setCommissionStructure] = useState<CommissionStructure>({});
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'earnings'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await fetch('/api/referral/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data);
        setCommissionStructure(data.commissionStructure || {});
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!stats) return;
    const referralUrl = `${window.location.origin}/signup?ref=${stats.code}`;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (!stats) return;
    const referralUrl = `${window.location.origin}/signup?ref=${stats.code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join EthosLife',
          text: 'Check out EthosLife - the future of personalized health optimization!',
          url: referralUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  if (isLoading) {
    return (
      <NeuCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#d4cfc5] rounded w-1/3" />
          <div className="h-24 bg-[#d4cfc5] rounded" />
          <div className="h-32 bg-[#d4cfc5] rounded" />
        </div>
      </NeuCard>
    );
  }

  if (!stats) {
    return (
      <NeuCard className="p-6">
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-[#5c5243] mx-auto mb-4" />
          <p className="text-[#5c5243]">Unable to load referral data</p>
          <NeuButton className="mt-4" onClick={fetchReferralStats}>Retry</NeuButton>
        </div>
      </NeuCard>
    );
  }

  const referralUrl = `${window.location.origin}/signup?ref=${stats.code}`;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Referrals', 
            value: stats.totalReferrals, 
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          { 
            label: 'Total Earned', 
            value: `$${stats.totalEarnings.toFixed(2)}`, 
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          { 
            label: 'Pending', 
            value: `$${stats.pendingEarnings.toFixed(2)}`, 
            icon: TrendingUp,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100'
          },
          { 
            label: 'Paid Out', 
            value: `$${stats.paidEarnings.toFixed(2)}`, 
            icon: Wallet,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          }
        ].map((stat, idx) => (
          <NeuCard key={idx} className="p-4" hover>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-[#5c5243] uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-[#2d2418]">{stat.value}</p>
              </div>
            </div>
          </NeuCard>
        ))}
      </div>

      {/* Referral Code Section */}
      <NeuCard className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-[#2d2418]">Your Referral Code</h3>
          </div>

          <p className="text-sm text-[#5c5243] mb-4">
            Share your code with friends and earn up to 10% commission on their purchases!
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f0ece3] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                <span className="text-lg font-mono font-bold text-[#2d2418] tracking-wider">
                  {stats.code}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <NeuButton
                variant="flat"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2 hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </NeuButton>
              <NeuButton
                onClick={shareReferral}
                className="flex-shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Share</span>
              </NeuButton>
            </div>
          </div>

          {/* Commission Structure */}
          <div className="mt-6 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="text-center">
                <div className={`p-2 rounded-lg ${
                  level === 1 ? 'bg-amber-100' : 'bg-[#f0ece3]'
                }`}>
                  <Crown className={`w-4 h-4 mx-auto ${
                    level === 1 ? 'text-amber-600' : 'text-[#5c5243]'
                  }`} />
                  <p className="text-xs font-bold text-[#2d2418] mt-1">L{level}</p>
                  <p className="text-xs text-[#5c5243]">
                    {((commissionStructure[level] || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </NeuCard>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'network', label: 'Network' },
          { id: 'earnings', label: 'Earnings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] text-[#2d2418]'
                : 'text-[#5c5243] hover:text-[#2d2418]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <NeuCard className="p-6">
              <h4 className="font-semibold text-[#2d2418] mb-4">Recent Referrals</h4>
              {stats.recentReferrals.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentReferrals.slice(0, 5).map((referral, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#f0ece3]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                          {referral.full_name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-[#2d2418]">{referral.full_name}</p>
                          <p className="text-xs text-[#5c5243]">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5c5243]" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#5c5243]">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No referrals yet. Share your code to start earning!</p>
                </div>
              )}
            </NeuCard>
          </motion.div>
        )}

        {activeTab === 'network' && (
          <motion.div
            key="network"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <NeuCard className="p-6">
              <h4 className="font-semibold text-[#2d2418] mb-4">Network Breakdown</h4>
              <div className="space-y-3">
                {stats.levelBreakdown.map((level) => (
                  <div
                    key={level.level}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f0ece3]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        level.level === 1 ? 'bg-amber-100 text-amber-700' :
                        level.level === 2 ? 'bg-blue-100 text-blue-700' :
                        level.level === 3 ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        L{level.level}
                      </div>
                      <span className="text-[#2d2418]">Level {level.level} Referrals</span>
                    </div>
                    <span className="font-bold text-[#2d2418]">{level.count}</span>
                  </div>
                ))}
                {stats.levelBreakdown.length === 0 && (
                  <p className="text-center text-[#5c5243] py-4">
                    No network data available yet
                  </p>
                )}
              </div>
            </NeuCard>
          </motion.div>
        )}

        {activeTab === 'earnings' && (
          <motion.div
            key="earnings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <NeuCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[#2d2418]">Monthly Earnings</h4>
                <NeuButton 
                  size="sm" 
                  onClick={() => setShowPayoutModal(true)}
                  disabled={stats.pendingEarnings < 25}
                >
                  Withdraw (${stats.pendingEarnings.toFixed(2)})
                </NeuButton>
              </div>
              
              {stats.monthlyEarnings.length > 0 ? (
                <div className="space-y-3">
                  {stats.monthlyEarnings.map((month, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#f0ece3]"
                    >
                      <span className="text-[#2d2418]">
                        {new Date(month.month).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="font-bold text-green-600">
                        +${parseFloat(month.total).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#5c5243] py-4">
                  No earnings yet. Keep sharing your code!
                </p>
              )}

              <p className="text-xs text-[#5c5243] mt-4">
                * Minimum withdrawal amount is $25. Your pending earnings will be processed monthly.
              </p>
            </NeuCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReferralWidget;
