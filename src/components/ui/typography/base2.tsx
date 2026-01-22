import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Base2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[15px] font-bold leading-6', className)}>
      {children}
    </p>
  );
}

export default Base2;
