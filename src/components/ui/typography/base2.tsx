import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Base2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-1 font-semibold', className)}>
      {children}
    </p>
  );
}

export default Base2;
