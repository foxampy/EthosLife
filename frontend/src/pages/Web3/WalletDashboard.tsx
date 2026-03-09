import React from 'react';
import { Wallet, Coins, TrendingUp, Clock, ArrowUpRight, ArrowDownLeft, Gift } from 'lucide-react';
import { NeuCard } from '../../components/Neumorphism/NeuCard';
import { NeuButton } from '../../components/Neumorphism/NeuButton';
import { WalletConnectButton } from '../../components/Web3/WalletConnectButton';
import { useWeb3 } from '../../web3/hooks/useWeb3';
import { useUnityToken } from '../../web3/hooks/useUnityToken';
import { useStaking } from '../../web3/hooks/useStaking';
import { useTokenSale } from '../../web3/hooks/useTokenSale';
import { Link } from 'react-router-dom';

export const WalletDashboard: React.FC = () => {
  const { isConnected, address, balance } = useWeb3();
  const { tokenInfo, vestingInfo, releaseVestedTokens } = useUnityToken();
  const { stats: stakingStats } = useStaking();
  const { vestingProgress, claimTokens } = useTokenSale();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#e4dfd5] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#e4dfd5] shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)] flex items-center justify-center">
              <Wallet className="w-12 h-12 text-[#5c5243]" />
            </div>
            <h1 className="text-3xl font-bold text-[#5c5243] mb-4">Connect Your Wallet</h1>
            <p className="text-[#8c7a6b] mb-8 max-w-md mx-auto">
              Connect your wallet to view your UNITY balance, staking positions, and token vesting schedule
            </p>
            <WalletConnectButton size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e4dfd5] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#5c5243]">My Wallet</h1>
            <p className="text-[#8c7a6b]">{address}</p>
          </div>
          <WalletConnectButton />
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* UNITY Balance */}
          <NeuCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] flex items-center justify-center">
                <Coins className="w-6 h-6 text-[#5c5243]" />
              </div>
              <div>
                <p className="text-sm text-[#8c7a6b]">UNITY Balance</p>
                <p className="text-2xl font-bold text-[#5c5243]">
                  {tokenInfo ? parseFloat(tokenInfo.balance).toLocaleString() : '0'} UNITY
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/stake" className="flex-1">
                <NeuButton className="w-full" size="sm">
                  Stake
                </NeuButton>
              </Link>
              <NeuButton variant="secondary" className="flex-1" size="sm">
                Send
              </NeuButton>
            </div>
          </NeuCard>

          {/* Staking Stats */}
          <NeuCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#5c5243]" />
              </div>
              <div>
                <p className="text-sm text-[#8c7a6b]">Staked</p>
                <p className="text-2xl font-bold text-[#5c5243]">
                  {stakingStats ? parseFloat(stakingStats.totalStaked).toLocaleString() : '0'} UNITY
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8c7a6b]">Pending Rewards:</span>
              <span className="font-medium text-[#5c5243]">
                {stakingStats ? parseFloat(stakingStats.totalPendingRewards).toFixed(2) : '0'} UNITY
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[#8c7a6b]">Active Stakes:</span>
              <span className="font-medium text-[#5c5243]">
                {stakingStats?.activeStakes || 0}
              </span>
            </div>
          </NeuCard>

          {/* Vested Tokens */}
          <NeuCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#5c5243]" />
              </div>
              <div>
                <p className="text-sm text-[#8c7a6b]">Vested Tokens</p>
                <p className="text-2xl font-bold text-[#5c5243]">
                  {vestingProgress ? parseFloat(vestingProgress.claimable).toLocaleString() : '0'} UNITY
                </p>
              </div>
            </div>
            {vestingProgress && parseFloat(vestingProgress.claimable) > 0 && (
              <NeuButton 
                onClick={claimTokens}
                className="w-full"
                size="sm"
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim Tokens
              </NeuButton>
            )}
          </NeuCard>
        </div>

        {/* Token Vesting Schedule */}
        {vestingInfo && (
          <NeuCard className="p-6 mb-8">
            <h2 className="text-xl font-bold text-[#5c5243] mb-4">Team Vesting Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Total Allocation</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingInfo.totalAmount} UNITY</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Released</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingInfo.releasedAmount} UNITY</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Vested</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingInfo.vestedAmount} UNITY</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Releasable</p>
                <p className="text-xl font-bold text-green-600">{vestingInfo.releasableAmount} UNITY</p>
              </div>
            </div>
            
            {/* Vesting Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#8c7a6b]">Vesting Progress</span>
                <span className="text-[#5c5243]">
                  {((parseFloat(vestingInfo.vestedAmount) / parseFloat(vestingInfo.totalAmount)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#d4cfc5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] transition-all duration-500"
                  style={{ 
                    width: `${(parseFloat(vestingInfo.vestedAmount) / parseFloat(vestingInfo.totalAmount)) * 100}%` 
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-[#8c7a6b]">
              <span>Start: {new Date(vestingInfo.startTime).toLocaleDateString()}</span>
              <span>Cliff: {new Date(vestingInfo.cliffEnd).toLocaleDateString()}</span>
              <span>End: {new Date(vestingInfo.vestingEnd).toLocaleDateString()}</span>
            </div>

            {parseFloat(vestingInfo.releasableAmount) > 0 && (
              <div className="mt-4">
                <NeuButton onClick={releaseVestedTokens} className="w-full">
                  Release Vested Tokens
                </NeuButton>
              </div>
            )}
          </NeuCard>
        )}

        {/* Token Purchase Vesting */}
        {vestingProgress && parseFloat(vestingProgress.totalPurchased) > 0 && (
          <NeuCard className="p-6 mb-8">
            <h2 className="text-xl font-bold text-[#5c5243] mb-4">Token Sale Vesting</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Total Purchased</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingProgress.totalPurchased} UNITY</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Claimable</p>
                <p className="text-xl font-bold text-green-600">{vestingProgress.claimable} UNITY</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Claimed</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingProgress.claimed} UNITY</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b] mb-1">Progress</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingProgress.progressPercent.toFixed(1)}%</p>
              </div>
            </div>

            {/* Vesting Timeline */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#8c7a6b]">Vesting Progress</span>
                <span className="text-[#5c5243]">{vestingProgress.progressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#d4cfc5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] transition-all duration-500"
                  style={{ width: `${vestingProgress.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-[#8c7a6b]">
              <span>Purchase: {new Date(vestingProgress.vestingStart).toLocaleDateString()}</span>
              <span>Cliff: {new Date(vestingProgress.cliffEnd).toLocaleDateString()}</span>
              <span>Fully Vested: {new Date(vestingProgress.vestingEnd).toLocaleDateString()}</span>
            </div>
          </NeuCard>
        )}

        {/* Tokenomics */}
        <NeuCard className="p-6">
          <h2 className="text-xl font-bold text-[#5c5243] mb-6">UNITY Tokenomics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Total Supply</p>
              <p className="text-lg font-bold text-[#5c5243]">1,000,000,000</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Seed Sale (10%)</p>
              <p className="text-lg font-bold text-[#5c5243]">100M UNITY</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Private Sale (15%)</p>
              <p className="text-lg font-bold text-[#5c5243]">150M UNITY</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Public Sale (5%)</p>
              <p className="text-lg font-bold text-[#5c5243]">50M UNITY</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Team (15%)</p>
              <p className="text-lg font-bold text-[#5c5243]">150M UNITY</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Advisors (5%)</p>
              <p className="text-lg font-bold text-[#5c5243]">50M UNITY</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Ecosystem (30%)</p>
              <p className="text-lg font-bold text-[#5c5243]">300M UNITY</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <p className="text-xs text-[#8c7a6b] mb-1">Liquidity + Reserve (20%)</p>
              <p className="text-lg font-bold text-[#5c5243]">200M UNITY</p>
            </div>
          </div>
        </NeuCard>
      </div>
    </div>
  );
};

export default WalletDashboard;
