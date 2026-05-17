import React, { useState } from 'react';

import type { IDataLumaEvents, IParamsMatchingCompaniesList } from '@/api/company';
import { useListLumaEvents } from '@/api/company';
import Empty from '@/components/Empty';
import { TablePagination } from '@/components/ui/table';
import { Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import CardEvent from '../../../components/event/CardEvent';
import { dataTabs } from '../utils/const';
import FilterLumaEvents from './FilterLumaEvents';

const defaultQuery: IParamsMatchingCompaniesList = {
  page: 1,
  limit: 100,
  orderByVal: 'DESC',
};

const GRID_CLASS = 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';

const LumaEventsCard = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(defaultQuery);
  const [tabs, setTabs] = useState<string | number>(dataTabs[0].value);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const { data: listEvents, isFetching } = useListLumaEvents({ variables: paramsQuery });

  const handlePageChange = (page: number) => {
    setParamsQuery((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit: number | string) => {
    setParamsQuery((prev) => ({ ...prev, limit: Number(limit) }));
  };

  return (
    <>
      <Wrapper className="pb-3 pt-0">
        <FilterLumaEvents paramsQuery={paramsQuery} setParamsQuery={setParamsQuery} tabs={tabs} setTabs={setTabs} />
        <Show when={!isFetching}>
          <div className={GRID_CLASS}>
            {listEvents?.data?.map((item: IDataLumaEvents, index) => (
              <CardEvent
                item={item}
                key={index}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
                paramsQuery={paramsQuery}
              />
            ))}
          </div>
        </Show>
        <Show when={isFetching}>
          <div className={GRID_CLASS}>
            {Array.from({ length: 10 }).map((_, index) => (
              <CardEvent loading key={index} />
            ))}
          </div>
        </Show>
        <Show when={!isFetching && (listEvents?.data?.length === 0 || !listEvents)}>
          <Empty />
        </Show>
        <Show when={!isFetching && listEvents?.data?.length !== 0 && !!listEvents}>
          <div className="sticky bottom-0 mt-5 bg-white">
            <TablePagination
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pagination={{
                ...listEvents?.pagination,
                current_page: paramsQuery.page,
                limit: paramsQuery.limit,
              }}
            />
          </div>
        </Show>
      </Wrapper>
    </>
  );
};

export default LumaEventsCard;
