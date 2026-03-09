import React from 'react';
import { Wallet } from 'lucide-react';
import { NeuButton } from '../Neumorphism/NeuButton';
import { useWeb3, shortenAddress } from '../../web3/hooks/useWeb3';

interface WalletConnectButtonProps {
  className?: string;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ className = '' }) => {
  const { isConnected, isConnecting, address, connect, disconnect } = useWeb3();

  if (isConnected && address) {
    return (
      <NeuButton
        onClick={disconnect}
        className={`flex items-center gap-2 ${className}`}
        size="sm"
        variant="secondary"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {shortenAddress(address)}
      </NeuButton>
    );
  }

  return (
    <NeuButton
      onClick={connect}
      disabled={isConnecting}
      className={`flex items-center gap-2 ${className}`}
      size="sm"
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </NeuButton>
  );
};

export default WalletConnectButton;
