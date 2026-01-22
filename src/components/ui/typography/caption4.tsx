import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption4({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-xs font-medium leading-3', className)}>
      {children}
    </p>
  );
}

export default Caption4;
