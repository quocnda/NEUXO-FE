import type { LucideIcon } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Icons } from '@/assets/icons';
import { formatItem } from '@/lib/common';
import { cn, removeUndefinedKeys } from '@/lib/utils';

import { Input } from '../input';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { HStack, VStack } from '../Utilities';

interface IProps {
  data: any;
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  paramsQuery: any;
  setParamsQuery: React.Dispatch<React.SetStateAction<any>>;
  name: string;
  icon?: LucideIcon;
}
const CustomPopover = (props: IProps) => {
  const { data, value, setValue, setParamsQuery, name, icon } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const updateParamsQuery = (newParams: any) => {
    setParamsQuery((prev: any) => removeUndefinedKeys({ ...prev, ...newParams }));
  };

  const handleCheckValue = (key: string) => {
    if (value.includes(key)) {
      setValue((prevState) => prevState.filter((item) => item !== key));
    } else {
      setValue((prevState) => [...prevState, key]);
    }
  };

  const handleClear = () => {
    setValue([]);
    updateParamsQuery({ [name]: '', page: 1 });
  };

  const dataFilter = data?.filter((item: { label: string; value: string }) =>
    item?.label?.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    updateParamsQuery({ [name]: value.length > 0 ? value.join(',') : '', page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const Icon = icon as LucideIcon;

  return (
    <Popover open={isOpen} onOpenChange={handleToggle}>
      <PopoverTrigger asChild>
        <div className="border-neutral-30 text-neutral-40 flex h-8 cursor-pointer items-center gap-2 rounded-md border-2 px-3 text-xs font-medium hover:opacity-50">
          {icon && <Icon width={14} height={14} />}
          <p className="text-neutral-40 text-xs">
            {formatItem(name)} {value.length > 0 ? `(+${value.length})` : ''}
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="z-[100] w-[content] rounded-sm border py-0">
        <VStack spacing={4} className="py-2">
          <div>
            <div className="sticky top-0 z-[99999] flex items-center gap-2 bg-white px-2 py-1">
              <div className="relative">
                <Input
                  className="border-neutral-30 h-8 border-2 text-xs"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <div className="absolute bottom-1/2 left-3 translate-y-1/2">
                  <Icons.search fill="#fff" className="m-auto h-[1.1rem]" />
                </div>
              </div>
              <HStack className={cn('cursor-pointer text-blue-600')} spacing={8} onClick={handleClear}>
                <div>
                  <RefreshCcw size={14} />
                </div>
              </HStack>
            </div>

            <VStack spacing={8} className="max-h-[300px] overflow-auto">
              {dataFilter?.map((i: { label: string; value: string }, z: number) => {
                return (
                  <Label key={z} className="text-grey-600 flex items-center space-x-2 px-2 text-xs font-medium">
                    <Input
                      type="checkbox"
                      onChange={() => handleCheckValue(i.value)}
                      checked={value.includes(i.value)}
                      className="h-3 w-3"
                    />
                    <span className="line-clamp-1 max-w-[12rem] break-all pr-2">{i.label}</span>
                  </Label>
                );
              })}
            </VStack>
          </div>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
