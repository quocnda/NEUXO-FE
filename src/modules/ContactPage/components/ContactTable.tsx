/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import type { IDataMatchingCompaniesList, IParamsMatchingCompaniesList } from '@/api/company';
import { useListColumnCompany, useListMatchingCompanies } from '@/api/company';
import Empty from '@/components/Empty';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { Show, VStack } from '@/components/ui/Utilities';
import { ENUM_PAGE } from '@/lib/const';

import useServices from '../hooks/useServices';
import { listHeaderCourse } from '../utils/const';
import FilterMatchingCompanies from './Components/filter/FilterHeader/FilterMatchingCompanies';
import SideBarSearch from './Components/filter/FilterSideBar/SideBarSearch';
import RowTableList from './RowTableList';

const ContactTable = () => {
  const defaultQuery: IParamsMatchingCompaniesList = {
    page: 1,
    limit: 100,
    orderByVal: 'DESC',
  };

  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(() => {
    const isLocalStorageAvailable = typeof localStorage !== 'undefined';
    if (isLocalStorageAvailable) {
      const companyPage = localStorage.getItem(ENUM_PAGE.MATCHING_COMPANIES_PAGE);
      const companyPageSize = localStorage.getItem(`pageSize_${ENUM_PAGE.MATCHING_COMPANIES_PAGE}`);
      if (companyPage || companyPageSize) {
        return {
          ...defaultQuery,
          page: Number(companyPage) || 1,
          limit: Number(companyPageSize) || 100,
        };
      }
    }
    return defaultQuery;
  });

  const [valueDate, setValueDate] = useState<string>('');

  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListContactEmail, setIsListContactEmail] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: { value: string; label: string }[] }>({});
  const [isDataCustomFilter, setIsDataCustomFilter] = useState<{ id: string; filter_name: string; filter: any }>({
    id: '',
    filter_name: '',
    filter: {},
  });

  const { data, refetch, isFetching } = useListMatchingCompanies({
    variables: paramsQuery,
    refetchOnMount: true,
  });
  const { data: listColumn, refetch: refetchColumn } = useListColumnCompany();

  const { listCustomFilter } = useServices();

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
        key: headerInfo?.key,
      };
    });

  return (
    <>
      <FilterMatchingCompanies
        setParamsQuery={setParamsQuery}
        paramsQuery={paramsQuery}
        columns={listColumn?.columns}
        refetch={refetchColumn}
        setIsShowFilter={setIsShowFilter}
        isShowFilter={isShowFilter}
        setValueDate={setValueDate}
        valueDate={valueDate}
      />
      <div className="flex flex-col xl:flex-row">
        {isShowFilter && (
          <SideBarSearch
            getDataFilter={[]}
            setParamsQuery={setParamsQuery}
            paramsQuery={paramsQuery}
            listCustomFilter={listCustomFilter}
            setIsDataCustomFilter={setIsDataCustomFilter}
            isDataCustomFilter={isDataCustomFilter}
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
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
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
                        columns={columns}
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                        validEmails={validEmails}
                        isListContactEmail={isListContactEmail}
                        setIsListContactEmail={setIsListContactEmail}
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
                    localStorage.setItem(`pageSize_${ENUM_PAGE.MATCHING_COMPANIES_PAGE}`, limit);
                  }}
                  pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
                  pageNameLocalStorage={ENUM_PAGE.MATCHING_COMPANIES_PAGE}
                />
              </Show>
            }
          />
          <Show when={!isFetching && (data?.data?.length === 0 || !data)}>
            <Empty />
          </Show>
        </VStack>
      </div>
    </>
  );
};

export default ContactTable;
