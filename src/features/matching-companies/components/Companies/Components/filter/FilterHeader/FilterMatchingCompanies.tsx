import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { Calendar, Filter, Search } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import type { IParamsMatchingCompaniesList } from '@/api/company';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip } from '@/components/ui/tooltip';
import { HStack } from '@/components/ui/Utilities';
import { cn, removeUndefinedKeys } from '@/lib/utils';

import { dateOptions } from '../../../../../utils/const';
import ToggleColumns from './ToggleColumns';

interface IProps {
  paramsQuery: IParamsMatchingCompaniesList;
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsMatchingCompaniesList>>;
  columns: any;
  refetch: any;
  setIsShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  isShowFilter: boolean;
  setValueDate: React.Dispatch<React.SetStateAction<string>>;
  valueDate: string;
}
const FilterMatchingCompanies = (props: IProps) => {
  const { paramsQuery, setParamsQuery, columns, refetch, setIsShowFilter, isShowFilter, setValueDate, valueDate } =
    props;
  const [searchValue, setSearchValue] = useState(paramsQuery.search_key || '');
  const mergeParamsQuery = (newParams: Partial<IParamsMatchingCompaniesList>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };
  const applyTodayDate = () => {
    const today = new Date();
    setValueDate('today');
    mergeParamsQuery({
      start_date: dayjs(today).format('YYYY-MM-DD'),
      end_date: dayjs(today).format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const applyThisWeek = () => {
    setValueDate('week');
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
    <HStack spacing={8} pos={'apart'} className="my-4">
      <HStack spacing={16}>
        <Tooltip label="Filter" className="text-xs">
          <div
            className="border-neutral-30 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border-2 px-3 hover:opacity-50"
            onClick={() => {
              setIsShowFilter(!isShowFilter);
            }}
          >
            <Filter className="h-4 w-4" color="#6F767E" />
            <span className="text-neutral-40 text-xs font-medium">Filter</span>
          </div>
        </Tooltip>

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
          key={dateOptions?.[0]?.value}
          value={valueDate}
          onValueChange={(e) => {
            switch (e) {
              case 'today':
                applyTodayDate();
                break;
              case 'week':
                applyThisWeek();
                break;

              default:
                setValueDate('');
                mergeParamsQuery({
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
        <ToggleColumns columns={columns} refetch={refetch} />
      </HStack>
    </HStack>
  );
};

export default FilterMatchingCompanies;
