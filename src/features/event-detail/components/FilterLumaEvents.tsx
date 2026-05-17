import dayjs from 'dayjs';
import { Calendar, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { type IParamsMatchingCompaniesList } from '@/api/company';
import { DateRangePicker } from '@/components/ui/date-picker-custom/date-range-picker-v2';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatDate } from '@/lib/common';
import { DATETIME_FORMAT } from '@/lib/const';
import { cn, debounceV2, removeUndefinedKeys } from '@/lib/utils';

import { dataTabs, dateOptions } from '../utils/const';

interface IProps {
  paramsQuery: IParamsMatchingCompaniesList;
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsMatchingCompaniesList>>;
  tabs: string | number;
  setTabs: React.Dispatch<React.SetStateAction<string | number>>;
}
const TAB_BUTTON_CLASS =
  'text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-sm px-2 text-xs font-semibold hover:opacity-50';
const SELECT_TRIGGER_CLASS =
  'border-neutral-30 text-neutral-40 flex h-8 items-center gap-2 rounded-md border-2 text-xs font-medium hover:opacity-50';

const getWeekStartDate = (today: Date) => {
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return startOfWeek;
};

const getMonthStartDate = (today: Date) => new Date(today.getFullYear(), today.getMonth(), 1);

const FilterLumaEvents = (props: IProps) => {
  const { paramsQuery, setParamsQuery, tabs, setTabs } = props;
  const [open, setOpen] = useState(false);
  const [valueDate, setValueDate] = useState<string>('');

  const updateParamsQuery = (newParams: Partial<IParamsMatchingCompaniesList>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };

  const handleSearchChange = debounceV2((event: React.ChangeEvent<HTMLInputElement>) => {
    updateParamsQuery({ search_key: event.target.value, page: 1 });
  }, 500);

  const handleSelectToday = () => {
    const today = new Date();
    setValueDate('today');
    updateParamsQuery({
      start_date: dayjs(today).format('YYYY-MM-DD'),
      end_date: dayjs(today).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const handleSelectThisWeek = () => {
    setValueDate('week');
    const today = new Date();
    const startOfWeek = getWeekStartDate(today);

    updateParamsQuery({
      start_date: dayjs(startOfWeek).format('YYYY-MM-DD'),
      end_date: dayjs(today).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const handleSelectThisMonth = () => {
    setValueDate('month');
    const today = new Date();
    const startOfMonth = getMonthStartDate(today);

    updateParamsQuery({
      start_date: dayjs(startOfMonth).format('YYYY-MM-DD'),
      end_date: dayjs(today).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    const { from, to } = dateRange;

    updateParamsQuery({
      start_date: from ? formatDate(from, DATETIME_FORMAT.DATE_TIME) : undefined,
      end_date: to ? formatDate(to, DATETIME_FORMAT.DATE_TIME) : undefined,
    });
  };
  return (
    <VStack spacing={16} className="sticky top-0 bg-white py-3">
      <HStack spacing={8} pos={'apart'}>
        <HStack spacing={0}>
          {dataTabs.map((item, index) => {
            const isActive = tabs === item.value;
            return (
              <div
                className={cn(TAB_BUTTON_CLASS, isActive && 'bg-main text-white')}
                key={index}
                onClick={() => {
                  setTabs(item.value);
                  updateParamsQuery({ page: 1, status: item.value === '' ? undefined : String(item.value) });
                }}
              >
                {item.label}
              </div>
            );
          })}
        </HStack>
        <HStack>
          <div className="max-w-[250px]">
            <Input
              placeholder="Search Side Event Name"
              name="search"
              className="border-neutral-30 h-8 border-2 text-xs"
              suffix={<Search size={16} />}
              onChange={handleSearchChange}
            />
          </div>
          <Show when={valueDate !== 'date_range'}>
            <Select
              key={dateOptions?.[0]?.value}
              defaultValue={dateOptions?.[0]?.value}
              onValueChange={(value) => {
                switch (value) {
                  case 'today':
                    handleSelectToday();
                    break;
                  case 'week':
                    handleSelectThisWeek();
                    break;
                  case 'month':
                    handleSelectThisMonth();
                    break;
                  case 'date_range':
                    updateParamsQuery({
                      start_date: '',
                      end_date: '',
                      page: 1,
                    });
                    setValueDate('date_range');
                    setOpen(true);
                    break;
                  default:
                    setValueDate('');
                    updateParamsQuery({
                      start_date: '',
                      end_date: '',
                      page: 1,
                    });
                    break;
                }
              }}
            >
              <SelectTrigger className={cn(SELECT_TRIGGER_CLASS)}>
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
                from={paramsQuery?.start_date}
                to={paramsQuery?.end_date}
                onChange={handleDateRangeChange}
                placeholder="Select date range"
                className="cursor-pointer rounded-full text-xs"
                onReset={() => {
                  setValueDate('');
                  updateParamsQuery({ start_date: undefined, end_date: undefined, page: 1 });
                }}
                open={open}
                setOpen={setOpen}
              />
              <Show when={!paramsQuery?.start_date || !paramsQuery?.end_date}>
                <div className="absolute right-2 top-[10px] cursor-pointer hover:opacity-60">
                  <X
                    size={16}
                    onClick={() => {
                      setValueDate('');
                      updateParamsQuery({ start_date: undefined, end_date: undefined, page: 1 });
                    }}
                  />
                </div>
              </Show>
            </div>
          </Show>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default FilterLumaEvents;
