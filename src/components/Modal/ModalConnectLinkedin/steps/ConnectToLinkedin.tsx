/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { HStack, VStack } from '@/components/ui/Utilities';

const ConnectToLinkedin = ({
  setActiveStep,
  activeStep,
  handleToggle,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  activeStep: number;
  handleToggle: () => void;
}) => {
  const form = useForm();

  const handleSubmit = (data: any) => {
    setActiveStep(activeStep + 1);
  };
  return (
    <FormWrapper form={form} onSubmit={handleSubmit}>
      <VStack spacing={12}>
        <VStack spacing={4}>
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            <span className="text-red-500">*</span> Your Linkedln session cookie.
          </label>
          <TextField
            control={form.control}
            name="sessionCookie"
            inputSize={'sm'}
            placeholder="Paste your Linkedin cookies session here"
          />
        </VStack>
        <VStack spacing={4}>
          <label className="text-sm font-medium text-gray-900 dark:text-white">Your Linkedln csrt token</label>
          <TextField
            control={form.control}
            name="csrtToken"
            inputSize={'sm'}
            placeholder="Paste your Linkedin crst token"
          />
        </VStack>
        <p className="text-xs font-normal italic">
          Every time you log into Linkedln on your browser, a new cookie and crst token is created for that "session'.
          If you log out or are disconnected, these expires. You can find your cookie and csrt token manually following
          this guidance
        </p>
        <HStack pos={'apart'}>
          <Button
            variant={'outline'}
            onClick={handleToggle}
            className="h-8 border-blue-500 text-sm text-blue-500 hover:text-blue-500"
          >
            Cancel
          </Button>
          <Button type="submit" className="h-8 text-sm">
            Save
          </Button>
        </HStack>
      </VStack>
    </FormWrapper>
  );
};

export default ConnectToLinkedin;
