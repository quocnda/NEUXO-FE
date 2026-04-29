/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import type { ICompanyDetails } from '@/api/company';
import { updateCompany } from '@/api/company';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { schemaUpdateProfile } from '@/lib/validations/company';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import { FormWrapper } from '../../ui/form';
import { TextField } from '../../ui/FormField';

interface IModalUpdateCompanyProps {
  refetch?: () => void;
  companyId?: string;
  data?: ICompanyDetails;
}
interface IFormValues {
  linkedin_url: string;
  twitter_url: string;
  website: string;
}
const ModalUpdateCompany: FCC<IModalUpdateCompanyProps> = ({ children, refetch, companyId, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user_id } = router.query;
  const form = useForm<IFormValues>({
    resolver: zodResolver(schemaUpdateProfile),
    defaultValues: {
      linkedin_url: '',
      twitter_url: '',
      website: '',
    },
  });

  const defaultValues = useMemo(
    () => ({
      name: data?.name,
      linkedin_url: data?.linkedin_url,
      twitter_url: data?.twitter_url,
      website: data?.website,
      industry: data?.industry,
      headquarter: data?.headquarters,
      organization_type: data?.organization_type,
      short_description: data?.short_description,
      followers: data?.followers,
      company_size: data?.size,
      category: data?.category,
      country: data?.country,
    }),
    [data]
  );
  const { mutate, isLoading } = useMutation(updateCompany, {
    onSuccess: () => {
      refetch?.();
      setIsOpen(false);
      toast.success('Update successfully!');
    },
    onError: onMutateError,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  const handleSubmit: SubmitHandler<any> = (formData) => {
    mutate({
      id: String(companyId),
      twitter_url: formData.twitter_url || '',
      website: formData.website || '',
      linkedin_url: formData.linkedin_url || '',
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
              Edit Link
            </Tag>
          </DialogTitle>
        </DialogHeader>
        <FormWrapper form={form} className="p-3" onSubmit={handleSubmit}>
          <VStack spacing={32}>
            <VStack spacing={12}>
              <TextField
                control={form.control}
                name="website"
                disabled={!!user_id}
                label="Website"
                inputSize="md"
                variant={'outline'}
                placeholder="Enter your website"
              />
              <TextField
                control={form.control}
                name="linkedin_url"
                label="Linkedin URL"
                disabled
                required
                inputSize="md"
                placeholder="Enter the LinkedIn URL"
              />
              <TextField
                control={form.control}
                name="twitter_url"
                label="Twitter URL"
                disabled={!!user_id}
                inputSize="md"
                variant={'outline'}
                placeholder="Enter the X (formerly Twitter) URL"
              />
            </VStack>

            <Button loading={isLoading} type="submit" fullWidth disabled={!!user_id}>
              Done
            </Button>
          </VStack>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateCompany;
