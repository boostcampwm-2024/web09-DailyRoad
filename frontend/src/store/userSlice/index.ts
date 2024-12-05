import { StateCreator } from 'zustand';

import { StoreState, User } from '@/types';

export type AuthState = {
  isLogged: boolean;
  user: User | null;
  setUser: (user: User) => void;
  logIn: () => void;
  logOut: () => void;
};

export const createAuthSlice: StateCreator<StoreState, [], [], AuthState> = (
  set,
) => ({
  isLogged: false,
  user: null,
  setUser: (user: User) => {
    set((state) => ({ ...state, user }));
  },
  logIn: () => {
    set(() => ({ isLogged: true }));
  },
  logOut: () => {
    set(() => ({ isLogged: false, user: null }));
  },
});
