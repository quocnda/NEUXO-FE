/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDown, ChevronLeft, Search, X } from 'lucide-react';
import React, { useState } from 'react';

import type { IParamsMatchingCompaniesList } from '@/api/company';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip } from '@/components/ui/tooltip';
import Base1 from '@/components/ui/typography/base1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatItem } from '@/lib/common';
import { cn } from '@/lib/utils';

interface IProps {
  getDataFilter: any[];
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsMatchingCompaniesList>>;
  paramsQuery: IParamsMatchingCompaniesList;
  selectedValues: { [key: string]: { value: string; label: string }[] };
  setSelectedValues: React.Dispatch<React.SetStateAction<{ [key: string]: { value: string; label: string }[] }>>;
}
const SideBarSearch = (props: IProps) => {
  const { getDataFilter, setParamsQuery, selectedValues, setSelectedValues } = props;

  const [visibleContacts, setVisibleContacts] = useState<{ [key: number]: boolean }>({});

  const [searchTerms, setSearchTerms] = useState<{ [key: number]: string }>({});

  const [showTooltip, setShowTooltip] = useState<{ [key: string]: boolean }>({});

  const handleMouseEnter = (fieldKey: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isTruncated = target.scrollWidth > target.clientWidth;
    setShowTooltip((prev) => ({ ...prev, [fieldKey]: isTruncated }));
  };

  const handleSearchChange = (index: number, value: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [index]: value,
    }));
  };
  const toggleVisibility = (index: number) => {
    setVisibleContacts((prev) => ({
      [index]: !prev[index],
    }));
  };

  const handleCheckboxChange = (fieldName: string, item: { value: string; label: string }, checked: boolean) => {
    setSelectedValues((prev) => {
      const currentValues = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: checked ? [...currentValues, item] : currentValues.filter((i) => i.value !== item.value),
      };
    });
  };

  const handleSearch = () => {
    setParamsQuery?.((prevQuery) => {
      const newQuery: any = { ...prevQuery };

      Object.keys(selectedValues).forEach((columnTitle) => {
        const updatedFilters = selectedValues[columnTitle];

        newQuery[columnTitle] =
          updatedFilters.length > 0 ? updatedFilters.map((item) => item.value).join(',') : undefined;
      });

      return {
        ...newQuery,
        page: 1,
        limit: 100,
        orderByVal: 'DESC',
      };
    });
  };

  const handleResetSearch = () => {
    setSelectedValues({});
    setParamsQuery((prevQuery) => {
      const newQuery: any = { ...prevQuery };

      Object.keys(prevQuery).forEach((key) => {
        if (!(key in {})) {
          delete newQuery[key];
        }
      });

      return { ...newQuery, page: 1, limit: 100, orderByVal: 'DESC' };
    });
  };

  const mergedObjectsWithFieldName = Object.entries(selectedValues).flatMap(([fieldName, group]) =>
    group.map((item) => ({ ...item, fieldName }))
  );

  return (
    <VStack className="bg-neutral-10 h-fit w-full p-3 xl:max-w-[320px]" spacing={12}>
      <HStack noWrap pos={'apart'}>
        <Tag className={cn('bg-secondary-blue h-7')} classNameContent="text-lg">
          Filter
        </Tag>
      </HStack>
      <VStack spacing={12}>
        <HStack spacing={4}>
          {mergedObjectsWithFieldName.map((item, index) => {
            return (
              <Label
                key={index}
                className="bg-neutral-30 text-neutral-70 flex h-6 w-fit cursor-pointer select-none items-center gap-2 rounded-sm border px-2 py-1 text-xs font-medium"
              >
                <span className="line-clamp-1 max-w-[12rem] break-all pr-2 text-xs">{item.label}</span>
                <div>
                  <X
                    className="cursor-pointer hover:opacity-60"
                    size={14}
                    onClick={() => handleCheckboxChange(item.fieldName, item, false)}
                  />
                </div>
              </Label>
            );
          })}
        </HStack>
        <VStack className="h-fit" spacing={8}>
          {getDataFilter.map((item, index) => {
            const customFilter = item?.value?.filter((i: any) =>
              i.label.toLowerCase().includes(searchTerms[index]?.toLowerCase() || '')
            );

            return (
              <VStack key={index} className="gap-[16px]">
                <HStack pos={'apart'} className="cursor-pointer" onClick={() => toggleVisibility(index)}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Base1 className="text-xs">{formatItem(item.name)}</Base1>
                    <Show when={selectedValues[item.name]?.length > 0}>
                      <p className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-center text-xs font-normal">
                        x{selectedValues[item.name]?.length}
                      </p>
                    </Show>
                  </div>
                  {visibleContacts[index] ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
                </HStack>
                <div
                  style={{
                    maxHeight: visibleContacts[index] ? '200px' : '0',
                    opacity: visibleContacts[index] ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                  }}
                  className="flex flex-col gap-[16px]"
                >
                  <Show when={item.name === 'country' || item.name === 'industry'}>
                    <Input
                      className="border-neutral-30 h-7 border-2 text-xs"
                      placeholder="Search..."
                      value={searchTerms[index] || ''}
                      onChange={(e) => handleSearchChange(index, e.target.value)}
                      suffix={<Search size={14} color="#808080" />}
                    />
                  </Show>

                  <div className="grid grid-cols-1 gap-2 overflow-auto sm:grid-cols-2">
                    {customFilter?.map((i: any, z: number) => {
                      return (
                        <Label key={z} className="flex h-4 max-h-[300px] cursor-pointer items-center gap-2">
                          <Input
                            type="checkbox"
                            className="h-3 w-3 cursor-pointer"
                            onChange={(e) => handleCheckboxChange(item.name, i, e.target.checked)}
                            checked={selectedValues[item.name]?.some((val) => val.value === i.value) || false}
                          />
                          <div
                            className="truncate whitespace-nowrap text-xs font-normal"
                            onMouseEnter={handleMouseEnter(`${item.name}-${i.value}`)}
                          >
                            <Tooltip
                              label={i.label}
                              className="max-w-xs text-xs"
                              hidden={!showTooltip[`${item.name}-${i.value}`] || false}
                            >
                              <span>{i.label}</span>
                            </Tooltip>
                          </div>
                        </Label>
                      );
                    })}
                  </div>
                  <Show when={customFilter.length === 0}>
                    <p className="py-1 text-center text-xs">No option</p>
                  </Show>
                </div>
              </VStack>
            );
          })}
        </VStack>
        <Separator />
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            variant={'outline'}
            fullWidth
            className="text-neutral-70 h-8 text-xs font-semibold"
            onClick={handleResetSearch}
          >
            Reset
          </Button>
          <Button className="h-8 text-xs font-semibold" onClick={handleSearch} fullWidth>
            Search
          </Button>
        </div>
      </VStack>
    </VStack>
  );
};

export default SideBarSearch;
