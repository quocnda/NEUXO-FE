import { cn } from '@/lib/utils';

import type { TextProps } from './type';

function H3({ className, children, ...props }: TextProps) {
  return (
    <p {...props} className={cn('text-[40px] font-semibold leading-[48px]', className)}>
      {children}
    </p>
  );
}

export default H3;
