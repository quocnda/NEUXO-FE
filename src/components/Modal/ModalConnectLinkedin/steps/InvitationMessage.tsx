import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { CheckboxField, TextAreaField } from '@/components/ui/FormField';
import { Label } from '@/components/ui/label';
import { HStack, Show, VStack } from '@/components/ui/Utilities';

const InvitationMessage = ({
  setActiveStep,
  activeStep,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  activeStep: number;
}) => {
  const form = useForm();
  const handleSubmit = (data: any) => {
    setActiveStep(activeStep + 1);
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit} className="h-full">
      <div className="flex h-full flex-col justify-between">
        <VStack spacing={12}>
          <HStack spacing={12}>
            <CheckboxField name="customize" control={form.control} className="h-5 w-5" />
            <Label className="text-sm font-medium">
              Customize Linkedin invitation message (only for Sales Navigator and Premium LinkedIn subscriptions)
            </Label>
          </HStack>
          <Show when={form.watch('customize')}>
            <VStack spacing={4}>
              <label className="text-sm font-medium text-gray-900 dark:text-white">Your invitation message</label>
              <TextAreaField
                control={form.control}
                name="message"
                placeholder="Type your message"
                className="border-input w-full rounded-md border bg-white"
                maxLength={280}
              />
            </VStack>
            <p className="text-xs font-normal italic">
              {
                'If you want to have a name variable, type in format “Hi {{first name}}”. Example: Hi {{first name}}, let’s connect!'
              }
            </p>
          </Show>
        </VStack>
        <HStack pos={'apart'} className="mt-5">
          <Button
            variant={'outline'}
            onClick={() => setActiveStep(activeStep - 1)}
            className="h-8 border-blue-500 text-sm text-blue-500 hover:text-blue-500"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-8 text-sm">
            Save
          </Button>
        </HStack>
      </div>
    </FormWrapper>
  );
};

export default InvitationMessage;
