/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import type { IBodyWatchlist, IParamsMatchingCompaniesList } from '@/api/company';
import { useListCountry, useListWatchList } from '@/api/company';
import { useListICPWatchlist } from '@/api/watchlist';
import Empty from '@/components/Empty';
import ModalUploadExcel from '@/components/Modal/ModalUploadExcel';
import ModalCreateManually from '@/components/Modal/Watchlist/ModalCreateManually';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { Show, VStack } from '@/components/ui/Utilities';
import { ENUM_PAGE } from '@/lib/const';
import { COMPANY_SIZE, FOLLOWERS_RANGE } from '@/utils/const';

import { listHeaderWatchList } from '../utils/const';
import Filter from './FilterComponents/Filter';
import HeaderWatchList from './Header/HeaderWatchList';
import ActionBar from './PopUpAction';
import RowTableList from './RowTableList';

const TableWatchList = () => {
  const defaultQuery: IParamsMatchingCompaniesList = {
    page: 1,
    limit: 100,
  };

  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(() => {
    const isLocalStorageAvailable = typeof localStorage !== 'undefined';
    if (isLocalStorageAvailable) {
      const watchListPage = localStorage.getItem(ENUM_PAGE.WATCH_LIST_PAGE);
      const watchListPageSize = localStorage.getItem(`pageSize_${ENUM_PAGE.WATCH_LIST_PAGE}`);
      if (watchListPage && watchListPageSize) {
        return {
          ...defaultQuery,
          page: Number(watchListPage),
          limit: Number(watchListPageSize),
        };
      }
    }
    return defaultQuery;
  });

  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isListContactEmail, setIsListContactEmail] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isShowUpload, setIsShowUpload] = useState<boolean>(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const { data: listICP } = useListICPWatchlist();
  const { data: listCountry } = useListCountry();
  const { data, refetch, isFetching } = useListWatchList({
    variables: paramsQuery,
    refetchOnMount: true,
  });

  useEffect(() => {
    const temp: any[] = [];
    const temp2: any[] = [];
    if (isDownloadAll) {
      data?.data?.forEach((s: IBodyWatchlist) => {
        temp.push(s.company_id);
        temp2.push(...s.lst_email);
      });
    } else {
      selectedIds.forEach((s: any) => temp.push(s));
      setIsListContactEmail([]);
    }
    setSelectedIds(temp);
    setIsListContactEmail(temp2);
  }, [isDownloadAll, data]);

  const openChange = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const openModal = () => {
    setIsOpen(true);
    setIsOpenDropdown(false);
  };

  const getDataFilter = [
    {
      name: 'icp_id',
      value: listICP?.map((c: { id: string; icp_name: string }) => ({ label: c.icp_name, value: c.id })) || [],
    },
    {
      name: 'country',
      value: (listCountry as any)?.list_country?.map((c: string) => ({ label: c, value: c })) || [],
    },
    {
      name: 'followers',
      value: FOLLOWERS_RANGE,
    },
    {
      name: 'company_size',
      value: COMPANY_SIZE,
    },
  ];

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
      <HeaderWatchList
        openModal={openModal}
        setIsShowUpload={setIsShowUpload}
        isOpenDropdown={isOpenDropdown}
        openChange={openChange}
      />

      <Filter setParamsQuery={setParamsQuery} paramsQuery={paramsQuery} />
      <VStack spacing={0} className="mt-4 w-full overflow-auto">
        <CommonTable
          checkBox={
            <Checkbox
              checked={isDownloadAll}
              onCheckedChange={(e) => {
                if (e) {
                  setIsDownloadAll(true);
                } else {
                  setIsDownloadAll(false);
                  setSelectedIds([]);
                }
              }}
            />
          }
          isPinCheckbox
          listHeader={columns}
          paramsQuery={paramsQuery}
          setParamsQuery={setParamsQuery}
          bodyComponent={
            <>
              <TableSkeleton loading={isFetching} col={columns.length + 1} />
              <Show when={data && data?.data?.length !== 0 && !isFetching}>
                {data?.data?.map((item: IBodyWatchlist, index: number) => {
                  const validEmails = item?.lst_email.filter(
                    (email) => email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  );
                  const checkExist = selectedIds.find((s) => s === item?.company_id);
                  return (
                    <RowTableList
                      indexRow={index}
                      tableLength={data?.data?.length}
                      key={index}
                      item={item}
                      refetch={refetch}
                      listHeaderWatchList={columns}
                      setIsDownloadAll={setIsDownloadAll}
                      isDownloadAll={isDownloadAll}
                      checkExist={checkExist}
                      setSelectedIds={setSelectedIds}
                      selectedIds={selectedIds}
                      validEmails={validEmails}
                      setIsListContactEmail={setIsListContactEmail}
                      isListContactEmail={isListContactEmail}
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
                  localStorage.setItem(`pageSize_${ENUM_PAGE.WATCH_LIST_PAGE}`, limit);
                }}
                pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
                pageNameLocalStorage={ENUM_PAGE.WATCH_LIST_PAGE}
              />
            </Show>
          }
        />
        <Show when={!isFetching && (data?.data?.length === 0 || !data)}>
          <Empty />
        </Show>
      </VStack>
      <Show when={selectedIds.length > 0}>
        <ActionBar isListContactEmail={isListContactEmail} refetch={refetch} selectedIds={selectedIds} />
      </Show>
      <ModalCreateManually refetch={refetch} setIsOpen={setIsOpen} isOpen={isOpen} />
      <ModalUploadExcel setIsShowUpload={setIsShowUpload} isShowUpload={isShowUpload} refetch={refetch} />
    </>
  );
};

export default TableWatchList;
