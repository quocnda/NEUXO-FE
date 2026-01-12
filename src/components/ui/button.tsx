import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-sm text-base font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:shadow-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border-2 border-neutral-30 bg-neutral-10 hover:opacity-50 text-neutral-40',
        secondary: 'bg-neutral-10 text-neutral-70 hover:opacity-50',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline',
        // Custom token
        primary: 'bg-main shadow-btn text-white hover:opacity-50 disabled:bg-disabled-grey border-2 border-neutral-30',
        terq: 'bg-main-terq shadow-btn text-white hover:bg-main-terq-hovered active:bg-main-terq-clicked disabled:bg-main-terq-disable',
        white:
          'bg-white shadow-btn disabled:text-white hover:text-white active:bg-main disabled:bg-disabled-grey hover:bg-main',
        error: 'bg-main-red shadow-btn text-white hover:opacity-50 active:bg-main-red disabled:bg-disabled-grey',
        success:
          'bg-main-green shadow-btn text-white hover:opacity-50 active:bg-main-green disabled:bg-success-disable',
        warning:
          'bg-secondary-orange shadow-btn text-white hover:opacity-50 active:bg-secondary-orange disabled:bg-disabled-grey',
        black:
          'bg-main-70 shadow-btn text-white hover:bg-main-dark-gray-hovered active:bg-main-dark-gray disabled:bg-disabled-grey',
        'outline-icon':
          'border border-main-dark-blue-hovered bg-background hover:bg-accent hover:text-accent-foreground',
        text: 'hover:bg-accent hover:text-primary text-primary',
        select: 'px-0 border border-input rounded-sm text-[#808080] font-normal active:border-primary-500',
      },
      rounded: {
        default: 'rounded-sm',
        full: 'rounded-full',
        md: 'rounded-md',
        none: 'rounded-none',
      },
      size: {
        default: 'h-10 px-5 py-3',
        md: 'h-btn-md px-4',
        sm: 'h-btn-sm px-3',
        xs: 'h-8 px-3',
        st: 'h-12 px-3',
        search: 'h-11 px-3',
        mixin: 'p-0',
        icon: 'h-6 w-6 rounded-full',
      },
      textSize: {
        default: 'text-xs font-semibold leading-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      rounded: 'md',
      textSize: 'default',
    },
  }
);

const LoadingIcon = ({ className, size = '1rem' }: { className?: string; size?: string }) => {
  return <Loader size={size} className={cn('animate-spin ', className)} />;
};
const LoadingCustomIcon = ({ className, bg = 'bg-white' }: { className?: string; bg?: string }) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-row gap-2">
        <div className={cn('h-3 w-3 animate-bounce rounded-full', bg)}></div>
        <div className={cn('h-3 w-3 animate-bounce rounded-full [animation-delay:-.3s]', bg)}></div>
        <div className={cn('h-3 w-3 animate-bounce rounded-full [animation-delay:-.5s]', bg)}></div>
      </div>
    </div>
  );
};
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, type = 'button', size, fullWidth, rounded, asChild = false, loading, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        disabled={props.disabled ?? loading}
        className={cn(fullWidth && 'w-full', buttonVariants({ variant, rounded, size, className }))}
        ref={ref}
        type={type}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {children}
            {loading && <LoadingIcon className="ml-4" />}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants, LoadingCustomIcon, LoadingIcon };
