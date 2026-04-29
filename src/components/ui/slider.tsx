import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Icons } from '../../assets/icons';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#B7B7B7]">
      <SliderPrimitive.Range className="bg-primary absolute h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="bg-primary  ring-offset-background focus-visible:ring-ring block h-4 w-4 rounded-full  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
SliderPrimitive.Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

export const STAR_MARKS = Array.from({ length: 11 }, (_, i) => ({
  value: i * 10,
  label: (
    <div className="flex flex-nowrap">
      <div>{i}</div> <Icons.star />
    </div>
  ),
}));
