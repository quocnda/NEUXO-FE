import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import EmailNotification from '@/components/EmailNotification';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores';

import AuthProfile from './Profile';
// import SheetNews from './SheetNews';

const AuthHeader = () => {
  const { fullSidebar, toggleSidebar } = useLayoutStore();

  return (
    <>
      <header
        className={cn(
          {
            'left-[5.625rem]': !fullSidebar,
            'left-[15.9375rem]': fullSidebar,
          },
          'border-input flex h-14 w-full items-center justify-between border-b border-[#E6E8EC] bg-white/90 px-5 shadow-[0_1px_0_rgba(16,24,40,0.04)] backdrop-blur'
        )}
      >
        <HStack>
          <div className="block md:hidden">
            <button
              onClick={toggleSidebar}
              className="border-neutral-20 text-neutral-60 flex items-center rounded-md border bg-white p-1 shadow-sm"
            >
              {!fullSidebar ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
          </div>
        </HStack>

        <HStack spacing={20} align="center">
          <AuthProfile />
        </HStack>
      </header>
    </>
  );
};

export default AuthHeader;
