import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const textAreaVariants = cva(
  cn(
    'placeholder:font-light text-normal bg-transparent ring-offset-background peer',
    'focus-visible:ring-transparent focus-visible:border-main flex w-full file:border-0 file:bg-transparent',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed'
    // 'read-only:bg-readonly read-only:border-readonly-border read-only:cursor-default'
  ),
  {
    variants: {
      variant: {
        default: 'bg-neutral-20 placeholder:italic border-2 border-[#9A9FA540]',
        filled: 'bg-background',
        error: 'bg-white hover:border-error border focus-visible:border-error border-error text-error',
        unstyled: 'focus-visible:ring-offset-0',
      },
      inputSize: {
        default: 'min-h-14 py-4 px-5 text-sm rounded-md max-h-[calc(100vh-200px)]',
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
