import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { removeFilter } from '@/api/company';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import Title1 from '../../ui/typography/title1';

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            <Tag className="bg-secondary-orange">Delete</Tag>
          </DialogTitle>
        </DialogHeader>
        <Title1 className="p-3 text-center">Are you sure you want to delete your saved search?</Title1>

        <HStack pos={'center'} noWrap className="p-3" spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleSubmit} className="w-full" variant={'error'}>
            Yes, I am
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveFilter;
