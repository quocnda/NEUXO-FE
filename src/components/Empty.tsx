import React from 'react';

import { Icons } from '@/assets/icons';
import { cn } from '@/lib/utils';

import { VStack } from './ui/Utilities';

const Empty = ({ className, content, size = '4.5rem' }: { className?: string; content?: string; size?: string }) => {
  return (
    <VStack
      align="center"
      className={cn('text-neutral-40 min-h-[80%] items-center justify-center', className)}
      spacing={4}
    >
      <Icons.empty width={size} />
      <p className="text-xs font-medium">{content || 'No data'}</p>
    </VStack>
  );
};

export default Empty;
