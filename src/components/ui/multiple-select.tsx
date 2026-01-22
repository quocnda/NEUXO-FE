import { Check } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { Icons } from '@/assets/icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

import type { InputProps } from './input';
import { Label } from './label';

interface IData {
  label: string;
  value: string;
  error?: boolean;
  image?: string;
  group?: string;
}

interface SelectWithSearchProps extends InputProps {
  onAdd: (value: IData) => void;
  options: IData[];
  onRemove: (value: IData) => void;
  listValue: IData[];
  noDataText?: string;
}

const MultipleSelect = forwardRef<HTMLInputElement, SelectWithSearchProps>(
  ({ className, value, inputSize, label, options, listValue, noDataText, onRemove, onAdd, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const { width } = groupRef.current?.getBoundingClientRect() || {};

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [setOpen]);

    return (
      <div className="relative" ref={containerRef}>
        <Label className="mb-1.5 block text-left">{label}</Label>
        <div
          className="relative flex min-h-[4.375rem] w-full flex-wrap gap-1 rounded-md bg-[#EFEFEF] px-5 pb-2.5 pr-[3rem] pt-4"
          onClick={() => setOpen(!open)}
          ref={groupRef}
        >
          {listValue?.length === 0 ? (
            <div className="flex items-center">{noDataText || 'No Selected Item'}</div>
          ) : (
            <>
              {listValue?.map((item, key) => (
                <div
                  className="flex items-center justify-between gap-5 truncate rounded-md bg-white px-[1.125rem] py-2.5"
                  key={key}
                  id="child"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop child onclick event
                  }}
                >
                  <span
                    className={cn('w-[15.625rem] truncate text-base font-semibold', {
                      'text-red-500': item?.error,
                    })}
                  >
                    {item?.label}
                  </span>
                  <div className="w-2 shrink-0">
                    <Icons.XIcon className="cursor-pointer" onClick={() => onRemove(item)} />
                  </div>
                </div>
              ))}
            </>
          )}

          {/* <PopoverTrigger asChild> */}
          <div className="bg-main-dark-gray absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-md">
            <Icons.chevronDown />
          </div>
          {/* </PopoverTrigger> */}
        </div>
        {open && (
          <div className="absolute w-full rounded bg-white shadow-md" style={{ width }}>
            <Command>
              <CommandInput placeholder="Search by keyword..." />
              <CommandEmpty>No result found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {options.map((x) => (
                    <CommandItem
                      onSelect={() => {
                        const isExist = listValue?.find((item) => item?.value === x?.value);

                        if (isExist) {
                          onRemove(x);
                        } else {
                          onAdd(x);
                          setOpen(false);
                        }
                      }}
                      key={x?.value}
                      style={{ display: listValue?.some((item) => item?.value === x?.value) ? 'none' : 'block' }}
                      value={x?.label}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          listValue?.find((item) => item?.value === x?.value) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex items-center space-x-2">
                        {x.image && <img src={x.image} alt="" className="h-6 w-6" />}
                        <p>{x?.label}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    );
  }
);

export default MultipleSelect;
