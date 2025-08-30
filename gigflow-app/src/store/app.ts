import { create } from 'zustand';

export type Session = { auth: 'wallet' | 'email' | null; address?: string; userId?: string };
export type Work = { title: string; url: string };
export type Profile = { name: string; bio: string; skills: string[]; works: Work[] };
export type Gig = { id: string; title: string; desc: string; skills: string[]; budget: number; token?: string; milestones: { title: string; amount: number }[]; owner: string; status: "Open" | "Assigned" | "InProgress" | "Completed"; applicants: string[]; assignee?: string };
export type Notification = { id: string; type: "Apply" | "Accept" | "Milestone"; gigId: string; from: string; createdAt: number; read: boolean };

type AppState = {
  session: Session;
  profile: Profile;
  gigs: Gig[];
  notifications: Notification[];
  setSession: (s: Partial<Session>) => void;
  upsertProfile: (p: Partial<Profile>) => void;
  addGig: (g: Gig) => void;
  updateGig: (id: string, patch: Partial<Gig>) => void;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  session: { auth: null },
  profile: { name: "", bio: "", skills: [], works: [] },
  gigs: [],
  notifications: [],
  setSession: (s) => set((st) => ({ session: { ...st.session, ...s } })),
  upsertProfile: (p) => set((st) => ({ profile: { ...st.profile, ...p } })),
  addGig: (g) => set((st) => ({ gigs: [g, ...st.gigs] })),
  updateGig: (id, patch) => set((st) => ({ gigs: st.gigs.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
  addNotification: (n) => set((st) => ({ notifications: [n, ...st.notifications] })),
  markRead: (id) => set((st) => ({ notifications: st.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
}));
