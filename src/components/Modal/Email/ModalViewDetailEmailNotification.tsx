/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, { useState } from 'react';

import { useGetDetailEmailNotification } from '@/api/notification';
import { Icons } from '@/assets/icons';
import Empty from '@/components/Empty';
import { LoadingIcon } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { shortenName } from '@/lib/common';
import { MIME } from '@/lib/mime';
import type { FCC } from '@/types';

interface IModalViewDetailEmailNotificationProps {
  notificationId: string;
}

const ModalViewDetailEmailNotification: FCC<IModalViewDetailEmailNotificationProps> = ({
  children,
  notificationId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: dataMailDetail, isFetching } = useGetDetailEmailNotification({
    variables: { id: notificationId },
    enabled: !!notificationId && isOpen,
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-screen-xl overflow-auto 2xl:max-w-screen-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            <Icons.genidealBlue color="#4F46E5" />
            {`Email records_${dataMailDetail?.sender_username || 'Unknown'}`}
          </DialogTitle>
        </DialogHeader>
        <Show when={!isFetching && dataMailDetail?.length !== 0}>
          <VStack className="max-h-[80vh] overflow-auto rounded-lg border-2 border-gray-200 bg-white p-3">
            <HStack spacing={4} pos={'apart'} align={'start'}>
              <div>
                <p className="text-sm font-bold text-[#33383F]">
                  {dataMailDetail?.mail_subject}{' '}
                  <span className="text-xs font-normal text-[#6F767E]">
                    from <span className="font-semibold text-[#33383F]">{dataMailDetail?.sender_mail}</span>
                  </span>
                </p>
                <span className="text-xs font-normal">
                  to <span className="font-semibold text-[#33383F]">{dataMailDetail?.recipient_mail}</span>
                </span>
              </div>
              <span className="whitespace-nowrap text-xs">
                {moment(dataMailDetail?.time_send).format('ddd, YYYY-MM-DD, hh:mm A')}
              </span>
            </HStack>
            <div
              className="mb-4 whitespace-pre-wrap text-xs font-medium text-gray-600"
              dangerouslySetInnerHTML={{ __html: dataMailDetail?.mail_content || '' }}
            />
            <Show when={dataMailDetail?.attachments.length !== 0}>
              <div className="grid grid-cols-2 gap-4">
                {dataMailDetail?.attachments.map((file: any, file_index: number) => {
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
        </Show>
        <Show when={!isFetching && dataMailDetail?.length === 0}>
          <Empty />
        </Show>
        <Show when={isFetching}>
          <div className="flex items-center justify-center">
            <LoadingIcon size="2rem" />
          </div>
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default ModalViewDetailEmailNotification;
