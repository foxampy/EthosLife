import React, { useState } from 'react';
import { Clock, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { NeuCard } from '../Neumorphism/NeuCard';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuInput } from '../Neumorphism/NeuInput';
import { useStaking, StakeDuration } from '../../web3/hooks/useStaking';
import { useUnityToken } from '../../web3/hooks/useUnityToken';

interface StakingCardProps {
  duration: StakeDuration;
  apy: number;
}

export const StakingCard: React.FC<StakingCardProps> = ({ duration, apy }) => {
  const [amount, setAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const { tokenInfo } = useUnityToken();
  const { 
    stake, 
    approveStaking, 
    checkApproval, 
    calculateReward, 
    calculateTotalAtMaturity,
    isLoading,
    stakingConstants 
  } = useStaking();

  const durationText = duration === 6 ? '6 Months' : '12 Months';
  const durationSeconds = duration === 6 
    ? stakingConstants.DURATION_6_MONTHS 
    : stakingConstants.DURATION_12_MONTHS;

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Check if we need to approve
    const approved = await checkApproval(amount);
    if (!approved) {
      setIsApproving(true);
      const approvedNow = await approveStaking(amount);
      setIsApproving(false);
      if (!approvedNow) return;
    }

    await stake(amount, duration);
    setAmount('');
  };

  const expectedReward = calculateReward(amount, duration);
  const totalAtMaturity = calculateTotalAtMaturity(amount, duration);
  const hasEnoughBalance = tokenInfo && parseFloat(amount) <= parseFloat(tokenInfo.balance);
  const isValidAmount = amount && parseFloat(amount) >= 1000;

  return (
    <NeuCard className="w-full max-w-sm p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] mb-4">
          <TrendingUp className="w-8 h-8 text-[#5c5243]" />
        </div>
        <h3 className="text-3xl font-bold text-[#5c5243] mb-1">{apy}% APY</h3>
        <p className="text-[#8c7a6b] flex items-center justify-center gap-1">
          <Clock className="w-4 h-4" />
          {durationText} Lock
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-[#8c7a6b] mb-2 block">Amount to Stake</label>
          <NeuInput
            type="number"
            placeholder={`Min ${stakingConstants.MIN_STAKE} UNITY`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1000"
          />
        </div>

        {amount && parseFloat(amount) > 0 && (
          <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#8c7a6b]">Expected Reward:</span>
              <span className="font-medium text-[#5c5243]">{expectedReward} UNITY</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8c7a6b]">Total at Maturity:</span>
              <span className="font-bold text-[#5c5243]">{totalAtMaturity} UNITY</span>
            </div>
          </div>
        )}

        {!isValidAmount && amount && (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Minimum stake is {stakingConstants.MIN_STAKE} UNITY</span>
          </div>
        )}

        {isValidAmount && !hasEnoughBalance && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Insufficient balance</span>
          </div>
        )}
      </div>

      <NeuButton
        onClick={handleStake}
        disabled={!isValidAmount || !hasEnoughBalance || isLoading}
        className="w-full"
        size="lg"
      >
        {isApproving ? 'Approving...' : isLoading ? 'Staking...' : 'Stake Now'}
      </NeuButton>

      <div className="mt-4 text-center text-xs text-[#8c7a6b]">
        <p>Early withdrawal available with 50% penalty</p>
      </div>
    </NeuCard>
  );
};

export default StakingCard;
