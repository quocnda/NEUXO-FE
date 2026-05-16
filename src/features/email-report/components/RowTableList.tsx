/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { Eye } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';

import type { IParamsEmailReport, IResponseEmailReport } from '@/api/email-report';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores';
import type { TypeItemTable } from '@/types/common.type';

interface Props extends TypeItemTable {
  item: IResponseEmailReport;
  refetch: () => void;
  paramsQuery: IParamsEmailReport | undefined;
  valueDate: string;
}
const RowTableList = ({ indexRow, tableLength, item, paramsQuery, valueDate }: Props) => {
  const router = useRouter();
  const { user } = useUserStore.getState();

  const handleNavigateToTracking = () => {
    const queryParams = {
      user_id: item.user_id,
      user_name: item.user_name,
      start_date: paramsQuery?.start_date,
      end_date: paramsQuery?.end_date,
      value_date: valueDate,
    };

    const filteredParams = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&');

    router.push(`/email-tracking?${filteredParams}`);
  };

  return (
    <RowTable>
      <ItemRowTable
        indexRow={indexRow}
        tableLength={tableLength}
        className="bg-neutral-10 sticky left-0 z-10 border-l-0 border-r-0 before:absolute before:right-0 before:top-0 before:h-full before:w-[8px] before:shadow-[3px_0px_4.1px_0px_#0000000F]"
      >
        <TextBody1>{item?.user_name}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.unique_domain_sent}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_sent}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_replied}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.replied_rate !== 'N/A' ? `${item?.replied_rate}%` : item?.replied_rate}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_follow_up_1}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_follow_up_2}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_follow_up_3}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_follow_up_4}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_follow_up_5}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1>{item?.new_email_follow_up_5_plus}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <button disabled={user.user_name === item.user_name} type="button">
          <HStack
            spacing={8}
            className={cn(
              'bg-neutral-20 flex h-6 w-6 cursor-pointer justify-center rounded-full hover:opacity-50',
              user.user_name === item.user_name && 'cursor-not-allowed opacity-40'
            )}
            onClick={handleNavigateToTracking}
          >
            <Eye size={12} color="#6F767E" />
          </HStack>
        </button>
      </ItemRowTable>
    </RowTable>
  );
};
export default RowTableList;
