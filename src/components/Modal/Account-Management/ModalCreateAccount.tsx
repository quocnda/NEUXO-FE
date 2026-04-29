import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { signUpRequest } from '@/api/auth';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { SchemaSignUpAccount } from '@/lib/validations/auth';
import { schemaSignUpAccount } from '@/lib/validations/auth';
import type { FCC } from '@/types';

import { FormWrapper } from '../../ui/form';
import { TextField } from '../../ui/FormField';
import { RadioGroupField } from '../../ui/FormField/RadioGroupField';

interface IModalCreateAccountProps {
  refetch?: () => void;
}
const ModalCreateAccount: FCC<IModalCreateAccountProps> = ({ children, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<SchemaSignUpAccount>({
    resolver: zodResolver(schemaSignUpAccount),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'User',
      phone_number: '',
    },
  });
  const { mutate } = useMutation(signUpRequest, {
    onSuccess: () => {
      toast.success('Account created successfully!');
      setIsOpen(!isOpen);
      refetch?.();
      form.reset();
    },
    onError: onMutateError,
  });
  const handleSubmit: SubmitHandler<SchemaSignUpAccount> = (formData) => {
    mutate({
      email: formData.email,
      role: formData.role,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      password: formData.password,
    });
  };
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (form.getValues('role')) return;
    form.setValue('role', 'User');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues('role')]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-purple">Create an account</Tag>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2 md:space-y-6">
          <FormWrapper className="space-y-4 md:space-y-6" onSubmit={handleSubmit} form={form}>
            <VStack spacing={4}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> First Name
              </label>
              <TextField control={form.control} name="first_name" inputSize="xs" placeholder="Enter your first name" />
            </VStack>
            <VStack spacing={4}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Last Name
              </label>
              <TextField control={form.control} name="last_name" inputSize="xs" placeholder="Enter your first name" />
            </VStack>
            <VStack spacing={4}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Role
              </label>
              <RadioGroupField
                control={form.control}
                defaultValue="User"
                className="text-xs"
                data={[
                  {
                    value: 'User',
                    label: 'User',
                  },
                  {
                    value: 'Admin',
                    label: 'Admin',
                  },
                ]}
                name="role"
              />
            </VStack>
            <VStack spacing={4}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
              <TextField
                control={form.control}
                name="phone_number"
                inputSize="xs"
                placeholder="Enter your phone_number"
              />
            </VStack>
            <VStack spacing={4}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Email
              </label>
              <TextField control={form.control} name="email" inputSize="xs" placeholder="Enter your email" />
            </VStack>
            <VStack spacing={4}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Password
              </label>
              <TextField
                control={form.control}
                type="password"
                name="password"
                inputSize="xs"
                placeholder="Enter your password"
              />
            </VStack>
            <VStack spacing={4}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Confirm Password
              </label>
              <TextField
                control={form.control}
                name="confirmPassword"
                type="password"
                inputSize="xs"
                placeholder="Enter your confirm password"
              />
            </VStack>
            <Button
              type="submit"
              variant={'outline'}
              className="group relative inline-block w-full overflow-hidden rounded border border-blue-500 px-5 text-xs font-medium text-blue-500"
            >
              <span className="absolute left-0 top-0 mb-0 flex h-0 w-full translate-y-0 transform bg-blue-600 opacity-90 transition-all duration-200 ease-out group-hover:h-full"></span>
              <span className="relative group-hover:text-white">Sign Up</span>
            </Button>
          </FormWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateAccount;
