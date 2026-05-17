/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import type { IBodyBlackList, IParamsMatchingCompaniesList } from '@/api/company';
import { useListBlackList } from '@/api/company';
import Empty from '@/components/Empty';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { Show, VStack } from '@/components/ui/Utilities';

import { listHeaderCourse } from '../../utils/const';
import FilterMatchingCompanies from './FilterMatchingCompanies';
import ActionBar from './PopUpAction';
import RowTableList from './RowTableList';

const TabelCompanyBlackList = () => {
  const defaultQuery: IParamsMatchingCompaniesList = {
    page: 1,
    limit: 100,
    orderByVal: 'DESC',
  };

  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(defaultQuery);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const { data, refetch, isFetching } = useListBlackList({
    variables: paramsQuery,
    refetchOnMount: true,
  });

  useEffect(() => {
    const updatedSelection: any[] = [];
    if (isDownloadAll) {
      data?.data?.map((s: IBodyBlackList) => updatedSelection.push(s.id));
    } else {
      selectedIds.map((s: any) => updatedSelection.push(s));
    }
    setSelectedIds(updatedSelection);
  }, [isDownloadAll, data]);

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setIsDownloadAll(true);
      return;
    }
    setIsDownloadAll(false);
    setSelectedIds([]);
  };

  const handlePageChange = (page: number) => {
    setParamsQuery({ ...paramsQuery, page });
  };

  const handlePageSizeChange = (limit: number | string) => {
    setParamsQuery({ ...paramsQuery, limit: Number(limit) });
  };

  const columns = listHeaderCourse
    ?.filter((item: any) => item.title !== 'action')
    .map((item: any) => {
      return {
        title: item.title,
        key: item.key,
        type: item?.type || '',
        pin: item?.pin,
        icon: item?.icon,
      };
    });

  return (
    <>
      <VStack spacing={0}>
        <FilterMatchingCompanies setParamsQuery={setParamsQuery} paramsQuery={paramsQuery} />
        <CommonTable
          checkBox={
            <Checkbox
              checked={isDownloadAll}
              onCheckedChange={(e) => handleSelectAllChange(!!e)}
            />
          }
          listHeader={columns || listHeaderCourse}
          paramsQuery={paramsQuery}
          setParamsQuery={setParamsQuery}
          isPinCheckbox
          bodyComponent={
            <>
              <TableSkeleton loading={isFetching} col={((columns?.length || listHeaderCourse.length) ?? 0) + 1} />
              <Show when={data && data?.data?.length !== 0 && !isFetching}>
                {data?.data?.map((item: IBodyBlackList, index: number) => {
                  const checkExist = selectedIds.find((s) => s === item?.id);
                  return (
                    <RowTableList
                      indexRow={index}
                      tableLength={data?.data?.length}
                      key={index}
                      item={item}
                      checkExist={checkExist}
                      setIsDownloadAll={setIsDownloadAll}
                      selectedIds={selectedIds}
                      isDownloadAll={isDownloadAll}
                      setSelectedIds={setSelectedIds}
                      refetch={refetch}
                      columns={columns}
                      start_date={paramsQuery?.start_date}
                    />
                  );
                })}
              </Show>
            </>
          }
          footerComponent={
            <Show when={data && data?.data?.length !== 0 && !isFetching}>
              <TablePagination
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
              />
            </Show>
          }
        />

        <Show when={!isFetching && (data?.data?.length === 0 || !data)}>
          <Empty />
        </Show>
      </VStack>
      <AnimatePresence>
        <Show when={selectedIds.length > 0}>
          <ActionBar
            refetch={refetch}
            selectedIds={selectedIds}
            setIsDownloadAll={setIsDownloadAll}
            setSelectedIds={setSelectedIds}
          />
        </Show>
      </AnimatePresence>
    </>
  );
};

export default TabelCompanyBlackList;
