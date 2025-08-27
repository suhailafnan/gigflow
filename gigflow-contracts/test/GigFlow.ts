import { expect } from "chai";
import { ethers } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// Import TypeChain types (generated after compile)
import type {
  MockERC20,
  ProjectFactory,
  MilestoneEscrow,
  ReputationNFT,
} from "../typechain-types";

describe("GigFlow Platform - Avalanche-Ready", function () {
  let owner: HardhatEthersSigner;
  let client: HardhatEthersSigner;
  let freelancer: HardhatEthersSigner;

  let factory: ProjectFactory;
  let reputationNft: ReputationNFT;
  let usdc: MockERC20;

  // Helper to deploy MockERC20 with USDC-like decimals (6)
  async function deployMockUSDC(
    owner: HardhatEthersSigner,
    client: HardhatEthersSigner
  ): Promise<MockERC20> {
    const MockUSDCFactory = await ethers.getContractFactory("MockERC20", owner);
    const mockUsdc = (await MockUSDCFactory.deploy(
      "Mock USDC",
      "USDC",
      ethers.parseUnits("10000", 6)
    )) as unknown as MockERC20;
    await mockUsdc.waitForDeployment();
    await mockUsdc.transfer(client.address, ethers.parseUnits("1000", 6));
    return mockUsdc;
  }

  beforeEach(async function () {
    [owner, client, freelancer] = await ethers.getSigners();

    // Deploy mock token and distribute to client
    usdc = await deployMockUSDC(owner, client);

    // Deploy ReputationNFT with owner as the admin
    const ReputationNFTFactory = await ethers.getContractFactory(
      "ReputationNFT",
      owner
    );
    reputationNft = (await ReputationNFTFactory.deploy(
      owner.address
    )) as unknown as ReputationNFT;
    await reputationNft.waitForDeployment();

    // Deploy ProjectFactory
    const ProjectFactoryFactory = await ethers.getContractFactory(
      "ProjectFactory",
      owner
    );
    factory = (await ProjectFactoryFactory.deploy()) as unknown as ProjectFactory;
    await factory.waitForDeployment();
  });

  describe("Project Creation and Funding", () => {
    it("Should create a project with native AVAX", async function () {
      const milestones = [ethers.parseEther("1"), ethers.parseEther("2")];
      const totalValue = ethers.parseEther("3");

      await expect(
        factory
          .connect(client)
          .createProject( freelancer.address, ethers.ZeroAddress, milestones, { value: totalValue } )
      ).to.emit(factory, "ProjectCreated");

      const projectAddress = await factory.deployedProjects(0);
      const balance = await ethers.provider.getBalance(projectAddress);
      expect(balance).to.equal(totalValue);
    });

    it("Should create a project with USDC tokens", async function () {
      const milestones = [ethers.parseUnits("100", 6), ethers.parseUnits("200", 6)];
      const totalValue = ethers.parseUnits("300", 6);

      await usdc.connect(client).approve(await factory.getAddress(), totalValue);

      await expect(
        factory
          .connect(client)
          .createProject(freelancer.address, await usdc.getAddress(), milestones)
      ).to.emit(factory, "ProjectCreated");

      const projectAddress = await factory.deployedProjects(0);
      expect(await usdc.balanceOf(projectAddress)).to.equal(totalValue);
    });
  });

  describe("Milestone Payments", () => {
    it("Should pay freelancer in AVAX for an approved milestone", async () => {
      const milestoneValue = ethers.parseEther("5");

      await factory
        .connect(client)
        .createProject(freelancer.address, ethers.ZeroAddress, [milestoneValue], {
          value: milestoneValue,
        });

      const projectAddress = await factory.deployedProjects(0);
      const escrow = (await ethers.getContractAt(
        "MilestoneEscrow",
        projectAddress,
        owner
      )) as unknown as MilestoneEscrow;

      const initialBalance = await ethers.provider.getBalance(freelancer.address);

      const tx = await escrow.connect(client).approveMilestone();
      const receipt = await tx.wait();
      // In local Hardhat tests this shouldn’t be null; still guard for TS:
      if (!receipt) {
        throw new Error("No receipt returned");
      }

      const finalBalance = await ethers.provider.getBalance(freelancer.address);
      expect(finalBalance).to.equal(initialBalance + milestoneValue);
    });
  });

  describe("Reputation NFT (AWM Ready)", () => {
    it("Should allow owner to mint and demonstrate soul-bound nature", async () => {
      await reputationNft.connect(owner).mintReputation(freelancer.address);
      expect(await reputationNft.ownerOf(0)).to.equal(freelancer.address);

      await expect(
        reputationNft
          .connect(freelancer)
          .transferFrom(freelancer.address, client.address, 0)
      ).to.be.revertedWith("Soul-bound: cannot transfer");
    });
  });
});
