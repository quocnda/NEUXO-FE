import { Loader } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { IUser } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/stores';
import { ROUTE } from '@/types';

export interface WithAuthProps {}

export default function withAuth<T extends WithAuthProps = WithAuthProps>(Component: React.ComponentType<T>) {
  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const router = useRouter();
    const { isLoading } = useAuth();

    const { isLogin, setUser } = useUserStore();

    useEffect(() => {
      if (!isLogin) {
        setUser({} as IUser);
        router.replace(ROUTE.SIGN_IN);
      }
    }, [router, isLogin, setUser]);

    if (isLoading) {
      return (
        <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center gap-2 bg-black/30 backdrop-blur-md">
          <Loader size="3rem" className={'animate-spin text-white'} />
        </div>
      );
    }

    return <Component {...(props as T)} />;
  };

  return ComponentWithAuth;
}
