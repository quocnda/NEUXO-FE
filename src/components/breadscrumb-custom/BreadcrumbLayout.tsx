import React from 'react';

import { VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { type FCC } from '@/types';

import BreadcrumbComp, { type BreadcrumbProps } from '.';

interface BreadcrumbLayoutProps extends BreadcrumbProps {
  containerClassname?: string;
}
const BreadcrumbLayout: FCC<BreadcrumbLayoutProps> = ({ data, children, className, containerClassname }) => {
  return (
    <VStack spacing={8} className={cn(containerClassname)}>
      <BreadcrumbComp data={data} className={cn('px-0', className)} />

      {children}
    </VStack>
  );
};

export default BreadcrumbLayout;
