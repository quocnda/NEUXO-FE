import { zodResolver } from '@hookform/resolvers/zod';
import type { UseMutateFunction } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useListICPWatchlist } from '@/api/watchlist';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HStack, VStack } from '@/components/ui/Utilities';
import type { SchemaAddICPWatchlist } from '@/lib/validations/company';
import { schemaAddICPWatchlist } from '@/lib/validations/company';
import type { FCC } from '@/types';

import { FormWrapper } from '../../ui/form';
import { SelectField } from '../../ui/FormField';

interface IModalEditICPWatchlistProps {
  refetch: () => void;
  company_id?: string;
  valueICP?: string;
  setValueICP?: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: (value: string) => void;
  mutate: UseMutateFunction<
    any,
    any,
    {
      company_id: string;
      icp_id: string;
    },
    unknown
  >;
}
const ModalEditICPWatchlist: FCC<IModalEditICPWatchlistProps> = ({
  children,
  company_id,
  valueICP,
  setValueICP,
  isOpen,
  setIsOpen,
  onSuccess,
  mutate,
}) => {
  const form = useForm<SchemaAddICPWatchlist>({
    defaultValues: {
      icp_id: '',
    },
    resolver: zodResolver(schemaAddICPWatchlist),
  });

  const { data } = useListICPWatchlist();

  const data_list_icp = [
    {
      label: 'Please select',
      value: '',
    },
    ...(data?.map((item: { id: string; icp_name: string }) => ({
      label: item.icp_name,
      value: item.id,
    })) || []),
  ];

  const handleSubmit: SubmitHandler<SchemaAddICPWatchlist> = (formData) => {
    mutate(
      {
        company_id: String(company_id),
        icp_id: String(formData.icp_id),
      },
      {
        onSuccess: () => {
          toast.success('Update ICP successfully!');
          onSuccess?.(data_list_icp.find((item) => item.value === formData.icp_id)?.label || '');
          handleToggle();
        },
      }
    );
  };
  const handleToggle = () => {
    form.reset();
    setValueICP?.('');
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (valueICP) {
      const matchingICP = data_list_icp.find((item) => item.label === valueICP);
      if (matchingICP) {
        form.reset({ icp_id: matchingICP.value });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueICP]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen flex-col gap-8 overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Tag>Update ICP</Tag>
          </DialogTitle>
        </DialogHeader>
        <FormWrapper form={form} onSubmit={handleSubmit}>
          <VStack spacing={32}>
            <SelectField
              required
              name="icp_id"
              label="ICP"
              inputSize="sm"
              data={data_list_icp}
              control={form.control}
              placeholder="Select ICP"
            />
            <HStack noWrap spacing={8}>
              <Button type="button" variant="outline" fullWidth onClick={handleToggle}>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Update
              </Button>
            </HStack>
          </VStack>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditICPWatchlist;
