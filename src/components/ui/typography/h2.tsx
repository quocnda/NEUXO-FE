import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-5xl font-semibold leading-[48px]', className)}>
      {children}
    </p>
  );
}

export default H2;
