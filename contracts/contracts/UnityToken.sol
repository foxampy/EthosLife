// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UnityToken
 * @dev UNITY ERC-20 Token for EthosLife ecosystem
 * Total Supply: 1 Billion tokens
 * Features: Vesting, Burnable, Ownable
 */
contract UnityToken is ERC20, ERC20Burnable, Ownable {
    // Tokenomics
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens
    
    // Allocation
    uint256 public constant SEED_SALE = 100_000_000 * 10**18;      // 10%
    uint256 public constant PRIVATE_SALE = 150_000_000 * 10**18;   // 15%
    uint256 public constant PUBLIC_SALE = 50_000_000 * 10**18;     // 5%
    uint256 public constant TEAM = 150_000_000 * 10**18;           // 15%
    uint256 public constant ADVISORS = 50_000_000 * 10**18;        // 5%
    uint256 public constant ECOSYSTEM = 300_000_000 * 10**18;      // 30%
    uint256 public constant LIQUIDITY = 100_000_000 * 10**18;      // 10%
    uint256 public constant RESERVE = 100_000_000 * 10**18;        // 10%
    
    // Vesting
    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(address => bool) public isVestingConfigured;
    
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 cliffDuration;
        uint256 vestingDuration;
    }
    
    // Events
    event VestingConfigured(address indexed beneficiary, uint256 amount, uint256 cliff, uint256 duration);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event TokensAllocated(address indexed category, uint256 amount);
    
    // Wallet addresses for allocations
    address public seedSaleWallet;
    address public privateSaleWallet;
    address public publicSaleWallet;
    address public teamWallet;
    address public advisorsWallet;
    address public ecosystemWallet;
    address public liquidityWallet;
    address public reserveWallet;
    
    constructor(
        address _seedSaleWallet,
        address _privateSaleWallet,
        address _publicSaleWallet,
        address _teamWallet,
        address _advisorsWallet,
        address _ecosystemWallet,
        address _liquidityWallet,
        address _reserveWallet
    ) ERC20("Unity", "UNITY") Ownable(msg.sender) {
        require(_seedSaleWallet != address(0), "Invalid seed sale wallet");
        require(_privateSaleWallet != address(0), "Invalid private sale wallet");
        require(_publicSaleWallet != address(0), "Invalid public sale wallet");
        require(_teamWallet != address(0), "Invalid team wallet");
        require(_advisorsWallet != address(0), "Invalid advisors wallet");
        require(_ecosystemWallet != address(0), "Invalid ecosystem wallet");
        require(_liquidityWallet != address(0), "Invalid liquidity wallet");
        require(_reserveWallet != address(0), "Invalid reserve wallet");
        
        seedSaleWallet = _seedSaleWallet;
        privateSaleWallet = _privateSaleWallet;
        publicSaleWallet = _publicSaleWallet;
        teamWallet = _teamWallet;
        advisorsWallet = _advisorsWallet;
        ecosystemWallet = _ecosystemWallet;
        liquidityWallet = _liquidityWallet;
        reserveWallet = _reserveWallet;
        
        // Mint total supply to contract
        _mint(address(this), TOTAL_SUPPLY);
        
        // Allocate tokens immediately (no vesting for sales and liquidity)
        _transfer(address(this), seedSaleWallet, SEED_SALE);
        emit TokensAllocated(seedSaleWallet, SEED_SALE);
        
        _transfer(address(this), privateSaleWallet, PRIVATE_SALE);
        emit TokensAllocated(privateSaleWallet, PRIVATE_SALE);
        
        _transfer(address(this), publicSaleWallet, PUBLIC_SALE);
        emit TokensAllocated(publicSaleWallet, PUBLIC_SALE);
        
        _transfer(address(this), ecosystemWallet, ECOSYSTEM);
        emit TokensAllocated(ecosystemWallet, ECOSYSTEM);
        
        _transfer(address(this), liquidityWallet, LIQUIDITY);
        emit TokensAllocated(liquidityWallet, LIQUIDITY);
        
        _transfer(address(this), reserveWallet, RESERVE);
        emit TokensAllocated(reserveWallet, RESERVE);
        
        // Setup vesting for team and advisors
        _setupVesting(teamWallet, TEAM, 365 days, 730 days);
        _setupVesting(advisorsWallet, ADVISORS, 180 days, 365 days);
    }
    
    function _setupVesting(
        address beneficiary,
        uint256 amount,
        uint256 cliff,
        uint256 duration
    ) internal {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(duration > cliff, "Duration must be > cliff");
        
        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            cliffDuration: cliff,
            vestingDuration: duration
        });
        isVestingConfigured[beneficiary] = true;
        
        emit VestingConfigured(beneficiary, amount, cliff, duration);
    }
    
    function releaseVestedTokens(address beneficiary) public {
        require(isVestingConfigured[beneficiary], "No vesting schedule");
        
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(block.timestamp >= schedule.startTime + schedule.cliffDuration, "Cliff not reached");
        
        uint256 vested = _calculateVestedAmount(schedule);
        uint256 unreleased = vested - schedule.releasedAmount;
        
        require(unreleased > 0, "No tokens to release");
        
        schedule.releasedAmount += unreleased;
        _transfer(address(this), beneficiary, unreleased);
        
        emit TokensReleased(beneficiary, unreleased);
    }
    
    function _calculateVestedAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }
        if (block.timestamp >= schedule.startTime + schedule.vestingDuration) {
            return schedule.totalAmount;
        }
        
        uint256 timeFromStart = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timeFromStart) / schedule.vestingDuration;
    }
    
    function getVestingInfo(address beneficiary) external view returns (
        uint256 totalAmount,
        uint256 releasedAmount,
        uint256 vestedAmount,
        uint256 startTime,
        uint256 cliffEnd,
        uint256 vestingEnd
    ) {
        require(isVestingConfigured[beneficiary], "No vesting schedule");
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        
        return (
            schedule.totalAmount,
            schedule.releasedAmount,
            _calculateVestedAmount(schedule),
            schedule.startTime,
            schedule.startTime + schedule.cliffDuration,
            schedule.startTime + schedule.vestingDuration
        );
    }
    
    function getReleasableAmount(address beneficiary) external view returns (uint256) {
        if (!isVestingConfigured[beneficiary]) return 0;
        
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }
        
        uint256 vested = _calculateVestedAmount(schedule);
        return vested - schedule.releasedAmount;
    }
}
