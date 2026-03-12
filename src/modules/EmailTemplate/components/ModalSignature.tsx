/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createMailSignature, removeSignature, useEmailSignature } from '@/api/email-template';
import LetterheadEditor from '@/components/LetterheadEditor';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { ISignature } from '@/lib/validations/email';
import { signatureSchema } from '@/lib/validations/email';
import type { FCC } from '@/types';

import HeaderSignature from './HeaderSignature';

interface IModalSignatureProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: () => void;
}
const ModalSignature: FCC<IModalSignatureProps> = ({ children, refetch, isOpen, setIsOpen }) => {
  const { data: dataSignature, refetch: refetchSignature } = useEmailSignature();
  const [sendFile, setSendFile] = useState<{ file_name: any; file_path: string }[]>([]);
  const form = useForm<ISignature>({
    resolver: zodResolver(signatureSchema),
    defaultValues: {
      signature_html: '',
      signature_name: '',
    },
  });
  const [isDataSignature, setIsDataSignature] = useState<{
    id: string;
    signature_html: string;
    signature_name: string;
  }>({
    id: '',
    signature_html: '',
    signature_name: '',
  });

  const { mutate } = useMutation(createMailSignature, {
    onSuccess: () => {
      toast.success(isDataSignature.id ? 'Update signature successfully!' : 'Create signature successfully!');
      refetchSignature();
      form.reset();
      setIsDataSignature({
        id: '',
        signature_html: '',
        signature_name: '',
      });
    },
    onError: onMutateError,
  });

  const { mutate: deleteSignature, isLoading } = useMutation(removeSignature, {
    onSuccess: () => {
      toast.success('Remove signature successfully!');
      refetchSignature();
      form.reset();
      setIsDataSignature({
        id: '',
        signature_html: '',
        signature_name: '',
      });
    },
    onError: onMutateError,
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
    form.reset();
    setIsDataSignature({
      id: '',
      signature_html: '',
      signature_name: '',
    });
  };
  const handleSubmit: SubmitHandler<ISignature> = (formData) => {
    if (isDataSignature.id) {
      mutate({
        ...formData,
        id: isDataSignature.id,
      });
      return;
    }
    mutate({
      ...formData,
    });
  };

  useEffect(() => {
    if (isDataSignature.id) {
      form.reset({
        signature_html: isDataSignature.signature_html,
        signature_name: isDataSignature.signature_name,
      });
    } else {
      form.reset({
        signature_html: '',
        signature_name: '',
      });
    }
  }, [isDataSignature]);
  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-screen-xl overflow-auto bg-white">
        <DialogHeader>
          <Tag className="bg-secondary-purple" classNameContent="text-xl">
            Signature
          </Tag>
        </DialogHeader>
        <div className="flex flex-col gap-4 rounded-md bg-white lg:flex-row">
          <div className="flex h-fit flex-col items-start rounded-lg lg:w-1/5 lg:border-gray-300 lg:bg-[#FCFCFC]">
            <HeaderSignature
              dataSignature={dataSignature}
              setIsDataSignature={setIsDataSignature}
              isDataSignature={isDataSignature}
              deleteSignature={deleteSignature}
              isLoading={isLoading}
            />
          </div>
          <div className="flex-1">
            <FormWrapper form={form} onSubmit={handleSubmit} className="relative">
              <VStack spacing={8}>
                <VStack spacing={0}>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    <span className="text-red-500">*</span> Signature name
                  </label>
                  <TextField
                    control={form.control}
                    name="signature_name"
                    variant={'outline'}
                    inputSize="sm"
                    placeholder="Enter your template name"
                  />
                </VStack>
                <VStack spacing={0} className="mt-2">
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    <span className="text-red-500">*</span> Signature Content
                  </label>
                  <Controller
                    control={form.control}
                    name="signature_html"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <LetterheadEditor
                        setSendFile={setSendFile}
                        sendFile={sendFile}
                        value={value}
                        onChange={onChange}
                        noAction
                      />
                    )}
                  />
                </VStack>
              </VStack>
              <Button type="button" onClick={() => handleSubmit(form.getValues())} disabled={!form.formState.isValid}>
                {isDataSignature.id ? 'Update' : 'Add'}
              </Button>
            </FormWrapper>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSignature;
