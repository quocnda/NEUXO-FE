import { Calendar, X } from 'lucide-react';
import React, { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import type { IParamsEmailReport } from '@/api/email-report';
import { DateRangePicker } from '@/components/ui/date-picker-custom/date-range-picker-v2';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HStack, Show } from '@/components/ui/Utilities';
import { formatToDate } from '@/lib/common';
import { cn, removeUndefinedKeys } from '@/lib/utils';
import { dateOptions } from '@/utils/const';

interface IProps {
  paramsQuery: IParamsEmailReport | undefined;
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsEmailReport | undefined>>;
  setValueDate: React.Dispatch<React.SetStateAction<string>>;
  valueDate: string;
}
const FilterEmailReport = ({ paramsQuery, setParamsQuery, setValueDate, valueDate }: IProps) => {
  const [open, setOpen] = useState(false);

  const updateParamsQuery = (newParams: Partial<IParamsEmailReport>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };
  const handleSelectDateToday = () => {
    const today = new Date();

    setValueDate('today');
    updateParamsQuery({
      start_date: formatToDate(today),
      end_date: formatToDate(today),
    });
  };
  const handleSelectDateYesterday = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    setValueDate('yesterday');
    updateParamsQuery({
      start_date: formatToDate(today),
      end_date: formatToDate(today),
    });
  };

  const handleSelectThisWeek = () => {
    setValueDate('week');
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const endOfWeek = new Date(today);

    updateParamsQuery({
      start_date: formatToDate(startOfWeek),
      end_date: formatToDate(endOfWeek),
    });
  };

  const handleSelectThisMonth = () => {
    setValueDate('month');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today);

    updateParamsQuery({
      start_date: formatToDate(startOfMonth),
      end_date: formatToDate(endOfMonth),
    });
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    const { from, to } = dateRange;

    updateParamsQuery({
      start_date: formatToDate(from),
      end_date: formatToDate(to),
    });
  };

  return (
    <HStack>
      <Show when={valueDate !== 'date_range'}>
        <Select
          key={dateOptions?.[1]?.value}
          value={valueDate}
          onValueChange={(value) => {
            switch (value) {
              case 'today':
                handleSelectDateToday();
                break;
              case 'yesterday':
                handleSelectDateYesterday();
                break;
              case 'week':
                handleSelectThisWeek();
                break;
              case 'month':
                handleSelectThisMonth();
                break;
              case 'date_range':
                setValueDate('date_range');
                setOpen(true);
                break;
              default:
                setValueDate('');
                updateParamsQuery({
                  start_date: undefined,
                  end_date: undefined,
                });
                break;
            }
          }}
        >
          <SelectTrigger
            className={cn(
              'border-neutral-30 text-neutral-40 flex h-8 items-center gap-2 rounded-md border-2 text-xs font-medium hover:opacity-50'
            )}
          >
            <Calendar size={14} />
            <SelectValue className="" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions?.map((item: { value: string; label: string }) => (
              <SelectItem value={item.value} key={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Show>
      <Show when={valueDate === 'date_range'}>
        <div className="relative min-w-[180px]">
          <DateRangePicker
            from={
              paramsQuery?.start_date
                ? new Date(
                    new Date(paramsQuery.start_date).getTime() -
                      new Date(paramsQuery.start_date).getTimezoneOffset() * 60000
                  )
                : undefined
            }
            to={
              paramsQuery?.end_date
                ? new Date(
                    new Date(paramsQuery.end_date).getTime() -
                      new Date(paramsQuery.end_date).getTimezoneOffset() * 60000
                  )
                : undefined
            }
            onChange={handleDateRangeChange}
            placeholder="Select date range"
            className="cursor-pointer rounded-full text-xs"
            onReset={() => {
              setValueDate('yesterday');
              updateParamsQuery({ start_date: undefined, end_date: undefined });
            }}
            open={open}
            setOpen={setOpen}
          />
          <Show when={!paramsQuery?.start_date || !paramsQuery?.end_date}>
            <div className="absolute right-2 top-[9px] cursor-pointer hover:opacity-60">
              <X
                size={14}
                onClick={() => {
                  setValueDate('yesterday');
                  updateParamsQuery({ start_date: undefined, end_date: undefined });
                }}
              />
            </div>
          </Show>
        </div>
      </Show>
    </HStack>
  );
};

export default FilterEmailReport;
