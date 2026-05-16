/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createNewEmailTemplate, updateEmailTemplate, useDetailEmailTemplate } from '@/api/email-template';
import LetterheadEditor from '@/components/LetterheadEditor';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { IEmailTemplate } from '@/lib/validations/email';
import { emailTemplateSchema } from '@/lib/validations/email';
import type { FCC } from '@/types';

interface IModalAddEmailTemplateProps {
  refetch?: () => void;
  templateInfo?: {
    templateName: string;
    templateId: string;
  };
}
const ModalAddEmailTemplate: FCC<IModalAddEmailTemplateProps> = ({ children, refetch, templateInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sendFile, setSendFile] = useState<{ file_path: string; file_name: string }[]>([]);
  const form = useForm<IEmailTemplate>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      template_content: '',
      template_name: '',
      template_subject: '',
    },
  });

  const { data: detailTemplate } = useDetailEmailTemplate({
    variables: { id: String(templateInfo?.templateId) },
    enabled: !!templateInfo?.templateId && isOpen,
    refetchOnMount: true,
  });

  const { mutate, isLoading } = useMutation(createNewEmailTemplate, {
    onSuccess: () => {
      toast.success('Add email template successfully!');
      setIsOpen(false);
      form.reset();
      refetch?.();
    },
    onError: onMutateError,
  });

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = useMutation(updateEmailTemplate, {
    onSuccess: () => {
      toast.success('Update email template successfully!');
      setIsOpen(false);
      form.reset();
      refetch?.();
      setSendFile([]);
    },
    onError: onMutateError,
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit: SubmitHandler<IEmailTemplate> = (formData) => {
    if (templateInfo?.templateId) {
      mutateUpdate({
        id: String(templateInfo?.templateId),
        attachments: sendFile,
        ...formData,
      });
    } else {
      mutate({
        attachments: sendFile,
        ...formData,
      });
    }
  };
  const handleInsertSignature = (val: string) => {
    const currentValue = form.watch('template_content');
    const updatedValue = `${currentValue}\n---\n${val}`;
    form.setValue('template_content', updatedValue);
  };

  useEffect(() => {
    if (templateInfo?.templateId && detailTemplate) {
      form.reset({
        template_content: detailTemplate?.template_content,
        template_name: detailTemplate?.template_name,
        template_subject: detailTemplate?.template_subject,
      });
      setSendFile((prev) => [...prev, ...(detailTemplate?.attachments || [])]);
    }
  }, [detailTemplate]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-screen-lg overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-purple">Email Template</Tag>
          </DialogTitle>
        </DialogHeader>
        <FormWrapper form={form} onSubmit={handleSubmit} className="relative">
          <VStack spacing={8} className="mb-2">
            <VStack spacing={0}>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Template name
              </label>
              <TextField
                control={form.control}
                name="template_name"
                variant={'outline'}
                inputSize="xs"
                placeholder="Enter your template name"
              />
            </VStack>
            <VStack spacing={0} className="mt-2">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Subject
              </label>

              <TextField
                control={form.control}
                name="template_subject"
                variant={'outline'}
                inputSize="xs"
                placeholder="Enter your template subject"
              />
            </VStack>
            <VStack spacing={0} className="mt-2">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-red-500">*</span> Content
              </label>
              <Controller
                control={form.control}
                name="template_content"
                render={({ field: { onChange, value } }) => (
                  <LetterheadEditor
                    setSendFile={setSendFile}
                    sendFile={sendFile}
                    onChange={onChange}
                    value={value}
                    handleInsertSignature={handleInsertSignature}
                  />
                )}
              />
              {form.formState.errors.template_content?.message && (
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '0.75rem',
                    lineHeight: '1rem',
                  }}
                  className="text-error italic"
                  dangerouslySetInnerHTML={{ __html: form.formState.errors.template_content?.message || 'Error' }}
                />
              )}
            </VStack>
          </VStack>
          <HStack pos={'apart'} className="my-4 w-full">
            <Button variant={'outline'} onClick={handleToggle}>
              Cancel
            </Button>
            <Button type="submit" loading={templateInfo?.templateId ? isLoadingUpdate : isLoading}>
              {templateInfo?.templateId ? 'Update' : 'Add'}
            </Button>
          </HStack>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddEmailTemplate;
