import React from 'react';

import { type ICustomFilterList } from '@/api/company';
import { Icons } from '@/assets/icons';
import ModalRemoveFilter from '@/components/Modal/Company/ModalRemoveFilter';
import { Tooltip } from '@/components/ui/tooltip';
import Base1 from '@/components/ui/typography/base1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

interface IProps {
  listCustomFilter: ICustomFilterList[] | undefined;
  setSelectedValues: React.Dispatch<React.SetStateAction<{ [key: string]: { value: string; label: string }[] }>>;
  setIsDataCustomFilter: React.Dispatch<
    React.SetStateAction<{
      id: string;
      filter_name: string;
      filter: any;
    }>
  >;
  setTab: React.Dispatch<React.SetStateAction<string | number>>;
  isDataCustomFilter: { id: string; filter_name: string; filter: any };
}

const SaveICP = (props: IProps) => {
  const { listCustomFilter, setIsDataCustomFilter, setTab, isDataCustomFilter } = props;

  return (
    <VStack spacing={6}>
      <div className="flex flex-col gap-1">
        {listCustomFilter?.map((item, index: number) => (
          <div
            key={item.id}
            className={cn(
              'border-neutral-30 flex h-10 items-center justify-between rounded-md border-2 p-2',
              isDataCustomFilter?.id === item?.id && 'bg-blue-500 text-white'
            )}
          >
            <HStack spacing={8} noWrap>
              <Base1
                className="flex w-full cursor-pointer items-center gap-2 text-xs"
                onClick={() => {
                  setIsDataCustomFilter(item);
                  setTab('search');
                }}
              >
                {item?.filter_name}
              </Base1>
            </HStack>

            <HStack spacing={8} noWrap>
              <Tooltip label="Update" className="text-xs hover:opacity-60">
                <Icons.edit
                  onClick={() => {
                    setIsDataCustomFilter(item);
                    setTab('search');
                  }}
                  width={14}
                  height={14}
                  color={isDataCustomFilter?.id === item?.id ? 'white' : '#6F767E'}
                  className="cursor-pointer hover:opacity-60"
                />
              </Tooltip>

              <ModalRemoveFilter id={item?.id} name={item?.filter_name} setIsDataCustomFilter={setIsDataCustomFilter}>
                <Icons.remove
                  color={isDataCustomFilter?.id === item?.id ? 'white' : '#6F767E'}
                  width={14}
                  height={14}
                  className="cursor-pointer hover:opacity-60"
                />
              </ModalRemoveFilter>
            </HStack>
          </div>
        ))}

        <Show when={listCustomFilter?.length === 0}>
          <p className="py-3 text-center text-sm">No data</p>
        </Show>
      </div>
    </VStack>
  );
};

export default SaveICP;
