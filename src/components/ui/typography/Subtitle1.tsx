import React from 'react';

import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Subtitle1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-2 font-medium', className)}>
      {children}
    </p>
  );
}

export default Subtitle1;
