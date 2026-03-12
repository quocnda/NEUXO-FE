import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { IParamsEmailTracking, IResponseEmailTracking } from '@/api/email-tracking';
import { useListEmailTracking, useListEmailTrackingFromUser } from '@/api/email-tracking';
import Empty from '@/components/Empty';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { Show, VStack } from '@/components/ui/Utilities';

import {
  dataEmailStatus,
  dataFollowUpStatus,
  dataPriority,
  listHeaderAccount,
  tabs_email_tracking,
} from '../../utils/const';
import FilterEmailTracking from './FilterEmailTracking';
import ActionBar from './PopUpAction';
import RowTableList from './RowTableList';

const TableEmailTracking = ({ tabs }: { tabs: string | number }) => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const [paramsQuery, setParamsQuery] = useState<IParamsEmailTracking>({
    page: 1,
    limit: 50,
    timeZone,
  });
  const router = useRouter();
  const { user_id } = router.query;
  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const { data, isFetching, refetch } = useListEmailTracking({
    variables: { ...paramsQuery, source: String(tabs) },
    refetchOnMount: true,
    enabled: !user_id,
  });
  const {
    data: dataUser,
    isFetching: isFetchingUser,
    refetch: refetchUser,
  } = useListEmailTrackingFromUser({
    variables: { ...paramsQuery, source: String(tabs), user_id: String(user_id) },
    refetchOnMount: true,
    enabled: !!user_id,
  });

  const dataToRender = user_id ? dataUser : data;
  const isFetchingData = user_id ? isFetchingUser : isFetching;
  const refetchData = user_id ? refetchUser : refetch;

  useEffect(() => {
    const temp: any[] = [];

    const isValidEmail = (email: string) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    if (isDownloadAll) {
      data?.data?.forEach((s: IResponseEmailTracking) => {
        if (isValidEmail(s.email)) {
          temp.push({
            email: s.email,
            company_id: s.id,
          });
        }
      });
    } else {
      selectedIds.forEach((s: any) => {
        if (isValidEmail(s.email)) {
          temp.push(s);
        }
      });
    }

    setSelectedIds(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDownloadAll, data]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const getDataFilter = [
    {
      name: 'email_status',
      value:
        (dataEmailStatus as any)?.map((c: { value: string; label: string }) => ({
          label: c.label,
          value: c.value,
        })) || [],
    },
    {
      name: 'follow_up_status',
      value:
        (dataFollowUpStatus as any)?.map((c: { value: string; label: string }) => ({
          label: c.label,
          value: c.value,
        })) || [],
    },
    {
      name: 'priority',
      value:
        (dataPriority as any)?.map((c: { value: string; label: string }) => ({
          label: c.label,
          value: c.value,
        })) || [],
    },
  ];

  const columnsCustom = listHeaderAccount?.flatMap((item: any) => {
    if (
      tabs !== tabs_email_tracking[0].value &&
      ['follow_up_date', 'email_status', 'follow_up_status', 'priority'].includes(item.key)
    ) {
      return [];
    }

    return [
      {
        title: item.title as string,
        key: item.key,
        type: item?.type || '',
        canFilter: item?.canFilter,
        filter_type: item?.filter_type,
        dataFilter: getDataFilter.find((s) => s.name === item?.title)?.value,
        name_filter: item?.name_filter,
      },
    ];
  });

  return (
    <div className="mt-4">
      <VStack spacing={0}>
        <FilterEmailTracking setParamsQuery={setParamsQuery} paramsQuery={paramsQuery} />
        <CommonTable
          listHeader={columnsCustom}
          paramsQuery={paramsQuery}
          setParamsQuery={setParamsQuery}
          checkBox={
            <Checkbox
              disabled={!!user_id}
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
          bodyComponent={
            <>
              <TableSkeleton loading={isFetchingData} col={(listHeaderAccount.length ?? 0) + 1} />
              <Show when={dataToRender?.data?.length !== 0 && !isFetchingData}>
                {dataToRender?.data?.map((item: IResponseEmailTracking, index: number) => {
                  const checkExist = selectedIds.some((selected: any) => selected.email === item?.email);
                  const isEmailValid = isValidEmail(item?.email || '');
                  return (
                    <RowTableList
                      indexRow={index}
                      tableLength={dataToRender?.data?.length}
                      key={index}
                      item={item}
                      refetch={refetchData}
                      checkExist={checkExist}
                      setIsDownloadAll={setIsDownloadAll}
                      setSelectedIds={setSelectedIds}
                      selectedIds={selectedIds}
                      isDownloadAll={isDownloadAll}
                      isEmailValid={isEmailValid}
                      tabs={tabs}
                    />
                  );
                })}
              </Show>
            </>
          }
          footerComponent={
            <Show when={dataToRender && dataToRender?.data?.length !== 0 && !isFetchingData}>
              <TablePagination
                onPageChange={(page) => setParamsQuery({ ...paramsQuery, page })}
                onPageSizeChange={(limit) => setParamsQuery({ ...paramsQuery, limit: Number(limit) })}
                pagination={{ ...dataToRender?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
              />
            </Show>
          }
        />
        <Show when={!isFetchingData && (dataToRender?.data?.length === 0 || !dataToRender)}>
          <Empty />
        </Show>
      </VStack>
      <Show when={selectedIds.length > 0}>
        <ActionBar refetch={refetchData} selectedIds={selectedIds} />
      </Show>
    </div>
  );
};

export default TableEmailTracking;
