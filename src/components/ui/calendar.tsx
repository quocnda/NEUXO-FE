import dayjs from 'dayjs';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';

import { Icons } from '../../assets/icons';
import { buttonVariants } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  disablePast?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  disablePast = false,
  ...props
}: CalendarProps): JSX.Element {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('bg-background px-3 pt-2', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm text-main-70 font-semibold',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline', size: 'mixin' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute rounded-none left-1 ',
        nav_button_next: 'absolute rounded-none right-1',
        table: 'w-full border-collapse space-y-1 bg-background',
        head_row: 'flex',
        head_cell: 'text-main-70 w-8 font-normal text-[0.8rem]',
        row: 'flex w-full  overflow-hidden',
        cell: 'text-center text-sm p-0 my-1 relative [&:has([aria-selected])]:bg-gray-200 focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost', size: 'mixin' }),
          'h-8 w-8 p-0 font-normal text-sm aria-selected:opacity-100'
        ),
        day_selected: 'bg-main-70 hover:bg-main-70 focus:bg-main-70 hover:text-white text-white ',
        day_today: 'bg-neutral-40 text-white',
        day_outside: 'text-muted-foreground opacity-40 invisible',
        day_disabled: 'text-muted-foreground opacity-40',
        day_range_middle: 'aria-selected:bg-gray-200 aria-selected:text-neutral-60 ',
        day_hidden: 'invisible',
        ...classNames,
      }}
      disabled={disablePast ? (date) => dayjs(date).date() > dayjs(new Date()).date() : false}
      components={{
        IconLeft: () => <Icons.chevronLeft className="h-4 w-4" />,
        IconRight: () => <Icons.chevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
