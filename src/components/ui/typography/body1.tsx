import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Body1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-1 font-normal', className)}>
      {children}
    </p>
  );
}

export default Body1;
