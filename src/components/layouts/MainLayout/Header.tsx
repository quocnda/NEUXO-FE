import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import EmailNotification from '@/components/EmailNotification';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores';

import AuthProfile from './Profile';
import SheetNews from './SheetNews';

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
          'border-input flex h-12 w-full items-center justify-between border-b bg-[#ffffff] p-4'
        )}
      >
        <HStack>
          <div className="block md:hidden">
            <button
              onClick={toggleSidebar}
              className="border-neutral-30 text-neutral-40 flex items-center rounded-sm border-2 p-1"
            >
              {!fullSidebar ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
          </div>
        </HStack>

        <HStack spacing={24} align="center">
          <HStack spacing={24}>
            <SheetNews />
            <EmailNotification />
          </HStack>{' '}
          <span className="h-7 border border-r-[0px] border-[#6F767E]"></span>
          <AuthProfile />
        </HStack>
      </header>
    </>
  );
};

export default AuthHeader;
