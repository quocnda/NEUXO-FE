import React from 'react';

import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Body1 from '@/components/ui/typography/body1';
import { HStack, Show } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

interface IModalcheckHadOtherWatchlistProps {
  isOpenConfirm: boolean;
  setIsOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: any;
  warningCompanyNames?: string[];
}
const ModalcheckHadOtherWatchlist: FCC<IModalcheckHadOtherWatchlistProps> = ({
  children,
  setIsOpenConfirm,
  isOpenConfirm,
  mutate,
  warningCompanyNames,
}) => {
  const handleToggle = () => {
    setIsOpenConfirm(!isOpenConfirm);
  };
  const addWatchList = () => {
    mutate();
  };
  return (
    <Dialog open={isOpenConfirm} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-blue" classNameContent="text-xl">
              Add to watchlist
            </Tag>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center space-x-[-20px]">
          {Array.from({ length: 3 }).map((src, index) => (
            <div key={index} className="h-16 w-16 overflow-hidden rounded-full bg-orange-300">
              <img src="/images/Avatar.png" alt={`Avatar ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <Show when={!!warningCompanyNames}>
          <Body1 className="text-neutral-40 text-center">
            {warningCompanyNames} is already in another watchlist. Do you want to continue to add it into your
            watchlist?
          </Body1>
        </Show>
        <Show when={!warningCompanyNames}>
          <Body1 className="text-neutral-70 text-center">
            This company is already in another watchlist. Do you want to continue to add it into your watchlist?
          </Body1>
        </Show>
        <HStack pos={'apart'} noWrap spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} fullWidth>
            Cancel
          </Button>
          <Button onClick={addWatchList} fullWidth>
            Continue
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalcheckHadOtherWatchlist;
