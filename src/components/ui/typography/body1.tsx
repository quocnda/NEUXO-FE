import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Body1({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[15px] font-medium leading-6', className)}>
      {children}
    </p>
  );
}

export default Body1;
