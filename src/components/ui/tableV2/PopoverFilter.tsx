import { RefreshCcw } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import type { IParamsMatchingCompaniesList } from '@/api/company';
import { Icons } from '@/assets/icons';
import { cn } from '@/lib/utils';

import { Input } from '../input';
import { Label } from '../label';
import { HStack, Show, VStack } from '../Utilities';

interface Props {
  elementRef: React.RefObject<HTMLDivElement>;
  setIsTooRight: React.Dispatch<React.SetStateAction<boolean>>;
  isTooRight: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredDataFilter: any;
  item: { title: string; type: string; canSort?: boolean; canFilter?: boolean; dataFilter?: any; key?: any };
  paramsQuery: IParamsMatchingCompaniesList | undefined;
  setParamsQuery?: Dispatch<SetStateAction<IParamsMatchingCompaniesList>> | undefined;
  setSelectedFilters: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
  selectedFilters: { [key: string]: string[] };
}
const PopoverFilter = (props: Props) => {
  const { elementRef, searchTerm, setSearchTerm, filteredDataFilter, item, setSelectedFilters, selectedFilters } =
    props;

  const handleSelectItem = (value: string, columnTitle: string) => {
    setSelectedFilters((prevFilters) => {
      const columnFilters = prevFilters[columnTitle] || [];
      let updatedFilters;

      if (columnFilters.includes(value)) {
        updatedFilters = columnFilters.filter((i) => i !== value);
      } else {
        updatedFilters = [...columnFilters, value];
      }
      const newFilters = { ...prevFilters, [columnTitle]: updatedFilters };
      // if (updatedFilters.length === 0) {
      //   delete newFilters[columnTitle];
      // }

      return newFilters;
    });
  };

  return (
    <div ref={elementRef}>
      <div className="sticky top-0 z-[99999] bg-white/95 backdrop-blur">
        <div className="px-2 py-2">
          <Input
            className="h-8 rounded-md border border-neutral-200/70 text-xs text-neutral-700 shadow-sm focus:border-neutral-300"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute bottom-1/2 left-3 translate-y-1/2 text-neutral-400">
            <Icons.search fill="#fff" className="m-auto h-[1.1rem]" />
          </div>
        </div>
      </div>
      <Show when={filteredDataFilter?.length > 0 && !!item?.dataFilter}>
        <HStack
          onClick={() => {
            setSelectedFilters((prev) => ({ ...prev, [item.key]: [] }));
          }}
          className={cn('cursor-pointer px-2 py-2 text-blue-600 hover:text-blue-700')}
          spacing={8}
        >
          <div>
            <RefreshCcw size={14} />
          </div>
          <span className="text-xs font-medium">Clear Filter</span>
        </HStack>
        <VStack spacing={8} className="max-h-[300px] overflow-auto">
          {filteredDataFilter.map((i: { label: string; value: string }, z: number) => {
            return (
              <Label key={z} className="text-neutral-700 flex items-center space-x-2 px-2 text-xs font-medium">
                <Input
                  type="checkbox"
                  onChange={() => handleSelectItem(i.value, item.key)}
                  className="h-3 w-3 rounded border-neutral-300"
                  checked={!!selectedFilters[item.key]?.includes(i.value)}
                />
                <span className="line-clamp-1 max-w-[12rem] break-all pr-2">{i.label}</span>
              </Label>
            );
          })}
        </VStack>
      </Show>
      <Show when={filteredDataFilter?.length === 0}>
        <p className="py-3 text-center text-sm font-medium">No data</p>
      </Show>
    </div>
  );
};

export default PopoverFilter;
