import type { ReactNode } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';

type WraaperModuleProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const Wrapper = ({ children, className, style }: WraaperModuleProps) => {
  return (
    <div style={style} className={cn('rounded-xl border bg-white p-3 shadow-sm', className)}>
      {children}
    </div>
  );
};

export default Wrapper;
