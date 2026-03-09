# EthosLife Smart Contracts

UNITY Token ecosystem smart contracts for EthosLife platform.

## Contracts

### UnityToken.sol
ERC-20 token with vesting and burnable features.

**Tokenomics:**
- Total Supply: 1,000,000,000 UNITY
- Seed Sale (10%): 100M tokens
- Private Sale (15%): 150M tokens
- Public Sale (5%): 50M tokens
- Team (15%): 150M tokens - 1 year cliff, 2 year vesting
- Advisors (5%): 50M tokens - 6 months cliff, 1 year vesting
- Ecosystem (30%): 300M tokens
- Liquidity (10%): 100M tokens
- Reserve (10%): 100M tokens

### UnityStaking.sol
Fixed-term staking contract with rewards.

**Staking Options:**
- 6 months: 25% APY
- 12 months: 35% APY
- Minimum stake: 1000 UNITY
- Early withdrawal: 50% penalty on rewards

### UnityTokenSale.sol
Token sale with vesting schedule.

**Pricing:**
- Seed Round: $0.01 per token
- Private Round: $0.025 per token
- Public Round: $0.05 per token

**Vesting:**
- 6 months cliff (no tokens claimable)
- 12 months total linear vesting

## Installation

```bash
cd contracts
npm install
```

## Compile

```bash
npm run compile
```

## Test

```bash
npm run test
```

## Deploy

### Local
```bash
npx hardhat node
npm run deploy:local
```

### Sepolia Testnet
```bash
npm run deploy:sepolia
```

### Mumbai Testnet
```bash
npm run deploy:mumbai
```

## Environment Variables

Create a `.env` file:

```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## License

MIT
