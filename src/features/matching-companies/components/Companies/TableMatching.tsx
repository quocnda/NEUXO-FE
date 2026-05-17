/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import type { IDataMatchingCompaniesList, IParamsMatchingCompaniesList } from '@/api/company';
import { useListColumnCompany, useListMatchingCompanies } from '@/api/company';
import Empty from '@/components/Empty';
import ModalAutomateEmail from '@/components/Modal/Email/ModalAutomateEmail';
import ModalCheckEmailAutomate from '@/components/Modal/Email/ModalCheckEmailAutomate';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { Show, VStack } from '@/components/ui/Utilities';
import { capitalizeFirstLetter } from '@/lib/common';
import { ENUM_PAGE } from '@/lib/const';
import { CATEGORY_LIST, COMPANY_SIZE, FOLLOWERS_RANGE, HAVE_EMAIL } from '@/utils/const';

import useServices from '../../hooks/useServices';
import { listHeaderCourse } from '../../utils/const';
import StepAddWatchList from './Components/AddToWatchlist/StepAddWatchList';
import FilterMatchingCompanies from './Components/filter/FilterHeader/FilterMatchingCompanies';
import SideBarSearch from './Components/filter/FilterSideBar/SideBarSearch';
import ActionBar from './PopUpAction';
import RowTableList from './RowTableList';

const DEFAULT_COMPANY_SIZE = [
  {
    value: '2-10',
    label: '2-10',
  },
  {
    value: '11-50',
    label: '11-50',
  },
  {
    value: '51-200',
    label: '51-200',
  },
];

const DEFAULT_QUERY: IParamsMatchingCompaniesList = {
  page: 1,
  limit: 100,
  orderByVal: 'DESC',
};

const TableMatching = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(() => {
    const isLocalStorageAvailable = typeof localStorage !== 'undefined';
    if (isLocalStorageAvailable) {
      const companyPage = localStorage.getItem(ENUM_PAGE.MATCHING_COMPANIES_PAGE);
      const companyPageSize = localStorage.getItem(`pageSize_${ENUM_PAGE.MATCHING_COMPANIES_PAGE}`);
      if (companyPage || companyPageSize) {
        return {
          ...DEFAULT_QUERY,
          page: Number(companyPage) || 1,
          limit: Number(companyPageSize) || 100,
        };
      }
    }
    return DEFAULT_QUERY;
  });

  const [valueDate, setValueDate] = useState<string>('');
  const [isOpenModalAutomateEmail, setIsOpenModalAutomateEmail] = useState(false);
  const [isOpenModalCheckEmailAutomate, setIsOpenModalCheckEmailAutomate] = useState(false);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListContactEmail, setIsListContactEmail] = useState<any[]>([]);
  const [isListEmailExist, setIsListEmailExist] = useState<any[]>([]);
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

  const { listCountry, listCustomFilter } = useServices();

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
      isListContactEmail.forEach((e) => temp2.push(e));
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
      value: (listCountry as any)?.trigger?.map((c: string) => ({ label: capitalizeFirstLetter(c), value: c })) || [],
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
        key: headerInfo?.key,
      };
    });

  useEffect(() => {
    setSelectedValues({
      company_size: DEFAULT_COMPANY_SIZE,
    });
    setParamsQuery({ ...paramsQuery, company_size: DEFAULT_COMPANY_SIZE.map((c) => c.value).join(',') });
  }, []);

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setIsDownloadAll(true);
      return;
    }
    setIsDownloadAll(false);
    setSelectedIds([]);
    setIsListContactEmail([]);
  };

  const handlePageChange = (page: number) => {
    setParamsQuery({ ...paramsQuery, page });
  };

  const handlePageSizeChange = (limit: number | string) => {
    setParamsQuery({ ...paramsQuery, limit: Number(limit) });
    localStorage.setItem(`pageSize_${ENUM_PAGE.MATCHING_COMPANIES_PAGE}`, String(limit));
  };

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
            getDataFilter={getDataFilter}
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
                onCheckedChange={(e) => handleSelectAllChange(!!e)}
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
                        valueDate={valueDate}
                        selectedValues={selectedValues}
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
      <AnimatePresence>
        <Show when={selectedIds.length > 0}>
          <ActionBar
            isListContactEmail={isListContactEmail}
            refetch={refetch}
            selectedIds={selectedIds}
            setIsDownloadAll={setIsDownloadAll}
            setSelectedIds={setSelectedIds}
            setIsOpenModalAutomateEmail={setIsOpenModalAutomateEmail}
            setIsOpenModalCheckEmailAutomate={setIsOpenModalCheckEmailAutomate}
            setIsListEmailExist={setIsListEmailExist}
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

      <ModalAutomateEmail
        listEmailAction={isListContactEmail.filter(
          (item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item) && !isListEmailExist.includes(item)
        )}
        isOpen={isOpenModalAutomateEmail}
        setIsOpen={setIsOpenModalAutomateEmail}
      />

      <ModalCheckEmailAutomate
        isOpen={isOpenModalCheckEmailAutomate}
        setIsOpen={setIsOpenModalCheckEmailAutomate}
        setIsOpenModalAutomateEmail={setIsOpenModalAutomateEmail}
        listEmailAction={isListContactEmail.filter(
          (item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item) && !isListEmailExist.includes(item)
        )}
      />
    </>
  );
};

export default TableMatching;
