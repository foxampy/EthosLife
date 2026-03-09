// Unity Token Contract Configuration
// Replace with actual deployed addresses after deployment

export const CONTRACT_ADDRESSES: Record<number, { unityToken: string; staking: string; tokenSale: string }> = {
  // Ethereum Mainnet
  1: {
    unityToken: '0x...', // After deployment
    staking: '0x...',
    tokenSale: '0x...',
  },
  // Polygon
  137: {
    unityToken: '0x...',
    staking: '0x...',
    tokenSale: '0x...',
  },
  // BSC
  56: {
    unityToken: '0x...',
    staking: '0x...',
    tokenSale: '0x...',
  },
  // Sepolia Testnet
  11155111: {
    unityToken: '0x...',
    staking: '0x...',
    tokenSale: '0x...',
  },
  // Mumbai Testnet
  80001: {
    unityToken: '0x...',
    staking: '0x...',
    tokenSale: '0x...',
  },
  // Hardhat Local
  31337: {
    unityToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    staking: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    tokenSale: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
};

export const SUPPORTED_CHAINS: Record<number, { name: string; nativeCurrency: string; rpcUrl: string; blockExplorer: string }> = {
  1: { 
    name: 'Ethereum Mainnet', 
    nativeCurrency: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
    blockExplorer: 'https://etherscan.io',
  },
  137: { 
    name: 'Polygon', 
    nativeCurrency: 'MATIC',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
    blockExplorer: 'https://polygonscan.com',
  },
  56: { 
    name: 'BSC', 
    nativeCurrency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
  },
  11155111: { 
    name: 'Sepolia Testnet', 
    nativeCurrency: 'ETH',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  80001: { 
    name: 'Mumbai Testnet', 
    nativeCurrency: 'MATIC',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY',
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
  31337: { 
    name: 'Hardhat Local', 
    nativeCurrency: 'ETH',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: '',
  },
};

export const USDC_ADDRESSES: Record<number, string> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  11155111: '0x...', // Sepolia USDC
  31337: '0x...',
};

export const USDT_ADDRESSES: Record<number, string> = {
  1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  56: '0x55d398326f99059fF775485246999027B3197955',
  11155111: '0x...',
  31337: '0x...',
};

// Token decimals
export const UNITY_DECIMALS = 18;
export const USDC_DECIMALS = 6;
export const USDT_DECIMALS = 6;

// Staking constants
export const STAKING_CONSTANTS = {
  MIN_STAKE: '1000', // 1000 UNITY
  DURATION_6_MONTHS: 180 * 24 * 60 * 60, // 180 days in seconds
  DURATION_12_MONTHS: 365 * 24 * 60 * 60, // 365 days in seconds
  APY_6_MONTHS: 25, // 25%
  APY_12_MONTHS: 35, // 35%
};

// Token Sale constants
export const SALE_CONSTANTS = {
  SEED_PRICE: 0.01, // $0.01 per token
  PRIVATE_PRICE: 0.025, // $0.025 per token
  PUBLIC_PRICE: 0.05, // $0.05 per token
  VESTING_CLIFF_DAYS: 180,
  VESTING_DURATION_DAYS: 365,
};

// Unity Token ABI
export const UNITY_TOKEN_ABI = [
  // ERC20 standard
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  
  // Vesting
  'function vestingSchedules(address) view returns (uint256 totalAmount, uint256 releasedAmount, uint256 startTime, uint256 cliffDuration, uint256 vestingDuration)',
  'function isVestingConfigured(address) view returns (bool)',
  'function releaseVestedTokens(address beneficiary)',
  'function getVestingInfo(address beneficiary) view returns (uint256 totalAmount, uint256 releasedAmount, uint256 vestedAmount, uint256 startTime, uint256 cliffEnd, uint256 vestingEnd)',
  'function getReleasableAmount(address beneficiary) view returns (uint256)',
  
  // Tokenomics
  'function TOTAL_SUPPLY() view returns (uint256)',
  'function SEED_SALE() view returns (uint256)',
  'function PRIVATE_SALE() view returns (uint256)',
  'function PUBLIC_SALE() view returns (uint256)',
  'function TEAM() view returns (uint256)',
  'function ADVISORS() view returns (uint256)',
  'function ECOSYSTEM() view returns (uint256)',
  'function LIQUIDITY() view returns (uint256)',
  'function RESERVE() view returns (uint256)',
  
  // Allocation wallets
  'function seedSaleWallet() view returns (address)',
  'function privateSaleWallet() view returns (address)',
  'function publicSaleWallet() view returns (address)',
  'function teamWallet() view returns (address)',
  'function advisorsWallet() view returns (address)',
  'function ecosystemWallet() view returns (address)',
  'function liquidityWallet() view returns (address)',
  'function reserveWallet() view returns (address)',
  
  // Burnable
  'function burn(uint256 amount)',
  'function burnFrom(address account, uint256 amount)',
];

// Staking Contract ABI
export const STAKING_ABI = [
  'function unityToken() view returns (address)',
  'function stake(uint256 amount, uint256 duration)',
  'function withdraw(uint256 stakeIndex)',
  'function earlyWithdraw(uint256 stakeIndex)',
  'function calculateReward(tuple(uint256 amount, uint256 startTime, uint256 duration, uint256 rewardRate, bool withdrawn) stake) view returns (uint256)',
  'function getUserStakes(address user) view returns (tuple(uint256 amount, uint256 startTime, uint256 duration, uint256 rewardRate, bool withdrawn)[])',
  'function getStakeInfo(address user, uint256 stakeIndex) view returns (uint256 amount, uint256 startTime, uint256 duration, uint256 rewardRate, bool withdrawn, uint256 currentReward, uint256 timeRemaining, bool canWithdraw)',
  'function getTotalPendingRewards(address user) view returns (uint256)',
  'function getTotalValueLocked() view returns (uint256)',
  'function totalStaked(address) view returns (uint256)',
  'function totalRewardsDistributed() view returns (uint256)',
  
  // Constants
  'function APY_6_MONTHS() view returns (uint256)',
  'function APY_12_MONTHS() view returns (uint256)',
  'function DURATION_6_MONTHS() view returns (uint256)',
  'function DURATION_12_MONTHS() view returns (uint256)',
  'function MINIMUM_STAKE() view returns (uint256)',
  'function BASIS_POINTS() view returns (uint256)',
  
  // Events
  'event Staked(address indexed user, uint256 stakeIndex, uint256 amount, uint256 duration, uint256 rewardRate)',
  'event Withdrawn(address indexed user, uint256 stakeIndex, uint256 amount, uint256 reward)',
  'event EarlyWithdrawn(address indexed user, uint256 stakeIndex, uint256 amount, uint256 penalty)',
];

// Token Sale ABI
export const TOKEN_SALE_ABI = [
  'function unityToken() view returns (address)',
  'function usdc() view returns (address)',
  'function usdt() view returns (address)',
  'function treasury() view returns (address)',
  'function buyWithUSDC(uint8 round, uint256 unityAmount)',
  'function buyWithUSDT(uint8 round, uint256 unityAmount)',
  'function calculateCost(uint8 round, uint256 unityAmount) view returns (uint256)',
  'function calculateClaimable(address user) view returns (uint256)',
  'function claimTokens()',
  'function getUserPurchases(address user) view returns (tuple(uint256 amount, uint256 price, uint256 purchaseTime, uint8 round, bool claimed)[])',
  'function totalPurchased(address) view returns (uint256)',
  'function totalRaisedUSDC() view returns (uint256)',
  'function totalRaisedUSDT() view returns (uint256)',
  'function rounds(uint8) view returns (uint256 price, uint256 allocation, uint256 sold, uint256 minPurchase, uint256 maxPurchase, bool active)',
  
  // Constants
  'function VESTING_CLIFF() view returns (uint256)',
  'function VESTING_DURATION() view returns (uint256)',
  
  // Events
  'event TokensPurchased(address indexed buyer, uint8 indexed round, uint256 amount, uint256 cost, address paymentToken)',
  'event TokensClaimed(address indexed buyer, uint256 amount)',
];

// ERC20 ABI for USDC/USDT
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];
