import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const textAreaVariants = cva(
  cn(
    'text-sm text-foreground placeholder:text-muted-foreground bg-background ring-offset-background peer transition-colors',
    'flex w-full file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:bg-muted/60'
    // 'read-only:bg-readonly read-only:border-readonly-border read-only:cursor-default'
  ),
  {
    variants: {
      variant: {
        default: 'bg-background border border-input hover:border-border/70',
        filled: 'bg-surface border border-transparent',
        error: 'bg-error-light border border-error/40 text-error placeholder:text-error',
        unstyled: 'focus-visible:ring-offset-0',
      },
      inputSize: {
        default: 'min-h-14 py-4 px-5 text-sm rounded-lg max-h-[calc(100vh-200px)]',
      },
    },
    defaultVariants: {
      inputSize: 'default',
      variant: 'default',
    },
  }
);
export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {
  suffix?: any;
  label?: React.ReactNode;
  fullWidth?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = 'default', label, rows = 5, children, fullWidth, inputSize, suffix, id, ...props }, ref) => {
    return (
      <textarea rows={rows} className={cn(textAreaVariants({ variant, inputSize, className }))} ref={ref} {...props} />
    );
  }
);
TextArea.displayName = 'TextArea';

export { TextArea };
