import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Caption3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-caption-2 font-semibold', className)}>
      {children}
    </p>
  );
}

export default Caption3;
