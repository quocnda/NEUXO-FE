import { useMutation } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import React from 'react';

import type { IResponseEmailTemplate } from '@/api/email-template';
import { AIGeneration } from '@/api/email-tracking';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';

interface IProps {
  data: IResponseEmailTemplate[] | undefined;
  setIsDataEmailTemplate: React.Dispatch<React.SetStateAction<{ value: string; label: string } | undefined>>;
  isDataEmailTemplate: { value: string; label: string } | undefined;
  event_id?: string | string[] | undefined;
  setDataEmailTemplate: React.Dispatch<
    React.SetStateAction<{
      template_content: string;
      template_subject: string;
    }>
  >;
}
const TemplateSelect = (props: IProps) => {
  const { data, setIsDataEmailTemplate, isDataEmailTemplate, event_id, setDataEmailTemplate } = props;
  const { mutate } = useMutation(AIGeneration, {
    onSuccess: (res) => {
      setDataEmailTemplate({
        template_content: res?.data?.email_content,
        template_subject: res?.data?.subject,
      });
    },
    onError: onMutateError,
  });

  const templateOptions = [
    {
      value: '',
      label: 'New Email',
    },
    {
      value: 'ai_generate_email',
      label: 'AI-generate email',
    },
    ...(data?.map((item: IResponseEmailTemplate) => ({
      value: item.id,
      label: item.template_name,
    })) as { value: string; label: string }[]),
  ];

  const handleSelectTemplate = (option: { value: string; label: string }) => {
    setIsDataEmailTemplate({ value: option.value, label: option.label });
    if (option.value === 'ai_generate_email' && event_id) {
      mutate({
        event_id: typeof event_id === 'string' ? String(event_id) : undefined,
        company_id: typeof event_id !== 'string' ? event_id : undefined,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end pr-5">
            <HStack
              spacing={8}
              noWrap
              className="border-neutral-30 mt-1 w-fit rounded-md border-2 px-2 py-1 text-xs font-medium text-[#6F767E]"
            >
              <span>{isDataEmailTemplate?.label || 'New Email'}</span>
              <ChevronDown className="h-4" />
            </HStack>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-neutral-30 z-[100] mr-5 w-fit border">
          {templateOptions?.map((option: { value: string; label: string }, index: number) => (
            <DropdownMenuItem
              className="cursor-pointer text-xs font-normal hover:bg-[#E5E4E4]"
              key={index}
              onClick={() => handleSelectTemplate(option)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TemplateSelect;
