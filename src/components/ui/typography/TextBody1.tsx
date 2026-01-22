import React from 'react';

import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function TextBody1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-neutral-70 text-xs font-normal', className)}>
      {children}
    </p>
  );
}

export default TextBody1;
