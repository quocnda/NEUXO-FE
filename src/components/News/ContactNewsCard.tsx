import React from 'react';

import { Icons } from '@/assets/icons';
import { Tooltip } from '@/components/ui/tooltip';
import Body1 from '@/components/ui/typography/body1';
import Caption1 from '@/components/ui/typography/caption1';
import Caption2 from '@/components/ui/typography/caption2';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatStatus, formatTimeDay, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';

interface IProps {
  item: any;
}

const ContactNewsCard = ({ item }: IProps) => {
  const renderContent = () => (
    <VStack spacing={8} className="w-full">
      <HStack pos={'apart'} noWrap>
        <Tooltip
          label={item?.title}
          hidden={!(item?.title && item?.title.length > 40)}
          className="max-w-[300px] text-xs"
        >
          <div className="cursor-pointer hover:opacity-50">
            <Body1 className="text-xs text-neutral-50" onClick={() => window.open(`${item?.post_url}`, '_blank')}>
              {shortenName(item?.title, 40)}
            </Body1>
          </div>
        </Tooltip>
        <div className={'bg-neutral-30 rounded-[6px] px-2 py-1 text-neutral-50'}>
          <Caption1 className="whitespace-nowrap text-xs">{formatStatus(item?.type)}</Caption1>
        </div>
      </HStack>
      <HStack pos={'apart'}>
        <HStack spacing={4}>
          <Icons.calendar width={14} height={14} />
          <Caption2 className="text-neutral-60 text-xs">{formatTimeDay(item?.time_post)}</Caption2>
        </HStack>
        <HStack spacing={4}>
          <Icons.user width={18} height={18} color="#9A9FA5" />
          <Caption2 className="text-neutral-60 text-xs">
            {`${item?.guest.first_name || ''} ${item?.guest.last_name || ''}` || '-'}
          </Caption2>
        </HStack>
      </HStack>
    </VStack>
  );

  return (
    <Show when={item.type === 'TWITTER' || item.type === 'LINKEDIN'}>
      <div className={cn('rounded-md border p-2', typeof item?.is_read === 'boolean' ? 'bg-neutral-30' : 'bg-white')}>
        <HStack noWrap spacing={12}>
          <div className="bg-secondary-purple flex h-6 w-6 items-center justify-center rounded-full">
            <Icons.contact color="white" width={14} height={14} />
          </div>
          {renderContent()}
        </HStack>
      </div>
    </Show>
  );
};

export default ContactNewsCard;
