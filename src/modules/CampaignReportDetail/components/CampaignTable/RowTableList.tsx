import React from 'react';

import type { ICampaignDetailDataResponse } from '@/api/campaign';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { colorStatus } from '@/modules/EmailTracking/utils/getStatus';
import type { TypeItemTable } from '@/types/common.type';

interface Props extends TypeItemTable {
  item: ICampaignDetailDataResponse;
}
const RowTableList = ({ indexRow, tableLength, item }: Props) => {
  return (
    <>
      <RowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.contact_name}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.email}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.company_name}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.email_sent}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          {colorStatus(item?.email_status)}
        </ItemRowTable>
      </RowTable>
    </>
  );
};

export default RowTableList;
