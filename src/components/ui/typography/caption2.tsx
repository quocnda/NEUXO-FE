import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-caption-1 font-medium', className)}>
      {children}
    </p>
  );
}

export default Caption2;
