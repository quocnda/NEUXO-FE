import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-xs font-bold leading-4', className)}>
      {children}
    </p>
  );
}

export default Caption3;
