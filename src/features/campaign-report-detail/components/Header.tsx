import React, { useEffect, useState } from 'react';

import { type ICampaignDetailDataStatus } from '@/api/campaign';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import Title2 from '@/components/ui/typography/title2';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

import { tabs } from '../utils/const';
import { getColorStatus } from '../utils/getColorStatus';

interface IProps {
  tab: number | string;
  data: ICampaignDetailDataStatus | undefined;
  setTab: React.Dispatch<React.SetStateAction<string | number>>;
  isFetching: boolean;
  campaign_name: string | undefined;
}
const Header = (props: IProps) => {
  const { tab, setTab, data, isFetching, campaign_name } = props;
  const [isCampaignName, setIsCampaignName] = useState(campaign_name || '');

  useEffect(() => {
    if (setIsCampaignName) setIsCampaignName(campaign_name || '');
  }, [campaign_name]);

  return (
    <HStack pos={'apart'} spacing={8}>
      <HStack spacing={12}>
        <SkeletonWrapper loading={isFetching}>{getColorStatus(data?.campaign_status || '')}</SkeletonWrapper>
        <SkeletonWrapper loading={isFetching}>
          <Title2>{isCampaignName}</Title2>
        </SkeletonWrapper>
      </HStack>
      <HStack>
        {tabs.map((item, index) => {
          return (
            <div
              className={cn(
                'text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-sm px-4 text-xs font-semibold hover:opacity-50',
                tab === item.value && 'bg-main text-white'
              )}
              key={index}
              onClick={() => setTab(item.value)}
            >
              {item.label}
            </div>
          );
        })}
      </HStack>
    </HStack>
  );
};

export default Header;
