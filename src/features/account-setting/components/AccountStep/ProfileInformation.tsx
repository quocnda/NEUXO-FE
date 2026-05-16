import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { updateProfileUser } from '@/api/auth';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { SelectWithSearchField, TextField } from '@/components/ui/FormField';
import { HStack, VStack } from '@/components/ui/Utilities';
import { UploadImg } from '@/components/UploadImg';
import { useAuth } from '@/hooks/useAuth';
import { onMutateError } from '@/lib/common';
import { LOCATION_SELECT_OPTIONS } from '@/lib/json';
import type { SchemaSignUp } from '@/lib/validations/auth';
import { schemaSignUp } from '@/lib/validations/auth';

const ProfileInformation = () => {
  const { user, refetch } = useAuth();
  const [dataFile, setDataFile] = useState<{ file_name: string; file_path: string }>({
    file_name: '',
    file_path: '',
  });
  const [initialDataFile, setInitialDataFile] = useState<{ file_name: string; file_path: string }>({
    file_name: '',
    file_path: '',
  });
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
  const { isDirty } = form.formState;
  const isAvatarChanged = dataFile.file_path !== initialDataFile.file_path;

  const { mutate: updateProfile, isLoading } = useMutation(updateProfileUser, {
    onSuccess: () => {
      toast.success('Update profile successfully!');
      refetch();
    },
    onError: onMutateError,
  });

  const handleUpdateProfile: SubmitHandler<SchemaSignUp> = (formData) => {
    updateProfile({
      avatar: {
        file_name: dataFile?.file_name,
        file_path: dataFile?.file_path,
      },
      first_name: formData?.first_name,
      last_name: formData?.last_name,
      phone_number: formData?.phone,
      location: formData?.location,
    });
  };

  const handleRemove = () => {
    setDataFile({ file_name: '', file_path: '' });
  };

  useEffect(() => {
    form.reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone_number || '',
      location: user?.location || '',
    });
    const avatarData = {
      file_name: user?.avatar?.file_name || '',
      file_path: user?.avatar?.file_path || '',
    };
    setDataFile(avatarData);
    setInitialDataFile(avatarData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <VStack spacing={32}>
      <Tag>Profile information</Tag>
      <HStack spacing={16}>
        <UploadImg setValue={setDataFile} value={dataFile} accept={['image/jpeg', 'image/jpeg', 'image/png']} />
        <Button variant={'outline'} onClick={handleRemove}>
          Remove
        </Button>
      </HStack>
      <FormWrapper onSubmit={handleUpdateProfile} form={form} className="flex flex-col gap-6">
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
        <TextField control={form.control} name="email" disabled label="Email" className="px-3" inputSize={'md'} />
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
        <Button className="w-fit" type="submit" loading={isLoading} disabled={!isDirty && !isAvatarChanged}>
          Save
        </Button>
      </FormWrapper>
    </VStack>
  );
};

export default ProfileInformation;
