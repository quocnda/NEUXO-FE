import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { IDataLumaEvents, IParamsMatchingCompaniesList } from '@/api/company';
import { useListLumaEvents } from '@/api/company';
import Empty from '@/components/Empty';
import { TablePagination } from '@/components/ui/table';
import { Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import CardEvent from '../../../components/event/CardEvent';
import { dataTabs } from '../utils/const';
import FilterLumaEvents from './FilterLumaEvents';

const EventDetailCard = () => {
  const defaultQuery: IParamsMatchingCompaniesList = {
    page: 1,
    limit: 100,
    orderByVal: 'DESC',
  };

  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(defaultQuery);
  const router = useRouter();
  const { event_id } = router.query;
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [tabs, setTabs] = useState<string | number>(dataTabs[0].value);
  const { data: listEvents, isFetching } = useListLumaEvents({ variables: paramsQuery });

  useEffect(() => {
    if (event_id) {
      setParamsQuery({ ...paramsQuery, main_event: event_id as string, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event_id]);

  return (
    <>
      <Wrapper className="pb-3 pt-0">
        <FilterLumaEvents paramsQuery={paramsQuery} setParamsQuery={setParamsQuery} tabs={tabs} setTabs={setTabs} />
        <Show when={!isFetching}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {listEvents?.data?.map((item: IDataLumaEvents, index) => (
              <CardEvent item={item} key={index} setSelectedIds={setSelectedIds} selectedIds={selectedIds} />
            ))}
          </div>
        </Show>
        <Show when={isFetching}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <CardEvent loading key={index} setSelectedIds={setSelectedIds} selectedIds={selectedIds} />
            ))}
          </div>
        </Show>
        <Show when={!isFetching && (listEvents?.data?.length === 0 || !listEvents)}>
          <Empty />
        </Show>
        <Show when={!isFetching && listEvents?.data?.length !== 0 && !!listEvents}>
          <div className="sticky bottom-0 mt-5 bg-white">
            <TablePagination
              onPageChange={(page) => setParamsQuery({ ...paramsQuery, page })}
              onPageSizeChange={(limit) => setParamsQuery({ ...paramsQuery, limit: Number(limit) })}
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

export default EventDetailCard;
