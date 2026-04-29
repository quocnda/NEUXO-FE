import React, { useState } from 'react';

import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Body1 from '@/components/ui/typography/body1';
import { HStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

interface IModalConfirmWatchListProps {
  companyId: string;
  setCompanyId?: React.Dispatch<React.SetStateAction<string>>;
  refetch?: () => void;
  setIsStepOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalConfirmWatchList: FCC<IModalConfirmWatchListProps> = ({ children, setIsStepOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleContinue = () => {
    setIsStepOpen?.(true);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto text-center">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-blue">Add to watchlist</Tag>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center space-x-[-20px]">
          {Array.from({ length: 3 }).map((src, index) => (
            <div key={index} className="h-16 w-16 overflow-hidden rounded-full bg-orange-300">
              <img src="/images/Avatar.png" alt={`Avatar ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <Body1 className="text-neutral-40">This company is already in another watchlist.</Body1>
        <Body1 className="text-neutral-70">Do you want to continue to add it into your watchlist?</Body1>
        <HStack pos={'apart'} noWrap>
          <Button variant={'outline'} onClick={handleToggle} fullWidth>
            Cancel
          </Button>
          <Button fullWidth onClick={handleContinue}>
            Continue
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmWatchList;
