import { createQuery } from 'react-query-kit';

import { useUserStore } from '@/stores';

import { getListAdmin, getUserProfile } from './requests';
import type { ISignupResponse, IUser } from './types';

export const useUserQuery = createQuery<IUser>({
  primaryKey: '/me',
  queryFn: getUserProfile,
  onSuccess: (data) => {
    const { setUser } = useUserStore.getState();
    if (data) setUser(data);
  },
});
export const useListAdmin = createQuery<ISignupResponse[]>({
  primaryKey: '/admin-list',
  queryFn: getListAdmin,
});
