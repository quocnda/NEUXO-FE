import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { handleRemoveBlackList } from '@/api/company';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalRemoveBlackListProps {
  selectedIds: any[];
  refetch?: () => void;
  setIsDownloadAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIds?: React.Dispatch<React.SetStateAction<any[]>>;
}
const ModalRemoveBlackList: FCC<IModalRemoveBlackListProps> = ({
  children,
  selectedIds,
  refetch,
  setIsDownloadAll,
  setSelectedIds,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useMutation(handleRemoveBlackList, {
    onSuccess: () => {
      refetch?.();
      setIsDownloadAll?.(false);
      setSelectedIds?.([]);
      toast.success('Removed from blacklist successfully!');
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
          <DialogTitle>
            <Tag className="bg-secondary-orange">Remove Blacklist</Tag>
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-lg font-medium">Are you sure you want to remove from blacklist?</p>
        <HStack pos={'center'} noWrap spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="h-10 w-full">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleSubmit} className="h-10 w-full">
            Remove
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveBlackList;
