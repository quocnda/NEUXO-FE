import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { creatFilter } from '@/api/company';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import Base3 from '../../ui/typography/base3';
import Title1 from '../../ui/typography/title1';
import { HStack, Show, VStack } from '../../ui/Utilities';

type SelectedValuesType = {
  [key: string]: { label: string; value: string }[];
};
interface IModalCreateFilterProps {
  selectedValues: {
    [key: string]: { value: string; label: string }[];
  };
  setIsDataCustomFilter: React.Dispatch<React.SetStateAction<{ id: string; filter_name: string; filter: any }>>;
  isDataCustomFilter: { id: string; filter_name: string; filter: any };
}
const ModalCreateFilter: FCC<IModalCreateFilterProps> = ({
  children,
  selectedValues,
  setIsDataCustomFilter,
  isDataCustomFilter,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [value, setValue] = useState('');
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(creatFilter, {
    onSuccess: (res) => {
      if (res?.data) {
        setIsDataCustomFilter({
          id: res?.data?.id,
          filter_name: res?.data?.filter_name,
          filter: res?.data?.filter,
        });
      } else {
        setIsDataCustomFilter((prev) => ({ ...prev }));
      }
      if (isSave) {
        toast.success('Created successfully!');
      } else toast.success('Updated successfully!');

      queryClient.refetchQueries(['/custom-filter/list']);
      setIsOpenModal(false);
    },
    onError: onMutateError,
  });
  const handleToggle = () => {
    setIsOpenModal(!isOpenModal);
  };
  const handleSubmit = () => {
    const formattedValues = Object.keys(selectedValues as SelectedValuesType).reduce((acc: any, key: string) => {
      acc[key] = (selectedValues as SelectedValuesType)[key].map((item) => item.value);
      return acc;
    }, {});
    if ('assignee' in formattedValues) {
      delete formattedValues.assignee;
    }
    if (!isSave && isDataCustomFilter?.id) {
      mutate({
        id: isDataCustomFilter?.id,
        filter_name: value || isDataCustomFilter?.filter_name,
        filter: formattedValues,
      });
    } else
      mutate({
        filter_name: value || isDataCustomFilter?.filter_name,
        filter: formattedValues,
      });
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen flex-col justify-between overflow-auto">
        <Show when={isSave || !isDataCustomFilter?.id}>
          <DialogHeader>
            <DialogTitle>
              <Tag className="bg-secondary-blue text-xl">Save Search</Tag>
            </DialogTitle>
          </DialogHeader>
          <VStack spacing={12}>
            <Base3 className="text-sm text-neutral-50">
              <span className="text-red-500">*</span> Name
            </Base3>
            <Input placeholder="Enter Search Name" variant={'outline'} onChange={(e) => setValue(e.target.value)} />
          </VStack>
          <HStack pos={'apart'} noWrap className="mt-4">
            <Button
              onClick={() => {
                if (isDataCustomFilter?.id) {
                  setIsSave(false);
                } else {
                  handleToggle();
                }
              }}
              variant={'outline'}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!value} loading={isLoading} fullWidth>
              Save
            </Button>
          </HStack>
        </Show>
        <Show when={!isSave && !!isDataCustomFilter?.id}>
          <Title1 className="text-center">
            Are you sure you want to update for <span className="font-medium">{isDataCustomFilter?.filter_name}</span>?
          </Title1>
          <HStack pos={'apart'} className="mt-4">
            <Button onClick={handleToggle} variant={'outline'}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsSave(true)} variant={'outline'}>
                Add new Saved Search
              </Button>
              <Button onClick={handleSubmit} loading={isLoading}>
                Update
              </Button>
            </div>
          </HStack>
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateFilter;
