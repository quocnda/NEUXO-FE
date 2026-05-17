import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Title1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-title-1 font-semibold', className)}>
      {children}
    </p>
  );
}

export default Title1;
