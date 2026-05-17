import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Base3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-3 font-semibold', className)}>
      {children}
    </p>
  );
}

export default Base3;
