import dayjs from 'dayjs';
import { Calendar, MapPin, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { type IParamsMatchingCompaniesList, useListCountryAndParentEvent } from '@/api/company';
import { Icons } from '@/assets/icons';
import Tag from '@/components/TagComponent';
import CustomPopover from '@/components/ui/customize/customPopover';
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
const FilterLumaEvents = (props: IProps) => {
  const { paramsQuery, setParamsQuery, tabs, setTabs } = props;
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedMainEvents, setSelectedMainEvents] = useState<string[]>([]);
  const [selectedDatePreset, setSelectedDatePreset] = useState<string>('');
  const { data: listCountryAndEvent } = useListCountryAndParentEvent();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const mergeParamsQuery = (newParams: Partial<IParamsMatchingCompaniesList>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };
  const handleSearchChange = debounceV2((e: any) => {
    mergeParamsQuery({ search_key: e.target.value, page: 1 });
  }, 500);

  useEffect(() => {
    mergeParamsQuery({ country: selectedCountries.length > 0 ? selectedCountries.join(',') : '', page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountries]);

  const applyTodayDate = () => {
    const today = new Date();
    setSelectedDatePreset('today');
    mergeParamsQuery({
      start_date: dayjs(today).format('YYYY-MM-DD'),
      end_date: dayjs(today).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const applyThisWeek = () => {
    setSelectedDatePreset('week');
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const endOfWeek = new Date(today);

    mergeParamsQuery({
      start_date: dayjs(startOfWeek).format('YYYY-MM-DD'),
      end_date: dayjs(endOfWeek).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const applyThisMonth = () => {
    setSelectedDatePreset('month');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today);

    mergeParamsQuery({
      start_date: dayjs(startOfMonth).format('YYYY-MM-DD'),
      end_date: dayjs(endOfMonth).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    const { from, to } = dateRange;

    mergeParamsQuery({
      start_date: from ? formatDate(from, DATETIME_FORMAT.DATE_TIME) : undefined,
      end_date: to ? formatDate(to, DATETIME_FORMAT.DATE_TIME) : undefined,
    });
  };

  const handleTabSelect = (value: string | number) => {
    setTabs(value);
    mergeParamsQuery({ page: 1, status: value === '' ? undefined : String(value) });
  };

  const handleDatePresetChange = (value: string) => {
    switch (value) {
      case 'today':
        applyTodayDate();
        break;
      case 'week':
        applyThisWeek();
        break;
      case 'month':
        applyThisMonth();
        break;
      case 'date_range':
        mergeParamsQuery({ start_date: '', end_date: '', page: 1 });
        setSelectedDatePreset('date_range');
        setIsDatePickerOpen(true);
        break;
      default:
        setSelectedDatePreset('');
        mergeParamsQuery({ start_date: '', end_date: '', page: 1 });
        break;
    }
  };

  return (
    <VStack spacing={8} className="sticky top-0 z-10 bg-white py-3">
      <HStack pos={'apart'} spacing={8}>
        <Tag>Events</Tag>
        <HStack spacing={0}>
          {dataTabs.map((item) => {
            return (
              <div
                className={cn(
                  'text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-sm px-2 text-xs font-semibold hover:opacity-50',
                  tabs === item.value && 'bg-main text-white'
                )}
                key={item.value}
                onClick={() => handleTabSelect(item.value)}
              >
                {item.label}
              </div>
            );
          })}
        </HStack>
      </HStack>
      <HStack spacing={8} pos={'apart'}>
        <div className="max-w-[250px]">
          <Input
            placeholder={'Search Side Event Name'}
            className="border-neutral-30 h-8 border-2 text-xs"
            name="search"
            suffix={<Search size={16} color="#808080" />}
            onChange={handleSearchChange}
          />
        </div>

        <HStack>
          <CustomPopover
            data={listCountryAndEvent?.main_events.map((item: any) => ({ label: item.name, value: item.id }))}
            value={selectedMainEvents}
            setValue={setSelectedMainEvents}
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
            name="main_event"
            icon={Icons.calendardays}
          />
          <CustomPopover
            data={listCountryAndEvent?.list_country?.map((item: any) => ({ label: item, value: item }))}
            value={selectedCountries}
            setValue={setSelectedCountries}
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
            name="country"
            icon={MapPin}
          />
          <Show when={selectedDatePreset !== 'date_range'}>
            <Select
              key={dateOptions?.[0]?.value}
              defaultValue={dateOptions?.[0]?.value}
              onValueChange={handleDatePresetChange}
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
          <Show when={selectedDatePreset === 'date_range'}>
            <div className="relative min-w-[180px]">
              <DateRangePicker
                from={paramsQuery?.start_date}
                to={paramsQuery?.end_date}
                onChange={handleDateRangeChange}
                placeholder="Select date range"
                className="cursor-pointer rounded-full text-xs"
                onReset={() => {
                  setSelectedDatePreset('');
                  mergeParamsQuery({ start_date: undefined, end_date: undefined, page: 1 });
                }}
                open={isDatePickerOpen}
                setOpen={setIsDatePickerOpen}
              />
              <Show when={!paramsQuery?.start_date || !paramsQuery?.end_date}>
                <div className="absolute right-2 top-[10px] cursor-pointer hover:opacity-60">
                  <X
                    size={16}
                    onClick={() => {
                      setSelectedDatePreset('');
                      mergeParamsQuery({ start_date: undefined, end_date: undefined, page: 1 });
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
