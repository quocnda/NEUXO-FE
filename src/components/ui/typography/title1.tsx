import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Title1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-lg font-medium leading-8', className)}>
      {children}
    </p>
  );
}

export default Title1;
