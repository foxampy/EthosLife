# EthosLife Web3 Integration

Web3 frontend integration for UNITY Token ecosystem.

## Structure

```
web3/
├── config.ts          # Contract addresses, ABIs, constants
├── hooks/
│   ├── useWeb3.ts         # Wallet connection, network switching
│   ├── useUnityToken.ts   # Token interactions (balance, transfer, vesting)
│   ├── useStaking.ts      # Staking operations
│   └── useTokenSale.ts    # Token sale purchases
└── index.ts           # Export all hooks
```

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure contract addresses in `config.ts` after deployment.

3. Add Web3 pages to your router (already done in App.tsx).

## Usage

### Connect Wallet
```tsx
import { WalletConnectButton } from './components/Web3';

<WalletConnectButton />
```

### Use Token
```tsx
import { useUnityToken } from './web3/hooks';

function MyComponent() {
  const { tokenInfo, vestingInfo, transfer } = useUnityToken();
  
  return (
    <div>
      <p>Balance: {tokenInfo?.balance}</p>
      <button onClick={() => transfer(to, amount)}>Send</button>
    </div>
  );
}
```

### Stake Tokens
```tsx
import { useStaking } from './web3/hooks';

function StakeComponent() {
  const { stake, stakes, calculateReward } = useStaking();
  
  const handleStake = () => {
    stake('1000', 6); // 1000 UNITY for 6 months
  };
  
  return (
    <div>
      {stakes.map(stake => (
        <div key={stake.index}>
          {stake.amount} UNITY @ {stake.apy}% APY
          Reward: {stake.currentReward}
        </div>
      ))}
    </div>
  );
}
```

### Buy Tokens
```tsx
import { useTokenSale } from './web3/hooks';

function TokenSaleComponent() {
  const { rounds, buyTokens, vestingProgress } = useTokenSale();
  
  const handleBuy = () => {
    buyTokens('seed', '10000', 'usdc'); // 10k UNITY with USDC
  };
  
  return (
    <div>
      <p>Seed Price: ${rounds?.seed.price}</p>
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
}
```

## Pages

- `/wallet` - Wallet dashboard with balance, staking positions, vesting
- `/stake` - Staking page with 6 and 12 month options
- `/token-sale` - Token sale with USDC/USDT purchase

## Supported Networks

- Ethereum Mainnet (1)
- Polygon (137)
- BSC (56)
- Sepolia Testnet (11155111)
- Mumbai Testnet (80001)
- Hardhat Local (31337)

## Contract Addresses

Update these in `config.ts` after deployment:

```typescript
export const CONTRACT_ADDRESSES = {
  1: {
    unityToken: '0x...',
    staking: '0x...',
    tokenSale: '0x...',
  },
  // ... other networks
};
```
