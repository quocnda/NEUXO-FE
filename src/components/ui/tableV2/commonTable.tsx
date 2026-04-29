import { ArrowDown, ArrowUp, ListFilter } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import type { Icon } from '@/assets/icons';
import { useFilters } from '@/components/contexts/FilterContextProps';
import { formatItem } from '@/lib/common';
import { cn } from '@/lib/utils';
import { typeHeaderTable } from '@/utils/const';

import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Show, VStack } from '../Utilities';
import PopoverFilter from './PopoverFilter';
import PopoverFilterDate from './PopoverFilterDate';
import PopoverFilterNumberRange from './PopoverFilterNumberRange';

interface Props<T = any> extends React.TableHTMLAttributes<HTMLTableElement> {
  listHeader: {
    title: string;
    key?: any;
    type: string;
    canSort?: boolean;
    canFilter?: boolean;
    dataFilter?: any;
    pin?: string;
    filter_type?: string;
    name_filter?: string[];
    icon?: Icon;
  }[];
  footerComponent: React.ReactElement;
  bodyComponent: React.ReactElement;
  tableClassName?: Props['className'];
  sortData?: (field: string, type: 'DESC' | 'ASC') => void;
  checkBox?: React.ReactNode;
  setParamsQuery?: React.Dispatch<React.SetStateAction<T>>;
  paramsQuery?: T;
  isPinCheckbox?: boolean;
}

