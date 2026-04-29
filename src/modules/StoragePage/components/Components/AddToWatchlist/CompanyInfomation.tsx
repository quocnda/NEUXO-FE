/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { updateCompany, useDetailCompanyById } from '@/api/company';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { onMutateError } from '@/lib/common';
import { schemaUpdateProfile } from '@/lib/validations/company';

interface Props {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  handleToggle: () => void;
  companyId: string;
}
const CompanyInfomation = (props: Props) => {
  const { active, setActive, companyId } = props;
  const form = useForm({
    resolver: zodResolver(schemaUpdateProfile),
  });
  const { data, refetch: refetchCompany } = useDetailCompanyById({
    variables: String(companyId),
    enabled: !!companyId,
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
  const { mutate } = useMutation(updateCompany, {
    onSuccess: () => {
      refetchCompany();
      setActive(2);
    },
    onError: onMutateError,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  const handleSubmit: SubmitHandler<any> = (formData) => {
    mutate({
      id: String(companyId),
      country: formData.country || '',
      twitter_url: formData.twitter_url || '',
      website: formData.website || '',
    });
  };

  const handleAddToWatchlist = async (formData: any) => {
    await handleSubmit(formData);
  };

  return (
    <FormWrapper form={form} onSubmit={handleAddToWatchlist} className="flex flex-col justify-between gap-8 p-3">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TextField control={form.control} label="Company Name" name="name" inputSize={'md'} disabled />
        <TextField label="Linkedin" control={form.control} name="linkedin_url" inputSize={'md'} disabled />
        <TextField
          label="Twitter"
          variant={'outline'}
          control={form.control}
          inputSize={'md'}
          name="twitter_url"
          placeholder="Enter the X (formerly Twitter) URL"
        />

        <TextField
          label="Website"
          variant={'outline'}
          inputSize={'md'}
          control={form.control}
          name="website"
          placeholder="Enter your website"
        />

        <TextField
          label="Country"
          variant={'outline'}
          control={form.control}
          inputSize={'md'}
          name="country"
          placeholder="Enter your country"
        />

        <TextField label="Industry" inputSize={'md'} control={form.control} disabled name="industry" />

        <TextField
          label="Organization Type"
          control={form.control}
          disabled
          name="organization_type"
          inputSize={'md'}
        />
        <TextField label="Headquarter" control={form.control} disabled inputSize={'md'} name="headquarter" />

        <TextField label="Followers" inputSize={'md'} disabled control={form.control} name="followers" />

        <TextField label="Company Size" control={form.control} name="company_size" inputSize={'md'} disabled />

        <TextField
          label="Short Description"
          disabled
          inputSize={'md'}
          control={form.control}
          name="short_description"
        />

        <TextField label="Category" control={form.control} name="category" disabled inputSize={'md'} />
      </div>
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${active === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>
      <Button type="submit" fullWidth>
        Continue
      </Button>
    </FormWrapper>
  );
};

export default CompanyInfomation;
