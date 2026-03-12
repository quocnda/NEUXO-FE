import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useDetailEmailTemplate } from '@/api/email-template';
import { sendEmail } from '@/api/email-tracking';
import LetterheadEditor from '@/components/LetterheadEditor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { VStack } from '@/components/ui/Utilities';
import { onMutateError, replaceBorderStyles } from '@/lib/common';
import type { FCC } from '@/types';

import useServices from '../../hooks/useServices';
import type { IFormValues } from '../../utils/type';
import EmailRender from './EmailRender';
import HeaderComponent from './HeaderComponent';
import TemplateSelect from './TemplateSelect';

interface IModalSentMailProps {
  refetch?: () => void;
  isOpenSendEmail?: boolean;
  setIsOpenSendEmail?: React.Dispatch<React.SetStateAction<boolean>>;
  contact_email?: any;
  event_id?: string | string[] | undefined;
}

const ModalSentMail: FCC<IModalSentMailProps> = ({
  children,
  refetch,
  isOpenSendEmail,
  setIsOpenSendEmail,
  contact_email,
  event_id,
}) => {
  const form = useForm<IFormValues>({
    defaultValues: {
      email: '',
      title: '',
      content: '',
      emailCC: '',
      emailBCC: '',
    },
  });

  const [isSending, setIsSending] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [sendFile, setSendFile] = useState<{ file_name: any; file_path: string }[]>([]);
  const [valueSendTo, setValueSendTo] = useState<string[]>([]);
  const [valueSendCC, setValueSendCC] = useState<string[]>([]);
  const [valueSendBCC, setValueSendBCC] = useState<string[]>([]);
  const [emailTo, setEmailTo] = useState('');
  const [emailCC, setEmailCC] = useState('');
  const [emailBCC, setEmailBCC] = useState('');
  const [isDataEmailTemplate, setIsDataEmailTemplate] = useState<{ value: string; label: string }>();
  const [dataEmailTemplate, setDataEmailTemplate] = useState<{ template_content: string; template_subject: string }>({
    template_content: '',
    template_subject: '',
  });
  const { data: listEmailTemplate } = useServices();

  const { data: detailTemplate } = useDetailEmailTemplate({
    variables: { id: String(isDataEmailTemplate?.value) },
    enabled: !!isDataEmailTemplate?.value && isDataEmailTemplate?.value !== 'ai_generate_email',
  });

  useEffect(() => {
    if (dataEmailTemplate) {
      form.reset({
        content: dataEmailTemplate?.template_content,
        title: dataEmailTemplate?.template_subject,
      });
    } else {
      form.reset({
        content: '',
        title: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEmailTemplate]);

  useEffect(() => {
    if (isDataEmailTemplate?.value && detailTemplate) {
      setDataEmailTemplate({
        template_content: detailTemplate?.template_content,
        template_subject: detailTemplate?.template_subject,
      });
      setSendFile((prev) => [...prev, ...(detailTemplate?.attachments || [])]);
    } else {
      setDataEmailTemplate({
        template_content: '',
        template_subject: '',
      });
      setSendFile([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailTemplate, isDataEmailTemplate?.value]);

  const { mutate } = useMutation(sendEmail, {
    onSuccess: () => {
      setTimeout(() => {
        toast.success('Send email successfully!');
        setIsOpenSendEmail?.(false);
        form.reset();
        refetch?.();
        setIsSending(false);
        setValueSendTo([]);
        setSendFile([]);
      }, 3000);
    },
    onError: (err) => {
      onMutateError(err);
      setIsSending(false);
    },
  });

  const handleToggle = () => {
    setIsOpenSendEmail?.(!isOpenSendEmail);
    setValueSendBCC([]);
    setValueSendCC([]);
    setIsDataEmailTemplate(undefined);
    setSendFile([]);
  };

  const handleAddEmail = (
    email: string,
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>,
    emailList: string[],
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (email.trim() !== '') {
      if (validateEmail(email)) {
        setEmailList((prev) => [...prev, email]);
        setInputValue('');
      } else {
        toast.error('Email is not valid');
      }
    }
  };

  const handleAddEmailTo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddEmail(emailTo, setValueSendTo, valueSendTo, setEmailTo);
    }
  };

  const handleAddEmailCC = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddEmail(emailCC, setValueSendCC, valueSendCC, setEmailCC);
    }
  };

  const handleAddEmailBCC = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddEmail(emailBCC, setValueSendBCC, valueSendBCC, setEmailBCC);
    }
  };

  const removeEmail = (
    index: number,
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>,
    emailList: string[]
  ) => {
    setEmailList(emailList.filter((_, i) => i !== index));
  };
  const validateEmail = (i: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(i);
  };

  const handleSubmit = (formData: IFormValues) => {
    setIsSending(true);
    mutate({
      list_email: valueSendTo.join(','),
      list_email_cc: valueSendCC.join(','),
      list_email_bcc: valueSendBCC.join(','),
      title: formData.title,
      content: replaceBorderStyles(formData.content),
      attachments: sendFile.map((file) => ({ name_file: file.file_name, file_path: file.file_path })),
    });
  };

  const handleInsertSignature = (val: string) => {
    const currentValue = form.watch('content');
    const updatedValue = `${currentValue}\n---\n${val}`;
    form.setValue('content', updatedValue);
  };

  useEffect(() => {
    if (contact_email?.length > 0) {
      setValueSendTo(contact_email);
    }
  }, [contact_email]);

  return (
    <Dialog open={isOpenSendEmail} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-screen-lg gap-0 overflow-auto bg-white p-0">
        <DialogHeader classNameHeader="bg-main px-4 py-3 max-h-[63px]">
          <HeaderComponent setIsDataEmailTemplate={setIsDataEmailTemplate} isDataEmailTemplate={isDataEmailTemplate} />
        </DialogHeader>
        <TemplateSelect
          data={listEmailTemplate}
          setIsDataEmailTemplate={setIsDataEmailTemplate}
          isDataEmailTemplate={isDataEmailTemplate}
          event_id={event_id}
          setDataEmailTemplate={setDataEmailTemplate}
        />
        <VStack spacing={8} className="px-4 py-3">
          <div className="relative">
            <p className="text-neutral-40 absolute left-2 top-3 z-[9999] flex items-center gap-2 text-xs font-medium sm:sm:text-sm">
              Recipients
            </p>
            <EmailRender
              data={valueSendTo}
              removeEmail={(index) => removeEmail(index, setValueSendTo, valueSendTo)}
              handleAddEmail={handleAddEmailTo}
              value={emailTo}
              className="ml-10"
              setValue={setEmailTo}
            />
            <div className="text-neutral-40 absolute right-2 top-2 z-[9999] flex items-center gap-2 text-xs font-medium sm:sm:text-sm">
              <div className="cursor-pointer hover:opacity-60" onClick={() => setShowCC(!showCC)} hidden={showCC}>
                CC
              </div>
              <div className="cursor-pointer hover:opacity-60" onClick={() => setShowBCC(!showBCC)} hidden={showBCC}>
                BCC
              </div>
            </div>
          </div>
          {showCC && (
            <div className="text-neutral-40 relative text-xs font-medium sm:sm:text-sm">
              <p className="absolute bottom-[10px] left-2 z-[9999] flex items-center gap-2">CC</p>
              <EmailRender
                data={valueSendCC}
                removeEmail={(index) => removeEmail(index, setValueSendCC, valueSendCC)}
                handleAddEmail={handleAddEmailCC}
                value={emailCC}
                setValue={setEmailCC}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-red-500"
                onClick={() => {
                  setShowCC(false);
                  setValueSendCC([]);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {showBCC && (
            <div className="text-neutral-40 relative text-xs font-medium sm:text-sm">
              <p className="absolute bottom-[10px] left-2 z-[9999] flex items-center gap-2">BCC</p>
              <EmailRender
                data={valueSendBCC}
                removeEmail={(index) => removeEmail(index, setValueSendBCC, valueSendBCC)}
                handleAddEmail={handleAddEmailBCC}
                value={emailBCC}
                setValue={setEmailBCC}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-red-500"
                onClick={() => {
                  setShowBCC(false);
                  setValueSendBCC([]);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <FormWrapper form={form} onSubmit={handleSubmit} className="relative">
            <TextField
              control={form.control}
              name="title"
              className="h-10 rounded-none border-0 border-b border-gray-300 bg-white px-2 text-xs hover:border-0 hover:border-b hover:border-black focus:border-0 focus:border-b focus:border-black sm:text-sm"
              placeholder="Subject"
            />

            <Controller
              control={form.control}
              name="content"
              render={({ field: { onChange, value } }) => (
                <LetterheadEditor
                  setSendFile={setSendFile}
                  sendFile={sendFile}
                  onChange={onChange}
                  value={value}
                  handleInsertSignature={handleInsertSignature}
                  className="rounded-none border-0 border-b border-gray-300 bg-white px-2 text-xs hover:border-0 hover:border-b hover:border-black focus:border-0 focus:border-b focus:border-black sm:text-sm"
                />
              )}
            />
            <Button
              type="submit"
              className="h-10 w-fit text-xs sm:text-sm"
              disabled={
                valueSendTo.length === 0 ||
                !form.watch('content') ||
                form.watch('content') === '<p><br></p>' ||
                isSending
              }
              loading={isSending}
            >
              Send
            </Button>
          </FormWrapper>
        </VStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSentMail;
