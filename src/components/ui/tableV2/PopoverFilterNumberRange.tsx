import { ListFilter, RefreshCcw } from 'lucide-react';
import type { Dispatch } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { cn, removeUndefinedKeys } from '@/lib/utils';

import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { HStack, VStack } from '../Utilities';

interface Props {
  elementRef: React.RefObject<HTMLDivElement>;
  paramsQuery: any | undefined;
  setParamsQuery: Dispatch<any> | undefined;
  nameToFilter?: string;
  nameForFilter?: string;
}

const PopoverFilterNumberRange = (props: Props) => {
  const { paramsQuery, setParamsQuery, nameToFilter, nameForFilter } = props;
  const updateParamsQuery = (newParams: Partial<any>) => {
    setParamsQuery?.((prev: any) => removeUndefinedKeys({ ...prev, ...newParams }));
  };
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  const handleApply = () => {
    if (Number(minValue) > Number(maxValue) && minValue && maxValue) {
      toast.error('From value cannot be greater than to value');
      return;
    }
    if (nameToFilter && nameForFilter) {
      updateParamsQuery({ [nameToFilter]: minValue, [nameForFilter]: maxValue });
    }
  };
  const handleClear = () => {
    if (nameToFilter && nameForFilter) {
      setMinValue(null);
      setMaxValue(null);
      updateParamsQuery({ [nameToFilter]: undefined, [nameForFilter]: undefined });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleToggle}>
      <PopoverTrigger asChild>
        <div>
          <ListFilter
            size={12}
            className={cn('cursor-pointer text-neutral-400 transition-colors hover:text-neutral-600', {
              'text-blue-600': !!(paramsQuery as any)?.email_count_start && (paramsQuery as any)?.email_count_end,
            })}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="z-[100] w-[content] rounded-md border border-neutral-200/70 bg-white p-2 shadow-lg">
        <VStack spacing={8}>
          <HStack className={cn('cursor-pointer text-blue-600 hover:text-blue-700')} spacing={8} onClick={handleClear}>
            <div>
              <RefreshCcw size={14} />
            </div>
            <span className="text-xs font-medium">Clear Filter</span>
          </HStack>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={minValue || ''}
              onChange={(e) => setMinValue(Number(e.target.value))}
              placeholder="From"
              onInput={(evt) => {
                const reGex = /[^0-9]/g;
                if (reGex.test(evt.currentTarget.value)) {
                  evt.currentTarget.value = evt.currentTarget.value.replace(reGex, '');
                }
              }}
              className="max-w-[70px] rounded-md border border-neutral-200/70 px-2 py-1 text-xs text-neutral-700 shadow-sm focus:border-neutral-300"
            />
            <p>-</p>
            <input
              type="text"
              value={maxValue || ''}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              placeholder="To"
              onInput={(evt) => {
                const reGex = /[^0-9]/g;
                if (reGex.test(evt.currentTarget.value)) {
                  evt.currentTarget.value = evt.currentTarget.value.replace(reGex, '');
                }
              }}
              className="max-w-[70px] rounded-md border border-neutral-200/70 px-2 py-1 text-xs text-neutral-700 shadow-sm focus:border-neutral-300"
            />
          </div>
          <Button className="h-8 w-full text-xs" onClick={handleApply}>
            Apply
          </Button>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverFilterNumberRange;
