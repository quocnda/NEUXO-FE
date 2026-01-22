import { useMediaQuery } from '@mantine/hooks';
import { PopoverClose } from '@radix-ui/react-popover';
import { ListFilter } from 'lucide-react';
import React, { type ElementRef, forwardRef, useMemo, useState } from 'react';
import type { Matcher } from 'react-day-picker';
import { Caption } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { type ElementProps } from '@/types/common.type';

import { Button } from '../button';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Calendar } from './calendar';
import { DateInput } from './date-input';
import { formatDateRange, PRESET_RANGE } from './date-utils';
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

export interface DateRangePickerProps extends ElementProps<'div', 'value' | 'onChange'> {
  /** Click handler for applying the updates from DateRangePicker. */
  onChange?: (range: DateRange) => void;
  /** Click handler for applying the updates from DateRangePicker. */
  onCancel?: () => void;
  /** Initial value for start date */
  from?: Date | string;
  /** Initial value for end date */
  to?: Date | string;
  withDefault?: boolean;
  withPreset?: boolean;
  label?: string;
  inputSize?: 'sm' | 'default';
  placeholder?: string;
  placeholderClassName?: string;
  inputClassName?: string;
  onReset?: () => void;
  disabled?: Matcher | Matcher[];
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DateRangePicker = forwardRef<ElementRef<'div'>, DateRangePickerProps>((props, ref) => {
  const {
    from = new Date(new Date().setHours(0, 0, 0, 0)),
    to = '',
    onChange,
    onCancel,
    withPreset,
    className,
    label,
    inputSize,
    placeholder = '',
    inputClassName,
    placeholderClassName,
    onReset,
    disabled,
    open,
    setOpen,
    ...etc
  } = props;
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });

  const isSmallScreen = useMediaQuery('(max-width: 48rem)');

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
  // Refs to store the values of range and rangeCompare when the date picker is opened

  const setPreset = (preset: string): void => {
    setRange(getPresetRange(preset));
    setSelectedPreset(preset);
  };

  const resetValues = (): void => {
    if (!from || !to) {
      setRange({ from: undefined, to: undefined });
      return;
    }

    setRange({
      from: typeof from === 'string' ? new Date(from) : from,
      // eslint-disable-next-line no-nested-ternary
      to: to ? (typeof to === 'string' ? new Date(to) : to) : typeof from === 'string' ? new Date(from) : from,
    });
  };

  const handleApply = () => {
    onChange?.(formatDateRange(range));
  };

  const renderInputGroup = useMemo(
    () => (
      <div className="flex items-center justify-between gap-2 md:gap-3">
        <DateInput
          value={range.from}
          onChange={(day) => {
            const toDate = range.to == null || day > range.to ? day : range.to;
            let _day = day;
            if (disabled && (disabled as any)?.before && (disabled as any)?.before > day) {
              _day = (disabled as any)?.before;
            }
            setRange((prevRange) => ({
              ...prevRange,
              from: _day,
              to: toDate,
            }));
          }}
        />
        <div className="text-xs">–</div>
        <DateInput
          value={range.to}
          onChange={(day) => {
            const fromDate = day < range.from! ? day : range.from;
            setRange((prevRange) => ({
              ...prevRange,
              from: fromDate,
              to: day,
            }));
          }}
        />
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [range.from, range.to]
  );

  const handleClearFilter = (event: any) => {
    // event.stopPropagation();

    if (onReset) {
      onReset();
    } else {
      onChange?.(
        formatDateRange({
          from: undefined,
          to: undefined,
        })
      );
    }
    resetValues();
    onCancel?.();
    handleOpenChange();
  };

  const handleOpenChange = () => {
    setOpen?.(!open);
    resetValues();
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {label && <Label className="mb-2">{label}</Label>}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div id="date">
            <ListFilter
              size={12}
              className={cn('mr-2 cursor-pointer', {
                'text-blue-500': !!from && to,
              })}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="z-[99999] w-auto overflow-hidden rounded-sm p-0" align="start">
          <div ref={ref} className={cn('relative flex w-fit flex-col text-gray-700 md:flex-row', className)} {...etc}>
            {!isSmallScreen && withPreset && (
              <div className="hidden w-[192px] flex-col justify-start gap-1 border-r px-4 py-3 md:flex">
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
            </div>

            <div className="flex flex-col">
              <Calendar
                unstyled
                className="border-b text-xs"
                classNames={{
                  caption_between: 'bg-red-500',
                }}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  Caption: (props) =>
                    isSmallScreen ? (
                      <div
                        className={cn('', {
                          'mb-4': withPreset,
                          'mb-2': !withPreset,
                        })}
                      >
                        <Caption {...props} />
                      </div>
                    ) : (
                      <div className="">
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
                selected={range}
                numberOfMonths={isSmallScreen ? 1 : 2}
                defaultMonth={new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))}
                disablePast={false}
                disabled={disabled}
              />
              <div className="flex justify-between p-4">
                <div className="hidden md:block">{renderInputGroup}</div>
                <div className="flex w-full gap-3 md:w-[200px]">
                  <PopoverClose>
                    <Button fullWidth variant={'outline'} onClick={handleClearFilter}>
                      Clear
                    </Button>
                  </PopoverClose>

                  <PopoverClose>
                    <Button fullWidth onClick={handleApply}>
                      Apply
                    </Button>
                  </PopoverClose>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';
