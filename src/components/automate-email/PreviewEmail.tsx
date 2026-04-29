import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { getPreviewEmail, submitSequence } from '@/api/automate-email';
import { Icons } from '@/assets/icons';
import { onMutateError } from '@/lib/common';

import LetterheadEditor from '../LetterheadEditor';
import { Button, LoadingIcon } from '../ui/button';
import { FormWrapper } from '../ui/form';
import { TextField } from '../ui/FormField';
import { HStack, Show, VStack } from '../ui/Utilities';
import Wrapper from '../Wrapper';
import SelectEmailContact from './SelectEmailContact';

interface IProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  listEmailAction: any[];
  setSequenceId: React.Dispatch<React.SetStateAction<null>>;
  sequenceId: any;
  handleToggle: () => void;
  source?: string;
  event_id?: string;
}
const PreviewEmail = (props: IProps) => {
  const { setStep, listEmailAction, setSequenceId, sequenceId, handleToggle, source, event_id } = props;
  const form = useForm();
  const [sendFile, setSendFile] = useState<{ file_name: any; file_path: string }[]>([]);
  const [valueEmail, setValueEmail] = useState(listEmailAction[0] || '');
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [emailContents, setEmailContents] = useState<
    {
      email: string;
      data: {
        stepNum: number;
        subject: string;
        content: string;
      }[];
    }[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<{ subject: string; content: string; stepNum: number }[]>([]);

  const { mutate, isLoading } = useMutation(submitSequence, {
    onSuccess: () => {
      toast.success('Automated email successfully. The first email will be sent shortly.');
      setSequenceId(null);
      handleToggle();
    },
    onError: onMutateError,
  });

  const handleSubmit = () => {
    const filteredEmailContents = emailContents
      .map((item) => ({
        ...item,
        data: item.data.filter((step) => step.subject?.trim() && step.content?.trim()),
      }))
      .filter((item) => item.data.length > 0);

    mutate({
      sequence_id: sequenceId,
      content_email: filteredEmailContents || [],
      event_id,
    });
  };

  const handleChangEmail = async (email: string) => {
    setValueEmail(email);
    setIsFetching(true);
    setIsModalVisible(true);
    const existingContent = emailContents.find((item) => item.email === email);
    if (existingContent) {
      existingContent.data.forEach((step) => {
        form.setValue(`subject_${step.stepNum}`, step.subject);
        form.setValue(`content_${step.stepNum}`, step.content);
      });
      if (existingContent.data.every((step) => step.subject && step.content)) {
        setIsFetching(false);
        setIsModalVisible(false);
      } else {
        setTimeout(() => handleChangEmail(email), 3000);
      }
      return;
    }

    try {
      const response = await getPreviewEmail({ email, sequence_id: sequenceId, source, event_id });

      if (response) {
        setData(response);
        response.forEach((step: any) => {
          form.setValue(`subject_${step.stepNum}`, step.subject);
          form.setValue(`content_${step.stepNum}`, step.content);
        });
        if (response.every((step: any) => step.subject && step.content)) {
          setIsFetching(false);
          setTimeout(() => setIsModalVisible(false), 2000);
        } else {
          setTimeout(() => handleChangEmail(email), 3000);
        }
      }
    } catch (error) {
      toast.error((error as any)?.data || 'An error occurred');
    }
  };

  useEffect(() => {
    if (listEmailAction.length > 0) {
      handleChangEmail(listEmailAction[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      setEmailContents((prev) => {
        const existingIndex = prev.findIndex((item) => item.email === valueEmail);
        if (existingIndex !== -1) {
          const updatedContents = [...prev];
          updatedContents[existingIndex] = {
            email: valueEmail,
            data: data.map((item) => {
              return {
                stepNum: item.stepNum,
                subject: item.subject,
                content: item.content,
              };
            }),
          };
          return updatedContents;
        }

        return [
          ...prev,
          {
            email: valueEmail,
            data: data.map((item) => {
              return {
                stepNum: item.stepNum,
                subject: item.subject,
                content: item.content,
              };
            }),
          },
        ];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <VStack spacing={16} className="relative px-4 py-3">
      <p className="text-xs font-bold">PREVIEW EMAIL (Initial Email Sequence)</p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr,2fr]">
        <div>
          <SelectEmailContact
            listEmailAction={listEmailAction}
            handleChangEmail={handleChangEmail}
            valueEmail={valueEmail}
            isFetching={isFetching}
          />
        </div>
        <VStack spacing={12}>
          <p className="text-xs font-bold">Preview</p>
          <Show when={isModalVisible}>
            <div
              className={`modal ${
                isFetching ? 'modal-show' : 'modal-hidden'
              } relative flex w-full items-center gap-10 overflow-hidden rounded-xl py-2`}
            >
              <div className="flex gap-2 px-4 py-2">
                <div>
                  <Icons.warning />
                </div>
                <p className="text-main-red text-sm">
                  Please wait a few seconds. Once all of this contact&apos;s emails are generated, you can edit them.
                </p>
              </div>
            </div>
          </Show>
          <FormWrapper form={form} onSubmit={handleSubmit} className="flex h-full flex-col justify-between">
            <VStack spacing={8} className="max-h-[calc(100vh-350px)] overflow-y-auto">
              {emailContents
                .find((item) => item.email === valueEmail)
                ?.data.map((step, index) => (
                  <VStack key={index} spacing={8} className="pb-4">
                    <Wrapper className="p-0">
                      <div className="bg-neutral-40/70 rounded-tl-xl rounded-tr-xl p-3 text-xs font-bold text-white">
                        Email {step.stepNum}
                      </div>
                      <VStack spacing={0} className="p-3">
                        <span className="mt-2 text-xs font-medium">Subject</span>
                        {form.watch(`subject_${step.stepNum}`) ? (
                          <TextField
                            inputSize={'xs'}
                            placeholder="Subject"
                            control={form.control}
                            name={`subject_${step.stepNum}`}
                            disabled={isFetching}
                            defaultValue={step.subject}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              form.setValue(`subject_${step.stepNum}`, newValue);

                              setEmailContents((prev) =>
                                prev.map((item) =>
                                  item.email === valueEmail
                                    ? {
                                        ...item,
                                        data: item.data.map((s) =>
                                          s.stepNum === step.stepNum ? { ...s, subject: newValue } : { ...s }
                                        ),
                                      }
                                    : { ...item }
                                )
                              );
                            }}
                          />
                        ) : (
                          <HStack className="py-2 text-xs font-normal text-gray-500">
                            <LoadingIcon size="1rem" />
                          </HStack>
                        )}
                        <span className="mt-2 text-xs font-medium">Content</span>
                        {form.watch(`content_${step.stepNum}`) ? (
                          <Controller
                            control={form.control}
                            name={`content_${step.stepNum}`}
                            defaultValue={step.content}
                            render={({ field: { onChange, value } }) => (
                              <LetterheadEditor
                                value={value}
                                isDisabled={isFetching}
                                onChange={(newValue) => {
                                  onChange(newValue);

                                  setEmailContents((prev: any) =>
                                    prev.map((item: any) =>
                                      item.email === valueEmail
                                        ? {
                                            ...item,
                                            data: item.data.map((s: any) =>
                                              s.stepNum === step.stepNum ? { ...s, content: newValue } : { ...s }
                                            ),
                                          }
                                        : { ...item }
                                    )
                                  );
                                }}
                                noAction
                                sendFile={sendFile}
                                setSendFile={setSendFile}
                                className="max-h-[300px] text-xs"
                              />
                            )}
                          />
                        ) : (
                          <HStack className="py-2 text-xs font-normal text-gray-500">
                            <LoadingIcon size="1rem" />
                          </HStack>
                        )}
                      </VStack>
                    </Wrapper>
                  </VStack>
                ))}
            </VStack>
            <HStack pos={'right'} className="sticky bottom-0 bg-white py-2">
              <Button className="w-fit" variant={'outline'} onClick={() => setStep(0)}>
                Back
              </Button>
              <Button className="w-fit" type="submit" loading={isLoading}>
                Send
              </Button>
            </HStack>
          </FormWrapper>
        </VStack>
      </div>
      <style jsx>{`
        .modal {
          background-color: #f6d3cf;
        }

        .modal-show {
          animation: anim-lineUp 3s ease-out forwards;
        }

        .modal-hidden {
          animation: anim-lineDown 3s ease-out forwards;
        }

        @keyframes anim-lineUp {
          0% {
            opacity: 0;
            transform: translateX(80%);
          }
          50% {
            opacity: 1;
            transform: translateX(0%);
          }
          100% {
            opacity: 1;
            transform: translateX(0%);
          }
        }

        @keyframes anim-lineDown {
          0% {
            opacity: 1;
            transform: translateX(0%);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translateX(80%);
          }
        }
      `}</style>
    </VStack>
  );
};

export default PreviewEmail;
