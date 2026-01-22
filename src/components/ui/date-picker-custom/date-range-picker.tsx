import { useMediaQuery } from '@mantine/hooks';
import { PopoverClose } from '@radix-ui/react-popover';
import { parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { type ElementRef, forwardRef, useEffect, useMemo, useState } from 'react';
import { Caption } from 'react-day-picker';
import { date } from 'zod';

import { formatDate, formatDateTimeRange, formatTime } from '@/lib/common';
import { DATETIME_FORMAT, TIME_FORMAT } from '@/lib/const';
import { cn } from '@/lib/utils';
import type { InputSize } from '@/styles/common';
import { inputSizeVariants } from '@/styles/common';
import { type ElementProps } from '@/types';

import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { HStack } from '../Utilities';
import { Calendar } from './calendar';
import { DateInput } from './date-input';
import { PRESET_RANGE } from './date-utils';
import { PresetButton } from './preset-button';

const getPresetRange = (presetName: string): DateRange => {
  const preset = PRESETS.find(({ name }) => name === presetName);
  if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
  const from = new Date();
  const to = new Date();
  const first = from.getDate() - from.getDay();

  switch (preset.name) {
    case PRESET_RANGE.TODAY:
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case PRESET_RANGE.YESTERDAY:
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to.setDate(to.getDate() - 1);
      to.setHours(23, 59, 59, 999);
      break;
    case PRESET_RANGE.THIS_WEEK:
      from.setDate(first);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case PRESET_RANGE.LAST_WEEK:
      from.setDate(from.getDate() - 7 - from.getDay());
      to.setDate(to.getDate() - to.getDay() - 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case PRESET_RANGE.THIS_MONTH:
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case PRESET_RANGE.LAST_MONTH:
      from.setMonth(from.getMonth() - 1);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setDate(0);
      to.setHours(23, 59, 59, 999);
      break;
    case PRESET_RANGE.THIS_YEAR:
      from.setMonth(0); // Set the month to January
      from.setDate(1); // Set the date to the 1st of the month
      from.setHours(0, 0, 0, 0);
      to.setMonth(11); // Set the month to December
      to.setDate(31); // Set the date to the last day of the month
      to.setHours(23, 59, 59, 999);
      break;
    case PRESET_RANGE.LAST_YEAR:
      // eslint-disable-next-line no-case-declarations
      const year = from.getFullYear() - 1; // Get the previous year
      from.setFullYear(year); // Set the year to the previous year
      from.setMonth(0); // Set the month to January
      from.setDate(1); // Set the date to the 1st of the month
      from.setHours(0, 0, 0, 0);
      to.setFullYear(year); // Set the year to the previous year
      to.setMonth(11); // Set the month to December
      to.setDate(31); // Set the date to the last day of the month
      to.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }

  return { from, to };
};

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface TimeRange {
  from: string | undefined;
  to: string | undefined;
}

interface Preset {
  name: string;
  label: string;
}

// Define presets
const PRESETS: Preset[] = [
  { name: 'today', label: 'Today' },
  { name: 'yesterday', label: 'Yesterday' },
  { name: 'thisWeek', label: 'This Week' },
  { name: 'lastWeek', label: 'Last Week' },
  { name: 'thisMonth', label: 'This Month' },
  { name: 'lastMonth', label: 'Last Month' },
  { name: 'thisYear', label: 'This Year' },
  { name: 'lastYear', label: 'Last Year' },
];

// const MOBILE_PRESETS: Preset[] = [
//   { name: 'lastWeek', label: 'Last Week' },
//   { name: 'lastMonth', label: 'Last Month' },
//   { name: 'lastYear', label: 'Last Year' },
// ];

export interface DateRangePickerProps extends ElementProps<'div', 'value' | 'onChange'> {
  /** Click handler for applying the updates from DateRangePicker. */
  onChange?: (range: DateRange, timeRange?: TimeRange) => void;
  /** Click handler for applying the updates from DateRangePicker. */
  onCancel?: () => void;
  /** Initial value for start date */
  from?: Date | string;
  /** Initial value for end date */
  to?: Date | string;

  timeFrom?: string;
  timeTo?: string;

  withPreset?: boolean;
  label?: string;
  placeholder?: string;
  inputSize?: InputSize;
  hasHour?: boolean;
  isDisableDateInput?: boolean;
  disablePast?: boolean;
}

const DateRangePicker = forwardRef<ElementRef<'div'>, DateRangePickerProps>((props, ref) => {
  const {
    from,
    to,
    timeFrom = '00:00',
    timeTo = '00:00',
    onChange,
    onCancel,
    withPreset,
    className,
    label,
    inputSize,
    hasHour = false,
    placeholder = '',
    isDisableDateInput = false,
    disablePast = false,
    ...etc
  } = props;

  const [range, setRange] = useState<DateRange>({
    from: from ? new Date(new Date(from).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0)),
    to: to ? new Date(new Date(to).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0)),
  });
  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: timeFrom,
    to: timeTo,
  });
  const isSmallScreen = useMediaQuery('(max-width: 48rem)');

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
  // Refs to store the values of range and rangeCompare when the date picker is opened

  const setPreset = (preset: string): void => {
    setRange(getPresetRange(preset));
    setSelectedPreset(preset);
  };

  const resetValues = (): void => {
    if (!from || !to) {
      return;
    }

    setRange({
      from: typeof from === 'string' ? new Date(from) : from,
      // eslint-disable-next-line no-nested-ternary
      to: to ? (typeof to === 'string' ? new Date(to) : to) : typeof from === 'string' ? new Date(from) : from,
    });
  };

  useEffect(() => {
    if (from !== range.from || to !== range.to) {
      setRange({ from: from as Date, to: to as Date });
    }

    if (timeFrom !== timeRange.from || timeTo !== timeRange.to) {
      setTimeRange({ from: timeFrom, to: timeTo });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, timeFrom, timeTo]);

  const handleApply = () => {
    if (hasHour) {
      onChange?.(range, timeRange);
      return;
    }

    onChange?.(range);
  };

  const handleCancel = () => {
    resetValues();
    onCancel?.();
  };

  const renderInputGroup = useMemo(
    () => (
      <div className="flex items-center justify-between gap-2 md:gap-3">
        <div className="flex items-center gap-1">
          <DateInput
            disabled={isDisableDateInput}
            className="bg-dark-bg text-black"
            value={range.from}
            onChange={(day) => {
              const toDate = range.to === null || day > range?.to! ? day : range.to;
              setRange((prevRange) => ({
                ...prevRange,
                from: day,
                to: toDate,
              }));
            }}
          />
          {hasHour && (
            <Input
              type="time"
              className="border border-black"
              value={timeRange.from}
              inputSize={'sm'}
              onChange={(e) => setTimeRange({ ...timeRange, from: e.target.value })}
            />
          )}
        </div>
        <div className="text-md text-black">–</div>
        <div className="flex items-center gap-1">
          <DateInput
            disabled={isDisableDateInput}
            className="bg-dark-bg text-black"
            value={range.to}
            onChange={(day) => {
              const fromDate = day < range?.from! ? day : range.from;
              setRange((prevRange) => ({
                ...prevRange,
                from: fromDate,
                to: day,
              }));
            }}
          />
          {hasHour && (
            <Input
              type="time"
              className="border border-black"
              value={timeRange.to}
              inputSize={'sm'}
              onChange={(e) => setTimeRange({ ...timeRange, to: e.target.value })}
            />
          )}
        </div>
      </div>
    ),
    [hasHour, isDisableDateInput, range.from, range.to, timeRange]
  );

  const renderTimeValue = useMemo(() => {
    if (!range.from) return <span className="text-xs">{placeholder}</span>;

    const formatRange = formatDateTimeRange(range, timeRange);

    const rangeFromFormatted = formatDate(range?.from);

    if (!range.to) {
      return (
        <span className="text-sm">
          {rangeFromFormatted}{' '}
          {hasHour &&
            formatRange.formatTimeRangeFrom &&
            `(${formatTime(formatRange.formatTimeRangeFrom, TIME_FORMAT.HOUR_MIN)})`}
        </span>
      );
    }

    const rangeToFormatted = formatDate(range?.to);
    if (hasHour) {
      return (
        <span className="whitespace-nowrap text-sm">
          {rangeFromFormatted}{' '}
          {formatRange.formatTimeRangeFrom && `(${formatTime(formatRange.formatTimeRangeFrom, TIME_FORMAT.HOUR_MIN)})`}{' '}
          - {rangeToFormatted}{' '}
          {formatRange.formatTimeRangeTo && `(${formatTime(formatRange.formatTimeRangeTo, TIME_FORMAT.HOUR_MIN)})`}
        </span>
      );
    }

    return (
      <span className="whitespace-nowrap text-sm">
        {rangeFromFormatted} - {rangeToFormatted}
      </span>
    );
  }, [hasHour, placeholder, range, timeRange]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetValues();
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {label && <Label className="mb-1.5">{label}</Label>}
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div
            id="date"
            className={cn(
              inputSizeVariants({ inputSize }),
              'border-border flex h-12 items-center justify-start rounded-sm border bg-white px-3 text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {renderTimeValue}
          </div>
        </PopoverTrigger>
        <PopoverContent className="z-[99999] w-auto overflow-hidden rounded-sm p-0" align="start">
          <div
            ref={ref}
            className={cn('bg-dark-bg relative flex w-fit flex-col rounded-sm text-gray-700 md:flex-row', className)}
            {...etc}
          >
            {!isSmallScreen && withPreset && (
              <div className="border-dark-stroke hidden w-[192px] flex-col justify-start gap-1 border-r px-4 py-3 md:flex">
                {PRESETS.map((preset) => (
                  <PresetButton
                    onClick={setPreset}
                    key={preset.name}
                    preset={preset.name}
                    label={preset.label}
                    isSelected={selectedPreset === preset.name}
                  />
                ))}
              </div>
            )}

            <div className="inset-x-center top-16 block w-full p-4 md:hidden">
              <div className="block">{renderInputGroup}</div>
              {/* {withPreset ? (
                <div className="mt-3 flex justify-between gap-2 overflow-auto">
                  {MOBILE_PRESETS.map((preset) => (
                    <PresetButton
                      onClick={setPreset}
                      key={preset.name}
                      preset={preset.name}
                      label={preset.label}
                      isSelected={selectedPreset === preset.name}
                    />
                  ))}
                </div>
              ) : null} */}
            </div>

            <div className="flex flex-col ">
              <Calendar
                unstyled
                className="border-dark-stroke border-b"
                classNames={{
                  caption_between: 'bg-red-500',
                }}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  Caption: (props) =>
                    isSmallScreen ? (
                      <div
                        className={cn('text-light', {
                          'mb-4': withPreset,
                          'mb-2': !withPreset,
                        })}
                      >
                        <Caption {...props} />
                      </div>
                    ) : (
                      <div className="text-light">
                        <Caption {...props} />
                      </div>
                    ),
                }}
                mode="range"
                onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                  if (value?.from != null) {
                    setRange({ from: value.from, to: value?.to });
                  }
                }}
                selected={{
                  from: range.from
                    ? parse(new Date(range.from!).toISOString(), DATETIME_FORMAT.FULL_DATE_TIME, new Date())
                    : undefined,
                  to: range.to
                    ? parse(new Date(range.to!).toISOString(), DATETIME_FORMAT.FULL_DATE_TIME, new Date())
                    : undefined,
                }}
                numberOfMonths={isSmallScreen ? 1 : 2}
                defaultMonth={new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))}
                disablePast={disablePast}
              />
              <HStack pos={'apart'} spacing={16} className=" p-4">
                <div className="hidden md:block">{renderInputGroup}</div>
                <div className="flex gap-3">
                  <PopoverClose>
                    <Button variant={'outline'} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </PopoverClose>

                  <PopoverClose>
                    <Button onClick={handleApply}>Apply</Button>
                  </PopoverClose>
                </div>
              </HStack>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
