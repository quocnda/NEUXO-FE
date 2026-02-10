/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

import { removeContactByAdmin } from '@/api/company';
import { Button } from '@/components/ui/button';
import Body1 from '@/components/ui/typography/body1';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IConfirmRemoveProps {
  refetch?: () => void;
  contactId: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const ConfirmRemove: FCC<IConfirmRemoveProps> = ({ refetch, contactId, isOpen, setIsOpen }) => {
  const { mutate, isLoading } = useMutation(removeContactByAdmin, {
    onSuccess: () => {
      refetch?.();
      toast.success('Removed successfully!');
      setIsOpen?.(false);
    },
    onError: onMutateError,
  });

  const handleContinue = () => {
    mutate(contactId);
  };

  return (
    <VStack>
      <Body1 className="text-neutral-40 text-center">Are you sure you want to remove this contact?</Body1>
      <HStack pos={'apart'} noWrap spacing={8}>
        <Button variant={'outline'} onClick={() => setIsOpen?.(!isOpen)} className="h-10 w-10">
          <div className="mx-auto">
            <ChevronLeft size={20} color="#6F767E" />
          </div>
        </Button>
        <Button loading={isLoading} onClick={handleContinue} variant={'error'} fullWidth>
          Save
        </Button>
      </HStack>
    </VStack>
  );
};

export default ConfirmRemove;
