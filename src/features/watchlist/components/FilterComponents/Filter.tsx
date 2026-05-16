import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { Calendar, Search } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

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
const Filter = (props: IProps) => {
  const { paramsQuery, setParamsQuery } = props;
  const [valueDate, setValueDate] = useState<string>('');
  const [searchValue, setSearchValue] = useState(paramsQuery.search_key || '');
  const updateParamsQuery = (newParams: Partial<IParamsMatchingCompaniesList>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value) => {
      setParamsQuery((prev) => ({ ...prev, search_key: value, page: 1 }));
    }, 500),
    []
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <HStack spacing={8} pos={'apart'}>
      <HStack spacing={16}>
        <div className="max-w-[256px]">
          <Input
            placeholder={'Search Company'}
            name="search"
            className="border-neutral-30 h-8 border-2 text-xs"
            suffix={<Search size={16} color="#808080" />}
            value={searchValue}
            onChange={handleInputChange}
          />
        </div>
      </HStack>
      <HStack>
        <Select
          key={valueDate}
          defaultValue={valueDate}
          onValueChange={(e) => {
            switch (e) {
              case 'today':
                handleSelectDateToday();
                break;
              case 'week':
                handleSelectThisWeek();
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

export default Filter;
