import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Icons } from '../../assets/icons';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-sm text-base font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none ',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Custom token
        primary:
          'bg-main-dark-gray shadow-btn text-white hover:bg-main-dark-gray-hovered active:bg-main-dark-gray disabled:bg-disabled-grey',
        terq: 'bg-main-terq shadow-btn text-white hover:bg-main-terq-hovered active:bg-main-terq-clicked disabled:bg-main-terq-disable',
        white:
          'bg-white shadow-btn text-main-dark-blue disabled:text-white hover:text-main-dark-blue-hovered active:bg-main-blue-background disabled:bg-disabled-grey',
        error: 'bg-error shadow-btn text-white hover:bg-error-light active:bg-error disabled:bg-error-disable',
        success:
          'bg-success shadow-btn text-white hover:bg-success-light active:bg-success disabled:bg-success-disable',
        warning:
          'bg-warning shadow-btn text-white hover:bg-warning-light active:bg-warning disabled:bg-warning-disable',
      },
      rounded: {
        default: 'rounded-sm',
        full: 'rounded-full',
        md: 'rounded-md',
        none: 'rounded-none',
      },
      size: {
        default: 'h-btn-lg p-6',
        md: 'h-btn-md px-4',
        sm: 'h-btn-sm px-3',
        xs: 'h-8 px-3',
        st: 'h-12 px-3',
        mixin: 'p-0',
        icon: 'h-6 w-6 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      rounded: 'default',
    },
  }
);

const LoadingIcon = ({ className, size = '1rem' }: { className?: string; size?: string }) => {
  return <Icons.spinner size={size} className={cn('animate-spin ', className)} />;
};
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export { buttonVariants, LoadingIcon };
