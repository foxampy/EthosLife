import React, { useState } from 'react';
import { Clock, Coins, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { NeuCard } from '../Neumorphism/NeuCard';
import { NeuButton } from '../Neumorphism/NeuButton';
import { useStaking, StakeInfo } from '../../web3/hooks/useStaking';

interface ActiveStakesProps {
  stakes: StakeInfo[];
}

const StakeItem: React.FC<{ stake: StakeInfo }> = ({ stake }) => {
  const { withdraw, earlyWithdraw, formatTimeRemaining, isLoading } = useStaking();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showEarlyWithdraw, setShowEarlyWithdraw] = useState(false);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    await withdraw(stake.index);
    setIsWithdrawing(false);
  };

  const handleEarlyWithdraw = async () => {
    setIsWithdrawing(true);
    await earlyWithdraw(stake.index);
    setIsWithdrawing(false);
    setShowEarlyWithdraw(false);
  };

  const progressPercent = Math.min(
    100,
    ((stake.duration - stake.timeRemaining) / stake.duration) * 100
  );

  return (
    <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#5c5243]" />
            <span className="font-bold text-[#5c5243]">{stake.amount} UNITY</span>
          </div>
          <p className="text-sm text-[#8c7a6b] mt-1">{stake.apy}% APY</p>
        </div>
        <div className="text-right">
          {stake.canWithdraw ? (
            <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[#8c7a6b] text-sm">
              <Clock className="w-4 h-4" />
              {formatTimeRemaining(stake.timeRemaining)}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-[#d4cfc5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm mb-3">
        <span className="text-[#8c7a6b]">Current Reward:</span>
        <span className="font-medium text-[#5c5243]">+{stake.currentReward} UNITY</span>
      </div>

      {stake.canWithdraw ? (
        <NeuButton
          onClick={handleWithdraw}
          disabled={isWithdrawing}
          className="w-full"
          size="sm"
        >
          {isWithdrawing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Withdrawing...
            </>
          ) : (
            'Withdraw with Rewards'
          )}
        </NeuButton>
      ) : (
        <div className="space-y-2">
          {!showEarlyWithdraw ? (
            <NeuButton
              onClick={() => setShowEarlyWithdraw(true)}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              Early Withdraw
            </NeuButton>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Early withdrawal will result in a 50% penalty on earned rewards.
                </p>
              </div>
              <div className="flex gap-2">
                <NeuButton
                  onClick={handleEarlyWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1"
                  size="sm"
                >
                  {isWithdrawing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Confirm'
                  )}
                </NeuButton>
                <NeuButton
                  onClick={() => setShowEarlyWithdraw(false)}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </NeuButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ActiveStakes: React.FC<ActiveStakesProps> = ({ stakes }) => {
  if (stakes.length === 0) {
    return (
      <NeuCard className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] flex items-center justify-center">
          <Coins className="w-8 h-8 text-[#8c7a6b]" />
        </div>
        <h3 className="text-lg font-medium text-[#5c5243] mb-2">No Active Stakes</h3>
        <p className="text-sm text-[#8c7a6b]">
          Start staking to earn rewards on your UNITY tokens
        </p>
      </NeuCard>
    );
  }

  return (
    <NeuCard className="p-6">
      <h3 className="text-lg font-bold text-[#5c5243] mb-4 flex items-center gap-2">
        <Coins className="w-5 h-5" />
        Active Stakes ({stakes.length})
      </h3>
      <div className="space-y-4">
        {stakes.map((stake) => (
          <StakeItem key={stake.index} stake={stake} />
        ))}
      </div>
    </NeuCard>
  );
};

export default ActiveStakes;
