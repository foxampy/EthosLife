import { useState, useCallback, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { 
  STAKING_ABI, 
  CONTRACT_ADDRESSES, 
  UNITY_DECIMALS,
  STAKING_CONSTANTS 
} from '../config';
import { useWeb3, formatTokenAmount, parseTokenAmount } from './useWeb3';

export type StakeDuration = 6 | 12; // months

export type StakeInfo = {
  index: number;
  amount: string;
  startTime: number;
  duration: number;
  rewardRate: number;
  withdrawn: boolean;
  currentReward: string;
  timeRemaining: number;
  canWithdraw: boolean;
  apy: number;
};

export type StakingStats = {
  totalStaked: string;
  totalPendingRewards: string;
  totalValueLocked: string;
  activeStakes: number;
};

export function useStaking() {
  const { provider, signer, address, chainId, isConnected } = useWeb3();
  const [stakes, setStakes] = useState<StakeInfo[]>([]);
  const [stats, setStats] = useState<StakingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  // Get contract instance
  const getContract = useCallback((): Contract | null => {
    if (!provider || !chainId) return null;
    
    const contractAddress = CONTRACT_ADDRESSES[chainId]?.staking;
    if (!contractAddress || contractAddress === '0x...') return null;

    return new Contract(contractAddress, STAKING_ABI, signer || provider);
  }, [provider, signer, chainId]);

  // Get read-only contract
  const getReadContract = useCallback((): Contract | null => {
    if (!provider || !chainId) return null;
    
    const contractAddress = CONTRACT_ADDRESSES[chainId]?.staking;
    if (!contractAddress || contractAddress === '0x...') return null;

    return new Contract(contractAddress, STAKING_ABI, provider);
  }, [provider, chainId]);

  // Get Unity token contract for approvals
  const getTokenContract = useCallback((): Contract | null => {
    if (!provider || !chainId) return null;
    
    const tokenAddress = CONTRACT_ADDRESSES[chainId]?.unityToken;
    if (!tokenAddress || tokenAddress === '0x...') return null;

    const abi = [
      'function approve(address spender, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function balanceOf(address account) view returns (uint256)',
    ];

    return new Contract(tokenAddress, abi, signer || provider);
  }, [provider, signer, chainId]);

  // Fetch user's stakes
  const fetchStakes = useCallback(async () => {
    const contract = getReadContract();
    if (!contract || !address) return;

    try {
      const rawStakes = await contract.getUserStakes(address);
      
      const stakeInfos: StakeInfo[] = await Promise.all(
        rawStakes.map(async (stake: unknown, index: number) => {
          const s = stake as {
            amount: bigint;
            startTime: bigint;
            duration: bigint;
            rewardRate: bigint;
            withdrawn: boolean;
          };

          const info = await contract.getStakeInfo(address, index);
          
          return {
            index,
            amount: formatTokenAmount(s.amount, UNITY_DECIMALS),
            startTime: Number(s.startTime) * 1000,
            duration: Number(s.duration),
            rewardRate: Number(s.rewardRate),
            withdrawn: s.withdrawn,
            currentReward: formatTokenAmount(info.currentReward, UNITY_DECIMALS),
            timeRemaining: Number(info.timeRemaining),
            canWithdraw: info.canWithdraw,
            apy: Number(s.rewardRate) / 100, // Convert basis points to percentage
          };
        })
      );

      setStakes(stakeInfos.filter(s => !s.withdrawn));
    } catch (err) {
      console.error('Error fetching stakes:', err);
    }
  }, [getReadContract, address]);

  // Fetch staking stats
  const fetchStats = useCallback(async () => {
    const contract = getReadContract();
    if (!contract || !address) return;

    try {
      const [totalStaked, pendingRewards, tvl, userStakes] = await Promise.all([
        contract.totalStaked(address),
        contract.getTotalPendingRewards(address),
        contract.getTotalValueLocked(),
        contract.getUserStakes(address),
      ]);

      const activeStakes = (userStakes as unknown[]).filter(
        (s: unknown) => !(s as { withdrawn: boolean }).withdrawn
      ).length;

      setStats({
        totalStaked: formatTokenAmount(totalStaked, UNITY_DECIMALS),
        totalPendingRewards: formatTokenAmount(pendingRewards, UNITY_DECIMALS),
        totalValueLocked: formatTokenAmount(tvl, UNITY_DECIMALS),
        activeStakes,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [getReadContract, address]);

  // Check if staking contract is approved
  const checkApproval = useCallback(async (amount: string): Promise<boolean> => {
    const tokenContract = getTokenContract();
    const stakingAddress = chainId ? CONTRACT_ADDRESSES[chainId]?.staking : null;
    
    if (!tokenContract || !stakingAddress || !address) return false;

    try {
      const allowance = await tokenContract.allowance(address, stakingAddress);
      const parsedAmount = parseTokenAmount(amount, UNITY_DECIMALS);
      return allowance >= parsedAmount;
    } catch (err) {
      console.error('Error checking approval:', err);
      return false;
    }
  }, [getTokenContract, chainId, address]);

  // Approve staking contract
  const approveStaking = useCallback(async (amount: string): Promise<boolean> => {
    const tokenContract = getTokenContract();
    const stakingAddress = chainId ? CONTRACT_ADDRESSES[chainId]?.staking : null;
    
    if (!tokenContract || !stakingAddress) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmount = parseTokenAmount(amount, UNITY_DECIMALS);
      const tx = await tokenContract.approve(stakingAddress, parsedAmount);
      await tx.wait();

      setIsApproved(true);
      return true;
    } catch (err) {
      console.error('Approval error:', err);
      setError(err instanceof Error ? err.message : 'Approval failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getTokenContract, chainId]);

  // Stake tokens
  const stake = useCallback(async (amount: string, duration: StakeDuration): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    // Check approval first
    const approved = await checkApproval(amount);
    if (!approved) {
      const approvedNow = await approveStaking(amount);
      if (!approvedNow) return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmount = parseTokenAmount(amount, UNITY_DECIMALS);
      const durationInSeconds = duration === 6 
        ? STAKING_CONSTANTS.DURATION_6_MONTHS 
        : STAKING_CONSTANTS.DURATION_12_MONTHS;

      const tx = await contract.stake(parsedAmount, durationInSeconds);
      await tx.wait();

      // Refresh data
      await fetchStakes();
      await fetchStats();

      return true;
    } catch (err) {
      console.error('Stake error:', err);
      setError(err instanceof Error ? err.message : 'Staking failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, checkApproval, approveStaking, fetchStakes, fetchStats]);

  // Withdraw stake with rewards
  const withdraw = useCallback(async (stakeIndex: number): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tx = await contract.withdraw(stakeIndex);
      await tx.wait();

      // Refresh data
      await fetchStakes();
      await fetchStats();

      return true;
    } catch (err) {
      console.error('Withdraw error:', err);
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, fetchStakes, fetchStats]);

  // Early withdraw with penalty
  const earlyWithdraw = useCallback(async (stakeIndex: number): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tx = await contract.earlyWithdraw(stakeIndex);
      await tx.wait();

      // Refresh data
      await fetchStakes();
      await fetchStats();

      return true;
    } catch (err) {
      console.error('Early withdraw error:', err);
      setError(err instanceof Error ? err.message : 'Early withdrawal failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, fetchStakes, fetchStats]);

  // Calculate expected reward
  const calculateReward = useCallback((amount: string, duration: StakeDuration): string => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return '0';

    const apy = duration === 6 ? STAKING_CONSTANTS.APY_6_MONTHS : STAKING_CONSTANTS.APY_12_MONTHS;
    const reward = (parsedAmount * apy * (duration / 12)) / 100;
    
    return reward.toFixed(2);
  }, []);

  // Calculate total value at maturity
  const calculateTotalAtMaturity = useCallback((amount: string, duration: StakeDuration): string => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return '0';

    const reward = parseFloat(calculateReward(amount, duration));
    return (parsedAmount + reward).toFixed(2);
  }, [calculateReward]);

  // Format time remaining
  const formatTimeRemaining = useCallback((seconds: number): string => {
    if (seconds <= 0) return 'Matured';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (isConnected && chainId && CONTRACT_ADDRESSES[chainId]?.staking !== '0x...') {
      fetchStakes();
      fetchStats();
    }
  }, [isConnected, chainId, fetchStakes, fetchStats]);

  // Poll for updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      fetchStakes();
      fetchStats();
    }, 15000);

    return () => clearInterval(interval);
  }, [isConnected, fetchStakes, fetchStats]);

  return {
    stakes,
    stats,
    isLoading,
    error,
    isApproved,
    stake,
    withdraw,
    earlyWithdraw,
    approveStaking,
    checkApproval,
    calculateReward,
    calculateTotalAtMaturity,
    formatTimeRemaining,
    fetchStakes,
    fetchStats,
    stakingConstants: STAKING_CONSTANTS,
  };
}
