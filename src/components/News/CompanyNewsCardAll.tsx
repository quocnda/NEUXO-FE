import { CalendarCheckIcon, LinkedinIcon } from 'lucide-react';
import React from 'react';

import { Icons } from '@/assets/icons';
import { Tooltip } from '@/components/ui/tooltip';
import Caption1 from '@/components/ui/typography/caption1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatStatus, formatTimeDay, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';

import { Separator } from '../ui/separator';
import { SkeletonWrapper } from '../ui/skeleton-wrapper';
import Caption2 from '../ui/typography/caption2';

interface IProps {
  item?: any;
  isLoading?: boolean;
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

const NewsCardCompanyAll = ({ item, isLoading }: IProps) => {
  const config = iconConfig[item?.type] || {};

  return (
    <Show when={!!config}>
      <VStack
        className={cn('rounded-md border p-3', typeof item?.is_read === 'boolean' ? 'bg-neutral-30' : 'bg-white')}
        spacing={4}
      >
        <VStack spacing={0} className="w-full">
          <HStack pos={'apart'} noWrap>
            <HStack spacing={8}>
              <Show when={!!item?.company__avatar_url}>
                <SkeletonWrapper loading={isLoading}>
                  <div className="bg-neutral-30 flex h-6 w-6 items-center justify-center rounded-full">
                    <img src={item?.company__avatar_url} alt="" className="rounded-full" />
                  </div>
                </SkeletonWrapper>
              </Show>
              <Show when={!item?.company__avatar_url}>
                <SkeletonWrapper loading={isLoading}>
                  <div className="bg-neutral-30 flex h-6 w-6 items-center justify-center rounded-full">
                    <Icons.company color="#9A9FA5" />
                  </div>
                </SkeletonWrapper>
              </Show>
              <SkeletonWrapper loading={isLoading}>
                <p className="text-sm font-semibold text-neutral-50">{item?.company__name}</p>
              </SkeletonWrapper>
            </HStack>
            <SkeletonWrapper loading={isLoading}>
              <div className={`rounded-[6px] px-2 py-1 text-neutral-50 ${config.style || ''}`}>
                <Caption1 className="whitespace-nowrap text-xs">{formatStatus(item?.type)}</Caption1>
              </div>
            </SkeletonWrapper>
          </HStack>
          <Tooltip
            label={config.label ? `${config.label} ${item?.title}` : item?.title}
            className="max-w-[300px] text-xs"
          >
            <div>
              <SkeletonWrapper loading={isLoading} className="my-3 w-full">
                <div className={cn(item?.post_url && 'cursor-pointer hover:opacity-50', 'p-3')}>
                  <Caption2
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
                      shortenName(item?.title, 200)
                    )}
                  </Caption2>
                </div>
              </SkeletonWrapper>
            </div>
          </Tooltip>
        </VStack>
        <Separator />
        <SkeletonWrapper loading={isLoading}>
          <HStack spacing={4}>
            <Icons.calendar width={14} height={14} />
            <Caption2 className="text-neutral-60 text-xs">{formatTimeDay(item?.time_post)}</Caption2>
          </HStack>
        </SkeletonWrapper>
      </VStack>
    </Show>
  );
};

export default NewsCardCompanyAll;
