import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Trash2 } from 'lucide-react';

import { removeFilter } from '@/api/company';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalRemoveFilterProps {
  id: string;
  setIsDataCustomFilter: React.Dispatch<React.SetStateAction<any>>;
  name: string;
}
const ModalRemoveFilter: FCC<IModalRemoveFilterProps> = ({ children, id, setIsDataCustomFilter, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(removeFilter, {
    onSuccess: () => {
      setIsDataCustomFilter?.((prev: any) => {
        if (prev?.id === id) {
          return {};
        }
        return { ...prev };
      });
      queryClient.refetchQueries(['/custom-filter/list']);
      toast.success('Removed successfully!');
      setIsOpen(false);
    },
    onError: onMutateError,
  });
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = () => {
    mutate(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-slate-900">
            Delete Filter
          </DialogTitle>
        </DialogHeader>
        <div className="mb-6 mt-2 text-center text-sm text-slate-500">
          Are you sure you want to delete your saved search? This action cannot be undone.
        </div>

        <DialogFooter className="w-full sm:justify-center">
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full sm:w-32">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleSubmit} variant={'error'} className="w-full sm:w-32">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveFilter;
