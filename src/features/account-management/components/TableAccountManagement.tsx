import { useRouter } from 'next/router';
import React from 'react';

import type { ISignupResponse } from '@/api/auth';
import { useListAdmin } from '@/api/auth';
import Empty from '@/components/Empty';
import ModalCreateAccount from '@/components/Modal/Account-Management/ModalCreateAccount';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import { listHeaderAccount } from '../utils/const';
import RowTableList from './RowTableList';

const TableAccountManagement = () => {
  const { data, isFetching, refetch } = useListAdmin();
  const router = useRouter();
  return (
    <>
      <Wrapper>
        <HStack pos="apart" className="mb-5">
          <Tag className="bg-secondary-blue">Account Management</Tag>
          <HStack spacing={4}>
            <Button
              variant={'outline'}
              onClick={() => router.push('/email-report')}
              className="flex h-10 items-center gap-2 rounded-md text-xs font-medium"
            >
              View Email Report
            </Button>
            <Button
              variant={'outline'}
              onClick={() => router.push('/watch-list-all')}
              className="flex h-10 items-center gap-2 rounded-md text-xs font-medium"
            >
              View All Watchlist
            </Button>
            <Button
              variant={'outline'}
              onClick={() => router.push('/campaign-report')}
              className="flex h-10 items-center gap-2 rounded-md text-xs font-medium"
            >
              View Automated Campaign Report
            </Button>
            <ModalCreateAccount refetch={refetch}>
              <Button className="flex h-10 items-center gap-2 rounded-md text-xs font-normal">Create Account</Button>
            </ModalCreateAccount>
          </HStack>
        </HStack>
        <VStack className="my-4" spacing={0}>
          <CommonTable
            listHeader={listHeaderAccount}
            bodyComponent={
              <>
                <TableSkeleton loading={isFetching} col={listHeaderAccount.length} />
                <Show when={data?.length !== 0 && !isFetching}>
                  {data?.map((item: ISignupResponse, index: number) => {
                    return (
                      <RowTableList
                        indexRow={index}
                        tableLength={data?.length}
                        key={index}
                        item={item}
                        index={index}
                        refetch={refetch}
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
    </>
  );
};

export default TableAccountManagement;
