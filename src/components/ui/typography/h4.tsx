import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H4({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[32px] font-semibold leading-[48px]', className)}>
      {children}
    </p>
  );
}

export default H4;
