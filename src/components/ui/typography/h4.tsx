import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H4({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-headline-2 font-semibold', className)}>
      {children}
    </p>
  );
}

export default H4;
