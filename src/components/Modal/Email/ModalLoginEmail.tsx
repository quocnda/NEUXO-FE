/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { addAccount } from '@/api/email-tracking';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { HStack, VStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { onMutateError } from '@/lib/common';
import type { LoginGmailSchema } from '@/lib/validations/auth';
import { loginGmailSchema } from '@/lib/validations/auth';
import type { FCC } from '@/types';

interface IModalLoginEmailProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  redirectBack?: () => void;
}
const ModalLoginEmail: FCC<IModalLoginEmailProps> = ({ children, setIsOpen, isOpen, redirectBack }) => {
  const { user } = useAuth();
  const form = useForm<LoginGmailSchema>({
    resolver: zodResolver(loginGmailSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { mutate } = useMutation(addAccount, {
    onSuccess: () => {
      setTimeout(() => {
        toast.success('Add account successfully!');
        queryClient.refetchQueries(['/me']);
        setIsOpen(false);
        form.reset();
        setLoading(false);
      }, 10000);
    },
    onError: (err) => {
      onMutateError(err);
      setLoading(false);
    },
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = (formData: LoginGmailSchema) => {
    setLoading(true);
    mutate({
      ...formData,
    });
  };
  useEffect(() => {
    form.reset({
      email: user?.email_tracker?.email,
      password: user?.email_tracker?.password || '',
    });
  }, [user]);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto bg-white">
        <DialogTitle>
          <Tag className="bg-secondary-orange" classNameContent="text-xl">
            Get app password
          </Tag>
        </DialogTitle>
        <FormWrapper form={form} onSubmit={handleSubmit} className="flex flex-col gap-8">
          <VStack spacing={16}>
            <TextField
              control={form.control}
              name="email"
              disabled
              inputSize="sm"
              placeholder="Enter your email"
              label="Email"
            />
            <TextField
              control={form.control}
              name="password"
              type="password"
              label="App Password"
              inputSize="sm"
              required
              placeholder="Enter your password"
            />
            <span className="text-neutral-40 text-xs font-medium">
              Please input your google app password to send email
            </span>
            <span className="text-neutral-40 text-xs font-medium">
              Make sure you did 2-Step Verification on your account. If you don't have one, you can create it{' '}
              <a
                href="https://support.google.com/accounts/answer/185833?hl=en"
                className="text-blue-500 underline"
                target="_blank"
              >
                here
              </a>
              .
            </span>
          </VStack>
          <HStack pos={'apart'} noWrap>
            <Button
              variant={'outline'}
              fullWidth
              onClick={() => {
                handleToggle();
                redirectBack?.();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              Login
            </Button>
          </HStack>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ModalLoginEmail;
