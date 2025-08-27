import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { MilestoneEscrow, ProjectFactory, ReputationNFT } from "../typechain-types";
import { Contract } from "ethers";

// A mock ERC20 token for testing purposes
async function deployMockUSDC(owner: HardhatEthersSigner, client: HardhatEthersSigner) {
    const MockUSDC = await ethers.getContractFactory("MockERC20", owner);
    const mockUsdc = await MockUSDC.deploy("Mock USDC", "USDC", ethers.parseUnits("10000", 6));
    await mockUsdc.transfer(client.address, ethers.parseUnits("1000", 6));
    return mockUsdc;
}

// A helper to deploy the MockERC20 contract before tests
const MockERC20Artifact = require("../artifacts/contracts/MockERC20.sol/MockERC20.json");

describe("GigFlow Platform - Avalanche-Ready", function () {
    let owner: HardhatEthersSigner, client: HardhatEthersSigner, freelancer: HardhatEthersSigner;
    let factory: ProjectFactory;
    let reputationNft: ReputationNFT;
    let usdc: Contract;

    before(async () => {
        // Deploy MockERC20 contract for Hardhat to use in tests
        const [tempOwner] = await ethers.getSigners();
        const MockERC20Factory = new ethers.ContractFactory(MockERC20Artifact.abi, MockERC20Artifact.bytecode, tempOwner);
        await MockERC20Factory.deploy("MockERC20", "M20", ethers.parseUnits("1", 18));
    });

    beforeEach(async function () {
        [owner, client, freelancer] = await ethers.getSigners();
        
        usdc = await deployMockUSDC(owner, client);
        
        const ReputationNFTFactory = await ethers.getContractFactory("ReputationNFT");
        reputationNft = await ReputationNFTFactory.deploy(owner.address);

        const ProjectFactoryFactory = await ethers.getContractFactory("ProjectFactory");
        factory = await ProjectFactoryFactory.deploy();
    });

    describe("Project Creation and Funding", () => {
        it("Should create a project with native AVAX", async function () {
            const milestones = [ethers.parseEther("1"), ethers.parseEther("2")];
            const totalValue = ethers.parseEther("3");

            await expect(
                factory.connect(client).createProject(freelancer.address, ethers.ZeroAddress, milestones, { value: totalValue })
            ).to.emit(factory, "ProjectCreated");

            const projectAddress = await factory.deployedProjects(0);
            expect(await ethers.provider.getBalance(projectAddress)).to.equal(totalValue);
        });

        it("Should create a project with USDC tokens", async function () {
            const milestones = [ethers.parseUnits("100", 6), ethers.parseUnits("200", 6)];
            const totalValue = ethers.parseUnits("300", 6);
            
            await usdc.connect(client).approve(await factory.getAddress(), totalValue);

            await factory.connect(client).createProject(freelancer.address, await usdc.getAddress(), milestones);
            const projectAddress = await factory.deployedProjects(0);
            expect(await usdc.balanceOf(projectAddress)).to.equal(totalValue);
        });
    });

    describe("Milestone Payments", () => {
        it("Should pay freelancer in AVAX for an approved milestone", async () => {
            const milestoneValue = ethers.parseEther("5");
            await factory.connect(client).createProject(freelancer.address, ethers.ZeroAddress, [milestoneValue], { value: milestoneValue });
            const projectAddress = await factory.deployedProjects(0);
            const escrow = await ethers.getContractAt("MilestoneEscrow", projectAddress);
            
            const initialBalance = await ethers.provider.getBalance(freelancer.address);
            const tx = await escrow.connect(client).approveMilestone();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            
            const finalBalance = await ethers.provider.getBalance(freelancer.address);
            expect(finalBalance).to.equal(initialBalance + milestoneValue);
        });
    });
    
    describe("Reputation NFT (AWM Ready)", () => {
        it("Should allow owner to mint and demonstrate soul-bound nature", async () => {
            await reputationNft.connect(owner).mintReputation(freelancer.address);
            expect(await reputationNft.ownerOf(0)).to.equal(freelancer.address);
            
            await expect(reputationNft.connect(freelancer).transferFrom(freelancer.address, client.address, 0))
                .to.be.revertedWith("Soul-bound: cannot transfer");
        });
    });
});
