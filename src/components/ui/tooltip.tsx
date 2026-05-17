// eslint-disable-next-line import/no-extraneous-dependencies
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    align="start"
    className={cn(
      'bg-popover text-main animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-main z-[70] overflow-hidden rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg ring-1 ring-black/5',
      className
    )}
    {...props}
  />
));

interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  children: React.ReactNode;
  label: React.ReactNode;
  disabled?: boolean;
}

const Tooltip = React.forwardRef<React.ElementRef<typeof TooltipTrigger>, TooltipProps>(
  ({ children, label, disabled, ...props }, ref) => {
    return (
      <TooltipRoot>
        <TooltipTrigger ref={ref} asChild>
          {children}
        </TooltipTrigger>
        {disabled ? null : <TooltipContent {...props}>{label}</TooltipContent>}
      </TooltipRoot>
    );
  }
);

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
