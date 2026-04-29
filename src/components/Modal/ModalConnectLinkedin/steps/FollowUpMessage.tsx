import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { CheckboxField, TextField } from '@/components/ui/FormField';
import { Label } from '@/components/ui/label';
import Subtitle1 from '@/components/ui/typography/Subtitle1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';

const FollowUpMessage = ({
  activeStep,
  setActiveStep,
}: {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const form = useForm();
  const handleSubmit = (data: any) => {
    setActiveStep(5);
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit} className="h-full">
      <div className="flex h-full flex-col justify-between">
        <VStack spacing={12}>
          <HStack spacing={12}>
            <CheckboxField name="schedule_message" control={form.control} className="h-5 w-5" />
            <Label className="text-sm font-medium">Schedule Follow up message</Label>
          </HStack>
          <Show when={form.watch('schedule_message')}>
            <Subtitle1 className="text-sm">
              Here you can write follow-up messages to be sent after your invites have been accepted. These messages
              will only be sent if there was no reply from the recipient.
            </Subtitle1>
            <VStack spacing={8}>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Send 1st Follow up message after
                </label>
                <div className="relative">
                  <TextField
                    type="number"
                    control={form.control}
                    name="send1st"
                    inputSize={'sm'}
                    className="h-8 w-48 pr-16"
                    min={0}
                  />
                  <span className="absolute right-2 top-[17px] -translate-y-1/2 border-l px-2 text-xs font-medium">
                    Days
                  </span>
                </div>
              </div>
              <TextField
                control={form.control}
                name="send1stMessage"
                inputSize={'sm'}
                className="w-full"
                placeholder="Type your 1st follow up message"
              />
            </VStack>

            <VStack spacing={8}>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Send 2nd Follow up message after
                </label>
                <div className="relative">
                  <TextField
                    type="number"
                    control={form.control}
                    name="send2nd"
                    inputSize={'sm'}
                    className="h-8 w-48 pr-16"
                    min={0}
                  />
                  <span className="absolute right-2 top-[17px] -translate-y-1/2 border-l px-2 text-xs font-medium">
                    Days
                  </span>
                </div>
              </div>
              <TextField
                control={form.control}
                name="send2ndMessage"
                inputSize={'sm'}
                className="w-full"
                placeholder="Type your 2nd follow up message"
              />
            </VStack>
            <VStack spacing={8}>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Send 3rd Follow up message after{' '}
                </label>
                <div className="relative">
                  <TextField
                    type="number"
                    control={form.control}
                    name="send3rd"
                    inputSize={'sm'}
                    className="h-8 w-48 pr-16"
                    min={0}
                  />
                  <span className="absolute right-2 top-[17px] -translate-y-1/2 border-l px-2 text-xs font-medium">
                    Days
                  </span>
                </div>
              </div>
              <TextField
                control={form.control}
                name="send3rdMessage"
                inputSize={'sm'}
                className="w-full"
                placeholder="Type your 3rd follow up message"
              />
            </VStack>
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

export default FollowUpMessage;
