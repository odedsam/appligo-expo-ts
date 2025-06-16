import { create } from 'zustand';

type AuthStore = {
  user: string | null;
  login: (u: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  login: (u) => set({ user: u }),
  logout: () => set({ user: null }),
}));
