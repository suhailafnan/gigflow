import { ethers } from 'ethers';

export function createLocalWallet() {
  // Use ethers.js to create a random wallet
  const wallet = ethers.Wallet.createRandom();

  return {
    privateKey: wallet.privateKey,
    address: wallet.address
  };
}
