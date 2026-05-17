import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function Body3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-body-3 font-medium', className)}>
      {children}
    </p>
  );
}

export default Body3;
