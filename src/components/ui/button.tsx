import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none active:translate-y-px select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md',
        outline: 'border border-input bg-background text-foreground shadow-sm hover:bg-muted/70 hover:border-border/70',
        secondary: 'bg-muted text-foreground shadow-sm hover:bg-muted/80',
        ghost: 'text-foreground hover:bg-muted/70',
        link: 'underline-offset-4 hover:underline',
        // Custom token
        primary:
          'bg-main text-white shadow-btn hover:bg-main/90 active:bg-main/80 disabled:bg-disabled-grey border border-transparent',
        terq:
          'bg-main-terq text-white shadow-btn hover:bg-main-terq-hovered active:bg-main-terq-clicked disabled:bg-main-terq-disable',
        white:
          'bg-white text-neutral-70 shadow-btn border border-border/60 hover:bg-main hover:text-white active:bg-main/90 disabled:bg-disabled-grey',
        error:
          'bg-main-red text-white shadow-btn hover:bg-main-red/90 active:bg-main-red/80 disabled:bg-disabled-grey',
        success:
          'bg-main-green text-white shadow-btn hover:bg-main-green/90 active:bg-main-green/80 disabled:bg-success-disable',
        warning:
          'bg-secondary-orange text-white shadow-btn hover:bg-secondary-orange/90 active:bg-secondary-orange/80 disabled:bg-disabled-grey',
        black:
          'bg-main-70 text-white shadow-btn hover:bg-main-dark-gray-hovered active:bg-main-dark-gray disabled:bg-disabled-grey',
        'outline-icon':
          'border border-main-dark-blue-hovered bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
        text: 'text-primary hover:bg-accent hover:text-primary',
        select: 'px-0 border border-input rounded-md text-muted-foreground font-normal active:border-primary',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        md: 'rounded-lg',
        none: 'rounded-none',
      },
      size: {
        default: 'h-11 px-5',
        md: 'h-btn-md px-4',
        sm: 'h-btn-sm px-3',
        xs: 'h-8 px-3',
        st: 'h-12 px-4',
        search: 'h-11 px-3',
        mixin: 'p-0',
        icon: 'h-8 w-8 rounded-full',
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
