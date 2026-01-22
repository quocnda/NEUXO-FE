import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Base1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-sm font-semibold leading-6', className)}>
      {children}
    </p>
  );
}

export default Base1;
