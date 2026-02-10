import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { removeContactByAdmin } from '@/api/company';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Body1 from '@/components/ui/typography/body1';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalRemoveContactByAdminProps {
  contactId: string;
  refetch?: () => void;
}
const ModalRemoveContactByAdmin: FCC<IModalRemoveContactByAdminProps> = ({ children, refetch, contactId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const { mutate, isLoading } = useMutation(removeContactByAdmin, {
    onSuccess: () => {
      refetch?.();
      toast.success('Removed successfully!');
      handleToggle();
    },
    onError: onMutateError,
  });

  const handleContinue = () => {
    mutate(contactId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto text-center">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-blue">Remove</Tag>
          </DialogTitle>
        </DialogHeader>
        <Body1 className="text-neutral-40">Are you sure you want to remove this contact?</Body1>
        <HStack pos={'apart'} noWrap>
          <Button variant={'outline'} onClick={handleToggle} fullWidth>
            Cancel
          </Button>
          <Button loading={isLoading} fullWidth variant={'error'} onClick={handleContinue}>
            Remove
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveContactByAdmin;
