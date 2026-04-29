import { useMutation } from '@tanstack/react-query';
import { ChevronDown, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createSequence } from '@/api/automate-email';
import { useEmailSignature } from '@/api/email-template';
import { Icons } from '@/assets/icons';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';
import ModalSignature from '@/modules/EmailTemplate/components/ModalSignature';
import { condition_dropdown } from '@/utils/const';

import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { FormWrapper } from '../ui/form';
import { SwitchField, TextField } from '../ui/FormField';
import { HStack, Show, VStack } from '../ui/Utilities';
import HotTriggerConditionDropDown from './HotTriggerConditionDropDown';
import UnresponsiveHandling from './UnresponsiveHandling';

const getOrdinalSuffix = (index: number) => {
  const j = index % 10;
  const k = index % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

interface IProps {
  form: UseFormReturn<any>;
  isOpen: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  listEmailAction: any[];
  setSequenceId: React.Dispatch<React.SetStateAction<any>>;
  setValueSignature: React.Dispatch<React.SetStateAction<{ id: string; signature_name: string }>>;
  valueSignature: { id: string; signature_name: string };
  source?: string;
}

const Sequence = ({
  form,
  isOpen,
  setStep,
  listEmailAction,
  setSequenceId,
  setValueSignature,
  valueSignature,
  source,
}: IProps) => {
  const { control, getValues, setValue } = form;
  const { fields, append, remove, update } = useFieldArray({ control, name: 'sequence' });
  const [valueHotTrigger, setValueHotTrigger] = useState<string[]>([]);
  const { data: dataSignature, refetch: refetchSignature } = useEmailSignature();
  const [openSignature, setOpenSignature] = useState(false);

  const { mutate, isLoading } = useMutation(createSequence, {
    onSuccess: (res) => {
      setSequenceId(res?.id);
      setStep(1);
    },
    onError: onMutateError,
  });

  useEffect(() => {
    if (isOpen && fields.length === 0) {
      const count = source === 'event' ? 3 : 5;
      Array(count)
        .fill(null)
        .forEach((_, i) => append({ day: i === 0 ? 0 : 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit: SubmitHandler<any> = (formData) => {
    const isValid = formData?.sequence?.every((item: any, index: number) =>
      index === 0 ? item.day >= 0 : item.day >= 1
    );

    if (!isValid) {
      toast.error('You must wait at least 1 day before sending the follow-up email.');
      return;
    }

    mutate({
      signature: valueSignature.id,
      campaign_name: formData.campaign_name,
      list_email: listEmailAction || [],
      custom_sequence: formData.sequence.map((item: any) => Number(item.day)),
      source: source || 'company',
      enable_bimonthly: formData.bimonthly_follow_up,
      max_email_bimonthly: Number(formData.maximum_follow_up),
      user_hot_trigger: formData.hot_trigger_prompt,
      hot_trigger_condition: valueHotTrigger.length > 0 ? valueHotTrigger : [],
    });
  };

  const renderSignatureDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer px-3">
        <div className="border-neutral-30 flex h-10 w-full items-center justify-between rounded-md border-2 px-2 text-xs">
          {valueSignature.signature_name ? (
            <p>{valueSignature.signature_name}</p>
          ) : (
            <span className="text-shades-0 font-light">Select Email Signature</span>
          )}
          <ChevronDown size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[9999] max-h-[200px] w-[var(--radix-dropdown-menu-trigger-width)] overflow-auto border"
        align="start"
      >
        {dataSignature?.list_signatures?.map((option: any) => (
          <DropdownMenuItem
            key={option.id}
            className={cn('cursor-pointer px-2 py-2 text-xs hover:bg-[#E5E4E4]', {
              'bg-[#E5E4E4]': option.id === valueSignature.id,
            })}
            onClick={() => setValueSignature({ id: option.id, signature_name: option.signature_name })}
          >
            {option.signature_name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer items-center gap-2 px-3 py-2 text-xs hover:bg-[#E5E4E4]"
          onClick={() => setOpenSignature(true)}
        >
          <Plus size={16} />
          Signature
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderSequenceRow = (item: any, index: number) => (
    <div
      key={item.id}
      className="border-neutral-30 flex items-center justify-between gap-2 rounded-md border-2 px-2 py-3 text-xs sm:h-10"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="w-32 whitespace-nowrap">
          Send the {index + 1}
          <sup>{getOrdinalSuffix(index + 1)}</sup> email after
        </span>
        <HStack spacing={4}>
          <div className="flex h-9 items-center overflow-hidden sm:px-5">
            <button
              type="button"
              onClick={() => update(index, { ...item, day: Math.max(Number(item.day || 0) - 1, 0) })}
              className="h-full bg-gray-100 px-2 text-lg font-bold hover:bg-gray-300"
            >
              -
            </button>
            <TextField
              control={control}
              name={`sequence.${index}.day`}
              inputSize="xs"
              variant="outline"
              className="w-16 rounded-none text-center"
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setValue(`sequence.${index}.day`, val, { shouldDirty: true, shouldValidate: true });
                item.day = val;
              }}
            />
            <button
              type="button"
              onClick={() => update(index, { ...item, day: Number(item.day || 0) + 1 })}
              className="h-full bg-gray-100 px-2 text-lg font-bold hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <span className="whitespace-nowrap">
            {index === 0 ? 'days from present' : 'days from the previous email'}
          </span>
        </HStack>
      </div>
      <Show when={index !== 0}>
        <Icons.remove
          width={14}
          height={14}
          color="#6F767E"
          className="hover:opacity-50"
          onClick={() => remove(index)}
        />
      </Show>
    </div>
  );

  return (
    <>
      <FormWrapper form={form} onSubmit={handleSubmit}>
        <VStack className="gap-[14px] px-4 py-3">
          <p className="text-xs font-bold">SET UP CAMPAIGN</p>

          <TextField
            control={control}
            name="campaign_name"
            label="Campaign Name"
            required
            placeholder="Enter your campaign name"
            inputSize="xs"
            className="border-neutral-30 border-2 bg-white"
          />

          <VStack spacing={8}>
            <span className="text-xs font-bold">
              <span className="text-red-500">*</span> Select Email Signature
            </span>
            {renderSignatureDropdown()}
          </VStack>

          <span className="text-xs font-bold">Customize Initial Email Sequence</span>

          <VStack spacing={8} className="max-h-[600px] overflow-auto">
            {fields.map(renderSequenceRow)}
            <div
              className="border-neutral-30 flex h-10 cursor-pointer items-center justify-center rounded-md border-2 px-2 py-3 hover:opacity-50"
              onClick={() => append({ day: fields.length === 0 ? 0 : 1 })}
            >
              <HStack spacing={8} noWrap>
                <Plus size={14} color="#6F767E" />
              </HStack>
            </div>
          </VStack>

          <span className="text-xs font-bold">Customize Bimonthly Follow-up Sequence</span>
          <SwitchField
            control={control}
            name="bimonthly_follow_up"
            className="h-5"
            classNameThumb="h-4"
            label="Enable Bimonthly Follow-up"
            description="If the recipient doesn’t reply to the initial email sequence, they will receive follow-up emails every two months"
          />

          <span className="text-xs font-bold">Follow-up settings</span>
          <p className="text-xs font-medium text-black">Maximum follow-up emails</p>
          <div className="flex h-9 items-center">
            <button
              type="button"
              onClick={() => {
                const newVal = Math.max(Number(getValues('maximum_follow_up') || 1) - 1, 1);
                setValue('maximum_follow_up', String(newVal), { shouldDirty: true, shouldValidate: true });
              }}
              className="h-full rounded-l-sm bg-gray-100 px-2 text-lg font-bold hover:bg-gray-300"
            >
              -
            </button>
            <TextField
              control={control}
              name="maximum_follow_up"
              inputSize="xs"
              variant="outline"
              defaultValue="1"
              className="w-16 rounded-none text-center"
              onChange={(evt) => {
                const reGex = /[^0-9]/g;
                let value = evt.target.value.replace(reGex, '');
                if (value !== '') {
                  value = String(Math.max(Number(value), 1));
                }
                form.setValue('maximum_follow_up', value, { shouldDirty: true, shouldValidate: true });
              }}
            />
            <button
              type="button"
              onClick={() => {
                const newVal = Number(getValues('maximum_follow_up') || 1) + 1;
                setValue('maximum_follow_up', String(newVal), { shouldDirty: true, shouldValidate: true });
              }}
              className="h-full rounded-r-sm bg-gray-100 px-2 text-lg font-bold hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <SwitchField
            control={control}
            name="hot_trigger_prompt"
            className="h-5"
            classNameThumb="h-4"
            label="Use a hot trigger prompt when available"
            description="Send a contextual follow-up when recipient activity is detected"
          />
          <HotTriggerConditionDropDown
            data={condition_dropdown.map((item: any) => ({ label: item, value: item }))}
            setValueHotTrigger={setValueHotTrigger}
            valueHotTrigger={valueHotTrigger}
          />
          <UnresponsiveHandling />
          <HStack pos={'right'}>
            <Button
              className="w-fit"
              type="submit"
              disabled={
                !valueSignature.id ||
                fields.some((_, index) => form.watch(`sequence.${index}.day`) === '') ||
                !form.watch('campaign_name')
              }
              loading={isLoading}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      </FormWrapper>

      <ModalSignature isOpen={openSignature} setIsOpen={setOpenSignature} refetch={refetchSignature} />
    </>
  );
};

export default Sequence;
