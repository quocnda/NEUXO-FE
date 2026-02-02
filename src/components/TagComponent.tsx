import type { ReactNode } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';

import { HStack } from './ui/Utilities';

type TagProps = {
  children: ReactNode;
  className?: string;
  classNameContent?: string;
};

const Tag = ({ children, className, classNameContent }: TagProps) => {
  return (
    <HStack spacing={16} noWrap>
      <div className={cn('bg-secondary-blue h-8 w-4 rounded-sm', className)} />
      <p className={cn('text-neutral-70 text-xl font-semibold', classNameContent)}>{children}</p>
    </HStack>
  );
};

export default Tag;
