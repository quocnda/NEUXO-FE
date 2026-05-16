import React, { useEffect, useState } from 'react';

import type { IParamsCampaignList } from '@/api/campaign';
import { useListCampaign } from '@/api/campaign';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { TablePagination } from '@/components/ui/table';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import CardCampaign from './components/CardCampaign';
import Filter from './components/Filter';
import WarningCreateNewEmailCampaign from './components/WarningCreateNewEmailCampaign';

const CampaignManagement = () => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [queryParams, setQueryParams] = useState<IParamsCampaignList>({
    page: 1,
    limit: 50,
  });
  const { data, isFetching, refetch } = useListCampaign({ variables: queryParams, refetchOnMount: true });

  useEffect(() => {
    const isOpenWarningLocal = localStorage.getItem('isOpenWarning');
    if (isOpenWarningLocal) {
      setIsWarningOpen(JSON.parse(isOpenWarningLocal));
    } else setIsWarningOpen(true);
  }, []);

  return (
    <Wrapper>
      <VStack spacing={12}>
        <HStack pos="apart">
          <Tag className="bg-secondary-purple">Automated Campaign Management </Tag>
        </HStack>
        <Show when={isWarningOpen}>
          <WarningCreateNewEmailCampaign setIsOpenWarning={setIsWarningOpen} />
        </Show>
        <Filter paramsQuery={queryParams} setParamsQuery={setQueryParams} />
        <Show when={!isFetching}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {data?.data?.map((item, index) => (
              <CardCampaign key={index} item={item} refetch={refetch} />
            ))}
          </div>
        </Show>

        <Show when={isFetching}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <CardCampaign loading key={index} />
            ))}
          </div>
        </Show>
        <Show when={!isFetching && (data?.data?.length === 0 || !data)}>
          <Empty />
        </Show>
        <Show when={!isFetching && data?.data?.length !== 0 && !!data}>
          <div className="sticky bottom-0 bg-white">
            <TablePagination
              onPageChange={(page) => setQueryParams({ ...queryParams, page })}
              onPageSizeChange={(limit) => setQueryParams({ ...queryParams, limit: Number(limit) })}
              pagination={{
                ...data?.pagination,
                current_page: queryParams.page,
                limit: queryParams.limit,
              }}
            />
          </div>
        </Show>
      </VStack>
    </Wrapper>
  );
};

export default CampaignManagement;
