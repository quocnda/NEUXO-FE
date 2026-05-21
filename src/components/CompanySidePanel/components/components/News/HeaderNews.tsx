import React from 'react';

import { type Icon, Icons } from '@/assets/icons';
import ModalGenIdeal from '@/components/Modal/Watchlist/GenIdeal/ModalGenIdeal';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import Caption3 from '@/components/ui/typography/caption3';
import { HStack, Show } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { tabNewsWatchList } from '@/features/watchlist-all/utils/const';

const HeaderNews = ({
  tab,
  setTab,
  isHidden,
  isWatchList,
  id,
}: {
  tab: number | string;
  setTab: (tab: number | string) => void;
  isHidden?: boolean;
  isWatchList?: boolean;
  id?: string;
}) => {
  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center gap-3',
        isWatchList && !isHidden ? 'flex-col gap-3' : 'flex-row justify-between border-b pb-3'
      )}
    >
      <HStack
        pos={'apart'}
        className={cn('border-[#9A9FA536]', isWatchList && !isHidden ? 'w-full border-b pb-3' : '')}
      >
        <Tag className="bg-secondary-purple h-6 w-3" classNameContent="text-lg">
          News
        </Tag>
      </HStack>
      <HStack noWrap spacing={8} className={cn(isWatchList && !isHidden ? 'w-full' : '')}>
        {tabNewsWatchList.map((item, index) => {
          const IconTab = item?.icon as Icon;
          return (
            <div
              className={cn(
                'bg-neutral-10 text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md px-2 hover:opacity-50',
                tab === item.value && 'bg-main text-white'
              )}
              key={index}
              onClick={() => setTab(item.value)}
            >
              <IconTab />
              <Caption3>{item.label}</Caption3>
            </div>
          );
        })}
      </HStack>
    </div>
  );
};

export default HeaderNews;
