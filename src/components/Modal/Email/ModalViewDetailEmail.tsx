/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { IResponseEmailDetail } from '@/api/email-tracking';
import { useListEmailDetail, useListEmailDetailFromUser } from '@/api/email-tracking';
import { Icons } from '@/assets/icons';
import Empty from '@/components/Empty';
import { LoadingIcon } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { shortenHTMLContent, shortenName } from '@/lib/common';
import { MIME } from '@/lib/mime';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';

interface IModalViewDetailEmailProps {
  isMail: string;
  campaign_id?: any;
  contactName: string;
}

const ModalViewDetailEmail: FCC<IModalViewDetailEmailProps> = ({ children, isMail, contactName, campaign_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user_id } = router.query;
  const { data: dataMailDetail, isFetching } = useListEmailDetail({
    variables: { email: isMail, campaign_id: campaign_id || undefined },
    enabled: !user_id && !!isMail,
  });
  const { data: dataMailDetailFromUser, isFetching: isFetchingUser } = useListEmailDetailFromUser({
    variables: { email: isMail, id: String(user_id) },
    enabled: !!user_id && !!isMail,
  });

  const dataDetailToRender = user_id ? dataMailDetailFromUser : dataMailDetail;
  const isFetchingToRender = user_id ? isFetchingUser : isFetching;

  const [emailRecord, setEmailRecord] = useState<IResponseEmailDetail | undefined>(dataDetailToRender?.[0]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (dataDetailToRender) {
      setEmailRecord(dataDetailToRender[0]);
    }
  }, [dataDetailToRender]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-screen-xl overflow-auto 2xl:max-w-screen-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            <Icons.genidealBlue color="#4F46E5" />
            Email records_{contactName || dataDetailToRender?.[0]?.mail_recieve}
          </DialogTitle>
        </DialogHeader>
        <Show when={!isFetchingToRender && dataDetailToRender?.length !== 0}>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <VStack spacing={4} className="bg-neutral-10 max-h-[80vh] overflow-auto rounded-lg">
              {dataDetailToRender?.map((item: IResponseEmailDetail, index: number) => (
                <Wrapper key={index} className={cn('cursor-pointer', emailRecord === item && 'bg-gray-100')}>
                  <VStack spacing={0} onClick={() => setEmailRecord(item)}>
                    <HStack spacing={4} pos={'apart'}>
                      <div>
                        <p className="text-sm font-bold text-[#33383F]">
                          {item?.title}{' '}
                          <span className="text-xs font-normal">
                            from <span className="font-semibold text-[#33383F]">{item?.mail_send}</span>
                          </span>
                        </p>
                        <span className="text-xs font-normal">
                          to <span className="font-semibold text-[#33383F]">{item?.mail_recieve}</span>
                        </span>
                      </div>
                    </HStack>

                    <HStack spacing={4} pos={'apart'}>
                      <div
                        className="whitespace-pre-wrap text-xs font-normal"
                        dangerouslySetInnerHTML={{ __html: shortenHTMLContent(item?.html_content) }}
                      />
                      <span className="whitespace-nowrap text-xs font-normal">
                        {moment(item?.time_send).format('ddd, YYYY-MM-DD, hh:mm A')}
                      </span>
                    </HStack>
                  </VStack>
                </Wrapper>
              ))}
            </VStack>

            <VStack className="max-h-[80vh] overflow-auto rounded-lg border-2 border-gray-200 bg-white p-3">
              <HStack spacing={4} pos={'apart'} align={'start'}>
                <div>
                  <p className="text-sm font-bold text-[#33383F]">
                    {emailRecord?.title}{' '}
                    <span className="text-xs font-normal text-[#6F767E]">
                      from <span className="font-semibold text-[#33383F]">{emailRecord?.mail_send}</span>
                    </span>
                  </p>
                  <span className="text-xs font-normal">
                    to <span className="font-semibold text-[#33383F]">{emailRecord?.mail_recieve}</span>
                  </span>
                </div>
                <span className="whitespace-nowrap text-xs">
                  {moment(emailRecord?.time_send).format('ddd, YYYY-MM-DD, hh:mm A')}
                </span>
              </HStack>
              <div
                className="mb-4 whitespace-pre-wrap text-xs font-medium text-gray-600"
                dangerouslySetInnerHTML={{ __html: emailRecord?.html_content || '' }}
              />
              <Show when={emailRecord?.attachments.length !== 0}>
                <div className="grid grid-cols-2 gap-4">
                  {emailRecord?.attachments.map((file: any, file_index: number) => {
                    const extension = file?.file_name.split('.').pop()?.toLowerCase();
                    const contentType = MIME[extension as keyof typeof MIME] || 'application/octet-stream';

                    return (
                      <div
                        key={file_index}
                        onClick={() => window.open(file.file_path, '_blank')}
                        className="bg-neutral-30 flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-[#292D32] hover:opacity-50"
                      >
                        <div className="flex items-center gap-1">
                          <Icons.attachment className="shrink-0" />
                          <div className="text-xs font-medium leading-none">{shortenName(file?.file_name, 20)}</div>
                        </div>
                        <div>
                          <Icons.download />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Show>
            </VStack>
          </div>
        </Show>
        <Show when={!isFetchingToRender && dataDetailToRender?.length === 0}>
          <Empty />
        </Show>
        <Show when={isFetchingToRender}>
          <div className="flex items-center justify-center">
            <LoadingIcon size="2rem" />
          </div>
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default ModalViewDetailEmail;
