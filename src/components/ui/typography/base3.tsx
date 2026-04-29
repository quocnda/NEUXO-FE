import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Base3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-xs font-semibold leading-5', className)}>
      {children}
    </p>
  );
}

export default Base3;
