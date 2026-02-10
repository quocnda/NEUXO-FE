import React from 'react';

import { Icons } from '@/assets/icons';
import { Tooltip } from '@/components/ui/tooltip';
import Caption1 from '@/components/ui/typography/caption1';
import Caption2 from '@/components/ui/typography/caption2';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatStatus, formatTimeDay, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';

import { Separator } from '../ui/separator';
import { SkeletonWrapper } from '../ui/skeleton-wrapper';

interface IProps {
  item?: any;
  isLoading?: boolean;
}

const ContactNewsCardAll = ({ item, isLoading }: IProps) => {
  return (
    <VStack
      className={cn('rounded-md border p-3', typeof item?.is_read === 'boolean' ? 'bg-neutral-30' : 'bg-white')}
      spacing={4}
    >
      <VStack spacing={0} className="w-full">
        <HStack pos={'apart'} noWrap>
          <HStack spacing={8}>
            <Show when={!!item?.guest?.avatar_linkedin_url}>
              <SkeletonWrapper loading={isLoading}>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                  <img src={item?.guest?.avatar_linkedin_url} alt="" className="rounded-full" />
                </div>
              </SkeletonWrapper>
            </Show>
            <Show when={!item?.guest?.avatar_linkedin_url}>
              <SkeletonWrapper loading={isLoading}>
                <Icons.avatar />
              </SkeletonWrapper>
            </Show>
            <SkeletonWrapper loading={isLoading}>
              <p className="text-sm font-semibold text-neutral-50">
                {`${item?.guest?.first_name || '-'} ${item?.guest?.last_name || '-'}`}
              </p>
            </SkeletonWrapper>
          </HStack>
          <SkeletonWrapper loading={isLoading}>
            <div className={'bg-neutral-30 rounded-[6px] px-2 py-1 text-neutral-50'}>
              <Caption1 className="whitespace-nowrap text-xs">{formatStatus(item?.type)}</Caption1>
            </div>
          </SkeletonWrapper>
        </HStack>
        <Tooltip
          label={item?.title}
          hidden={!(item?.title && item?.title.length > 200)}
          className="max-w-[300px] text-xs"
        >
          <div>
            <SkeletonWrapper loading={isLoading} className="my-3 w-full">
              <div className="cursor-pointer p-3 hover:opacity-50">
                <Caption2
                  className="text-xs text-neutral-50"
                  onClick={() => window.open(`${item?.post_url}`, '_blank')}
                >
                  {shortenName(item?.title, 200)}
                </Caption2>
              </div>
            </SkeletonWrapper>
          </div>
        </Tooltip>
      </VStack>
      <Separator />
      <HStack pos={'apart'}>
        <SkeletonWrapper loading={isLoading}>
          <HStack spacing={4}>
            <Icons.company width={14} height={14} color="#9A9FA5" />
            <Caption2 className="text-neutral-60 text-xs">{item?.company__name || '-'}</Caption2>
          </HStack>
        </SkeletonWrapper>
        <SkeletonWrapper loading={isLoading}>
          <HStack spacing={4}>
            <Icons.calendar width={14} height={14} />
            <Caption2 className="text-neutral-60 text-xs">{formatTimeDay(item?.time_post)}</Caption2>
          </HStack>
        </SkeletonWrapper>
      </HStack>
    </VStack>
  );
};

export default ContactNewsCardAll;
