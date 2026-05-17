import dayjs from 'dayjs';
import { Calendar, Search } from 'lucide-react';
import React, { useState } from 'react';

import type { IParamsMatchingCompaniesList } from '@/api/company';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HStack } from '@/components/ui/Utilities';
import { cn, removeUndefinedKeys } from '@/lib/utils';

import { dateOptions } from '../../utils/const';

interface IProps {
  paramsQuery: IParamsMatchingCompaniesList;
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsMatchingCompaniesList>>;
}
const FilterMatchingCompanies = (props: IProps) => {
  const { paramsQuery, setParamsQuery } = props;
  const [selectedDatePreset, setSelectedDatePreset] = useState('');

  const mergeParamsQuery = (newParams: Partial<IParamsMatchingCompaniesList>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    mergeParamsQuery({ search_key: e.target.value, page: 1 });
  };

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

  const handleDatePresetChange = (value: string) => {
    switch (value) {
      case 'today':
        applyTodayDate();
        break;
      case 'week':
        applyThisWeek();
        break;
      default:
        setSelectedDatePreset('');
        mergeParamsQuery({
          start_date: '',
          end_date: '',
          page: 1,
        });
        break;
    }
  };

  return (
    <HStack spacing={8} pos={'apart'} className="my-4">
      <HStack spacing={16}>
        <div className="max-w-[400px]">
          <Input
            placeholder={'Search Company'}
            name="search"
            className="border-neutral-30 h-8 border-2 text-xs"
            suffix={<Search size={16} color="#808080" />}
            value={paramsQuery.search_key || ''}
            onChange={handleInputChange}
          />
        </div>
      </HStack>

      <HStack>
        <Select
          key={dateOptions?.[0]?.value}
          value={selectedDatePreset}
          onValueChange={handleDatePresetChange}
        >
          <SelectTrigger
            className={cn(
              'border-neutral-30 text-neutral-40 flex h-8 items-center gap-2 rounded-md border-2 text-xs font-medium hover:opacity-50'
            )}
          >
            <Calendar size={14} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateOptions?.map((item: any, index) => (
              <SelectItem value={item.value} key={index} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </HStack>
    </HStack>
  );
};

export default FilterMatchingCompanies;
