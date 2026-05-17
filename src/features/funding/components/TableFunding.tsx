import React, { useState } from 'react';

import type { IDataLumaFunding, IParamsMatchingCompaniesList } from '@/api/company';
import { useListFunding, useListMetaDateFunding } from '@/api/company';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { ENUM_PAGE } from '@/lib/const';

import { listHeaderCourse } from '../utils/const';
import FilterFunding from './FilterFunding';
import RowTableList from './RowTableList';

const DEFAULT_QUERY: IParamsMatchingCompaniesList = {
  page: 1,
  limit: 100,
  orderByVal: 'DESC',
};

const getInitialQueryFromStorage = (): IParamsMatchingCompaniesList => {
  if (typeof localStorage === 'undefined') return DEFAULT_QUERY;

  const fundingPage = localStorage.getItem(ENUM_PAGE.FUNDING_PAGE);
  const fundingPageSize = localStorage.getItem(`pageSize_${ENUM_PAGE.FUNDING_PAGE}`);

  if (fundingPage || fundingPageSize) {
    return {
      ...DEFAULT_QUERY,
      page: Number(fundingPage) || 1,
      limit: Number(fundingPageSize) || 100,
    };
  }

  return DEFAULT_QUERY;
};

const TableFunding = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(getInitialQueryFromStorage());
  const { data, isFetching, refetch } = useListFunding({ variables: paramsQuery, refetchOnMount: true });
  const { data: metaDataFunding } = useListMetaDateFunding();

  const getDataFilter = [
    {
      name: 'category',
      value:
        metaDataFunding?.category?.map((c: string) => ({
          label: c,
          value: c,
        })) || [],
    },
    {
      name: 'round',
      value:
        metaDataFunding?.round?.map((c: string) => ({
          label: c,
          value: c,
        })) || [],
    },
  ];
  const columns = listHeaderCourse?.map((item: any) => {
    return {
      title: item.title,
      key: item.key,
      type: item?.type || '',
      canFilter: item?.canFilter,
      filter_type: item?.filter_type,
      dataFilter: getDataFilter.find((s) => s.name === item.key)?.value,
      name_filter: item?.name_filter,
    };
  });

  return (
    <>
      <Wrapper>
        <HStack pos="apart">
          <Tag className="bg-secondary-purple">Funding</Tag>
        </HStack>
        <VStack className="mt-4" spacing={12}>
          <FilterFunding setParamsQuery={setParamsQuery} paramsQuery={paramsQuery} />
          <CommonTable
            listHeader={columns}
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
            bodyComponent={
              <>
                <TableSkeleton loading={isFetching} col={columns?.length} />
                <Show when={data && data?.data?.length !== 0 && !isFetching}>
                  {data?.data?.map((item: IDataLumaFunding, index: number) => {
                    const validEmails = item?.lst_email.filter(
                      (email) => email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    );
                    return (
                      <RowTableList
                        refetch={refetch}
                        indexRow={index}
                        tableLength={data?.data?.length}
                        key={index}
                        item={item}
                        validEmails={validEmails}
                        paramsQuery={paramsQuery}
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
                  onPageSizeChange={(limit) => {
                    setParamsQuery({ ...paramsQuery, limit: Number(limit) });
                    localStorage.setItem(`pageSize_${ENUM_PAGE.FUNDING_PAGE}`, limit);
                  }}
                  pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
                  pageNameLocalStorage={ENUM_PAGE.FUNDING_PAGE}
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

export default TableFunding;
