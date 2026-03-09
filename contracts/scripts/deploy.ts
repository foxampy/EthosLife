import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";
import hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Wallet addresses for token allocation
  const seedSaleWallet = process.env.SEED_SALE_WALLET || deployer.address;
  const privateSaleWallet = process.env.PRIVATE_SALE_WALLET || deployer.address;
  const publicSaleWallet = process.env.PUBLIC_SALE_WALLET || deployer.address;
  const teamWallet = process.env.TEAM_WALLET || deployer.address;
  const advisorsWallet = process.env.ADVISORS_WALLET || deployer.address;
  const ecosystemWallet = process.env.ECOSYSTEM_WALLET || deployer.address;
  const liquidityWallet = process.env.LIQUIDITY_WALLET || deployer.address;
  const reserveWallet = process.env.RESERVE_WALLET || deployer.address;

  // Deploy UnityToken
  console.log("\nDeploying UnityToken...");
  const UnityToken = await ethers.getContractFactory("UnityToken");
  const unityToken = await UnityToken.deploy(
    seedSaleWallet,
    privateSaleWallet,
    publicSaleWallet,
    teamWallet,
    advisorsWallet,
    ecosystemWallet,
    liquidityWallet,
    reserveWallet
  );
  await unityToken.waitForDeployment();
  
  const unityTokenAddress = await unityToken.getAddress();
  console.log("UnityToken deployed to:", unityTokenAddress);

  // Deploy UnityStaking
  console.log("\nDeploying UnityStaking...");
  const UnityStaking = await ethers.getContractFactory("UnityStaking");
  const unityStaking = await UnityStaking.deploy(unityTokenAddress);
  await unityStaking.waitForDeployment();
  
  const stakingAddress = await unityStaking.getAddress();
  console.log("UnityStaking deployed to:", stakingAddress);

  // Deploy UnityTokenSale
  console.log("\nDeploying UnityTokenSale...");
  
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  
  let usdcAddress: string;
  let usdtAddress: string;
  
  if (chainId === 31337) {
    // Deploy mock USDC and USDT for local testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    
    const mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
    await mockUSDC.waitForDeployment();
    usdcAddress = await mockUSDC.getAddress();
    console.log("Mock USDC deployed to:", usdcAddress);
    
    const mockUSDT = await MockERC20.deploy("Tether USD", "USDT", 6);
    await mockUSDT.waitForDeployment();
    usdtAddress = await mockUSDT.getAddress();
    console.log("Mock USDT deployed to:", usdtAddress);
  } else {
    usdcAddress = getUSDCAddress(chainId);
    usdtAddress = getUSDTAddress(chainId);
  }

  const treasuryWallet = process.env.TREASURY_WALLET || deployer.address;
  
  const UnityTokenSale = await ethers.getContractFactory("UnityTokenSale");
  const unityTokenSale = await UnityTokenSale.deploy(
    unityTokenAddress,
    usdcAddress,
    usdtAddress,
    treasuryWallet
  );
  await unityTokenSale.waitForDeployment();
  
  const tokenSaleAddress = await unityTokenSale.getAddress();
  console.log("UnityTokenSale deployed to:", tokenSaleAddress);

  // Transfer tokens to staking contract for rewards
  console.log("\nTransferring tokens to staking contract for rewards...");
  const rewardAmount = ethers.parseEther("10000000");
  await unityToken.transfer(stakingAddress, rewardAmount);
  console.log("Transferred", ethers.formatEther(rewardAmount), "UNITY to staking contract");

  // Transfer tokens to token sale contract
  console.log("\nTransferring tokens to token sale contract...");
  const saleAllocation = ethers.parseEther("300000000");
  await unityToken.transfer(tokenSaleAddress, saleAllocation);
  console.log("Transferred", ethers.formatEther(saleAllocation), "UNITY to token sale contract");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: chainId,
    deployer: deployer.address,
    contracts: {
      UnityToken: unityTokenAddress,
      UnityStaking: stakingAddress,
      UnityTokenSale: tokenSaleAddress,
      USDC: usdcAddress,
      USDT: usdtAddress,
    },
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = join(__dirname, "..", "deployments");
  writeFileSync(
    join(deploymentPath, `${network.name}-${chainId}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to:", `deployments/${network.name}-${chainId}.json`);

  console.log("\n========== DEPLOYMENT SUMMARY ==========");
  console.log("UnityToken:", unityTokenAddress);
  console.log("UnityStaking:", stakingAddress);
  console.log("UnityTokenSale:", tokenSaleAddress);
  console.log("USDC:", usdcAddress);
  console.log("USDT:", usdtAddress);
  console.log("========================================");
}

function getUSDCAddress(chainId: number): string {
  const addresses: Record<number, string> = {
    1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    11155111: "0x0000000000000000000000000000000000000000",
    80001: "0x0000000000000000000000000000000000000000",
  };
  return addresses[chainId] || "0x0000000000000000000000000000000000000000";
}

function getUSDTAddress(chainId: number): string {
  const addresses: Record<number, string> = {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    11155111: "0x0000000000000000000000000000000000000000",
    80001: "0x0000000000000000000000000000000000000000",
  };
  return addresses[chainId] || "0x0000000000000000000000000000000000000000";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
