/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

import { removeContactByAdmin } from '@/api/company';
import { Button } from '@/components/ui/button';
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
    <div className="flex flex-col space-y-6 pt-2">
      <div className="text-center text-sm text-slate-600">
        Are you sure you want to remove this contact? This action cannot be undone.
      </div>
      <div className="flex gap-3">
        <Button variant={'outline'} onClick={() => setIsOpen?.(!isOpen)} className="px-3" type="button">
          <ChevronLeft size={20} className="text-slate-500" />
          <span className="sr-only">Back</span>
        </Button>
        <Button loading={isLoading} onClick={handleContinue} variant={'error'} className="flex-1">
          Remove Contact
        </Button>
      </div>
    </div>
  );
};

export default ConfirmRemove;
