import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-display-1 font-semibold tracking-[-0.02em]', className)}>
      {children}
    </p>
  );
}

export default H1;
