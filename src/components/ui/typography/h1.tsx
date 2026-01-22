import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[64px] font-semibold leading-[64px]', className)}>
      {children}
    </p>
  );
}

export default H1;
