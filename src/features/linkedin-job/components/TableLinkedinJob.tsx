import React, { useState } from 'react';

import type { IDataLinkedinJob, IParamsMatchingCompaniesList } from '@/api/company';
import { useListLinkedinJob, useListMetaDateHiring } from '@/api/company';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { ENUM_PAGE } from '@/lib/const';

import { listHeaderLinkedinJob } from '../utils/const';
import FilterLinkedinJob from './FilterLinkedinJob';
import RowTableList from './RowTableList';

const TableLinkedinJob = () => {
  const defaultQuery: IParamsMatchingCompaniesList = {
    page: 1,
    limit: 100,
    orderByVal: 'DESC',
  };

  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(() => {
    const isLocalStorageAvailable = typeof localStorage !== 'undefined';
    if (isLocalStorageAvailable) {
      const jobPage = localStorage.getItem(ENUM_PAGE.LINKEDIN_JOB_PAGE);
      const jobPageSize = localStorage.getItem(`pageSize_${ENUM_PAGE.LINKEDIN_JOB_PAGE}`);
      if (jobPage || jobPageSize) {
        return {
          ...defaultQuery,
          page: Number(jobPage) || 1,
          limit: Number(jobPageSize) || 100,
        };
      }
    }
    return defaultQuery;
  });
  const { data, isFetching, refetch } = useListLinkedinJob({ variables: paramsQuery, refetchOnMount: true });
  const { data: metaDataHiring } = useListMetaDateHiring();

  const getDataFilter = [
    {
      name: 'country',
      value:
        metaDataHiring?.country?.map((c: string) => ({
          label: c,
          value: c,
        })) || [],
    },
    {
      name: 'category',
      value: [
        {
          label: 'Blockchain',
          value: 'Blockchain',
        },
        {
          label: 'AI',
          value: 'AI',
        },
      ],
    },
  ];
  const columns = listHeaderLinkedinJob?.map((item: any) => {
    return {
      title: item.title,
      key: item.key,
      type: item?.type || '',
      canFilter: item?.canFilter,
      filter_type: item?.filter_type,
      name_filter: item?.name_filter,
      dataFilter: getDataFilter.find((s) => s.name === item.key)?.value,
    };
  });

  return (
    <>
      <Wrapper>
        <HStack pos="apart">
          <Tag className="bg-secondary-purple">Linkedin Job</Tag>
        </HStack>
        <VStack className="mt-4" spacing={12}>
          <FilterLinkedinJob setParamsQuery={setParamsQuery} paramsQuery={paramsQuery} />
          <CommonTable
            listHeader={columns}
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
            bodyComponent={
              <>
                <TableSkeleton loading={isFetching} col={columns?.length} />
                <Show when={data && data?.data?.length !== 0 && !isFetching}>
                  {data?.data?.map((item: IDataLinkedinJob, index: number) => {
                    const validEmails = item?.lst_email.filter(
                      (email) => email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    );
                    return (
                      <RowTableList
                        indexRow={index}
                        tableLength={data?.data?.length}
                        key={index}
                        item={item}
                        refetch={refetch}
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
                    localStorage.setItem(`pageSize_${ENUM_PAGE.LINKEDIN_JOB_PAGE}`, String(limit));
                  }}
                  pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
                  pageNameLocalStorage={ENUM_PAGE.LINKEDIN_JOB_PAGE}
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

export default TableLinkedinJob;
