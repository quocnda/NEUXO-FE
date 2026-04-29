import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[13px] font-semibold leading-4', className)}>
      {children}
    </p>
  );
}

export default Caption1;
