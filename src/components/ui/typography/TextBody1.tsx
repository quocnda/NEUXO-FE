import React from 'react';

import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function TextBody1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-2 font-normal text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export default TextBody1;
