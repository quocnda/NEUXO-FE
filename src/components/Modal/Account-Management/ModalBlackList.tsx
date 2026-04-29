import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { handleAddBlackList } from '@/api/company';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import Title1 from '../../ui/typography/title1';

interface IModalBlackListProps {
  selectedIds: any[];
  refetch?: () => void;
  setIsDownloadAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIds?: React.Dispatch<React.SetStateAction<any[]>>;
}
const ModalBlackList: FCC<IModalBlackListProps> = ({
  children,
  selectedIds,
  refetch,
  setIsDownloadAll,
  setSelectedIds,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useMutation(handleAddBlackList, {
    onSuccess: () => {
      refetch?.();
      setIsDownloadAll?.(false);
      setSelectedIds?.([]);
      toast.success('Added to blacklist successfully!');
      setIsOpen(false);
    },
    onError: onMutateError,
  });
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = () => {
    mutate({
      ids: selectedIds.join(','),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            <Tag className="bg-secondary-orange">Blacklist</Tag>
          </DialogTitle>
        </DialogHeader>
        <Title1 className="text-center">Are you sure you want to add the selected companies to the blacklist?</Title1>
        <HStack pos={'center'} noWrap className="mt-5" spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleSubmit} className="w-full">
            Add
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBlackList;
