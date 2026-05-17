import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import type { IDataLumaEvents, IParamsMatchingCompaniesList } from '@/api/company';
import { useListLumaEvents } from '@/api/company';
import Empty from '@/components/Empty';
import { TablePagination } from '@/components/ui/table';
import { Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import CardEvent from '../../../components/event/CardEvent';
import { dataTabs } from '../utils/const';
import FilterLumaEvents from './FilterLumaEvents';

const DEFAULT_QUERY: IParamsMatchingCompaniesList = {
  page: 1,
  limit: 100,
  orderByVal: 'DESC',
};

const EVENT_GRID_CLASS = 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';

const EventDetailCard = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(DEFAULT_QUERY);
  const router = useRouter();
  const { event_id } = router.query;
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [tabs, setTabs] = useState<string | number>(dataTabs[0].value);
  const { data: listEvents, isFetching } = useListLumaEvents({ variables: paramsQuery });

  const events = listEvents?.data ?? [];
  const placeholderCards = useMemo(() => Array.from({ length: 10 }), []);
  const hasEvents = events.length !== 0;

  useEffect(() => {
    if (event_id) {
      setParamsQuery((prev) => ({ ...prev, main_event: event_id as string, page: 1 }));
    }
  }, [event_id]);

  const handlePageChange = (page: number) => setParamsQuery((prev) => ({ ...prev, page }));

  const handlePageSizeChange = (limit: string | number) =>
    setParamsQuery((prev) => ({ ...prev, limit: Number(limit) }));

  const renderEventCards = (loading: boolean) => (
    <div className={EVENT_GRID_CLASS}>
      {(loading ? placeholderCards : events).map((item: IDataLumaEvents, index) => (
        <CardEvent
          item={loading ? undefined : item}
          key={index}
          setSelectedIds={setSelectedIds}
          selectedIds={selectedIds}
          loading={loading}
        />
      ))}
    </div>
  );

  return (
    <>
      <Wrapper className="pb-3 pt-0">
        <FilterLumaEvents paramsQuery={paramsQuery} setParamsQuery={setParamsQuery} tabs={tabs} setTabs={setTabs} />
        <Show when={!isFetching}>
          {renderEventCards(false)}
        </Show>
        <Show when={isFetching}>
          {renderEventCards(true)}
        </Show>
        <Show when={!isFetching && (!listEvents || !hasEvents)}>
          <Empty />
        </Show>
        <Show when={!isFetching && !!listEvents && hasEvents}>
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

export default EventDetailCard;
