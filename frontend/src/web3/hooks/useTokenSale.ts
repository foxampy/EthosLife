import { useState, useCallback, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { 
  TOKEN_SALE_ABI, 
  CONTRACT_ADDRESSES, 
  UNITY_DECIMALS,
  USDC_DECIMALS,
  USDT_DECIMALS,
  SALE_CONSTANTS,
  ERC20_ABI,
  USDC_ADDRESSES,
  USDT_ADDRESSES,
} from '../config';
import { useWeb3, formatTokenAmount, parseTokenAmount } from './useWeb3';

export type SaleRound = 'seed' | 'private' | 'public';

export type RoundInfo = {
  price: number;
  allocation: string;
  sold: string;
  minPurchase: string;
  maxPurchase: string;
  active: boolean;
  remaining: string;
};

export type Purchase = {
  amount: string;
  price: number;
  purchaseTime: number;
  round: SaleRound;
  claimed: boolean;
};

export type VestingProgress = {
  totalPurchased: string;
  claimable: string;
  claimed: string;
  vestingStart: number;
  cliffEnd: number;
  vestingEnd: number;
  progressPercent: number;
};

export function useTokenSale() {
  const { provider, signer, address, chainId, isConnected } = useWeb3();
  const [rounds, setRounds] = useState<Record<SaleRound, RoundInfo> | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [vestingProgress, setVestingProgress] = useState<VestingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get contract instance
  const getContract = useCallback((): Contract | null => {
    if (!provider || !chainId) return null;
    
    const contractAddress = CONTRACT_ADDRESSES[chainId]?.tokenSale;
    if (!contractAddress || contractAddress === '0x...') return null;

    return new Contract(contractAddress, TOKEN_SALE_ABI, signer || provider);
  }, [provider, signer, chainId]);

  // Get read-only contract
  const getReadContract = useCallback((): Contract | null => {
    if (!provider || !chainId) return null;
    
    const contractAddress = CONTRACT_ADDRESSES[chainId]?.tokenSale;
    if (!contractAddress || contractAddress === '0x...') return null;

    return new Contract(contractAddress, TOKEN_SALE_ABI, provider);
  }, [provider, chainId]);

  // Get stablecoin contracts
  const getStablecoinContracts = useCallback(() => {
    if (!provider || !chainId) return null;

    const usdcAddress = USDC_ADDRESSES[chainId];
    const usdtAddress = USDT_ADDRESSES[chainId];

    if (!usdcAddress || !usdtAddress) return null;

    return {
      usdc: new Contract(usdcAddress, ERC20_ABI, signer || provider),
      usdt: new Contract(usdtAddress, ERC20_ABI, signer || provider),
    };
  }, [provider, signer, chainId]);

  // Fetch round info
  const fetchRounds = useCallback(async () => {
    const contract = getReadContract();
    if (!contract) return;

    try {
      const [seedRound, privateRound, publicRound] = await Promise.all([
        contract.rounds(1), // Seed = 1
        contract.rounds(2), // Private = 2
        contract.rounds(3), // Public = 3
      ]);

      const formatRound = (r: {
        price: bigint;
        allocation: bigint;
        sold: bigint;
        minPurchase: bigint;
        maxPurchase: bigint;
        active: boolean;
      }): RoundInfo => ({
        price: Number(r.price) / 100, // Convert cents to dollars
        allocation: formatTokenAmount(r.allocation, UNITY_DECIMALS),
        sold: formatTokenAmount(r.sold, UNITY_DECIMALS),
        minPurchase: formatTokenAmount(r.minPurchase, UNITY_DECIMALS),
        maxPurchase: formatTokenAmount(r.maxPurchase, UNITY_DECIMALS),
        active: r.active,
        remaining: formatTokenAmount(r.allocation - r.sold, UNITY_DECIMALS),
      });

      setRounds({
        seed: formatRound(seedRound),
        private: formatRound(privateRound),
        public: formatRound(publicRound),
      });
    } catch (err) {
      console.error('Error fetching rounds:', err);
    }
  }, [getReadContract]);

  // Fetch user purchases
  const fetchPurchases = useCallback(async () => {
    const contract = getReadContract();
    if (!contract || !address) return;

    try {
      const rawPurchases = await contract.getUserPurchases(address);
      
      const formattedPurchases: Purchase[] = rawPurchases.map((p: {
        amount: bigint;
        price: bigint;
        purchaseTime: bigint;
        round: number;
        claimed: boolean;
      }) => {
        const roundMap: Record<number, SaleRound> = { 1: 'seed', 2: 'private', 3: 'public' };
        
        return {
          amount: formatTokenAmount(p.amount, UNITY_DECIMALS),
          price: Number(p.price) / 100,
          purchaseTime: Number(p.purchaseTime) * 1000,
          round: roundMap[p.round] || 'seed',
          claimed: p.claimed,
        };
      });

      setPurchases(formattedPurchases);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  }, [getReadContract, address]);

  // Fetch vesting progress
  const fetchVestingProgress = useCallback(async () => {
    const contract = getReadContract();
    if (!contract || !address) return;

    try {
      const [totalPurchased, claimable] = await Promise.all([
        contract.totalPurchased(address),
        contract.calculateClaimable(address),
      ]);

      const rawPurchases = await contract.getUserPurchases(address);
      
      if (rawPurchases.length === 0) {
        setVestingProgress(null);
        return;
      }

      // Calculate totals
      const totalPurchasedNum = Number(formatTokenAmount(totalPurchased, UNITY_DECIMALS));
      const claimableNum = Number(formatTokenAmount(claimable, UNITY_DECIMALS));
      const claimedNum = totalPurchasedNum - claimableNum;

      // Calculate vesting timeline based on earliest purchase
      const earliestPurchase = rawPurchases.reduce((min: { purchaseTime: bigint }, p: { purchaseTime: bigint }) => 
        p.purchaseTime < min.purchaseTime ? p : min
      );

      const vestingStart = Number(earliestPurchase.purchaseTime) * 1000;
      const cliffEnd = vestingStart + (SALE_CONSTANTS.VESTING_CLIFF_DAYS * 24 * 60 * 60 * 1000);
      const vestingEnd = vestingStart + (SALE_CONSTANTS.VESTING_DURATION_DAYS * 24 * 60 * 60 * 1000);

      // Calculate progress percentage
      const now = Date.now();
      let progressPercent = 0;
      
      if (now >= vestingEnd) {
        progressPercent = 100;
      } else if (now <= cliffEnd) {
        progressPercent = 0;
      } else {
        progressPercent = ((now - cliffEnd) / (vestingEnd - cliffEnd)) * 100;
      }

      setVestingProgress({
        totalPurchased: totalPurchasedNum.toFixed(2),
        claimable: claimableNum.toFixed(2),
        claimed: claimedNum.toFixed(2),
        vestingStart,
        cliffEnd,
        vestingEnd,
        progressPercent: Math.min(Math.max(progressPercent, 0), 100),
      });
    } catch (err) {
      console.error('Error fetching vesting progress:', err);
    }
  }, [getReadContract, address]);

  // Calculate purchase cost
  const calculateCost = useCallback(async (round: SaleRound, unityAmount: string): Promise<string> => {
    const contract = getReadContract();
    if (!contract) return '0';

    try {
      const roundMap: Record<SaleRound, number> = { seed: 1, private: 2, public: 3 };
      const parsedAmount = parseTokenAmount(unityAmount, UNITY_DECIMALS);
      
      const cost = await contract.calculateCost(roundMap[round], parsedAmount);
      return formatTokenAmount(cost, USDC_DECIMALS);
    } catch (err) {
      console.error('Error calculating cost:', err);
      return '0';
    }
  }, [getReadContract]);

  // Approve stablecoin spending
  const approveStablecoin = useCallback(async (token: 'usdc' | 'usdt', amount: string): Promise<boolean> => {
    const stablecoins = getStablecoinContracts();
    const contract = getContract();
    
    if (!stablecoins || !contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenContract = token === 'usdc' ? stablecoins.usdc : stablecoins.usdt;
      const parsedAmount = parseTokenAmount(amount, USDC_DECIMALS);
      
      const tx = await tokenContract.approve(contract.target, parsedAmount);
      await tx.wait();

      return true;
    } catch (err) {
      console.error('Approval error:', err);
      setError(err instanceof Error ? err.message : 'Approval failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getStablecoinContracts, getContract]);

  // Buy tokens
  const buyTokens = useCallback(async (
    round: SaleRound, 
    unityAmount: string, 
    paymentToken: 'usdc' | 'usdt'
  ): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Calculate and approve cost first
      const cost = await calculateCost(round, unityAmount);
      const approved = await approveStablecoin(paymentToken, cost);
      if (!approved) return false;

      // Execute purchase
      const roundMap: Record<SaleRound, number> = { seed: 1, private: 2, public: 3 };
      const parsedAmount = parseTokenAmount(unityAmount, UNITY_DECIMALS);

      const tx = paymentToken === 'usdc' 
        ? await contract.buyWithUSDC(roundMap[round], parsedAmount)
        : await contract.buyWithUSDT(roundMap[round], parsedAmount);

      await tx.wait();

      // Refresh data
      await fetchRounds();
      await fetchPurchases();
      await fetchVestingProgress();

      return true;
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err instanceof Error ? err.message : 'Purchase failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, calculateCost, approveStablecoin, fetchRounds, fetchPurchases, fetchVestingProgress]);

  // Claim vested tokens
  const claimTokens = useCallback(async (): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tx = await contract.claimTokens();
      await tx.wait();

      // Refresh data
      await fetchPurchases();
      await fetchVestingProgress();

      return true;
    } catch (err) {
      console.error('Claim error:', err);
      setError(err instanceof Error ? err.message : 'Claim failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, fetchPurchases, fetchVestingProgress]);

  // Get token price for round
  const getTokenPrice = useCallback((round: SaleRound): number => {
    const prices: Record<SaleRound, number> = {
      seed: SALE_CONSTANTS.SEED_PRICE,
      private: SALE_CONSTANTS.PRIVATE_PRICE,
      public: SALE_CONSTANTS.PUBLIC_PRICE,
    };
    return prices[round];
  }, []);

  // Format vesting date
  const formatVestingDate = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (isConnected && chainId && CONTRACT_ADDRESSES[chainId]?.tokenSale !== '0x...') {
      fetchRounds();
      if (address) {
        fetchPurchases();
        fetchVestingProgress();
      }
    }
  }, [isConnected, chainId, address, fetchRounds, fetchPurchases, fetchVestingProgress]);

  return {
    rounds,
    purchases,
    vestingProgress,
    isLoading,
    error,
    buyTokens,
    claimTokens,
    calculateCost,
    getTokenPrice,
    formatVestingDate,
    fetchRounds,
    fetchPurchases,
    saleConstants: SALE_CONSTANTS,
  };
}
