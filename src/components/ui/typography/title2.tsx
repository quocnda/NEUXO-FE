import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Title2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-xl font-medium leading-8', className)}>
      {children}
    </p>
  );
}

export default Title2;
