import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { creatFilter } from '@/api/company';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Base3 from '@/components/ui/typography/base3';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalReNameFilterProps {
  setIsDataCustomFilter: React.Dispatch<React.SetStateAction<{ id: string; filter_name: string; filter: any }>>;
  isDataCustomFilter: { id: string; filter_name: string; filter: any };
}
const ModalReNameFilter: FCC<IModalReNameFilterProps> = ({ children, setIsDataCustomFilter, isDataCustomFilter }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [value, setValue] = useState<string>(isDataCustomFilter?.filter_name);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(creatFilter, {
    onSuccess: () => {
      setIsDataCustomFilter((prev) => ({ ...prev, filter_name: value }));
      toast.success('Updated successfully!');

      queryClient.refetchQueries(['/custom-filter/list']);
      setIsOpenModal(false);
    },
    onError: onMutateError,
  });
  const handleToggle = () => {
    setIsOpenModal(!isOpenModal);
  };
  const handleSubmit = () => {
    const filteredValues = { ...isDataCustomFilter?.filter };
    if (filteredValues.assignee) {
      delete filteredValues.assignee;
    }
    mutate({
      id: isDataCustomFilter?.id,
      filter_name: value,
      filter: filteredValues,
    });
  };
  return (
    <Dialog open={isOpenModal} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen flex-col justify-between overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-blue text-xl">Save Search</Tag>
          </DialogTitle>
        </DialogHeader>
        <VStack spacing={12}>
          <Base3 className="text-neutral-50">
            <span className="text-red-500">*</span> Name
          </Base3>
          <Input
            variant={'outline'}
            placeholder="Enter Search Name"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </VStack>
        <HStack pos={'apart'} noWrap>
          <Button onClick={handleToggle} variant={'outline'} fullWidth>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!value} loading={isLoading} fullWidth>
            Save
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalReNameFilter;
