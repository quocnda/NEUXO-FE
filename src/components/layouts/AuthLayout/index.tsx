import type { ReactNode } from 'react';
import React from 'react';

import type { FCC } from '@/types';

import LeftSignIn from './LeftSignIn';

interface Props {
  children: ReactNode;
}

const AuthLayout: FCC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      <LeftSignIn />
      <div className="col-span-2 flex min-h-screen items-center md:col-span-1 lg:col-span-3">{children}</div>
    </div>
  );
};

export default AuthLayout;
