import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createNewCompany, useContactDetailCompany } from '@/api/company';
import { checkHadCreateManual, useListICPWatchlist } from '@/api/watchlist';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Show, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { createCompanySchema, type SchemaCreateCompany } from '@/lib/validations/company';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import { FormWrapper } from '../../ui/form';
import { SelectField, TextField } from '../../ui/FormField';
import ContactAddNew from '../Contact/ContactAddNew';
import ContactList from '../Contact/ContactList';
import ModalcheckHadOtherWatchlist from './ModalcheckHadOtherWatchlist';

interface IModalCreateManuallyProps {
  refetch: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}
const ModalCreateManually: FCC<IModalCreateManuallyProps> = ({ children, refetch, setIsOpen, isOpen }) => {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [active, setActive] = useState(1);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [isRemoveContact, setIsRemoveContact] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');
  const form = useForm<SchemaCreateCompany>({
    defaultValues: {
      linkedin_url: '',
      icp_id: '',
    },
    resolver: zodResolver(createCompanySchema),
  });

  const {
    data,
    isFetching,
    refetch: refetchContacts,
  } = useContactDetailCompany({
    variables: companyId,
    refetchOnMount: true,
    enabled: !!companyId && active === 2,
  });

  const { data: data_list_icp } = useListICPWatchlist();

  const { mutate, isLoading } = useMutation(createNewCompany, {
    onSuccess: (res) => {
      setCompanyId(res?.company_id);
      toast.success('Created watchlist company successfully!');
      setIsOpenConfirm(false);
      setActive(2);
      form.reset();
      refetch();
    },
    onError: onMutateError,
  });

  const { mutate: checkHad } = useMutation(checkHadCreateManual, {
    onError: onMutateError,
    onSuccess: (res) => {
      const { existWatchlist, otherWatchlist } = res.data || {};
      if (existWatchlist) {
        toast.error('This company already exists in your watchlist');
      } else if (otherWatchlist) {
        setIsOpenConfirm(true);
      } else {
        mutate(form.getValues());
      }
    },
  });
  const handleToggle = () => {
    setCompanyId('');
    form.reset();
    setActive(1);
    setIsOpen(!isOpen);
  };

  const handleSubmit: SubmitHandler<SchemaCreateCompany> = (formData) => {
    checkHad(formData?.linkedin_url);
  };

  const mutateUpdate = () => {
    mutate(form.getValues());
  };
  const data_list_icp_custom = [
    {
      label: 'Please select',
      value: '',
    },
    ...(data_list_icp?.map((item: { id: string; icp_name: string }) => ({
      label: item.icp_name,
      value: item.id,
    })) || []),
  ];
  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen flex-col gap-8 overflow-auto">
        <Show when={active === 1}>
          <DialogHeader close={handleToggle}>
            <DialogTitle>
              <Tag className="bg-secondary-blue" classNameContent="text-xl">
                Add Manual
              </Tag>
            </DialogTitle>
          </DialogHeader>
          <FormWrapper form={form} onSubmit={handleSubmit} className="flex flex-col gap-8 p-3">
            <VStack>
              <TextField
                required
                variant={'outline'}
                name="linkedin_url"
                control={form.control}
                label="Linkedin Link"
                placeholder="Enter Linkedin URL"
                className="w-full px-4 text-xs"
              />
              <SelectField
                required
                name="icp_id"
                label="ICP"
                inputSize="sm"
                data={data_list_icp_custom}
                control={form.control}
                placeholder="Select ICP"
                className="w-full px-4 text-xs"
              />
            </VStack>
            <Button loading={isLoading} type="submit">
              Add Watchlist
            </Button>
          </FormWrapper>
        </Show>
        <Show when={active === 2}>
          <DialogHeader close={handleToggle}>
            <DialogTitle>
              <Tag classNameContent="text-xl" className="bg-secondary-blue">
                Contact
              </Tag>
            </DialogTitle>
          </DialogHeader>

          <Show when={!isOpenContact}>
            <ContactList
              setIsOpen={setIsOpenContact}
              data={data}
              isFetching={isFetching}
              refetchContacts={refetchContacts}
              isRemoveContact={isRemoveContact}
              setIsRemoveContact={setIsRemoveContact}
            />
          </Show>
          <Show when={isOpenContact}>
            <ContactAddNew
              isOpen={isOpenContact}
              setIsOpen={setIsOpenContact}
              companyId={companyId}
              refetchContacts={refetchContacts}
            />
          </Show>

          <Button type="submit" onClick={handleToggle}>
            Completed
          </Button>
        </Show>
      </DialogContent>
      <ModalcheckHadOtherWatchlist
        isOpenConfirm={isOpenConfirm}
        setIsOpenConfirm={setIsOpenConfirm}
        mutate={mutateUpdate}
      />
    </Dialog>
  );
};

export default ModalCreateManually;
