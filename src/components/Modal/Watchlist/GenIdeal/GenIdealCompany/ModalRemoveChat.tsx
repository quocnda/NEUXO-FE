import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { handleRemoveChatHistory } from '@/api/watchlist';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalRemoveChatProps {
  refetch?: () => void;
  completion_id: string;
  currentId: string | null;
  handleNews: () => Promise<void>;
}
const ModalRemoveChat: FCC<IModalRemoveChatProps> = ({ children, refetch, completion_id, currentId, handleNews }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useMutation(handleRemoveChatHistory, {
    onSuccess: () => {
      refetch?.();
      toast.success('Removed successfully!');
      setIsOpen(false);
      if (currentId === completion_id) {
        handleNews();
      }
    },
    onError: onMutateError,
  });
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = () => {
    mutate({
      completion_id,
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
            <Tag className="bg-secondary-orange">Remove</Tag>
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-lg font-medium">Are you sure you want to remove this chat?</p>
        <HStack pos={'center'} noWrap spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="h-10 w-full">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleSubmit} variant={'error'} className="h-10 w-full">
            Remove
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveChat;
