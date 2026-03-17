/**
 * useWeb3 - Web3 Connection Hook
 * Manages wallet connection and state
 */

import { useState, useEffect } from 'react';

export interface Web3State {
  isConnected: boolean;
  address: string | null;
  balance: string;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    address: null,
    balance: '0',
    chainId: null,
    isConnecting: false,
    error: null,
  });

  useEffect(() => {
    // Check for existing connection
    const savedConnection = localStorage.getItem('wallet_connected');
    const savedAddress = localStorage.getItem('wallet_address');
    const savedBalance = localStorage.getItem('wallet_balance');

    if (savedConnection === 'true' && savedAddress) {
      setState(prev => ({
        ...prev,
        isConnected: true,
        address: savedAddress,
        balance: savedBalance || '0',
      }));
    }
  }, []);

  const connect = async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // TODO: Implement actual MetaMask/WalletConnect connection
      // For now, using mock data for development
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate connection delay

      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      const mockBalance = '1000';
      const mockChainId = 1; // Ethereum Mainnet

      setState({
        isConnected: true,
        address: mockAddress,
        balance: mockBalance,
        chainId: mockChainId,
        isConnecting: false,
        error: null,
      });

      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', mockAddress);
      localStorage.setItem('wallet_balance', mockBalance);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const disconnect = () => {
    setState({
      isConnected: false,
      address: null,
      balance: '0',
      chainId: null,
      isConnecting: false,
      error: null,
    });

    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_balance');
  };

  return {
    ...state,
    connect,
    disconnect,
  };
}

export default useWeb3;
