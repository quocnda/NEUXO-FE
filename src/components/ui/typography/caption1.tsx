import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-caption-1 font-semibold', className)}>
      {children}
    </p>
  );
}

export default Caption1;
