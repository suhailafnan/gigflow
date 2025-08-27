import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1) Deploy ReputationNFT (owner = deployer)
  const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
  const reputationNft = await ReputationNFT.deploy(deployer.address);
  await reputationNft.waitForDeployment();
  const reputationAddr = await reputationNft.getAddress();
  console.log("ReputationNFT:", reputationAddr);

  // 2) Deploy ProjectFactory
  const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
  const factory = await ProjectFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("ProjectFactory:", factoryAddr);

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
