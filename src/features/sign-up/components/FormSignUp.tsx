import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { updateProfileUser } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { SelectWithSearchField, TextField } from '@/components/ui/FormField';
import Base3 from '@/components/ui/typography/base3';
import Caption1 from '@/components/ui/typography/caption1';
import H4 from '@/components/ui/typography/h4';
import { VStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { onMutateError } from '@/lib/common';
import { LOCATION_SELECT_OPTIONS } from '@/lib/json';
import type { SchemaSignUp } from '@/lib/validations/auth';
import { schemaSignUp } from '@/lib/validations/auth';
import { useUserStore } from '@/stores';
import { ROUTE } from '@/types';

const FormSignUp = () => {
  const { user } = useAuth();
  const form = useForm<SchemaSignUp>({
    resolver: zodResolver(schemaSignUp),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      location: '',
    },
  });
  const router = useRouter();
  const { setIsLogin } = useUserStore();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isLoading } = useMutation(updateProfileUser, {
    onSuccess: () => {
      toast.success('Update profile successfully!');
      setIsLogin(true);
      queryClient.refetchQueries(['/me']);
      router.push(ROUTE.HOME);
    },
    onError: onMutateError,
  });

  const handleSignUp: SubmitHandler<SchemaSignUp> = (formData) => {
    updateProfile({
      first_name: formData?.first_name,
      last_name: formData?.last_name,
      phone_number: formData?.phone,
      location: formData?.location,
    });
  };

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone_number || '',
        location: user?.location || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <VStack className="col-span-2 mx-auto w-full max-w-[426px] rounded-lg" spacing={32}>
      <H4 className="text-neutral-70">Tell us more about yourself</H4>
      <FormWrapper form={form} onSubmit={handleSignUp} className="flex flex-col gap-[20px]">
        <TextField
          variant={'outline'}
          control={form.control}
          name="first_name"
          required
          label="First name"
          className="px-3"
          inputSize={'md'}
        />
        <TextField
          variant={'outline'}
          control={form.control}
          name="last_name"
          required
          label="Last name"
          className="px-3"
          inputSize={'md'}
        />
        <TextField
          variant={'outline'}
          control={form.control}
          name="email"
          disabled
          label="Email"
          className="px-3"
          inputSize={'md'}
        />
        <TextField
          variant={'outline'}
          control={form.control}
          name="phone"
          label="Phone number"
          className="px-3"
          inputSize={'md'}
        />
        <SelectWithSearchField
          control={form.control}
          name="location"
          inputSize={'md'}
          label="Location"
          placeholder="Select location"
          data={LOCATION_SELECT_OPTIONS}
          variant={'outline'}
        />
        <Button
          variant="primary"
          loading={isLoading}
          rounded={'md'}
          type="submit"
          className="text-[15px] font-bold leading-6"
        >
          Create an account
        </Button>
        <Base3 className="text-shades-0">This site is protected by reCAPTCHA and the Google Privacy Policy.</Base3>
        <Caption1 className="text-shades-0">
          Already have an account?{' '}
          <span className="text-neutral-70 cursor-pointer" onClick={() => router.push(ROUTE.SIGN_IN)}>
            Login
          </span>
        </Caption1>
      </FormWrapper>
    </VStack>
  );
};

export default FormSignUp;
