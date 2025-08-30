import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "dotenv/config";

const FUJI_PRIVATE_KEY = process.env.FUJI_PRIVATE_KEY || "";
const SUBNET_PRIVATE_KEY = process.env.SUBNET_PRIVATE_KEY || FUJI_PRIVATE_KEY;

const SUBNET_RPC_URL = process.env.SUBNET_RPC_URL || "http://127.0.0.1:9650/ext/bc/C/rpc";
const SUBNET_CHAIN_ID = process.env.SUBNET_CHAIN_ID ? Number(process.env.SUBNET_CHAIN_ID) : 99999;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,           // Enable IR pipeline
      optimizer: {
        enabled: true,       // Enable optimizer
        runs: 200            // Optimize for ~200 runs
      }
    }
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 225_000_000_000,
      accounts: FUJI_PRIVATE_KEY ? [FUJI_PRIVATE_KEY] : [],
    },
    gigflowSubnet: {
      url: SUBNET_RPC_URL,
      chainId: SUBNET_CHAIN_ID,
      accounts: SUBNET_PRIVATE_KEY ? [SUBNET_PRIVATE_KEY] : [],
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
