import { DialogTitle } from '@radix-ui/react-dialog';
import React, { useState } from 'react';

import { Icons } from '@/assets/icons';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import Base1 from '@/components/ui/typography/base1';
import Base3 from '@/components/ui/typography/base3';
import Title1 from '@/components/ui/typography/title1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import News from '@/features/company-detail/components/News';
import { tabNewsWatchList } from '@/features/watchlist-all/utils/const';
import type { FCC } from '@/types';

import GenIdealCompany from './GenIdealCompany/GenIdealCompany';
import GenIdealContact from './GenIdealContact/GenIdealContact';

interface IModalGenIdealProps {
  company_id_outside?: string;
}
const ModalGenIdeal: FCC<IModalGenIdealProps> = ({ children, company_id_outside }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<number | string>(tabNewsWatchList[0].value);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setTab(tabNewsWatchList[0].value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-screen-xl overflow-y-auto overflow-x-hidden p-3 sm:max-h-screen">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Icons.genidealBlue color="#2A85FF" width={24} height={24} />
            <Title1>AI-generated pitch ideas</Title1>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="col-span-1 w-full">
            <News isHidden />
          </div>
          <div className="bg-neutral-10 relative col-span-1 flex h-full w-full items-start lg:col-span-2">
            <VStack spacing={24} className="h-full w-full">
              <VStack spacing={12}>
                <HStack pos={'apart'}>
                  <Base3>Select news&apos;s source</Base3>
                </HStack>

                <HStack noWrap spacing={8}>
                  {tabNewsWatchList.map((item, index) => {
                    return (
                      <div
                        className={cn(
                          'bg-neutral-10 text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md px-4',
                          tab === item.value && 'bg-main text-white'
                        )}
                        key={index}
                        onClick={() => {
                          setTab(item.value);
                        }}
                      >
                        <Base1 className="text-xs">{item.label}</Base1>
                      </div>
                    );
                  })}
                </HStack>
              </VStack>

              <Show when={tab === tabNewsWatchList[0].value}>
                <GenIdealCompany isOpen={isOpen} />
              </Show>
              <Show when={tab === tabNewsWatchList[1].value}>
                <GenIdealContact tab={tab} />
              </Show>
            </VStack>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalGenIdeal;
