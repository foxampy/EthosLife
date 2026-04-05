/**
 * useTokenSale - Token Sale Hook
 * Manages SAFT token purchase operations
 */

import { useState, useEffect } from 'react';

export type SaleRound = 'seed' | 'private' | 'public';

export interface RoundInfo {
  price: number;
  allocation: string;
  sold: string;
  minPurchase: string;
  maxPurchase: string;
  active: boolean;
  remaining: string;
}

export interface Rounds {
  seed: RoundInfo;
  private: RoundInfo;
  public: RoundInfo;
}

export interface Purchase {
  round: SaleRound;
  amount: string;
  price: number;
  purchaseTime: Date;
  claimed: boolean;
}

export interface VestingProgress {
  totalPurchased: string;
  claimable: string;
  claimed: string;
  progressPercent: number;
  vestingStart: Date;
  cliffEnd: Date;
  vestingEnd: Date;
}

export interface TokenSaleState {
  isActive: boolean;
  currentPrice: number;
  minInvestment: number;
  maxInvestment: number;
  tokensSold: string;
  totalSupply: string;
  saleStartTime: Date;
  saleEndTime: Date;
  userAllocation: string;
  userPurchased: string;
}

export function useTokenSale(walletAddress: string | null = null) {
  const [state, setState] = useState<TokenSaleState>({
    isActive: true,
    currentPrice: 0.05, // $0.05 per token
    minInvestment: 5000, // $5,000
    maxInvestment: 500000, // $500,000
    tokensSold: '250000000', // 250M tokens sold
    totalSupply: '1000000000', // 1B total supply
    saleStartTime: new Date('2026-03-06T09:00:00Z'),
    saleEndTime: new Date('2026-03-10T01:00:00Z'),
    userAllocation: '0',
    userPurchased: '0',
  });

  const [isLoading, setIsLoading] = useState(false);

  const rounds: Rounds = {
    seed: {
      price: 0.03,
      allocation: '100000000',
      sold: '45000000',
      minPurchase: '5000',
      maxPurchase: '500000',
      active: true,
      remaining: '55000000',
    },
    private: {
      price: 0.04,
      allocation: '150000000',
      sold: '75000000',
      minPurchase: '10000',
      maxPurchase: '250000',
      active: true,
      remaining: '75000000',
    },
    public: {
      price: 0.05,
      allocation: '50000000',
      sold: '20000000',
      minPurchase: '1000',
      maxPurchase: '50000',
      active: false,
      remaining: '30000000',
    },
  };

  const purchases: Purchase[] = [
    {
      round: 'seed',
      amount: '10000',
      price: 0.03,
      purchaseTime: new Date('2026-03-07T10:00:00Z'),
      claimed: false,
    },
  ];

  const vestingProgress: VestingProgress = {
    totalPurchased: '10000',
    claimable: '0',
    claimed: '0',
    progressPercent: 25,
    vestingStart: new Date('2026-03-07T10:00:00Z'),
    cliffEnd: new Date('2026-09-07T10:00:00Z'),
    vestingEnd: new Date('2027-03-07T10:00:00Z'),
  };

  useEffect(() => {
    // Check if sale is active
    const now = new Date();
    const isActive = now >= state.saleStartTime && now <= state.saleEndTime;

    setState(prev => ({ ...prev, isActive }));

    if (walletAddress) {
      // TODO: Fetch user's purchase data from blockchain
      const fetchUserData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setState(prev => ({
            ...prev,
            userPurchased: '10000',
          }));
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };

      fetchUserData();
    }
  }, [walletAddress, state.saleStartTime, state.saleEndTime]);

  const calculateTokens = (amount: number): number => {
    return Math.floor(amount / state.currentPrice);
  };

  const calculateCost = async (_round: SaleRound, amount: string): Promise<string> => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return '0';
    const price = rounds[_round]?.price || state.currentPrice;
    return (amt * price).toString();
  };

  const purchase = async (amount: number) => {
    // TODO: Implement actual token purchase
    try {
      if (amount < state.minInvestment) {
        return {
          success: false,
          error: `Minimum investment is $${state.minInvestment.toLocaleString()}`,
        };
      }

      if (amount > state.maxInvestment) {
        return {
          success: false,
          error: `Maximum investment is $${state.maxInvestment.toLocaleString()}`,
        };
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      const tokens = calculateTokens(amount);

      setState(prev => ({
        ...prev,
        userPurchased: (parseFloat(prev.userPurchased) + tokens).toString(),
        tokensSold: (parseFloat(prev.tokensSold) + tokens).toString(),
      }));

      return {
        success: true,
        tokens,
        price: state.currentPrice,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Purchase failed',
      };
    }
  };

  const buyTokens = async (_round: SaleRound, amount: string, _paymentToken: 'usdc' | 'usdt') => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Buy failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const claimTokens = async () => {
    // TODO: Implement actual token claiming
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Claim failed' };
    }
  };

  return {
    ...state,
    rounds,
    purchases,
    vestingProgress,
    calculateTokens,
    calculateCost,
    purchase,
    buyTokens,
    claimTokens,
    isLoading,
  };
}

export default useTokenSale;
