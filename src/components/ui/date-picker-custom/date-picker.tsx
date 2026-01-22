import { type ElementRef, forwardRef, useState } from 'react';
import { Caption } from 'react-day-picker';

import { cn } from '@/lib/utils';

import { Button } from '../button';
import { Calendar, type CalendarProps } from './calendar';
import { DateInput } from './date-input';

type DateValue = Date | undefined;

export interface DatePickerProps {
  calendarProps?: CalendarProps;
  className?: string;
  onChange?: (value: DateValue) => void;
  value?: DateValue;
  onCancel?: () => void;
}

const DatePicker = forwardRef<ElementRef<'div'>, DatePickerProps>((props, ref) => {
  const { value, onChange, calendarProps, className, onCancel, ...etc } = props;
  const [date, setDate] = useState<DateValue>(value ? new Date(new Date(value).setHours(0, 0, 0, 0)) : undefined);

  const handleApply = () => {
    onCancel?.();
    onChange?.(date);
  };

  const resetValue = () => {
    setDate(typeof value === 'string' ? new Date(value) : value);
  };

  const handleCancel = () => {
    onCancel?.();
    resetValue();
  };

  const handleSetToday = () => {
    const preset = new Date();
    preset.setHours(0, 0, 0, 0);
    setDate(preset);
  };

  return (
    <div className={cn('relative flex w-fit flex-col rounded-xl bg-white text-gray-700', className)} ref={ref} {...etc}>
      <div className="absolute left-0 top-12 w-full px-6">
        <div className="flex w-full gap-3">
          <DateInput single value={date} onChange={setDate} className="border-neutral-30 h-8 rounded-md border-2" />
          <Button onClick={handleSetToday} className="min-w-[70px]" size="xs">
            Today
          </Button>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={date as any}
        onSelect={((d: DateValue) => setDate(d)) as any}
        unstyled
        components={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          Caption: (props) => (
            <div className="mb-14">
              <Caption {...props} />
            </div>
          ),
        }}
        {...calendarProps}
        className={cn('px-6 py-3', calendarProps?.className)}
      />
      <div className="flex w-full gap-3 border-t p-4">
        <Button fullWidth variant={'outline'} onClick={handleCancel}>
          Cancel
        </Button>
        <Button fullWidth onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export { DatePicker };
