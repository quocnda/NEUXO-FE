import { CalendarCheckIcon, LinkedinIcon } from 'lucide-react';
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

const iconConfig: Record<string, { icon: React.ReactNode; style?: string; label?: string; urlPrefix?: string }> = {
  SUB_DOMAIN: {
    icon: <Icons.subdomain size={18} color="red" />,
    style: 'bg-orange-300',
  },
  TWITTER: {
    icon: <Icons.XIcon size={16} width={17} color="white" fill="white" />,
    style: 'bg-secondary-black',
  },
  LINKEDIN: {
    icon: <LinkedinIcon size={16} width={17} color="white" fill="white" />,
    style: 'bg-secondary-blue',
  },
  EVENT: {
    icon: <CalendarCheckIcon size={20} color="#105bdc" />,
    style: 'bg-secondary-purple',
    label: 'Company will join this event: ',
  },
  HIRING: {
    icon: <Icons.hiring size={18} color="white" />,
    label: 'Hiring: ',
    style: 'bg-secondary-green',
  },
  NEWS: {
    icon: <Icons.newsIconcom size={18} color="white" />,
    style: 'bg-blue-300',
  },
  FUNDING: {
    icon: <Icons.funding size={18} color="white" />,
    style: 'bg-blue-300',
  },
  JOB_CHANGE: {
    icon: <Icons.job_user size={18} />,
    style: 'bg-secondary-yellow',
  },
};

const NewsCardCompany = ({ item }: IProps) => {
  const config = iconConfig[item.type] || {};

  return (
    <Show when={!!config}>
      <div className={cn('rounded-md border p-2', typeof item?.is_read === 'boolean' ? 'bg-neutral-30' : 'bg-white')}>
        <HStack noWrap spacing={12}>
          <div className="bg-secondary-blue flex h-7 w-7 items-center justify-center rounded-full">
            <Icons.company color="white" />
          </div>
          <VStack spacing={8} className="w-full">
            <HStack pos={'apart'} noWrap>
              <Tooltip
                label={config.label ? `${config.label} ${item?.title}` : item?.title}
                className="max-w-[300px] text-xs"
              >
                <div className={cn(item?.post_url && 'cursor-pointer hover:opacity-50')}>
                  <Body1
                    className="text-xs text-neutral-50"
                    onClick={() => {
                      if (!item?.post_url) {
                        return;
                      }
                      window.open(`${config.urlPrefix || ''}${item?.post_url}`, '_blank');
                    }}
                  >
                    {config.label ? (
                      <>
                        {config.label} <strong>{item?.title}</strong>
                      </>
                    ) : (
                      shortenName(item?.title, 40)
                    )}
                  </Body1>
                </div>
              </Tooltip>
              <div className={`rounded-[6px] px-2 py-1 text-neutral-50 ${config.style || ''}`}>
                <Caption1 className="whitespace-nowrap text-xs">{formatStatus(item?.type)}</Caption1>
              </div>
            </HStack>
            <HStack spacing={4}>
              <Icons.calendar width={12} height={12} />
              <Caption2 className="text-neutral-60 text-xs">{formatTimeDay(item?.time_post)}</Caption2>
            </HStack>
          </VStack>
        </HStack>
      </div>
    </Show>
  );
};

export default NewsCardCompany;
