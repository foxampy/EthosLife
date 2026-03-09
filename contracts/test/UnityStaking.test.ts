import { expect } from "chai";
import { ethers } from "hardhat";
import { UnityToken, UnityStaking } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("UnityStaking", function () {
  let unityToken: UnityToken;
  let staking: UnityStaking;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let seedSaleWallet: SignerWithAddress;

  const DURATION_6_MONTHS = 180 * 24 * 60 * 60;
  const DURATION_12_MONTHS = 365 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, user1, seedSaleWallet] = await ethers.getSigners();

    const UnityTokenFactory = await ethers.getContractFactory("UnityToken");
    unityToken = await UnityTokenFactory.deploy(
      seedSaleWallet.address,
      seedSaleWallet.address,
      seedSaleWallet.address,
      seedSaleWallet.address,
      seedSaleWallet.address,
      seedSaleWallet.address,
      seedSaleWallet.address,
      seedSaleWallet.address
    );

    const UnityStakingFactory = await ethers.getContractFactory("UnityStaking");
    staking = await UnityStakingFactory.deploy(await unityToken.getAddress());

    await unityToken.transfer(await staking.getAddress(), ethers.parseEther("1000000"));
    await unityToken.transfer(user1.address, ethers.parseEther("10000"));
  });

  describe("Staking", function () {
    it("Should allow staking with valid parameters", async function () {
      const amount = ethers.parseEther("1000");
      
      await unityToken.connect(user1).approve(await staking.getAddress(), amount);
      await staking.connect(user1).stake(amount, DURATION_6_MONTHS);

      const stakes = await staking.getUserStakes(user1.address);
      expect(stakes.length).to.equal(1);
      expect(stakes[0].amount).to.equal(amount);
    });

    it("Should reject staking below minimum", async function () {
      const amount = ethers.parseEther("100");
      
      await unityToken.connect(user1).approve(await staking.getAddress(), amount);
      
      await expect(
        staking.connect(user1).stake(amount, DURATION_6_MONTHS)
      ).to.be.revertedWith("Minimum 1000 UNITY required");
    });

    it("Should reject invalid durations", async function () {
      const amount = ethers.parseEther("1000");
      
      await unityToken.connect(user1).approve(await staking.getAddress(), amount);
      
      await expect(
        staking.connect(user1).stake(amount, 100)
      ).to.be.revertedWith("Invalid duration");
    });
  });

  describe("Withdrawal", function () {
    it("Should allow withdrawal after lock period", async function () {
      const amount = ethers.parseEther("1000");
      
      await unityToken.connect(user1).approve(await staking.getAddress(), amount);
      await staking.connect(user1).stake(amount, DURATION_6_MONTHS);

      await ethers.provider.send("evm_increaseTime", [DURATION_6_MONTHS]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await unityToken.balanceOf(user1.address);
      
      await staking.connect(user1).withdraw(0);
      
      const finalBalance = await unityToken.balanceOf(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject early withdrawal before lock period", async function () {
      const amount = ethers.parseEther("1000");
      
      await unityToken.connect(user1).approve(await staking.getAddress(), amount);
      await staking.connect(user1).stake(amount, DURATION_6_MONTHS);

      await expect(
        staking.connect(user1).withdraw(0)
      ).to.be.revertedWith("Stake period not ended");
    });
  });
});
