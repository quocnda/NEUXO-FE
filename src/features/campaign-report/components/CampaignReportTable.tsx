import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useListAdmin } from '@/api/auth';
import type { IParamsCampaignReport } from '@/api/campaign';
import { useListCampaignlReport } from '@/api/campaign';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { debounceV2, removeUndefinedKeys } from '@/lib/utils';
import { listEmailFocus } from '@/features/email-report/utils/data';

import { listHeaderEmailReport } from '../utils/const';
import RowTableList from './RowTableList';

const CampaignReportTable = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsCampaignReport>({
    page: 1,
    limit: 50,
    orderByVal: 'DESC',
  });

  const { data, isFetching, refetch } = useListCampaignlReport({ variables: paramsQuery, refetchOnMount: true });
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
    {
      name: 'campaign_status',
      value: [
        {
          label: 'Active',
          value: 'Active',
        },
        {
          label: 'Paused',
          value: 'Paused',
        },
        {
          label: 'Completed',
          value: 'Completed',
        },
      ],
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

  const updateParamsQuery = (newParams: Partial<IParamsCampaignReport>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };

  const handleInputChange = debounceV2((e: any) => {
    updateParamsQuery({ search_key: e.target.value, page: 1 });
  }, 500);

  useEffect(() => {
    if (!paramsQuery?.list_user_id && dataUser && dataUser.length > 0) {
      setParamsQuery((prev) => ({
        ...prev,
        list_user_id: dataUser.map((user) => user.user_id).join(','),
      }));
    }
  }, [dataUser, paramsQuery?.list_user_id]);

  return (
    <Wrapper>
      <HStack pos={'apart'} spacing={8}>
        <Tag className="bg-secondary-purple">Automated Campaign Report</Tag>
        <div className="max-w-[400px]">
          <Input
            placeholder={'Search Campaign Name'}
            className="border-neutral-30 h-8 border-2 text-xs"
            suffix={<Search size={16} color="#808080" />}
            onChange={handleInputChange}
          />
        </div>
      </HStack>

      <VStack spacing={0} className="my-4">
        <CommonTable
          listHeader={columnsCustom}
          paramsQuery={paramsQuery}
          setParamsQuery={setParamsQuery}
          bodyComponent={
            <>
              <TableSkeleton loading={isFetching} col={columnsCustom.length} />
              <Show when={data && data?.length !== 0 && !isFetching}>
                {data?.map((item: any, index: number) => {
                  return (
                    <RowTableList
                      indexRow={index}
                      tableLength={data?.length}
                      key={index}
                      item={item}
                      refetch={refetch}
                      paramsQuery={paramsQuery}
                    />
                  );
                })}
              </Show>
            </>
          }
          footerComponent={<></>}
        />

        <Show when={!isFetching && (data?.length === 0 || !data)}>
          <Empty />
        </Show>
      </VStack>
    </Wrapper>
  );
};

export default CampaignReportTable;
