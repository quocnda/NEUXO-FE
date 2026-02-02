import { useRouter } from 'next/router';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

export enum breadcrumbTypes {
  'link',
  'page',
}

export interface IBreadcrumbData {
  label: string | React.ReactNode;
  href?: string | undefined;
  type: breadcrumbTypes.link | breadcrumbTypes.page;
}

export interface BreadcrumbProps {
  className?: string;
  data: IBreadcrumbData[];
}
const BreadcrumbComp: React.FC<BreadcrumbProps> = ({ className, data }) => {
  const router = useRouter();
  return (
    <Breadcrumb>
      <BreadcrumbList className={cn(className)}>
        {data?.map((item, index) => (
          <HStack spacing={8} key={index}>
            <BreadcrumbItem>
              {item.type === breadcrumbTypes.link ? (
                <BreadcrumbLink
                  onClick={() => router.push(item.href || '#')}
                  className="cursor-pointer text-xs font-semibold text-[#9A9FA5] sm:text-sm"
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-neutral-70 text-xs font-semibold sm:text-sm">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index !== data.length - 1 && <BreadcrumbSeparator />}
          </HStack>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComp;
