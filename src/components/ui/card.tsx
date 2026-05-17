import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const cardVariants = cva('border border-border/70 bg-card shadow-sm transition-all duration-200', {
  variants: {
    variant: {
      default: 'hover:border-border/50 hover:shadow-active cursor-pointer',
      static: 'border-border/70',
    },
    rounded: {
      default: 'rounded-xl p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    rounded: 'default',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, rounded, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(cardVariants({ variant, rounded }), className)} {...props}>
      {children}
    </div>
  );
});

export { Card, cardVariants };
