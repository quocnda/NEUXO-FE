import { FileOutput, SendHorizonal, Star } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useListAdmin } from '@/api/auth';
import type { IParamsEmailReport, IResponseEmailReport } from '@/api/email-report';
import { useListEmailReport } from '@/api/email-report';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import { listHeaderEmailReport } from '../utils/const';
import { listEmailFocus } from '../utils/data';
import CardEmailReport from './CardEmailReport';
import FilterEmailReport from './FilterEmailReport';
import RowTableList from './RowTableList';

const EmailReportTable = () => {
  const [queryParams, setQueryParams] = useState<IParamsEmailReport>();
  const [datePreset, setDatePreset] = useState<string>('');
  const router = useRouter();
  const { start_date, end_date, value_date } = router.query;

  const { data, isFetching, refetch } = useListEmailReport({ variables: queryParams, refetchOnMount: true });
  const { data: adminUsers } = useListAdmin();

  const focusUsers = adminUsers
    ?.filter((user) => listEmailFocus.includes(user.email))
    .map((user) => ({
      email: user.email,
      user_name: user.user_name,
      user_id: user.id,
    }));

  const filterOptions = [
    {
      name: 'list_user_id',
      value:
        (
          focusUsers as
            | {
                email: string;
                user_name: string;
                user_id: string;
              }[]
            | undefined
        )?.map((user: { user_name: string; user_id: string }) => ({
          label: user.user_name,
          value: String(user.user_id),
        })) || [],
    },
  ];

  const tableColumns = listHeaderEmailReport?.map((item: any) => ({
    title: item.title,
    key: item.key,
    pin: item.pin,
    type: item?.type || '',
    canFilter: item?.canFilter,
    filter_type: item?.filter_type,
    dataFilter: filterOptions.find((s) => s.name === item.key)?.value,
    name_filter: item?.name_filter,
  }));

  useEffect(() => {
    if (!queryParams?.list_user_id && focusUsers && focusUsers.length > 0) {
      setQueryParams((prev) => ({
        ...prev,
        list_user_id: focusUsers.map((user) => user.user_id).join(','),
      }));
    }
  }, [focusUsers, queryParams?.list_user_id]);

  useEffect(() => {
    if (value_date) {
      setDatePreset(String(value_date));
      setQueryParams((prev) => ({
        ...prev,
        start_date: start_date ? String(start_date) : undefined,
        end_date: end_date ? String(end_date) : undefined,
      }));
    } else {
      setDatePreset('yesterday');
      setQueryParams((prev) => ({
        ...prev,
        start_date: undefined,
        end_date: undefined,
      }));
    }
  }, [value_date, start_date, end_date]);

  const reportRows = data?.report_data || [];

  return (
    <Wrapper>
      <HStack pos={'apart'} spacing={8}>
        <Tag className="bg-secondary-purple">Email Report</Tag>
        <FilterEmailReport
          paramsQuery={queryParams}
          setParamsQuery={setQueryParams}
          setValueDate={setDatePreset}
          valueDate={datePreset}
        />
      </HStack>
      <div className="bg-neutral-20 my-4 grid grid-cols-1 items-center justify-center gap-2 rounded-md p-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <CardEmailReport
          icon={SendHorizonal}
          title="Average New Email Sent"
          value={data?.average_new_email_sent || '0'}
          className="col-span-1 sm:col-span-2 lg:col-span-1"
          isFetching={isFetching}
        />
        <CardEmailReport
          icon={FileOutput}
          title="Average New Email Replied"
          value={data?.average_new_email_reply || '0'}
          isFetching={isFetching}
        />
        <CardEmailReport
          icon={Star}
          title="Average Replied Rate"
          value={`${data?.average_reply_rate} %` || '0 %'}
          isFetching={isFetching}
        />
      </div>
      <VStack spacing={0}>
        <CommonTable
          listHeader={tableColumns}
          paramsQuery={queryParams}
          setParamsQuery={setQueryParams}
          bodyComponent={
            <>
              <TableSkeleton loading={isFetching} col={tableColumns.length} />
              <Show when={data && reportRows.length !== 0 && !isFetching}>
                {reportRows.map((item: IResponseEmailReport, index: number) => {
                  return (
                    <RowTableList
                      indexRow={index}
                      tableLength={reportRows.length}
                      key={index}
                      item={item}
                      refetch={refetch}
                      paramsQuery={queryParams}
                      valueDate={datePreset}
                    />
                  );
                })}
              </Show>
            </>
          }
          footerComponent={<></>}
        />

        <Show when={!isFetching && (reportRows.length === 0 || !data)}>
          <Empty />
        </Show>
      </VStack>
    </Wrapper>
  );
};

export default EmailReportTable;
