import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[13px] font-medium leading-4', className)}>
      {children}
    </p>
  );
}

export default Caption2;
