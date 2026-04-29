/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDown, ChevronLeft, Filter, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import type { ICustomFilterList, IParamsMatchingCompaniesList } from '@/api/company';
import { Icons } from '@/assets/icons';
import ModalCreateFilter from '@/components/Modal/Company/ModalCreateFilter';
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

import ModalReNameFilter from './ModalReNameFilter';
import SaveICP from './SaveICP';
import { tabs } from './utils/const';

interface IProps {
  getDataFilter: any[];
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsMatchingCompaniesList>>;
  paramsQuery: IParamsMatchingCompaniesList;
  listCustomFilter: ICustomFilterList[] | undefined;
  setIsDataCustomFilter: React.Dispatch<React.SetStateAction<{ id: string; filter_name: string; filter: any }>>;
  isDataCustomFilter: { id: string; filter_name: string; filter: any };
  selectedValues: { [key: string]: { value: string; label: string }[] };
  setSelectedValues: React.Dispatch<React.SetStateAction<{ [key: string]: { value: string; label: string }[] }>>;
}
const SideBarSearch = (props: IProps) => {
  const {
    getDataFilter,
    setParamsQuery,
    listCustomFilter,
    setIsDataCustomFilter,
    isDataCustomFilter,
    selectedValues,
    setSelectedValues,
  } = props;

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
  const [tab, setTab] = useState<string | number>(tabs[0].value);

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

  const processCustomFilter = () => {
    const updatedFilter = { ...isDataCustomFilter };
    if (isDataCustomFilter.filter && typeof isDataCustomFilter.filter === 'object') {
      Object?.keys(isDataCustomFilter.filter).forEach((filterKey) => {
        const newValues = isDataCustomFilter.filter[filterKey];

        const filterData = getDataFilter.find((filter) => filter.name === filterKey);

        if (filterData) {
          updatedFilter.filter[filterKey] = newValues.map((value: string) => {
            const matchedItem = filterData.value.find((item: any) => item.value === value);

            return matchedItem ? { value: matchedItem.value, label: matchedItem.label } : value;
          });
        }
      });
    }

    setIsDataCustomFilter(updatedFilter);
  };

  useEffect(() => {
    processCustomFilter();
  }, [isDataCustomFilter?.filter]);

  useEffect(() => {
    if (isDataCustomFilter?.id) {
      setSelectedValues(isDataCustomFilter?.filter);
    }
  }, [isDataCustomFilter?.id]);

  useEffect(() => {
    handleSearch();
  }, [isDataCustomFilter]);

  const mergedObjectsWithFieldName = Object.entries(selectedValues).flatMap(([fieldName, group]) =>
    group.map((item) => ({ ...item, fieldName }))
  );

  return (
    <VStack className="bg-neutral-10 h-fit w-full p-3 xl:max-w-[320px]" spacing={12}>
      <HStack noWrap pos={'apart'}>
        <Tag
          className={cn('h-7', tab === 'search' ? 'bg-secondary-blue' : 'bg-secondary-green')}
          classNameContent="text-lg"
        >
          {tabs.find((t) => t.value === tab)?.label}
        </Tag>

        <div
          className="border-neutral-30 flex h-8 w-fit cursor-pointer items-center justify-center gap-2 rounded-md border-2 px-4 py-2 text-xs font-medium"
          onClick={() => setTab(tab === 'search' ? 'save-icp' : 'search')}
        >
          {tab === 'search' ? (
            <>
              Saved Search
              <Icons.icp className="h-4 w-4" />
            </>
          ) : (
            <>
              Filter
              <Filter className="h-4 w-4" color="#6F767E" />
            </>
          )}
        </div>
      </HStack>
      <Show when={tab === 'search'}>
        <VStack spacing={12}>
          <Show when={!!isDataCustomFilter?.id}>
            <div className="flex items-center justify-between text-lg font-bold">
              <Base1>{isDataCustomFilter?.filter_name}</Base1>
              <ModalReNameFilter setIsDataCustomFilter={setIsDataCustomFilter} isDataCustomFilter={isDataCustomFilter}>
                <Icons.edit color="#6F767E" width={16} height={16} className="cursor-pointer hover:opacity-50" />
              </ModalReNameFilter>
            </div>
          </Show>
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
          <ModalCreateFilter
            selectedValues={selectedValues}
            setIsDataCustomFilter={setIsDataCustomFilter}
            isDataCustomFilter={isDataCustomFilter}
          >
            <Button variant={'outline'} className="text-neutral-70 h-8 text-xs font-semibold">
              Save Search
            </Button>
          </ModalCreateFilter>
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
      </Show>
      <Show when={tab === 'save-icp'}>
        <SaveICP
          listCustomFilter={listCustomFilter}
          setIsDataCustomFilter={setIsDataCustomFilter}
          setSelectedValues={setSelectedValues}
          setTab={setTab}
          isDataCustomFilter={isDataCustomFilter}
        />
      </Show>
    </VStack>
  );
};

export default SideBarSearch;
