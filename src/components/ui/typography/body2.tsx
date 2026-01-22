import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Body2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[15px] font-semibold leading-6', className)}>
      {children}
    </p>
  );
}

export default Body2;
