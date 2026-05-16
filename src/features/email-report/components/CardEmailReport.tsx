import type { LucideIcon } from 'lucide-react';
import React from 'react';

import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { cn } from '@/lib/utils';

interface IProps {
  icon: LucideIcon;
  title: string;
  value: string;
  className?: string;
  isFetching?: boolean;
}
const CardEmailReport = ({ icon, title, value, className, isFetching }: IProps) => {
  const Icon = icon as LucideIcon;
  return (
    <Wrapper className={cn('flex h-[90px] items-center gap-4 rounded-md bg-white p-4', className)}>
      <SkeletonWrapper loading={isFetching} className="rounded-full">
        <div className="bg-secondary-yellow flex h-10 w-10 items-center justify-center rounded-full">
          <Icon width={24} height={24} />
        </div>
      </SkeletonWrapper>
      <VStack spacing={4}>
        <SkeletonWrapper loading={isFetching}>
          <p className="text-neutral-40 text-xs font-semibold">{title}</p>{' '}
        </SkeletonWrapper>
        <SkeletonWrapper loading={isFetching}>
          <p className="text-xl font-semibold sm:text-[30px]">{value}</p>
        </SkeletonWrapper>
      </VStack>
    </Wrapper>
  );
};

export default CardEmailReport;
