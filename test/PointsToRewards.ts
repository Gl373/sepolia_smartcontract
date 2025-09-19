import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PointsToRewards", function () {
  async function deployPointsToRewardsFixture() {
    const [admin, member1, member2] = await ethers.getSigners();
    const PointsToRewards = await ethers.getContractFactory("PointsToRewards");
    const pointsToRewards = await PointsToRewards.deploy();
    return { pointsToRewards, admin, member1, member2 };
  }

  describe("Deployment", function () {
    it("Should set the deployer as admin", async function () {
      const { pointsToRewards, admin } = await deployPointsToRewardsFixture();
      expect(await pointsToRewards.admin()).to.equal(admin.address);
    });
  });

  describe("Member registration", function () {
    it("Should allow a member to register", async function () {
      const { pointsToRewards, member1 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      const [name, points, isRegistered] = await pointsToRewards.members(member1.address);
      expect(name).to.equal("Alice");
      expect(points).to.equal(0);
      expect(isRegistered).to.be.true;
    });

    it("Should revert if a member tries to register twice", async function () {
      const { pointsToRewards, member1 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await expect(pointsToRewards.connect(member1).registerMember("Alice"))
        .to.be.revertedWith("You are already registered");
    });
  });

  describe("Award points", function () {
    it("Should allow admin to award points to a registered member", async function () {
      const { pointsToRewards, admin, member1 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await expect(pointsToRewards.connect(admin).awardPoints(member1.address, 100))
        .to.emit(pointsToRewards, "PointsAwarded")
        .withArgs(member1.address, 100);
      expect(await pointsToRewards.connect(member1).getPointsBalance()).to.equal(100);
    });

    it("Should revert if non-admin tries to award points", async function () {
      const { pointsToRewards, member1, member2 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await expect(pointsToRewards.connect(member2).awardPoints(member1.address, 100))
        .to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Transfer points", function () {
    it("Should allow a member to transfer points to another registered member", async function () {
      const { pointsToRewards, admin, member1, member2 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await pointsToRewards.connect(member2).registerMember("Bob");
      await pointsToRewards.connect(admin).awardPoints(member1.address, 100);
      await pointsToRewards.connect(member1).transferPoints(member2.address, 50);
      expect(await pointsToRewards.connect(member1).getPointsBalance()).to.equal(50);
      expect(await pointsToRewards.connect(member2).getPointsBalance()).to.equal(50);
    });

    it("Should revert if transferring more points than available", async function () {
      const { pointsToRewards, admin, member1, member2 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await pointsToRewards.connect(member2).registerMember("Bob");
      await pointsToRewards.connect(admin).awardPoints(member1.address, 100);
      await expect(pointsToRewards.connect(member1).transferPoints(member2.address, 150))
        .to.be.revertedWith("Insufficient points");
    });
  });

  describe("Get points balance", function () {
    it("Should return the correct points balance", async function () {
      const { pointsToRewards, admin, member1 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await pointsToRewards.connect(admin).awardPoints(member1.address, 100);
      expect(await pointsToRewards.connect(member1).getPointsBalance()).to.equal(100);
    });

    it("Should revert if not registered", async function () {
      const { pointsToRewards, member1 } = await deployPointsToRewardsFixture();
      await expect(pointsToRewards.connect(member1).getPointsBalance())
        .to.be.revertedWith("You are not registered");
    });
  });

  describe("Redeem reward", function () {
    it("Should allow a member to redeem a T-shirt reward", async function () {
      const { pointsToRewards, admin, member1 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await pointsToRewards.connect(admin).awardPoints(member1.address, 100);
      await expect(pointsToRewards.connect(member1).redeemReward(0))
        .to.emit(pointsToRewards, "RewardRedeemed")
        .withArgs(member1.address, 0);
      expect(await pointsToRewards.connect(member1).getPointsBalance()).to.equal(50);
    });

    it("Should revert if member has insufficient points for reward", async function () {
      const { pointsToRewards, member1 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member1).registerMember("Alice");
      await expect(pointsToRewards.connect(member1).redeemReward(0))
        .to.be.revertedWith("Insufficient points");
    });

    it("Should revert if sender is not registered", async function () {
      const { pointsToRewards, admin, member1, member2 } = await deployPointsToRewardsFixture();
      await pointsToRewards.connect(member2).registerMember("Bob");
      await pointsToRewards.connect(admin).awardPoints(member2.address, 100); 
      await expect(pointsToRewards.connect(member1).transferPoints(member2.address, 50))
        .to.be.revertedWith("You are not registered");
    });

  });
});