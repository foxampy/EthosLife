// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UnityStaking
 * @dev Staking contract for UNITY tokens with fixed-term rewards
 * - 6 months: 25% APY
 * - 12 months: 35% APY
 */
contract UnityStaking is ReentrancyGuard, Ownable {
    IERC20 public unityToken;
    
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 duration; // 180 or 365 days
        uint256 rewardRate;
        bool withdrawn;
    }
    
    mapping(address => Stake[]) public userStakes;
    mapping(address => uint256) public totalStaked;
    
    // APY rates in basis points (10000 = 100%)
    uint256 public constant APY_6_MONTHS = 2500; // 25%
    uint256 public constant APY_12_MONTHS = 3500; // 35%
    uint256 public constant BASIS_POINTS = 10000;
    
    uint256 public constant DURATION_6_MONTHS = 180 days;
    uint256 public constant DURATION_12_MONTHS = 365 days;
    uint256 public constant MINIMUM_STAKE = 1000 * 10**18; // 1000 UNITY
    
    // Total rewards pool
    uint256 public totalRewardsPool;
    uint256 public totalRewardsDistributed;
    
    // Events
    event Staked(address indexed user, uint256 stakeIndex, uint256 amount, uint256 duration, uint256 rewardRate);
    event Withdrawn(address indexed user, uint256 stakeIndex, uint256 amount, uint256 reward);
    event EarlyWithdrawn(address indexed user, uint256 stakeIndex, uint256 amount, uint256 penalty);
    event RewardsPoolReplenished(uint256 amount);
    
    constructor(address _unityToken) Ownable(msg.sender) {
        require(_unityToken != address(0), "Invalid token address");
        unityToken = IERC20(_unityToken);
    }
    
    /**
     * @dev Stake tokens for a fixed duration
     * @param amount Amount of UNITY tokens to stake
     * @param duration Staking duration (180 or 365 days)
     */
    function stake(uint256 amount, uint256 duration) external nonReentrant {
        require(duration == DURATION_6_MONTHS || duration == DURATION_12_MONTHS, "Invalid duration");
        require(amount >= MINIMUM_STAKE, "Minimum 1000 UNITY required");
        
        uint256 rewardRate = duration == DURATION_6_MONTHS ? APY_6_MONTHS : APY_12_MONTHS;
        uint256 expectedReward = (amount * rewardRate * duration) / (365 days * BASIS_POINTS);
        
        require(unityToken.balanceOf(address(this)) + amount >= totalRewardsDistributed + expectedReward, "Insufficient rewards pool");
        
        // Transfer tokens from user
        require(unityToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Create stake
        uint256 stakeIndex = userStakes[msg.sender].length;
        userStakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            duration: duration,
            rewardRate: rewardRate,
            withdrawn: false
        }));
        
        totalStaked[msg.sender] += amount;
        
        emit Staked(msg.sender, stakeIndex, amount, duration, rewardRate);
    }
    
    /**
     * @dev Calculate reward for a specific stake
     */
    function calculateReward(Stake memory stake) public view returns (uint256) {
        if (stake.withdrawn) return 0;
        
        uint256 stakedDuration = block.timestamp - stake.startTime;
        if (stakedDuration > stake.duration) {
            stakedDuration = stake.duration;
        }
        
        // Simple interest: principal * rate * time / (365 days * BASIS_POINTS)
        return (stake.amount * stake.rewardRate * stakedDuration) / (365 days * BASIS_POINTS);
    }
    
    /**
     * @dev Withdraw staked tokens with rewards after lock period
     * @param stakeIndex Index of the stake to withdraw
     */
    function withdraw(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        Stake storage stake = userStakes[msg.sender][stakeIndex];
        require(!stake.withdrawn, "Already withdrawn");
        require(block.timestamp >= stake.startTime + stake.duration, "Stake period not ended");
        
        uint256 reward = calculateReward(stake);
        uint256 totalAmount = stake.amount + reward;
        
        stake.withdrawn = true;
        totalStaked[msg.sender] -= stake.amount;
        totalRewardsDistributed += reward;
        
        require(unityToken.transfer(msg.sender, totalAmount), "Transfer failed");
        
        emit Withdrawn(msg.sender, stakeIndex, stake.amount, reward);
    }
    
    /**
     * @dev Early withdrawal with 50% penalty on rewards
     * @param stakeIndex Index of the stake to withdraw early
     */
    function earlyWithdraw(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        Stake storage stake = userStakes[msg.sender][stakeIndex];
        require(!stake.withdrawn, "Already withdrawn");
        require(block.timestamp < stake.startTime + stake.duration, "Use regular withdraw");
        
        uint256 fullReward = calculateReward(stake);
        uint256 penalty = fullReward / 2; // 50% penalty
        uint256 actualReward = fullReward - penalty;
        uint256 totalAmount = stake.amount + actualReward;
        
        stake.withdrawn = true;
        totalStaked[msg.sender] -= stake.amount;
        totalRewardsDistributed += actualReward;
        
        require(unityToken.transfer(msg.sender, totalAmount), "Transfer failed");
        
        emit EarlyWithdrawn(msg.sender, stakeIndex, stake.amount, penalty);
    }
    
    /**
     * @dev Get all stakes for a user
     */
    function getUserStakes(address user) external view returns (Stake[] memory) {
        return userStakes[user];
    }
    
    /**
     * @dev Get detailed stake info with calculated rewards
     */
    function getStakeInfo(address user, uint256 stakeIndex) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 duration,
        uint256 rewardRate,
        bool withdrawn,
        uint256 currentReward,
        uint256 timeRemaining,
        bool canWithdraw
    ) {
        require(stakeIndex < userStakes[user].length, "Invalid stake index");
        Stake memory stake = userStakes[user][stakeIndex];
        
        uint256 endTime = stake.startTime + stake.duration;
        uint256 remaining = block.timestamp >= endTime ? 0 : endTime - block.timestamp;
        
        return (
            stake.amount,
            stake.startTime,
            stake.duration,
            stake.rewardRate,
            stake.withdrawn,
            calculateReward(stake),
            remaining,
            block.timestamp >= endTime && !stake.withdrawn
        );
    }
    
    /**
     * @dev Get total pending rewards for a user
     */
    function getTotalPendingRewards(address user) external view returns (uint256) {
        uint256 total = 0;
        Stake[] memory stakes = userStakes[user];
        
        for (uint i = 0; i < stakes.length; i++) {
            if (!stakes[i].withdrawn) {
                total += calculateReward(stakes[i]);
            }
        }
        
        return total;
    }
    
    /**
     * @dev Get total value locked in contract
     */
    function getTotalValueLocked() external view returns (uint256) {
        return unityToken.balanceOf(address(this));
    }
    
    /**
     * @dev Replenish rewards pool (only owner)
     */
    function replenishRewardsPool(uint256 amount) external onlyOwner {
        require(unityToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        totalRewardsPool += amount;
        emit RewardsPoolReplenished(amount);
    }
    
    /**
     * @dev Emergency withdrawal of stuck tokens (only owner)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(unityToken.transfer(owner(), amount), "Transfer failed");
    }
}
