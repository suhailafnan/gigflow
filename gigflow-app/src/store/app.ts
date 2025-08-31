// src/store/app.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// FIX 1: Define and export the 'Work' type
export type Work = {
  title: string;
  url: string;
};

export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export type Session = {
  auth: 'wallet' | 'email' | null;
  address?: string;
  userId?: string;
  chainId?: number;
  isConnected: boolean;
};

// FIX 2: Add the 'works' property to the Profile type
export type Profile = {
  name: string;
  bio: string;
  skills: string[];
  portfolioHashes: string[];
  tier: SubscriptionTier;
  subscriptionExpiry: number;
  reputationScore: number;
  isFreelancer: boolean;
  isClient: boolean;
  completedGigs: number;
  activeGigs: number;
  works: Work[]; // <-- ADDED THIS LINE
};

export type GigListing = {
  id: number;
  client: string;
  title: string;
  dataHash: string;
  budget: number;
  token: string;
  isConfidential: boolean;
  createdAt: number;
  isActive: boolean;
  escrowContract: string;
  description?: string;
  skills?: string[];
  milestones?: { title: string; amount: number }[];
  owner: string;
  status: 'Open' | 'Assigned' | 'Completed' | 'Cancelled';
  applicants: string[];
  assignee?: string;
};

export type Notification = {
  id: string;
  type: "Apply" | "Accept" | "Milestone" | "Complete";
  gigId: number;
  from: string;
  createdAt: number;
  read: boolean;
  title: string;
message: string;
};

// FIX 3: Add 'upsertProfile' to the AppState type
type AppState = {
  session: Session;
  profile: Profile;
  gigs: GigListing[];
  myPostedGigs: GigListing[];
  myAssignedGigs: GigListing[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  setSession: (s: Partial<Session>) => void;
  upsertProfile: (p: Partial<Profile>) => void; // Renamed from setProfile
  setGigs: (gigs: GigListing[]) => void;
  addGig: (g: GigListing) => void;
  updateGig: (id: number, patch: Partial<GigListing>) => void;
  // ... rest of the type
  setMyPostedGigs: (gigs: GigListing[]) => void;
  setMyAssignedGigs: (gigs: GigListing[]) => void;
  addNotification: (n: Notification) => void;
  markAllRead: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

// FIX 4: Initialize the 'works' array in the initial profile
const initialProfile: Profile = {
  name: "",
  bio: "",
  skills: [],
  portfolioHashes: [],
  tier: 'FREE',
  subscriptionExpiry: 0,
  reputationScore: 0,
  isFreelancer: false,
  isClient: false,
  completedGigs: 0,
  activeGigs: 0,
  works: [], // <-- ADDED THIS LINE
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      session: { auth: null, isConnected: false },
      profile: initialProfile,
      gigs: [],
      myPostedGigs: [],
      myAssignedGigs: [],
      notifications: [],
      isLoading: false,
      error: null,
      setSession: (s) => set((state) => ({ session: { ...state.session, ...s, isConnected: true } })),
      // FIX 5: Implement the 'upsertProfile' function
      upsertProfile: (p) => set((state) => ({
        profile: { ...state.profile, ...p }
      })),
      setGigs: (gigs) => set({ gigs }),
      addGig: (g) => set((state) => ({
        gigs: [g, ...state.gigs],
        myPostedGigs: g.client === state.session.address ? [g, ...state.myPostedGigs] : state.myPostedGigs,
      })),
      updateGig: (id, patch) => set((state) => ({
        gigs: state.gigs.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        myPostedGigs: state.myPostedGigs.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        myAssignedGigs: state.myAssignedGigs.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      })),
      setMyPostedGigs: (gigs) => set({ myPostedGigs: gigs }),
      setMyAssignedGigs: (gigs) => set({ myAssignedGigs: gigs }),
      addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
      markAllRead: () => set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reset: () => set({ /* ... reset state ... */ }),
    }),
    {
      name: 'gigflow-storage',
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
        notifications: state.notifications,
      }),
    }
  )
);
