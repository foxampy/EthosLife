import React from 'react';
import { TrendingUp, Info, Shield, Clock } from 'lucide-react';
import { NeuCard } from '../../components/Neumorphism/NeuCard';
import { StakingCard, ActiveStakes } from '../../components/Web3';
import { useStaking } from '../../web3/hooks/useStaking';
import { useWeb3 } from '../../web3/hooks/useWeb3';
import { WalletConnectButton } from '../../components/Web3/WalletConnectButton';

export const StakingPage: React.FC = () => {
  const { isConnected } = useWeb3();
  const { stakes, stats, stakingConstants } = useStaking();

  return (
    <div className="min-h-screen bg-[#e4dfd5] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#5c5243]">UNITY Staking</h1>
            <p className="text-[#8c7a6b]">Stake your tokens and earn rewards</p>
          </div>
          <WalletConnectButton />
        </div>

        {!isConnected ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#e4dfd5] shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)] flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-[#5c5243]" />
            </div>
            <h2 className="text-2xl font-bold text-[#5c5243] mb-4">Connect Your Wallet</h2>
            <p className="text-[#8c7a6b] mb-8 max-w-md mx-auto">
              Connect your wallet to stake UNITY tokens and start earning rewards
            </p>
            <WalletConnectButton size="lg" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <NeuCard className="p-4">
                  <p className="text-sm text-[#8c7a6b] mb-1">Total Value Locked</p>
                  <p className="text-xl font-bold text-[#5c5243]">
                    {parseFloat(stats.totalValueLocked).toLocaleString()} UNITY
                  </p>
                </NeuCard>
                <NeuCard className="p-4">
                  <p className="text-sm text-[#8c7a6b] mb-1">Your Staked</p>
                  <p className="text-xl font-bold text-[#5c5243]">
                    {parseFloat(stats.totalStaked).toLocaleString()} UNITY
                  </p>
                </NeuCard>
                <NeuCard className="p-4">
                  <p className="text-sm text-[#8c7a6b] mb-1">Pending Rewards</p>
                  <p className="text-xl font-bold text-green-600">
                    {parseFloat(stats.totalPendingRewards).toFixed(2)} UNITY
                  </p>
                </NeuCard>
                <NeuCard className="p-4">
                  <p className="text-sm text-[#8c7a6b] mb-1">Active Stakes</p>
                  <p className="text-xl font-bold text-[#5c5243]">{stats.activeStakes}</p>
                </NeuCard>
              </div>
            )}

            {/* Staking Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#5c5243] mb-4">Choose Your Stake</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <StakingCard duration={6} apy={stakingConstants.APY_6_MONTHS} />
                  <StakingCard duration={12} apy={stakingConstants.APY_12_MONTHS} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#5c5243] mb-4">Your Active Stakes</h2>
                <ActiveStakes stakes={stakes} />
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NeuCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#5c5243]" />
                  </div>
                  <h3 className="font-bold text-[#5c5243]">Secure Staking</h3>
                </div>
                <p className="text-sm text-[#8c7a6b]">
                  Your tokens are securely locked in audited smart contracts. 
                  No one can access your staked funds until the lock period ends.
                </p>
              </NeuCard>

              <NeuCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#5c5243]" />
                  </div>
                  <h3 className="font-bold text-[#5c5243]">Guaranteed APY</h3>
                </div>
                <p className="text-sm text-[#8c7a6b]">
                  Earn guaranteed returns with fixed APY rates. 
                  Longer staking periods offer higher rewards up to 35% APY.
                </p>
              </NeuCard>

              <NeuCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#5c5243]" />
                  </div>
                  <h3 className="font-bold text-[#5c5243]">Flexible Exit</h3>
                </div>
                <p className="text-sm text-[#8c7a6b]">
                  Need your funds early? You can withdraw anytime with a 50% 
                  penalty on earned rewards. Principal is always protected.
                </p>
              </NeuCard>
            </div>

            {/* How It Works */}
            <NeuCard className="p-6 mt-8">
              <h3 className="text-lg font-bold text-[#5c5243] mb-4">How Staking Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#5c5243] text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-medium text-[#5c5243] mb-1">Connect Wallet</h4>
                  <p className="text-xs text-[#8c7a6b]">Link your Web3 wallet</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#5c5243] text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-medium text-[#5c5243] mb-1">Choose Duration</h4>
                  <p className="text-xs text-[#8c7a6b]">6 months (25%) or 12 months (35%)</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#5c5243] text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-medium text-[#5c5243] mb-1">Stake Tokens</h4>
                  <p className="text-xs text-[#8c7a6b]">Minimum 1000 UNITY required</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#5c5243] text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <h4 className="font-medium text-[#5c5243] mb-1">Earn Rewards</h4>
                  <p className="text-xs text-[#8c7a6b]">Claim principal + rewards at maturity</p>
                </div>
              </div>
            </NeuCard>
          </>
        )}
      </div>
    </div>
  );
};

export default StakingPage;
