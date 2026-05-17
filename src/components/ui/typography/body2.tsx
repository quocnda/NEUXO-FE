import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Body2({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-2 font-medium', className)}>
      {children}
    </p>
  );
}

export default Body2;
