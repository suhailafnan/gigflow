// src/hooks/useContracts.ts

import { useWriteContract, useReadContract, useAccount, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useAppStore } from '../store/app';
import { CONTRACT_ADDRESSES, GIGFLOW_CORE_ABI } from '../lib/contracts';
import type { Profile, GigListing } from '../store/app'; // Import types for casting

// Custom hook for GigFlowCore contract interactions
export function useGigFlowCore() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  const { address: _address } = useAccount();
  const { upsertProfile, addGig: _addGig, setLoading, setError } = useAppStore();

  const updateProfile = async (
    name: string,
    bio: string,
    skills: string[],
    portfolioHashes: string[],
    isFreelancer: boolean,
    isClient: boolean
  ) => {
    try {
      setLoading(true);
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.GIGFLOW_CORE as `0x${string}`,
        abi: GIGFLOW_CORE_ABI,
        functionName: 'updateProfile',
        args: [name, bio, skills, portfolioHashes, isFreelancer, isClient],
      });
      
      upsertProfile({ name, bio, skills, portfolioHashes, isFreelancer, isClient });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseSubscription = async (tier: 'PRO' | 'ENTERPRISE') => {
    try {
      setLoading(true);
      const price = tier === 'PRO' ? parseEther('0.1') : parseEther('0.3');
      
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.GIGFLOW_CORE as `0x${string}`,
        abi: GIGFLOW_CORE_ABI,
        functionName: 'purchaseSubscription',
        args: [tier === 'PRO' ? 1 : 2],
        value: price,
      });

      upsertProfile({ 
        tier, 
        subscriptionExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000
      });
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const postGig = async (
    title: string,
    dataHash: string,
    budget: number,
    token: string,
    isConfidential: boolean,
    milestones: number[]
  ) => {
    try {
      setLoading(true);
      const budgetWei = parseEther(budget.toString());
      const milestonesWei = milestones.map(m => parseEther(m.toString()));
      
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.GIGFLOW_CORE as `0x${string}`,
        abi: GIGFLOW_CORE_ABI,
        functionName: 'postGig',
        args: [title, dataHash, budgetWei, token, isConfidential, milestonesWei],
        value: token === '0x0000000000000000000000000000000000000000' ? budgetWei : 0n,
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post gig');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignGig = async (gigId: number, freelancerAddress: string) => {
    try {
      setLoading(true);
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.GIGFLOW_CORE as `0x${string}`,
        abi: GIGFLOW_CORE_ABI,
        functionName: 'assignGig',
        args: [gigId, freelancerAddress],
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign gig');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    purchaseSubscription,
    postGig,
    assignGig,
    isPending,
    isSuccess,
    error,
  };
}

// Hook for reading contract data
export function useGigFlowData() {
  const { address } = useAccount();

  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESSES.GIGFLOW_CORE as `0x${string}`,
    abi: GIGFLOW_CORE_ABI,
    functionName: 'getProfile',
    args: address ? [address] : undefined,
  });

  const { data: userGigs } = useReadContract({
    address: CONTRACT_ADDRESSES.GIGFLOW_CORE as `0x${string}`,
    abi: GIGFLOW_CORE_ABI,
    functionName: 'getUserGigs',
    args: address ? [address] : undefined,
  });

  const { data: freelancerGigs } = useReadContract({
    address: CONTRACT_ADDRESSES.GIGFLOW_CORE as `0x${string}`,
    abi: GIGFLOW_CORE_ABI,
    functionName: 'getFreelancerGigs',
    args: address ? [address] : undefined,
  });

  return {
    profile: profile as Profile | undefined,
    userGigs: userGigs as GigListing[] | undefined,
    freelancerGigs: freelancerGigs as GigListing[] | undefined,
  };
}

// Hook for wallet connection and balance
export function useWallet() {
  // CORRECTED: `useAccount` provides address, isConnected, and chainId
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ address });

  const formattedBalance = balance ? formatEther(balance.value) : '0';

  return {
    address,
    isConnected,
    balance: formattedBalance,
    chainId, // Get chainId directly from useAccount
  };
}
