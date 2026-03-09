/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React from 'react';

import type { IParamsEmailReport } from '@/api/email-report';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { formatStatus } from '@/lib/common';
import type { TypeItemTable } from '@/types/common.type';

interface Props extends TypeItemTable {
  item: any;
  refetch: () => void;
  paramsQuery: IParamsEmailReport | undefined;
}
const RowTableList = ({ indexRow, tableLength, item }: Props) => {
  const router = useRouter();
  return (
    <>
      <React.Fragment>
        <RowTable>
          <ItemRowTable
            indexRow={indexRow}
            tableLength={tableLength}
            className="bg-neutral-10 sticky left-0 z-10 border-l-0 border-r-0 before:absolute before:right-0 before:top-0 before:h-full before:w-[8px] before:shadow-[3px_0px_4.1px_0px_#0000000F]"
          >
            <TextBody1
              className="cursor-pointer"
              onClick={() => router.push(`/campaign-report/campaign-detail/${item?.campaign_id}`)}
            >
              {item?.campaign_name}
            </TextBody1>
          </ItemRowTable>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
            <TextBody1>{item?.user_send}</TextBody1>
          </ItemRowTable>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
            <TextBody1>{formatStatus(item?.campaign_status)}</TextBody1>
          </ItemRowTable>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
            <TextBody1>{dayjs(item?.day_created).format('DD MMM, YYYY')}</TextBody1>
          </ItemRowTable>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
            <TextBody1>{item?.total_email_sent}</TextBody1>
          </ItemRowTable>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
            <TextBody1>{item?.total_email_opened}</TextBody1>
          </ItemRowTable>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
            <TextBody1>{item?.total_email_replied}</TextBody1>
          </ItemRowTable>
        </RowTable>
      </React.Fragment>
    </>
  );
};
export default RowTableList;
