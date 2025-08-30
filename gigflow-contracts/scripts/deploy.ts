import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1) Deploy ReputationNFT
  const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
  const reputationNft = await ReputationNFT.deploy(deployer.address);
  await reputationNft.waitForDeployment();
  const reputationAddr = await reputationNft.getAddress();
  console.log("ReputationNFT:", reputationAddr);

  // 2) Deploy ProjectFactory
  const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
  const projectFactory = await ProjectFactory.deploy();
  await projectFactory.waitForDeployment();
  const factoryAddr = await projectFactory.getAddress();
  console.log("ProjectFactory:", factoryAddr);

  // 3) Deploy GigFlowCore
  const GigFlowCore = await ethers.getContractFactory("GigFlowCore");
  const gigFlowCore = await GigFlowCore.deploy(reputationAddr, factoryAddr);
  await gigFlowCore.waitForDeployment();
  const coreAddr = await gigFlowCore.getAddress();
  console.log("GigFlowCore:", coreAddr);

  console.log("All deployed successfully");
}

main().catch((e) => {
  console.error("Deployment failed:", e);
  process.exitCode = 1;
});
