import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import React from 'react';

import { cn } from '@/lib/utils';

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardPortal = HoverCardPrimitive.Portal;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'text-grey-600 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[9999999999] min-w-[8rem] rounded-md border bg-white px-2 pb-1 pt-0.5 shadow-md outline-none',
        className
      )}
      {...props}
    />
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

interface HoverCardComponentProps {
  children: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  btnClassName?: string;
}

const HoverCardComponent = ({ children, label, className, btnClassName }: HoverCardComponentProps) => (
  <HoverCard>
    <HoverCardTrigger className={btnClassName} asChild>
      {children}
    </HoverCardTrigger>
    <HoverCardContent className={className}>{label}</HoverCardContent>
  </HoverCard>
);

export { HoverCard, HoverCardComponent, HoverCardContent, HoverCardPortal, HoverCardTrigger };
