/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import type { IResponseContacts } from '@/api/company';
import { addGuestMention } from '@/api/company';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { SchemaAddGuestMention } from '@/lib/validations/company';
import { schemaAddGuestMention } from '@/lib/validations/company';
import type { FCC } from '@/types';

interface IContactAddNewProps {
  refetchContacts?: () => void;
  companyId?: string;
  dataContacts?: IResponseContacts | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ContactAddNew: FCC<IContactAddNewProps> = ({ refetchContacts, companyId, dataContacts, isOpen, setIsOpen }) => {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const form = useForm<SchemaAddGuestMention>({
    resolver: zodResolver(schemaAddGuestMention()),
    defaultValues: {
      linkedin_url: '',
      twitter_url: '',
    },
  });

  const { mutate } = useMutation(addGuestMention, {
    onSuccess: () => {
      setIsLoadingButton(true);
      setTimeout(() => {
        toast.success('Add contact successfully!');
        refetchContacts?.();
        setIsOpen(!isOpen);
        form.reset();
        setIsLoadingButton(false);
      }, 5000);
    },
    onError: onMutateError,
  });
  const handleSubmit: SubmitHandler<SchemaAddGuestMention> = (formData) => {
    mutate({
      ...formData,
      id: String(companyId),
    });
  };

  return (
    <FormWrapper form={form} className="p-3" onSubmit={handleSubmit}>
      <VStack spacing={32}>
        <VStack spacing={12}>
          <TextField
            control={form.control}
            name="linkedin_url"
            label="Linkedin URL"
            required
            inputSize="xs"
            variant={'outline'}
            placeholder="Enter the LinkedIn URL"
          />
          <TextField
            control={form.control}
            name="twitter_url"
            label="Twitter URL"
            inputSize="xs"
            variant={'outline'}
            placeholder="Enter the X (formerly Twitter) URL"
          />
        </VStack>
        <HStack pos={'apart'} noWrap spacing={8}>
          <Button variant={'outline'} onClick={() => setIsOpen(!isOpen)} className="h-10 w-10">
            <div className="mx-auto">
              <ChevronLeft size={20} color="#6F767E" />
            </div>
          </Button>
          <Button loading={isLoadingButton} type="submit" variant={'primary'} fullWidth>
            Save
          </Button>
        </HStack>
      </VStack>
    </FormWrapper>
  );
};

export default ContactAddNew;
