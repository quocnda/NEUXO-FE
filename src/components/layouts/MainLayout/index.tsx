import type { ReactNode } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores';
import type { FCC } from '@/types';

import AuthHeader from './Header';
import SideBar from './SideBar';

interface Props {
  children: ReactNode;
}

const MainLayout: FCC<Props> = ({ children }) => {
  const { fullSidebar } = useLayoutStore();

  return (
    <div className="flex min-h-screen overflow-clip bg-[#F9F8F7]">
      <SideBar />

      <div
        style={{
          width: '-webkit-fill-available',
        }}
        className={cn(
          {
            'ml-0 md:ml-[4.25rem]': !fullSidebar,
            'md:ml-[13.9375rem]': fullSidebar,
          },
          'relative z-10 w-fit overflow-clip transition-all duration-300 ease-linear'
        )}
      >
        <AuthHeader />
        <main className="w-full p-2">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
