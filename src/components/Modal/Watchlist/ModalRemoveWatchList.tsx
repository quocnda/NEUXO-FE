import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import { Button } from '../../ui/button';
import Title1 from '../../ui/typography/title1';
import { HStack } from '../../ui/Utilities';

interface IModalRemoveWatchListProps {
  removeWatch: () => void;
  isLoading: boolean;
}
const ModalRemoveWatchList: FCC<IModalRemoveWatchListProps> = ({ children, isLoading, removeWatch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            <Tag className="bg-secondary-purple">Delete</Tag>
          </DialogTitle>
        </DialogHeader>
        <Title1 className="text-center">
          Are you sure you want to remove the selected companies from the watchlist?
        </Title1>
        <HStack pos={'center'} noWrap className="mt-5" spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full">
            Cancel
          </Button>
          <Button
            loading={isLoading}
            onClick={() => {
              removeWatch();
              handleToggle();
            }}
            className="w-full border-2"
            variant={'error'}
          >
            Remove
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveWatchList;
