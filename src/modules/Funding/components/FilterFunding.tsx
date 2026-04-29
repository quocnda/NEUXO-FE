import dayjs from 'dayjs';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import type { IParamsMatchingCompaniesList } from '@/api/company';
import { Input } from '@/components/ui/input';
import { HStack } from '@/components/ui/Utilities';
import { formatDate } from '@/lib/common';
import { DATETIME_FORMAT } from '@/lib/const';
import { debounceV2, removeUndefinedKeys } from '@/lib/utils';

interface IProps {
  paramsQuery: IParamsMatchingCompaniesList;
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsMatchingCompaniesList>>;
}
const FilterFunding = (props: IProps) => {
  const { paramsQuery, setParamsQuery } = props;
  const [valueDate, setValueDate] = useState<string>('');
  const [open, setOpen] = useState(false);
  const updateParamsQuery = (newParams: Partial<IParamsMatchingCompaniesList>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };

  const handleInputChange = debounceV2((e: any) => {
    updateParamsQuery({ search_key: e.target.value, page: 1 });
  }, 500);
  const handleSelectDateToday = () => {
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
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const endOfWeek = new Date(today);

    updateParamsQuery({
      start_date: dayjs(startOfWeek).format('YYYY-MM-DD'),
      end_date: dayjs(endOfWeek).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const handleSelectThisMonth = () => {
    setValueDate('month');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today);

    updateParamsQuery({
      start_date: dayjs(startOfMonth).format('YYYY-MM-DD'),
      end_date: dayjs(endOfMonth).format('YYYY-MM-DD'),
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
    <HStack spacing={32} pos={'apart'}>
      <div className="max-w-[400px]">
        <Input
          placeholder={'Search Company'}
          name="search"
          className="border-neutral-30 h-8 border-2 text-xs"
          suffix={<Search size={16} color="#808080" />}
          onChange={handleInputChange}
        />
      </div>
      {/* <Show when={valueDate !== 'date_range'}>
        <Select
          key={dateOptions?.[0]?.value}
          defaultValue={dateOptions?.[0]?.value}
          onValueChange={(value) => {
            switch (value) {
              case 'today':
                handleSelectDateToday();
                break;
              case 'week':
                handleSelectThisWeek();
                break;
              case 'month':
                handleSelectThisMonth();
                break;
              case 'date_range':
                updateParamsQuery({
                  start_date: undefined,
                  end_date: undefined,
                  page: 1,
                });
                setValueDate('date_range');
                setOpen(true);
                break;
              default:
                setValueDate('');
                updateParamsQuery({
                  start_date: undefined,
                  end_date: undefined,
                  page: 1,
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
      </Show> */}
    </HStack>
  );
};

export default FilterFunding;
