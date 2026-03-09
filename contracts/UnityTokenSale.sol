// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title UnityTokenSale
 * @dev Token sale contract for UNITY with vesting schedule
 * - Seed Round: $0.01 per token
 * - Private Round: $0.025 per token  
 * - Public Round: $0.05 per token
 */
contract UnityTokenSale is ReentrancyGuard, Ownable, Pausable {
    IERC20 public unityToken;
    IERC20 public usdc;
    IERC20 public usdt;
    
    enum SaleRound { None, Seed, Private, Public }
    
    struct Round {
        uint256 price; // Price in cents (10000 = $1.00)
        uint256 allocation;
        uint256 sold;
        uint256 minPurchase;
        uint256 maxPurchase;
        bool active;
    }
    
    struct Purchase {
        uint256 amount;
        uint256 price;
        uint256 purchaseTime;
        SaleRound round;
        bool claimed;
    }
    
    mapping(SaleRound => Round) public rounds;
    mapping(address => Purchase[]) public userPurchases;
    mapping(address => uint256) public totalPurchased;
    
    // Vesting: 6 months cliff, 12 months linear vesting
    uint256 public constant VESTING_CLIFF = 180 days;
    uint256 public constant VESTING_DURATION = 365 days;
    
    // Treasury wallet to receive payments
    address public treasury;
    
    // Total raised
    uint256 public totalRaisedUSDC;
    uint256 public totalRaisedUSDT;
    
    // Events
    event RoundUpdated(SaleRound indexed round, uint256 price, uint256 allocation);
    event TokensPurchased(address indexed buyer, SaleRound indexed round, uint256 amount, uint256 cost, address paymentToken);
    event TokensClaimed(address indexed buyer, uint256 amount);
    event TreasuryUpdated(address newTreasury);
    
    constructor(
        address _unityToken,
        address _usdc,
        address _usdt,
        address _treasury
    ) Ownable(msg.sender) {
        require(_unityToken != address(0), "Invalid token address");
        require(_usdc != address(0), "Invalid USDC address");
        require(_usdt != address(0), "Invalid USDT address");
        require(_treasury != address(0), "Invalid treasury");
        
        unityToken = IERC20(_unityToken);
        usdc = IERC20(_usdc);
        usdt = IERC20(_usdt);
        treasury = _treasury;
        
        // Initialize rounds
        // Seed: $0.01 = 1 cent
        rounds[SaleRound.Seed] = Round({
            price: 1,
            allocation: 100_000_000 * 10**18, // 100M tokens
            sold: 0,
            minPurchase: 1000 * 10**18, // 1000 UNITY = $10
            maxPurchase: 500_000 * 10**18, // 500K UNITY = $5000
            active: false
        });
        
        // Private: $0.025 = 2.5 cents
        rounds[SaleRound.Private] = Round({
            price: 2,
            allocation: 150_000_000 * 10**18, // 150M tokens
            sold: 0,
            minPurchase: 1000 * 10**18,
            maxPurchase: 1_000_000 * 10**18, // 1M UNITY = $25000
            active: false
        });
        
        // Public: $0.05 = 5 cents
        rounds[SaleRound.Public] = Round({
            price: 5,
            allocation: 50_000_000 * 10**18, // 50M tokens
            sold: 0,
            minPurchase: 100 * 10**18, // Lower minimum for public
            maxPurchase: 200_000 * 10**18, // 200K UNITY = $10000
            active: false
        });
    }
    
    /**
     * @dev Buy tokens with USDC
     * @param round Sale round
     * @param unityAmount Amount of UNITY tokens to purchase
     */
    function buyWithUSDC(SaleRound round, uint256 unityAmount) external nonReentrant whenNotPaused {
        _buy(round, unityAmount, address(usdc));
    }
    
    /**
     * @dev Buy tokens with USDT
     * @param round Sale round
     * @param unityAmount Amount of UNITY tokens to purchase
     */
    function buyWithUSDT(SaleRound round, uint256 unityAmount) external nonReentrant whenNotPaused {
        _buy(round, unityAmount, address(usdt));
    }
    
    function _buy(SaleRound round, uint256 unityAmount, address paymentToken) internal {
        require(round != SaleRound.None, "Invalid round");
        Round storage r = rounds[round];
        require(r.active, "Round not active");
        require(unityAmount >= r.minPurchase, "Below minimum");
        require(unityAmount <= r.maxPurchase, "Above maximum");
        require(totalPurchased[msg.sender] + unityAmount <= r.maxPurchase, "Exceeds max per user");
        require(r.sold + unityAmount <= r.allocation, "Exceeds round allocation");
        
        // Calculate cost: (amount * price) / 100 (price in cents)
        uint256 cost = (unityAmount * r.price) / 100;
        // Adjust for 6 decimal stablecoins vs 18 decimal UNITY
        cost = cost / 10**12;
        
        // Transfer payment
        require(IERC20(paymentToken).transferFrom(msg.sender, treasury, cost), "Payment failed");
        
        // Update state
        r.sold += unityAmount;
        totalPurchased[msg.sender] += unityAmount;
        
        // Record purchase
        userPurchases[msg.sender].push(Purchase({
            amount: unityAmount,
            price: r.price,
            purchaseTime: block.timestamp,
            round: round,
            claimed: false
        }));
        
        if (paymentToken == address(usdc)) {
            totalRaisedUSDC += cost;
        } else {
            totalRaisedUSDT += cost;
        }
        
        emit TokensPurchased(msg.sender, round, unityAmount, cost, paymentToken);
    }
    
    /**
     * @dev Calculate claimable tokens based on vesting schedule
     */
    function calculateClaimable(address user) public view returns (uint256) {
        Purchase[] memory purchases = userPurchases[user];
        uint256 totalClaimable = 0;
        
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].claimed) continue;
            
            uint256 purchaseTime = purchases[i].purchaseTime;
            uint256 cliffEnd = purchaseTime + VESTING_CLIFF;
            
            if (block.timestamp < cliffEnd) continue;
            
            if (block.timestamp >= purchaseTime + VESTING_DURATION) {
                // Fully vested
                totalClaimable += purchases[i].amount;
            } else {
                // Partially vested
                uint256 timeSinceCliff = block.timestamp - cliffEnd;
                uint256 vestingPeriod = VESTING_DURATION - VESTING_CLIFF;
                uint256 vested = (purchases[i].amount * timeSinceCliff) / vestingPeriod;
                totalClaimable += vested;
            }
        }
        
        return totalClaimable;
    }
    
    /**
     * @dev Claim vested tokens
     */
    function claimTokens() external nonReentrant {
        uint256 claimable = calculateClaimable(msg.sender);
        require(claimable > 0, "No tokens to claim");
        
        // Mark purchases as claimed
        for (uint i = 0; i < userPurchases[msg.sender].length; i++) {
            if (!userPurchases[msg.sender][i].claimed) {
                userPurchases[msg.sender][i].claimed = true;
            }
        }
        
        require(unityToken.transfer(msg.sender, claimable), "Transfer failed");
        emit TokensClaimed(msg.sender, claimable);
    }
    
    /**
     * @dev Get user's purchase history
     */
    function getUserPurchases(address user) external view returns (Purchase[] memory) {
        return userPurchases[user];
    }
    
    /**
     * @dev Admin: Update round parameters
     */
    function updateRound(
        SaleRound round,
        uint256 price,
        uint256 allocation,
        uint256 minPurchase,
        uint256 maxPurchase,
        bool active
    ) external onlyOwner {
        require(round != SaleRound.None, "Invalid round");
        Round storage r = rounds[round];
        r.price = price;
        r.allocation = allocation;
        r.minPurchase = minPurchase;
        r.maxPurchase = maxPurchase;
        r.active = active;
        
        emit RoundUpdated(round, price, allocation);
    }
    
    /**
     * @dev Admin: Set treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }
    
    /**
     * @dev Admin: Pause/unpause sales
     */
    function setPaused(bool paused) external onlyOwner {
        if (paused) {
            _pause();
        } else {
            _unpause();
        }
    }
    
    /**
     * @dev Calculate price for given amount
     */
    function calculateCost(SaleRound round, uint256 unityAmount) external view returns (uint256) {
        Round memory r = rounds[round];
        uint256 cost = (unityAmount * r.price) / 100;
        return cost / 10**12; // Adjust decimals
    }
}
