import type { QueryHookOptions } from 'react-query-kit';

import type { IUser } from '@/api/auth';
import { useUserQuery } from '@/api/auth';
import { useUserStore } from '@/stores';

export const useAuth = (options?: QueryHookOptions<IUser, Error, IUser, any> | undefined) => {
  const { isLogin } = useUserStore.getState();

  const { data, ...rest } = useUserQuery({ ...options, enabled: isLogin, refetchOnMount: true });

  return {
    isLoggedIn: !!data,
    user: data,
    ...rest,
  };
};
