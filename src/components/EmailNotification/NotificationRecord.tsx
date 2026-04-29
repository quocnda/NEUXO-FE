import { format, formatDistanceToNow } from 'date-fns';
import { Eye } from 'lucide-react';
import React from 'react';

import { shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';

import ModalViewDetailEmailNotification from '../Modal/Email/ModalViewDetailEmailNotification';
import { Tooltip } from '../ui/tooltip';
import { HStack, VStack } from '../ui/Utilities';

const NotificationRecord = ({ item, dataToggle }: { item: any; dataToggle: any }) => {
  const data = dataToggle?.is_subscribed ? item?.data : item?.last_data;

  const lastOpened =
    data?.last_opened_at && data?.last_opened_at !== 'Not yet opened' ? new Date(`${data.last_opened_at}Z`) : null;
  const sentDate = item?.created_at ? new Date(item.created_at) : null;

  let timeLabel = '';
  let dateStr = '';

  if (lastOpened) {
    timeLabel = `was last opened ${formatDistanceToNow(lastOpened, { addSuffix: true })}`;
    dateStr = format(lastOpened, "dd MMM, 'at' h:mm a");
  } else if (sentDate) {
    timeLabel = `was last sent ${formatDistanceToNow(sentDate, { addSuffix: true })}`;
    dateStr = format(sentDate, "dd MMM, 'at' h:mm a");
  }

  return (
    <ModalViewDetailEmailNotification notificationId={item.id}>
      <VStack
        className={cn('max-w-[400px] rounded-lg p-4 shadow-inner', lastOpened ? 'bg-[#EAF3FF]' : 'bg-neutral-20')}
        spacing={4}
      >
        <div className="text-sm font-medium text-gray-800">{data?.recipient_mail}</div>
        <Tooltip hidden={!(data?.mail_subject && data?.mail_subject.length > 40)} label={data?.mail_subject}>
          <div className="text-sm font-medium text-blue-500">{shortenName(data?.mail_subject, 40)}</div>
        </Tooltip>
        <div className="text-xs text-gray-600">
          {timeLabel ? (
            <span>
              {timeLabel}, {dateStr}
            </span>
          ) : (
            'No open record'
          )}
        </div>
        <HStack spacing={8}>
          <Eye size={16} color="#4b5563" />
          <div className="text-sm text-gray-600">{lastOpened ? `${data?.open_count || 0} opens` : 'Unopened'}</div>
        </HStack>
      </VStack>
    </ModalViewDetailEmailNotification>
  );
};

export default NotificationRecord;
