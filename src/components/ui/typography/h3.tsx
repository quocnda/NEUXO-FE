import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-headline-1 font-semibold', className)}>
      {children}
    </p>
  );
}

export default H3;
