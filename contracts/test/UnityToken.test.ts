import { expect } from "chai";
import { ethers } from "hardhat";
import { UnityToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("UnityToken", function () {
  let unityToken: UnityToken;
  let owner: SignerWithAddress;
  let seedSaleWallet: SignerWithAddress;
  let privateSaleWallet: SignerWithAddress;
  let publicSaleWallet: SignerWithAddress;
  let teamWallet: SignerWithAddress;
  let advisorsWallet: SignerWithAddress;
  let ecosystemWallet: SignerWithAddress;
  let liquidityWallet: SignerWithAddress;
  let reserveWallet: SignerWithAddress;
  let addr1: SignerWithAddress;

  const TOTAL_SUPPLY = ethers.parseEther("1000000000");
  const SEED_SALE = ethers.parseEther("100000000");
  const PRIVATE_SALE = ethers.parseEther("150000000");
  const PUBLIC_SALE = ethers.parseEther("50000000");
  const TEAM = ethers.parseEther("150000000");
  const ADVISORS = ethers.parseEther("50000000");
  const ECOSYSTEM = ethers.parseEther("300000000");
  const LIQUIDITY = ethers.parseEther("100000000");
  const RESERVE = ethers.parseEther("100000000");

  beforeEach(async function () {
    [owner, seedSaleWallet, privateSaleWallet, publicSaleWallet, teamWallet, 
     advisorsWallet, ecosystemWallet, liquidityWallet, reserveWallet, addr1] = await ethers.getSigners();

    const UnityTokenFactory = await ethers.getContractFactory("UnityToken");
    unityToken = await UnityTokenFactory.deploy(
      seedSaleWallet.address,
      privateSaleWallet.address,
      publicSaleWallet.address,
      teamWallet.address,
      advisorsWallet.address,
      ecosystemWallet.address,
      liquidityWallet.address,
      reserveWallet.address
    );
  });

  describe("Deployment", function () {
    it("Should set the correct token details", async function () {
      expect(await unityToken.name()).to.equal("Unity");
      expect(await unityToken.symbol()).to.equal("UNITY");
      expect(await unityToken.decimals()).to.equal(18);
      expect(await unityToken.totalSupply()).to.equal(TOTAL_SUPPLY);
    });

    it("Should allocate tokens correctly", async function () {
      expect(await unityToken.balanceOf(seedSaleWallet.address)).to.equal(SEED_SALE);
      expect(await unityToken.balanceOf(privateSaleWallet.address)).to.equal(PRIVATE_SALE);
      expect(await unityToken.balanceOf(publicSaleWallet.address)).to.equal(PUBLIC_SALE);
      expect(await unityToken.balanceOf(ecosystemWallet.address)).to.equal(ECOSYSTEM);
      expect(await unityToken.balanceOf(liquidityWallet.address)).to.equal(LIQUIDITY);
      expect(await unityToken.balanceOf(reserveWallet.address)).to.equal(RESERVE);
    });

    it("Should set up vesting for team and advisors", async function () {
      const teamVesting = await unityToken.vestingSchedules(teamWallet.address);
      expect(teamVesting.totalAmount).to.equal(TEAM);
      expect(teamVesting.releasedAmount).to.equal(0);

      const advisorsVesting = await unityToken.vestingSchedules(advisorsWallet.address);
      expect(advisorsVesting.totalAmount).to.equal(ADVISORS);
      expect(advisorsVesting.releasedAmount).to.equal(0);
    });
  });

  describe("Vesting", function () {
    it("Should not allow releasing tokens before cliff", async function () {
      await expect(
        unityToken.releaseVestedTokens(teamWallet.address)
      ).to.be.revertedWith("Cliff not reached");
    });

    it("Should allow releasing tokens after vesting period", async function () {
      await ethers.provider.send("evm_increaseTime", [730 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await unityToken.balanceOf(teamWallet.address);
      
      await unityToken.releaseVestedTokens(teamWallet.address);
      
      const finalBalance = await unityToken.balanceOf(teamWallet.address);
      expect(finalBalance - initialBalance).to.equal(TEAM);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseEther("100");
      await unityToken.connect(seedSaleWallet).transfer(addr1.address, amount);
      expect(await unityToken.balanceOf(addr1.address)).to.equal(amount);
    });
  });

  describe("Burning", function () {
    it("Should burn tokens", async function () {
      const amount = ethers.parseEther("100");
      const initialBalance = await unityToken.balanceOf(seedSaleWallet.address);
      
      await unityToken.connect(seedSaleWallet).burn(amount);
      
      const finalBalance = await unityToken.balanceOf(seedSaleWallet.address);
      expect(initialBalance - finalBalance).to.equal(amount);
    });
  });
});
