import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { pinCompanyWatchlist } from '@/api/watchlist';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalPinWatchlistProps {
  refetch?: () => void;
  company_name?: string;
  company_id?: string;
  checkPin?: boolean;
}
const ModalPinWatchlist: FCC<IModalPinWatchlistProps> = ({ children, refetch, company_name, company_id, checkPin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useMutation(pinCompanyWatchlist, {
    onSuccess: () => {
      refetch?.();
      toast.success('Pin company successfully!');
      setIsOpen(false);
    },
    onError: onMutateError,
  });
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = () => {
    mutate({
      company_id: String(company_id),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-orange">
              {checkPin ? 'Unpin' : 'Pin'} {company_name}
            </Tag>
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-lg font-medium">
          Are you sure you want to {checkPin ? 'unpin' : 'pin'} this company
        </p>
        <HStack pos={'center'} noWrap spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="h-10 w-full">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleSubmit} className="h-10 w-full">
            {checkPin ? 'Unpin' : 'Pin'}
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPinWatchlist;
