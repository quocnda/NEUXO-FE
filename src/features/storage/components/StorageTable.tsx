/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import type { IDataMatchingCompaniesList, IParamsMatchingCompaniesList } from '@/api/company';
import { useListColumnCompany, useListStorage } from '@/api/company';
import Empty from '@/components/Empty';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { Show, VStack } from '@/components/ui/Utilities';
import { capitalizeFirstLetter } from '@/lib/common';
import { ENUM_PAGE } from '@/lib/const';
import { CATEGORY_LIST, COMPANY_SIZE, FOLLOWERS_RANGE, HAVE_EMAIL } from '@/utils/const';

import useServices from '../hooks/useServices';
import { list_trigger_storage, listHeaderCourse } from '../utils/const';
import StepAddWatchList from './Components/AddToWatchlist/StepAddWatchList';
import FilterMatchingCompanies from './Components/filter/FilterHeader/FilterMatchingCompanies';
import SideBarSearch from './Components/filter/FilterSideBar/SideBarSearch';
import ActionBar from './PopUpAction';
import RowTableList from './RowTableList';

const StorageTable = () => {
  const defaultQuery: IParamsMatchingCompaniesList = {
    page: 1,
    limit: 100,
    orderByVal: 'DESC',
  };

  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(() => {
    const isLocalStorageAvailable = typeof localStorage !== 'undefined';
    if (isLocalStorageAvailable) {
      const storagePage = localStorage.getItem(ENUM_PAGE.STORAGE_PAGE);
      const storagePageSize = localStorage.getItem(`pageSize_${ENUM_PAGE.STORAGE_PAGE}`);
      if (storagePage || storagePageSize) {
        return {
          ...defaultQuery,
          page: Number(storagePage) || 1,
          limit: Number(storagePageSize) || 100,
        };
      }
    }
    return defaultQuery;
  });

  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListContactEmail, setIsListContactEmail] = useState<any[]>([]);
  const { listCountry } = useServices();

  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: { value: string; label: string }[] }>({});

  const { data, refetch, isFetching } = useListStorage({
    variables: paramsQuery,
    refetchOnMount: true,
  });
  const { data: listColumn, refetch: refetchColumn } = useListColumnCompany();

  useEffect(() => {
    const temp: any[] = [];
    const temp2: any[] = [];
    if (isDownloadAll) {
      data?.data?.forEach((s: IDataMatchingCompaniesList) => {
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

  const getDataFilter = [
    {
      name: 'country',
      value: (listCountry as any)?.list_country?.map((c: string) => ({ label: c, value: c })) || [],
    },
    {
      name: 'industry',
      value: (listCountry as any)?.industry?.map((c: string) => ({ label: c, value: c })) || [],
    },
    {
      name: 'category',
      value: CATEGORY_LIST,
    },
    {
      name: 'trigger',
      value: list_trigger_storage.map((c: string) => ({ label: capitalizeFirstLetter(c), value: c })) || [],
    },
    {
      name: 'followers',
      value: FOLLOWERS_RANGE,
    },
    {
      name: 'company_size',
      value: COMPANY_SIZE,
    },
    {
      name: 'company_email',
      value: HAVE_EMAIL,
    },
  ];

  const columns = listColumn?.columns
    ?.filter((item: any) => item.is_show !== false)
    .map((item: any) => {
      const headerInfo = listHeaderCourse.find((header) => header.title === item.name);
      return {
        title: item.name,
        type: headerInfo?.type || '',
        canSort: item?.can_arrange,
        pin: headerInfo?.pin,
        order_by: item?.order_by,
      };
    })
    .sort((a: { order_by: any }, b: { order_by: any }) => (a.order_by ?? 0) - (b.order_by ?? 0));

  return (
    <>
      <FilterMatchingCompanies
        setParamsQuery={setParamsQuery}
        paramsQuery={paramsQuery}
        columns={listColumn?.columns}
        refetch={refetchColumn}
        setIsShowFilter={setIsShowFilter}
        isShowFilter={isShowFilter}
      />
      <div className="flex flex-col xl:flex-row">
        {isShowFilter && (
          <SideBarSearch
            getDataFilter={getDataFilter}
            setParamsQuery={setParamsQuery}
            paramsQuery={paramsQuery}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
        )}
        <VStack spacing={0} className="w-full overflow-auto">
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
            listHeader={columns || listHeaderCourse}
            bodyComponent={
              <>
                <TableSkeleton loading={isFetching} col={((columns?.length || listHeaderCourse.length) ?? 0) + 1} />
                <Show when={data && data?.data?.length !== 0 && !isFetching}>
                  {data?.data?.map((item: IDataMatchingCompaniesList, index: number) => {
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
                        checkExist={checkExist}
                        setIsDownloadAll={setIsDownloadAll}
                        selectedIds={selectedIds}
                        isDownloadAll={isDownloadAll}
                        setSelectedIds={setSelectedIds}
                        refetch={refetch}
                        start_date={paramsQuery?.start_date}
                        columns={columns}
                        companyId={companyId}
                        setCompanyId={setCompanyId}
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                        validEmails={validEmails}
                        isListContactEmail={isListContactEmail}
                        setIsListContactEmail={setIsListContactEmail}
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
                    localStorage.setItem(`pageSize_${ENUM_PAGE.STORAGE_PAGE}`, limit);
                  }}
                  pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
                  pageNameLocalStorage={ENUM_PAGE.STORAGE_PAGE}
                />
              </Show>
            }
          />
          <Show when={!isFetching && (data?.data?.length === 0 || !data)}>
            <Empty />
          </Show>
        </VStack>
      </div>
      <AnimatePresence>
        <Show when={selectedIds.length > 0}>
          <ActionBar
            isListContactEmail={isListContactEmail}
            refetch={refetch}
            selectedIds={selectedIds}
            setIsDownloadAll={setIsDownloadAll}
            setSelectedIds={setSelectedIds}
          />
        </Show>
      </AnimatePresence>

      <StepAddWatchList
        companyId={companyId}
        setCompanyId={setCompanyId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={refetch}
      />
    </>
  );
};

export default StorageTable;
