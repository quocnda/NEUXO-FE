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
  const [paramsQuery, setParamsQuery] = useState<IParamsEmailReport>();

  const [valueDate, setValueDate] = useState<string>('');
  const router = useRouter();
  const { start_date, end_date, value_date } = router.query;

  const { data, isFetching, refetch } = useListEmailReport({ variables: paramsQuery, refetchOnMount: true });
  const { data: dataAdmin } = useListAdmin();

  const dataUser = dataAdmin
    ?.filter((item) => listEmailFocus.includes(item.email))
    .map((item) => ({
      email: item.email,
      user_name: item.user_name,
      user_id: item.id,
    }));

  const getDataFilter = [
    {
      name: 'list_user_id',
      value:
        (
          dataUser as
            | {
                email: string;
                user_name: string;
                user_id: string;
              }[]
            | undefined
        )?.map((c: { user_name: string; user_id: string }) => ({
          label: c.user_name,
          value: String(c.user_id),
        })) || [],
    },
  ];

  const columnsCustom = listHeaderEmailReport?.map((item: any) => {
    return {
      title: item.title,
      key: item.key,
      pin: item.pin,
      type: item?.type || '',
      canFilter: item?.canFilter,
      filter_type: item?.filter_type,
      dataFilter: getDataFilter.find((s) => s.name === item.key)?.value,
      name_filter: item?.name_filter,
    };
  });

  useEffect(() => {
    if (!paramsQuery?.list_user_id && dataUser && dataUser.length > 0) {
      setParamsQuery((prev) => ({
        ...prev,
        list_user_id: dataUser.map((user) => user.user_id).join(','),
      }));
    }
  }, [dataUser, paramsQuery?.list_user_id]);

  useEffect(() => {
    if (value_date) {
      setValueDate(String(value_date));
      setParamsQuery((prev) => ({
        ...prev,
        start_date: start_date ? String(start_date) : undefined,
        end_date: end_date ? String(end_date) : undefined,
      }));
    } else {
      setValueDate('yesterday');
      setParamsQuery((prev) => ({
        ...prev,
        start_date: undefined,
        end_date: undefined,
      }));
    }
  }, [value_date, start_date, end_date]);

  return (
    <Wrapper>
      <HStack pos={'apart'} spacing={8}>
        <Tag className="bg-secondary-purple">Email Report</Tag>
        <FilterEmailReport
          paramsQuery={paramsQuery}
          setParamsQuery={setParamsQuery}
          setValueDate={setValueDate}
          valueDate={valueDate}
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
          listHeader={columnsCustom}
          paramsQuery={paramsQuery}
          setParamsQuery={setParamsQuery}
          bodyComponent={
            <>
              <TableSkeleton loading={isFetching} col={columnsCustom.length} />
              <Show when={data && data?.report_data?.length !== 0 && !isFetching}>
                {data?.report_data?.map((item: IResponseEmailReport, index: number) => {
                  return (
                    <RowTableList
                      indexRow={index}
                      tableLength={data?.report_data?.length}
                      key={index}
                      item={item}
                      refetch={refetch}
                      paramsQuery={paramsQuery}
                      valueDate={valueDate}
                    />
                  );
                })}
              </Show>
            </>
          }
          footerComponent={<></>}
        />

        <Show when={!isFetching && (data?.report_data?.length === 0 || !data)}>
          <Empty />
        </Show>
      </VStack>
    </Wrapper>
  );
};

export default EmailReportTable;
