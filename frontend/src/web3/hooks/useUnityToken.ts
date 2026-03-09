import { useState, useCallback, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { 
  UNITY_TOKEN_ABI, 
  CONTRACT_ADDRESSES, 
  UNITY_DECIMALS,
  SUPPORTED_CHAINS 
} from '../config';
import { useWeb3, formatTokenAmount, parseTokenAmount } from './useWeb3';

type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  balance: string;
};

type VestingInfo = {
  totalAmount: string;
  releasedAmount: string;
  vestedAmount: string;
  startTime: number;
  cliffEnd: number;
  vestingEnd: number;
  releasableAmount: string;
};

type Tokenomics = {
  totalSupply: string;
  seedSale: string;
  privateSale: string;
  publicSale: string;
  team: string;
  advisors: string;
  ecosystem: string;
  liquidity: string;
  reserve: string;
};

export function useUnityToken() {
  const { provider, signer, address, chainId, isConnected } = useWeb3();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [vestingInfo, setVestingInfo] = useState<VestingInfo | null>(null);
  const [tokenomics, setTokenomics] = useState<Tokenomics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get contract instance
  const getContract = useCallback((): Contract | null => {
    if (!provider || !chainId) return null;
    
    const contractAddress = CONTRACT_ADDRESSES[chainId]?.unityToken;
    if (!contractAddress || contractAddress === '0x...') return null;

    return new Contract(contractAddress, UNITY_TOKEN_ABI, signer || provider);
  }, [provider, signer, chainId]);

  // Get read-only contract
  const getReadContract = useCallback((): Contract | null => {
    if (!provider || !chainId) return null;
    
    const contractAddress = CONTRACT_ADDRESSES[chainId]?.unityToken;
    if (!contractAddress || contractAddress === '0x...') return null;

    return new Contract(contractAddress, UNITY_TOKEN_ABI, provider);
  }, [provider, chainId]);

  // Fetch token info
  const fetchTokenInfo = useCallback(async () => {
    const contract = getReadContract();
    if (!contract) return;

    try {
      setIsLoading(true);
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      let balance = '0';
      if (address) {
        const balanceRaw = await contract.balanceOf(address);
        balance = formatTokenAmount(balanceRaw, decimals);
      }

      setTokenInfo({
        name,
        symbol,
        decimals,
        totalSupply: formatTokenAmount(totalSupply, decimals),
        balance,
      });
    } catch (err) {
      console.error('Error fetching token info:', err);
      setError('Failed to fetch token info');
    } finally {
      setIsLoading(false);
    }
  }, [getReadContract, address]);

  // Fetch vesting info
  const fetchVestingInfo = useCallback(async () => {
    const contract = getReadContract();
    if (!contract || !address) return;

    try {
      const isConfigured = await contract.isVestingConfigured(address);
      
      if (!isConfigured) {
        setVestingInfo(null);
        return;
      }

      const [
        totalAmount,
        releasedAmount,
        vestedAmount,
        startTime,
        cliffEnd,
        vestingEnd,
      ] = await contract.getVestingInfo(address);

      const releasableAmount = await contract.getReleasableAmount(address);

      setVestingInfo({
        totalAmount: formatTokenAmount(totalAmount, UNITY_DECIMALS),
        releasedAmount: formatTokenAmount(releasedAmount, UNITY_DECIMALS),
        vestedAmount: formatTokenAmount(vestedAmount, UNITY_DECIMALS),
        startTime: Number(startTime) * 1000, // Convert to milliseconds
        cliffEnd: Number(cliffEnd) * 1000,
        vestingEnd: Number(vestingEnd) * 1000,
        releasableAmount: formatTokenAmount(releasableAmount, UNITY_DECIMALS),
      });
    } catch (err) {
      console.error('Error fetching vesting info:', err);
    }
  }, [getReadContract, address]);

  // Fetch tokenomics
  const fetchTokenomics = useCallback(async () => {
    const contract = getReadContract();
    if (!contract) return;

    try {
      const [
        totalSupply,
        seedSale,
        privateSale,
        publicSale,
        team,
        advisors,
        ecosystem,
        liquidity,
        reserve,
      ] = await Promise.all([
        contract.TOTAL_SUPPLY(),
        contract.SEED_SALE(),
        contract.PRIVATE_SALE(),
        contract.PUBLIC_SALE(),
        contract.TEAM(),
        contract.ADVISORS(),
        contract.ECOSYSTEM(),
        contract.LIQUIDITY(),
        contract.RESERVE(),
      ]);

      setTokenomics({
        totalSupply: formatTokenAmount(totalSupply, UNITY_DECIMALS),
        seedSale: formatTokenAmount(seedSale, UNITY_DECIMALS),
        privateSale: formatTokenAmount(privateSale, UNITY_DECIMALS),
        publicSale: formatTokenAmount(publicSale, UNITY_DECIMALS),
        team: formatTokenAmount(team, UNITY_DECIMALS),
        advisors: formatTokenAmount(advisors, UNITY_DECIMALS),
        ecosystem: formatTokenAmount(ecosystem, UNITY_DECIMALS),
        liquidity: formatTokenAmount(liquidity, UNITY_DECIMALS),
        reserve: formatTokenAmount(reserve, UNITY_DECIMALS),
      });
    } catch (err) {
      console.error('Error fetching tokenomics:', err);
    }
  }, [getReadContract]);

  // Transfer tokens
  const transfer = useCallback(async (to: string, amount: string): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmount = parseTokenAmount(amount, UNITY_DECIMALS);
      const tx = await contract.transfer(to, parsedAmount);
      await tx.wait();

      // Refresh balance
      await fetchTokenInfo();

      return true;
    } catch (err) {
      console.error('Transfer error:', err);
      setError(err instanceof Error ? err.message : 'Transfer failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, fetchTokenInfo]);

  // Approve spending
  const approve = useCallback(async (spender: string, amount: string): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmount = parseTokenAmount(amount, UNITY_DECIMALS);
      const tx = await contract.approve(spender, parsedAmount);
      await tx.wait();

      return true;
    } catch (err) {
      console.error('Approve error:', err);
      setError(err instanceof Error ? err.message : 'Approval failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract]);

  // Get allowance
  const getAllowance = useCallback(async (owner: string, spender: string): Promise<string> => {
    const contract = getReadContract();
    if (!contract) return '0';

    try {
      const allowance = await contract.allowance(owner, spender);
      return formatTokenAmount(allowance, UNITY_DECIMALS);
    } catch (err) {
      console.error('Allowance error:', err);
      return '0';
    }
  }, [getReadContract]);

  // Release vested tokens
  const releaseVestedTokens = useCallback(async (): Promise<boolean> => {
    const contract = getContract();
    if (!contract || !address) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tx = await contract.releaseVestedTokens(address);
      await tx.wait();

      // Refresh vesting info
      await fetchVestingInfo();
      await fetchTokenInfo();

      return true;
    } catch (err) {
      console.error('Release error:', err);
      setError(err instanceof Error ? err.message : 'Release failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, address, fetchVestingInfo, fetchTokenInfo]);

  // Burn tokens
  const burn = useCallback(async (amount: string): Promise<boolean> => {
    const contract = getContract();
    if (!contract) {
      setError('Contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmount = parseTokenAmount(amount, UNITY_DECIMALS);
      const tx = await contract.burn(parsedAmount);
      await tx.wait();

      // Refresh balance
      await fetchTokenInfo();

      return true;
    } catch (err) {
      console.error('Burn error:', err);
      setError(err instanceof Error ? err.message : 'Burn failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, fetchTokenInfo]);

  // Initial data fetch
  useEffect(() => {
    if (isConnected && chainId && CONTRACT_ADDRESSES[chainId]?.unityToken !== '0x...') {
      fetchTokenInfo();
      fetchTokenomics();
      if (address) {
        fetchVestingInfo();
      }
    }
  }, [isConnected, chainId, address, fetchTokenInfo, fetchVestingInfo, fetchTokenomics]);

  // Poll for updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      fetchTokenInfo();
      if (address) fetchVestingInfo();
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [isConnected, address, fetchTokenInfo, fetchVestingInfo]);

  return {
    tokenInfo,
    vestingInfo,
    tokenomics,
    isLoading,
    error,
    fetchTokenInfo,
    fetchVestingInfo,
    transfer,
    approve,
    getAllowance,
    releaseVestedTokens,
    burn,
  };
}