const CommonTable = (props: Props) => {
  const {
    listHeader,
    footerComponent,
    bodyComponent,
    tableClassName,
    checkBox,
    isPinCheckbox,
    paramsQuery,
    setParamsQuery,
  } = props;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const { selectedFilters, setSelectedFilters } = useFilters();
  const router = useRouter();
  const [isTooRight, setIsTooRight] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const elementRef = useRef<HTMLDivElement>(null);
  const [debouncedFilters, setDebouncedFilters] = useState(selectedFilters);

  const sortData = (sortBy: string) => {
    setParamsQuery?.((prevQuery: any) => {
      if (prevQuery.sortByVal !== sortBy) {
        return {
          ...prevQuery,
          page: 1,
          sortByVal: sortBy,
          orderByVal: 'ASC',
        };
      }
      if (prevQuery.orderByVal === 'ASC') {
        return {
          ...prevQuery,
          page: 1,
          sortByVal: sortBy,
          orderByVal: 'DESC',
        };
      }
      if (prevQuery.orderByVal === 'DESC') {
        const { sortByVal, orderByVal, ...rest } = prevQuery;
        return { ...rest, page: 1 };
      }

      return prevQuery;
    });
  };

  useEffect(() => {
    setSelectedFilters({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(selectedFilters);
    }, 1000);

    return () => clearTimeout(handler);
  }, [selectedFilters]);

  useEffect(() => {
    if (Object.keys(debouncedFilters).length > 0) {
      setParamsQuery?.((prevQuery: {}) => {
        const newQuery: any = { ...prevQuery };

        Object.keys(debouncedFilters).forEach((columnTitle) => {
          const updatedFilters = debouncedFilters[columnTitle];

          if (columnTitle === 'headquarter') {
            newQuery[columnTitle] = updatedFilters.length > 0 ? JSON.stringify(updatedFilters) : undefined;
          } else {
            newQuery[columnTitle] = updatedFilters.length > 0 ? updatedFilters.join(',') : undefined;
          }
        });

        return { ...newQuery, page: 1, limit: 100, orderByVal: 'DESC' };
      });
    }
  }, [debouncedFilters, setParamsQuery]);

  return (
    <>
      <div className="flex max-h-[calc(100vh-13rem)] w-full overflow-auto">
        <table className={cn('mt-0 w-full table-auto border-collapse border-spacing-0', tableClassName)}>
          <thead className="sticky top-0 z-20">
            <tr>
              {checkBox && (
                <th
                  className={cn(
                    'h-8 w-[50px] border-none bg-white px-4 pb-2',
                    isPinCheckbox && 'sm:sticky sm:left-[-1px]'
                  )}
                >
                  {checkBox}
                </th>
              )}
              {listHeader.map((item, index) => {
                const filteredDataFilter =
                  item?.dataFilter?.filter(({ label }: any) =>
                    label?.toLowerCase().includes(searchTerm.toLowerCase())
                  ) || [];

                return (
                  <th
                    key={index}
                    className={cn('h-8 bg-white px-2 pb-2', item.pin, {
                      'border-r-0': index !== listHeader.length,
                      'w-[150px]': item.type === typeHeaderTable.BUTTON,
                      'w-[100px]': item.type === typeHeaderTable.INDEX,
                      'min-w-[100px]': item.type === typeHeaderTable.DATA,
                    })}
                  >
                    <div className="flex w-full flex-row flex-nowrap items-center justify-between gap-5">
                      <div
                        className="flex w-full cursor-pointer items-center gap-1"
                        onClick={() => {
                          if (item?.key) {
                            sortData(item.key);
                          }
                        }}
                      >
                        {item?.icon && <item.icon />}
                        <Label className="text-neutral-40 cursor-pointer whitespace-nowrap text-start text-xs font-medium">
                          {formatItem(item?.title)}
                        </Label>{' '}
                        <Show when={item?.key}>
                          <Show when={paramsQuery?.sortByVal === item.key && paramsQuery?.orderByVal === 'ASC'}>
                            <ArrowUp className="text-neutral-40" size={14} />
                          </Show>
                          <Show when={paramsQuery?.sortByVal === item.key && paramsQuery?.orderByVal === 'DESC'}>
                            <ArrowDown className="text-neutral-40" size={14} />
                          </Show>
                        </Show>
                      </div>
                      {item.filter_type === 'CHECKBOX' && (
                        <>
                          <Popover
                            onOpenChange={(isOpen) => {
                              setOpen((prevState: any) => {
                                return { ...prevState, [item.key]: isOpen };
                              });
                              if (!isOpen) {
                                setSearchTerm('');
                              }
                            }}
                            open={open[item.key]}
                          >
                            <PopoverTrigger asChild className="ml-3">
                              <div>
                                <ListFilter
                                  size={12}
                                  className={cn('cursor-pointer', {
                                    'text-blue-600':
                                      !!(paramsQuery as any)?.[item.key] &&
                                      (paramsQuery as any)?.[item.key]?.length !== 0,
                                  })}
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-[content] rounded-sm border py-0">
                              <VStack spacing={4} className="py-2">
                                <PopoverFilter
                                  elementRef={elementRef}
                                  setIsTooRight={setIsTooRight}
                                  isTooRight={isTooRight}
                                  searchTerm={searchTerm}
                                  setSearchTerm={setSearchTerm}
                                  filteredDataFilter={filteredDataFilter}
                                  item={item}
                                  paramsQuery={paramsQuery}
                                  setParamsQuery={setParamsQuery}
                                  setSelectedFilters={setSelectedFilters}
                                  selectedFilters={selectedFilters}
                                />
                              </VStack>
                            </PopoverContent>
                          </Popover>
                        </>
                      )}
                      <Show when={item.filter_type === 'DATE'}>
                        <PopoverFilterDate
                          elementRef={elementRef}
                          paramsQuery={paramsQuery}
                          setParamsQuery={setParamsQuery}
                          startDate={item?.name_filter?.[0]}
                          endDate={item?.name_filter?.[1]}
                        />
                      </Show>
                      <Show when={item.filter_type === 'NUMBER_RANGE'}>
                        <PopoverFilterNumberRange
                          elementRef={elementRef}
                          paramsQuery={paramsQuery}
                          setParamsQuery={setParamsQuery}
                          nameToFilter={item?.name_filter?.[0]}
                          nameForFilter={item?.name_filter?.[1]}
                        />
                      </Show>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{bodyComponent}</tbody>
        </table>
      </div>
      <div className="sticky bottom-0 z-[10] mt-0 bg-white">{footerComponent}</div>
    </>
  );
};

export default CommonTable;
