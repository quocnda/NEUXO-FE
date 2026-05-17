import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-display-2 font-semibold tracking-[-0.015em]', className)}>
      {children}
    </p>
  );
}

export default H2;
