import { Search } from 'lucide-react';
import React from 'react';

import type { ICampaignDetailDataResponse, IParamsCampaignDetail } from '@/api/campaign';
import Empty from '@/components/Empty';
import { Input } from '@/components/ui/input';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { Show, VStack } from '@/components/ui/Utilities';
import { debounceV2, removeUndefinedKeys } from '@/lib/utils';
import { dataEmailStatus } from '@/features/email-tracking/utils/const';
import type { IPagination } from '@/types';

import { listHeader } from '../../utils/const';
import RowTableList from './RowTableList';

const CampaignTable = ({
  data,
  paramsQuery,
  setParamsQuery,
  isFetching,
  pagination,
}: {
  data: ICampaignDetailDataResponse[] | undefined;
  paramsQuery: IParamsCampaignDetail;
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsCampaignDetail>>;
  isFetching: boolean;
  pagination: IPagination | undefined;
}) => {
  const updateParamsQuery = (newParams: Partial<IParamsCampaignDetail>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };

  const handleSearch = debounceV2((e: React.ChangeEvent<HTMLInputElement>) => {
    updateParamsQuery({ search_key: e.target.value });
  }, 300);

  const getDataFilter = [
    {
      name: 'email_status',
      value:
        (dataEmailStatus as any)?.map((c: { value: string; label: string }) => ({
          label: c.label,
          value: c.value,
        })) || [],
    },
  ];

  const columns = listHeader?.map((item: any) => {
    return {
      title: item.title,
      key: item.key,
      type: item?.type || '',
      canFilter: item?.canFilter,
      filter_type: item?.filter_type,
      name_filter: item?.name_filter,
      dataFilter: getDataFilter.find((s) => s.name === item?.key)?.value,
    };
  });

  return (
    <>
      <VStack className="mt-4" spacing={12}>
        <div className="max-w-[400px]">
          <Input
            placeholder={'Search Company Name, Contact Name or Email'}
            name="search"
            className="border-neutral-30 h-8 border-2 text-xs"
            suffix={<Search size={16} color="#808080" />}
            onChange={handleSearch}
          />
        </div>
        <CommonTable
          listHeader={columns}
          paramsQuery={paramsQuery}
          setParamsQuery={setParamsQuery}
          bodyComponent={
            <>
              <TableSkeleton loading={isFetching} col={(columns?.length || 0) + 1} />
              <Show when={data && data?.length !== 0 && !isFetching}>
                {data?.map((item: ICampaignDetailDataResponse, index: number) => {
                  return <RowTableList indexRow={index} tableLength={data?.length} key={index} item={item} />;
                })}
              </Show>
            </>
          }
          footerComponent={
            <Show when={data && data?.length !== 0 && !isFetching}>
              <TablePagination
                onPageChange={(page) => setParamsQuery({ ...paramsQuery, page })}
                onPageSizeChange={(limit) => setParamsQuery({ ...paramsQuery, limit: Number(limit) })}
                pagination={{ ...pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
              />
            </Show>
          }
        />
        <Show when={!isFetching && (data?.length === 0 || !data)}>
          <Empty />
        </Show>
      </VStack>
    </>
  );
};

export default CampaignTable;
