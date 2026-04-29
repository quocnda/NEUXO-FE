import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ILoginResponse, IUser } from '@/api/auth';

export interface IMeQueryStore {
  user: IUser;
  access_token: string;
  refresh_token?: string;
  role: string;
  setIsRole: (data: string) => void;
  isLogin: boolean;
  setIsLogin: (data: boolean) => void;
  setStore: (data: ILoginResponse) => void;
  setUser: (data: IUser) => void;
  setAccessToken: (data: string) => void;
  logout: () => void;
}

const useBaseUserStore = create<IMeQueryStore>()(
  persist(
    (set) => ({
      access_token: '',
      refresh_token: undefined,
      role: '',
      setIsRole: (data) => set(() => ({ role: data })),
      user: {} as IUser,
      isLogin: false,
      setStore: (data) => set(() => data),
      setUser: (data) => set(() => ({ user: data })),
      setAccessToken: (data) => set((state) => ({ ...state, access_token: data })),
      setIsLogin: (data) => set(() => ({ isLogin: data })),
      logout: () => set(() => ({ access_token: '', refresh_token: undefined, user: {} as IUser })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUserStore = createSelectorFunctions(useBaseUserStore);
