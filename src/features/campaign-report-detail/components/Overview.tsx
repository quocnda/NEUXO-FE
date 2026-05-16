import React from 'react';

import type { ICampaignDetailDataReport } from '@/api/campaign';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { HStack, VStack } from '@/components/ui/Utilities';

import { data_overview } from '../utils/const';

const Overview = ({ data, isFetching }: { data: ICampaignDetailDataReport | undefined; isFetching: boolean }) => {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {data_overview.map((item, index) => {
        const Icons = item.icon;
        return (
          <HStack key={index} spacing={12} noWrap className="border-neutral-30 rounded-md border p-4 shadow-lg">
            <div className="bg-secondary-yellow flex h-10 w-10 items-center justify-center rounded-full">
              <Icons />
            </div>
            <VStack spacing={8}>
              <p className="text-neutral-40 text-sm font-semibold">{item?.label}</p>
              <SkeletonWrapper loading={isFetching} className="h-7 w-12">
                <p className="text-2xl font-semibold text-black">
                  {data ? (data as any)[item.key] : '0'} {item?.suffix}
                </p>
              </SkeletonWrapper>
            </VStack>
          </HStack>
        );
      })}
    </div>
  );
};

export default Overview;
