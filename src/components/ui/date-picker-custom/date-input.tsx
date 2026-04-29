/* eslint-disable @typescript-eslint/no-shadow */
import React, { type ElementRef, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import type { ElementProps } from '@/types/common.type';

interface DateInputProps extends ElementProps<'div', 'value' | 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  single?: boolean;
  disabled?: boolean;
}

interface DateParts {
  day?: number;
  month?: number;
  year?: number;
}

const DateInput = React.forwardRef<ElementRef<'div'>, DateInputProps>(
  ({ value, single, onChange, className, disabled = false, ...props }, ref) => {
    const [date, setDate] = React.useState<DateParts>(() => {
      if (!value) return {};
      const d = new Date(value);
      return {
        day: d.getDate(),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      };
    });

    const monthRef = useRef<HTMLInputElement | null>(null);
    const dayRef = useRef<HTMLInputElement | null>(null);
    const yearRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (!value) {
        setDate({});
        return;
      }
      const d = new Date(value);
      setDate({
        day: d.getDate(),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      });
    }, [value]);

    const validateDate = (field: keyof DateParts, value: number): boolean => {
      if (
        (field === 'day' && (value < 1 || value > 31)) ||
        (field === 'month' && (value < 1 || value > 12)) ||
        (field === 'year' && (value < 1000 || value > 9999))
      ) {
        return false;
      }

      const newDate = { ...date, [field]: value };
      if (!newDate.day || !newDate.month || !newDate.year) return false;

      const d = new Date(newDate.year, newDate.month - 1, newDate.day);
      return d.getFullYear() === newDate.year && d.getMonth() + 1 === newDate.month && d.getDate() === newDate.day;
    };

    const handleInputChange = (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value ? Number(e.target.value) : '';
      const isValid = typeof newValue === 'number' && validateDate(field, newValue);

      // If the new value is valid, update the date
      const newDate = { ...date, [field]: newValue };
      setDate(newDate);

      // only call onChange when the entry is valid
      if (isValid) {
        if (newDate.year !== undefined && newDate.month !== undefined && newDate.day !== undefined) {
          onChange?.(new Date(newDate.year, newDate.month - 1, newDate.day));
        }
      }
    };

    const initialDate = useRef<DateParts>(date);

    const handleBlur =
      (field: keyof DateParts) =>
      (e: React.FocusEvent<HTMLInputElement>): void => {
        if (!e.target.value) {
          setDate(initialDate.current);
          return;
        }

        const newValue = Number(e.target.value);
        const isValid = validateDate(field, newValue);

        if (!isValid) {
          setDate(initialDate.current);
        } else {
          // If the new value is valid, update the initial value
          initialDate.current = { ...date, [field]: newValue };
        }
      };

    const handleKeyDown = (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow command (or control) combinations
      if (e.metaKey || e.ctrlKey) {
        return;
      }

      // Prevent non-numeric characters, excluding allowed keys
      if (
        !/^[0-9]$/.test(e.key) &&
        !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Backspace', 'Enter'].includes(e.key)
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        let newDate = { ...date };

        if (field === 'day') {
          if (date[field] === new Date(date.year ?? 0, (date.month ?? 1) - 1, 0).getDate()) {
            newDate = { ...newDate, day: 1, month: ((date.month ?? 0) % 12) + 1 };
            if (newDate.month === 1) newDate.year = (newDate.year ?? 0) + 1;
          } else {
            newDate.day = (newDate.day ?? 0) + 1;
          }
        }

        if (field === 'month') {
          if (date[field] === 12) {
            newDate = { ...newDate, month: 1, year: (date.year ?? 0) + 1 };
          } else {
            newDate.month = (newDate.month ?? 0) + 1;
          }
        }

        if (field === 'year') {
          newDate.year = (newDate.year ?? 0) + 1;
        }

        setDate(newDate);
        if (newDate.year !== undefined && newDate.month !== undefined && newDate.day !== undefined) {
          onChange?.(new Date(newDate.year, newDate.month - 1, newDate.day));
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        let newDate = { ...date };

        if (field === 'day') {
          if (date[field] === 1) {
            newDate.month = (newDate.month ?? 1) - 1;
            if (newDate.month === 0) {
              newDate.month = 12;
              newDate.year = (newDate.year ?? 0) - 1;
            }
            newDate.day = new Date(newDate.year ?? 0, (newDate.month ?? 1) - 1, 0).getDate();
          } else {
            newDate.day = (newDate.day ?? 1) - 1;
          }
        }

        if (field === 'month') {
          if (date[field] === 1) {
            newDate = { ...newDate, month: 12, year: (date.year ?? 0) - 1 };
          } else {
            newDate.month = (newDate.month ?? 1) - 1;
          }
        }

        if (field === 'year') {
          newDate.year = (newDate.year ?? 0) - 1;
        }

        setDate(newDate);
        if (newDate.year !== undefined && newDate.month !== undefined && newDate.day !== undefined) {
          onChange?.(new Date(newDate.year, newDate.month - 1, newDate.day));
        }
      }

      if (e.key === 'ArrowRight') {
        if (
          e.currentTarget.selectionStart === e.currentTarget.value.length ||
          (e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          e.preventDefault();
          if (field === 'month') dayRef.current?.focus();
          if (field === 'day') yearRef.current?.focus();
        }
      } else if (e.key === 'ArrowLeft') {
        if (
          e.currentTarget.selectionStart === 0 ||
          (e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          e.preventDefault();
          if (field === 'day') monthRef.current?.focus();
          if (field === 'year') dayRef.current?.focus();
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'border-dark-stroke flex h-10 items-center rounded-sm border px-2 py-2.5 text-xs text-gray-900 md:px-3.5',
          { 'h-10 w-full': single },
          className
        )}
        {...props}
      >
        <input
          disabled={disabled}
          type="text"
          ref={dayRef}
          max={31}
          maxLength={2}
          value={date.day?.toString() ?? ''}
          onChange={handleInputChange('day')}
          onKeyDown={handleKeyDown('day')}
          onFocus={(e) => {
            if (window.innerWidth > 1024) {
              e.target.select();
            }
          }}
          onBlur={handleBlur('day')}
          className="bg-dark-bg w-6 border-none p-0 text-center outline-none"
          placeholder="D"
        />
        <span className="-mx-px opacity-20">/</span>
        <input
          disabled={disabled}
          type="text"
          ref={monthRef}
          max={12}
          maxLength={2}
          value={date.month?.toString() ?? ''}
          onChange={handleInputChange('month')}
          onKeyDown={handleKeyDown('month')}
          onFocus={(e) => {
            if (window.innerWidth > 1024) {
              e.target.select();
            }
          }}
          onBlur={handleBlur('month')}
          className="bg-dark-bg w-6 border-none p-0 text-center outline-none"
          placeholder="M"
        />

        <span className="-mx-px opacity-20">/</span>
        <input
          disabled={disabled}
          type="text"
          ref={yearRef}
          max={9999}
          maxLength={4}
          value={date.year?.toString() ?? ''}
          onChange={handleInputChange('year')}
          onKeyDown={handleKeyDown('year')}
          onFocus={(e) => {
            if (window.innerWidth > 1024) {
              e.target.select();
            }
          }}
          onBlur={handleBlur('year')}
          className="bg-dark-bg w-11 border-none p-0 text-center outline-none"
          placeholder="YYYY"
        />
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export { DateInput };
