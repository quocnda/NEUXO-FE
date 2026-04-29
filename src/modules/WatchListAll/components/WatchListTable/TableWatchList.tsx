/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import type { IParamsViewWatchlistAll, IWatchListView } from '@/api/admin-watchlist';
import { useListWatchListViewAll } from '@/api/admin-watchlist';
import { useListAdmin } from '@/api/auth';
import { useListICPWatchlist } from '@/api/watchlist';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { listEmailFocus } from '@/modules/EmailReport/utils/data';

import { listHeaderWatchList } from '../../utils/const';
import Filter from './Filter';
import RowTableList from './RowTableList';

const TableWatchList = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsViewWatchlistAll>({
    page: 1,
    limit: 100,
  });
  const { data, refetch, isFetching } = useListWatchListViewAll({
    variables: {
      ...paramsQuery,
    },
    refetchOnMount: true,
  });
  const { data: listUser } = useListAdmin();

  const dataUser = listUser
    ?.filter((item) => listEmailFocus.includes(item.email))
    .map((item) => ({
      email: item.email,
      user_name: item.user_name,
      user_id: item.id,
    }));

  const { data: listICP } = useListICPWatchlist();

  const getDataFilter = [
    {
      name: 'list_icp',
      value: listICP?.map((c: { id: string; icp_name: string }) => ({ label: c.icp_name, value: c.id })) || [],
    },
    {
      name: 'list_user_id',
      value:
        dataUser?.map((c: { user_id: string; user_name: string }) => ({ label: c.user_name, value: c.user_id })) || [],
    },
  ];

  useEffect(() => {
    if (!paramsQuery?.list_user_id && dataUser && dataUser.length > 0) {
      setParamsQuery((prev) => ({
        ...prev,
        list_user_id: dataUser.map((user) => user.user_id).join(','),
      }));
    }
  }, [dataUser, paramsQuery?.list_user_id]);

  const columns = listHeaderWatchList?.map((item: any) => {
    return {
      title: item.title,
      key: item.key,
      type: item?.type || '',
      icon: item?.icon,
      canFilter: item?.canFilter,
      filter_type: item?.type_filter,
      name_filter: item?.name_filter,
      dataFilter: getDataFilter.find((s) => s.name === item.key)?.value,
    };
  });

  return (
    <>
      <Wrapper>
        <HStack pos={'apart'} spacing={8}>
          <Tag className="bg-secondary-purple">Watchlist All</Tag>
          <Filter setParamsQuery={setParamsQuery} paramsQuery={paramsQuery} />
        </HStack>

        <VStack spacing={0} className="my-4">
          <CommonTable
            checkBox={<Checkbox disabled checked={false} />}
            listHeader={columns}
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
            bodyComponent={
              <>
                <TableSkeleton loading={isFetching} col={columns.length + 1} />
                <Show when={data && data?.data?.length !== 0 && !isFetching}>
                  {data?.data?.map((item: IWatchListView, index: number) => {
                    return (
                      <RowTableList
                        indexRow={index}
                        tableLength={data?.data?.length}
                        key={index}
                        item={item}
                        refetch={refetch}
                        listHeaderWatchList={columns}
                      />
                    );
                  })}
                </Show>
              </>
            }
            footerComponent={
              <Show when={data && data?.data?.length !== 0 && !isFetching}>
                <TablePagination
                  onPageChange={(page) => setParamsQuery({ ...paramsQuery, page })}
                  onPageSizeChange={(limit) => setParamsQuery({ ...paramsQuery, limit: Number(limit) })}
                  pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
                />
              </Show>
            }
          />

          <Show when={!isFetching && (data?.data?.length === 0 || !data)}>
            <Empty />
          </Show>
        </VStack>
      </Wrapper>
    </>
  );
};

export default TableWatchList;
