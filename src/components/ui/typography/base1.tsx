import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Base1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-2 font-semibold', className)}>
      {children}
    </p>
  );
}

export default Base1;
