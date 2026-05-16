/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { IWatchListView } from '@/api/admin-watchlist';
import { useListWatchListView } from '@/api/admin-watchlist';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { Checkbox } from '@/components/ui/checkbox';
import { TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import { listHeaderWatchList } from '../../utils/const';
import Filter from './Filter';
import RowTableList from './RowTableList';

const TableWatchList = () => {
  const [paramsQuery, setParamsQuery] = useState({});
  const router = useRouter();
  const { user_id, user_name } = router.query;
  const { data, refetch, isFetching } = useListWatchListView({
    variables: {
      ...paramsQuery,
      id: String(user_id),
    },
    refetchOnMount: true,
    enabled: !!user_id,
  });

  return (
    <>
      <Wrapper>
        <HStack pos={'apart'} spacing={8}>
          <Tag className="bg-secondary-purple">Watchlist: {user_name}</Tag>
          <Filter setParamsQuery={setParamsQuery} paramsQuery={paramsQuery} />
        </HStack>
        <VStack spacing={0} className="my-4">
          <CommonTable
            checkBox={<Checkbox disabled checked={false} />}
            listHeader={listHeaderWatchList}
            bodyComponent={
              <>
                <TableSkeleton loading={isFetching} col={listHeaderWatchList.length + 1} />
                <Show when={data && data?.length !== 0 && !isFetching}>
                  {data?.map((item: IWatchListView, index: number) => {
                    return (
                      <RowTableList
                        indexRow={index}
                        tableLength={data?.length}
                        key={index}
                        item={item}
                        refetch={refetch}
                        listHeaderWatchList={listHeaderWatchList}
                      />
                    );
                  })}
                </Show>
              </>
            }
            footerComponent={<></>}
          />

          <Show when={!isFetching && (data?.length === 0 || !data)}>
            <Empty />
          </Show>
        </VStack>
      </Wrapper>
    </>
  );
};

export default TableWatchList;
