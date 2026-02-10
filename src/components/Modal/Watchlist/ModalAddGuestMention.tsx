/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import type { IContactDetail } from '@/api/company';
import { addGuestMention } from '@/api/company';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { SchemaAddGuestMention } from '@/lib/validations/company';
import { schemaAddGuestMention } from '@/lib/validations/company';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import { FormWrapper } from '../../ui/form';
import { TextField } from '../../ui/FormField';

interface IModalAddGuestMentionProps {
  refetch?: () => void;
  companyId?: string;
  dataContacts?: IContactDetail | undefined;
}
const ModalAddGuestMention: FCC<IModalAddGuestMentionProps> = ({ children, refetch, companyId, dataContacts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const form = useForm<SchemaAddGuestMention>({
    resolver: zodResolver(schemaAddGuestMention()),
    defaultValues: {
      linkedin_url: '',
      twitter_url: '',
    },
  });

  const { mutate } = useMutation(addGuestMention, {
    onSuccess: () => {
      setIsButtonLoading(true);
      setTimeout(() => {
        toast.success('Add contact successfully!');
        refetch?.();
        setIsOpen(!isOpen);
        form.reset();
        setIsButtonLoading(false);
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-blue" classNameContent="text-xl">
              Add Contact
            </Tag>
          </DialogTitle>
        </DialogHeader>
        <FormWrapper form={form} className="p-3" onSubmit={handleSubmit}>
          <VStack spacing={32}>
            <VStack spacing={12}>
              <TextField
                control={form.control}
                name="linkedin_url"
                label="Linkedin URL"
                required
                inputSize="md"
                variant={'outline'}
                placeholder="Enter the LinkedIn URL"
              />
              <TextField
                control={form.control}
                name="twitter_url"
                label="Twitter URL"
                inputSize="md"
                variant={'outline'}
                placeholder="Enter the X (formerly Twitter) URL"
              />
            </VStack>

            <Button loading={isButtonLoading} type="submit" fullWidth>
              Done
            </Button>
          </VStack>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddGuestMention;
