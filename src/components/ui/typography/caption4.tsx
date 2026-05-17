import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption4({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-caption-2 font-medium', className)}>
      {children}
    </p>
  );
}

export default Caption4;
