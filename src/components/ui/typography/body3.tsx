import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Body3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-sm font-semibold leading-6', className)}>
      {children}
    </p>
  );
}

export default Body3;
