import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { changePassword, setPassword } from '@/api/auth';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import Caption4 from '@/components/ui/typography/caption4';
import Title1 from '@/components/ui/typography/title1';
import Title2 from '@/components/ui/typography/title2';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';
import type { SchemaChangePassword } from '@/lib/validations/auth';
import { schemaChangePassword } from '@/lib/validations/auth';
import { useUserStore } from '@/stores';

const PasswordCriteria = ({ isValid, label }: { isValid: boolean; label: string }) => (
  <HStack spacing={8}>
    <div
      className={cn(
        'border-neutral-40 text-neutral-40 flex items-center justify-center rounded-full border-[1.5px]',
        'h-[14px] w-[14px]',
        isValid && 'bg-main-green border-0 text-white'
      )}
      style={{ lineHeight: 'normal' }}
    >
      <Check size={10} strokeWidth={3} />
    </div>
    <Caption4 className={isValid ? 'text-main-green' : 'text-neutral-40'}>{label}</Caption4>
  </HStack>
);

const Password = () => {
  const { user, refetch } = useAuth();
  const statusPassword = user?.has_password;
  const form = useForm<SchemaChangePassword>({
    resolver: zodResolver(schemaChangePassword(statusPassword)),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });
  const { setStore, setIsLogin } = useUserStore();
  const [isMessageErrorOldPassword, setIsMessageErrorOldPassword] = useState('');
  const password = form.watch('new_password');
  const confirmPassword = form.watch('confirm_password');

  const isMinLength = password.length >= 8 && !/\s/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>/?~]/.test(password);
  const checkPassConfirmError = form.formState.errors.confirm_password?.message === 'Password does not match.';
  const passMatch = password && confirmPassword && password === confirmPassword;

  const isPasswordValid = isMinLength && hasUppercase && hasNumber && hasSpecialCharacter;

  const { mutate, isLoading } = useMutation(changePassword, {
    onSuccess: (res) => {
      setStore(res.data);
      setIsLogin(true);
      toast.success('Change password successfully!');
      setIsMessageErrorOldPassword('');
      form.reset();
    },
    onError: (err: any) => {
      setIsMessageErrorOldPassword(err?.message);
    },
  });

  const { mutate: mutateSetPassword, isLoading: isLoadingSetPassword } = useMutation(setPassword, {
    onSuccess: (res) => {
      setStore(res.data);
      setIsLogin(true);
      refetch();
      toast.success('Set password successfully!');
      form.reset();
    },
    onError: onMutateError,
  });

  const handleSubmit = (data: SchemaChangePassword) => {
    if (!statusPassword) {
      mutateSetPassword({
        new_password: data.new_password,
      });
    } else {
      mutate({
        oldPassword: data.old_password,
        newPassword: data.new_password,
      });
    }
  };

  return (
    <VStack spacing={24}>
      <Tag className="bg-secondary-orange">Password</Tag>
      <Show when={statusPassword}>
        <Title2 className="text-neutral-40 text-lg">Update Sign in password by entering old and new password</Title2>
      </Show>
      <Show when={!statusPassword}>
        <Title1 className="text-neutral-40 text-lg">
          Set up a password so you can sign in with your email or username!
        </Title1>
      </Show>
      <FormWrapper onSubmit={handleSubmit} form={form} className="flex flex-col gap-8">
        <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2', !statusPassword && 'grid sm:grid-cols-1')}>
          <Show when={statusPassword}>
            <VStack spacing={12} className="sm:col-span-2 ">
              <TextField
                variant={'outline'}
                required
                control={form.control}
                name="old_password"
                type="password"
                label="Old Password"
                className={cn(
                  'px-3 pr-8',
                  isMessageErrorOldPassword &&
                    'text-main-red border-0 bg-[#FFBC9940] font-semibold hover:border-0 focus-visible:border-0'
                )}
                inputSize={'md'}
              />
              <Show when={!!isMessageErrorOldPassword && !form.formState.errors.old_password}>
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '0.75rem',
                    lineHeight: '1rem',
                  }}
                  className="text-error"
                  dangerouslySetInnerHTML={{ __html: isMessageErrorOldPassword || '' }}
                />
              </Show>
            </VStack>
          </Show>

          <TextField
            variant={'outline'}
            control={form.control}
            name="new_password"
            required
            onError={checkPassConfirmError}
            type="password"
            label="New Password"
            className={cn(
              'px-3 pr-8',
              checkPassConfirmError &&
                'text-main-red border-0 bg-[#FFBC9940] font-semibold hover:border-0 focus-visible:border-0',
              passMatch && 'text-main-green border-0 bg-[#B5E4CA50] font-semibold hover:border-0 focus-visible:border-0'
            )}
            inputSize={'md'}
          />
          <TextField
            variant={'outline'}
            control={form.control}
            required
            type="password"
            name="confirm_password"
            label="Confirm Password"
            className={cn(
              'px-3 pr-8',
              passMatch && 'text-main-green border-0 bg-[#B5E4CA50] font-semibold hover:border-0 focus-visible:border-0'
            )}
            inputSize={'md'}
          />
        </div>
        <VStack spacing={8}>
          <PasswordCriteria isValid={isMinLength} label="At least 8 characters and no spaces" />
          <PasswordCriteria isValid={hasUppercase} label="Contain uppercase characters (A-Z)" />
          <PasswordCriteria isValid={hasNumber} label="Must contain number (0-9)" />
          <PasswordCriteria isValid={hasSpecialCharacter} label="Contains special characters" />
        </VStack>
        <Button className="w-fit" type="submit" disabled={!isPasswordValid} loading={isLoading || isLoadingSetPassword}>
          Update Password
        </Button>
      </FormWrapper>
    </VStack>
  );
};

export default Password;
