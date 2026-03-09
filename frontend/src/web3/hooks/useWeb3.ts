import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_CHAINS, CONTRACT_ADDRESSES } from '../config';

// Type definitions
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (params: unknown) => void) => void;
  removeListener: (event: string, callback: (params: unknown) => void) => void;
  isMetaMask?: boolean;
};

type Web3State = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  balance: string | null;
};

const initialState: Web3State = {
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  balance: null,
};

// Check if window.ethereum is available
const getEthereum = (): EthereumProvider | null => {
  if (typeof window !== 'undefined' && (window as unknown as { ethereum?: EthereumProvider }).ethereum) {
    return (window as unknown as { ethereum: EthereumProvider }).ethereum;
  }
  return null;
};

export function useWeb3() {
  const [state, setState] = useState<Web3State>(initialState);

  // Get native balance
  const updateBalance = useCallback(async () => {
    if (!state.provider || !state.address) return;
    
    try {
      const balance = await state.provider.getBalance(state.address);
      setState(prev => ({ 
        ...prev, 
        balance: ethers.formatEther(balance)
      }));
    } catch (err) {
      console.error('Failed to get balance:', err);
    }
  }, [state.provider, state.address]);

  // Connect wallet
  const connect = useCallback(async () => {
    const ethereum = getEthereum();
    
    if (!ethereum) {
      setState(prev => ({ 
        ...prev, 
        error: 'No wallet found. Please install MetaMask.' 
      }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Request account access
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Get balance
      const balance = await provider.getBalance(address);

      setState({
        provider,
        signer,
        address,
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
        balance: ethers.formatEther(balance),
      });
    } catch (err) {
      console.error('Connection error:', err);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: err instanceof Error ? err.message : 'Failed to connect wallet',
      }));
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState(initialState);
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId: number) => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      // Chain not added to MetaMask
      if (typeof switchError === 'object' && switchError !== null && 'code' in switchError && switchError.code === 4902) {
        const chain = SUPPORTED_CHAINS[targetChainId];
        if (!chain) {
          throw new Error('Unsupported chain');
        }

        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: {
                name: chain.nativeCurrency,
                symbol: chain.nativeCurrency,
                decimals: 18,
              },
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: chain.blockExplorer ? [chain.blockExplorer] : undefined,
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }, []);

  // Sign message
  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (!state.signer) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    try {
      const signature = await state.signer.signMessage(message);
      return signature;
    } catch (err) {
      console.error('Signing error:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to sign message' 
      }));
      return null;
    }
  }, [state.signer]);

  // Check if contract addresses are configured for current chain
  const isContractsConfigured = useCallback((): boolean => {
    if (!state.chainId) return false;
    const addresses = CONTRACT_ADDRESSES[state.chainId];
    return addresses?.unityToken !== '0x...' && !!addresses?.unityToken;
  }, [state.chainId]);

  // Listen for account and chain changes
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountList = accounts as string[];
      if (accountList.length === 0) {
        // User disconnected
        disconnect();
      } else if (accountList[0] !== state.address) {
        // Account changed, reconnect
        connect();
      }
    };

    const handleChainChanged = () => {
      // Reload the page on chain change as recommended by MetaMask
      window.location.reload();
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [state.address, connect, disconnect]);

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      const ethereum = getEthereum();
      if (!ethereum) return;

      try {
        const accounts = await ethereum.request({ 
          method: 'eth_accounts' 
        }) as string[];
        
        if (accounts.length > 0) {
          connect();
        }
      } catch (err) {
        console.error('Auto-connect error:', err);
      }
    };

    checkConnection();
  }, [connect]);

  // Refresh balance periodically
  useEffect(() => {
    if (!state.isConnected) return;

    const interval = setInterval(updateBalance, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [state.isConnected, updateBalance]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    updateBalance,
    isContractsConfigured,
    supportedChains: SUPPORTED_CHAINS,
  };
}

// Utility to shorten address
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Utility to format ether
export function formatEther(wei: string | bigint): string {
  return ethers.formatEther(wei);
}

// Utility to parse ether
export function parseEther(ether: string): bigint {
  return ethers.parseEther(ether);
}

// Utility to format token amount with decimals
export function formatTokenAmount(amount: string | bigint, decimals: number): string {
  return ethers.formatUnits(amount, decimals);
}

// Utility to parse token amount with decimals
export function parseTokenAmount(amount: string, decimals: number): bigint {
  return ethers.parseUnits(amount, decimals);
}
