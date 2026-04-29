import { Eye, Mail } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

import type { ICampaignDetailDataResponse } from '@/api/campaign';
import ModalViewDetailEmail from '@/components/Modal/Email/ModalViewDetailEmail';
import { Checkbox } from '@/components/ui/checkbox';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import ModalSentMail from '@/modules/EmailTracking/components/EmailTracking/ModalSentMail';
import { colorStatus } from '@/modules/EmailTracking/utils/getStatus';
import type { TypeItemTable } from '@/types/common.type';

interface Props extends TypeItemTable {
  item: ICampaignDetailDataResponse;
  checkExist: any;
  isDownloadAll: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
  isEmailValid: boolean;
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}
const RowTableList = ({
  indexRow,
  tableLength,
  item,
  checkExist,
  setSelectedIds,
  isEmailValid,
  setIsDownloadAll,
  refetch,
}: Props) => {
  const [isMail, setIsMail] = useState<{ contactName: string; email: string }>({ contactName: '', email: '' });
  const [contactEmail, setContactEmail] = useState<string>('');
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const handleCheckboxChange = useCallback(
    (isChecked: boolean) => {
      setIsDownloadAll(false);
      if (isChecked && isEmailValid) {
        setSelectedIds((prev) => [...prev, item.email]);
      } else {
        setSelectedIds((prev) => prev.filter((s) => s !== item.email));
      }
    },
    [isEmailValid, item.email, setIsDownloadAll, setSelectedIds]
  );
  return (
    <>
      <RowTable rowClassName={cn(checkExist && 'bg-blue-50 hover:bg-blue-50')}>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength} className="text-center">
          <Checkbox
            checked={checkExist}
            disabled={!isEmailValid}
            onCheckedChange={(e: any) => handleCheckboxChange(e)}
          />
        </ItemRowTable>
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
          <TextBody1>{item?.email_sent || 0}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.open_count || 0}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          {colorStatus(item?.email_status)}
        </ItemRowTable>

        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <HStack spacing={4}>
            <ModalViewDetailEmail isMail={isMail.email} contactName={isMail.contactName} campaign_id={String(id)}>
              <div>
                <Tooltip label="View email record">
                  <HStack
                    spacing={8}
                    onClick={() => setIsMail({ contactName: item?.contact_name, email: item?.email })}
                    className={cn(
                      'bg-neutral-20 flex h-6 w-6 cursor-pointer justify-center rounded-full hover:opacity-50'
                    )}
                  >
                    <Eye size={12} color="#6F767E" />
                  </HStack>
                </Tooltip>
              </div>
            </ModalViewDetailEmail>
            <Tooltip label="Send email">
              <div>
                <ModalSentMail
                  refetch={refetch}
                  setIsOpenSendEmail={setIsOpenSendEmail}
                  isOpenSendEmail={isOpenSendEmail}
                  contact_email={[contactEmail]}
                >
                  <HStack
                    spacing={8}
                    onClick={() => setContactEmail(item?.email)}
                    className={cn('bg-neutral-20 flex h-6 w-6 justify-center rounded-full hover:opacity-50')}
                  >
                    <Mail size={12} color="#6F767E" />
                  </HStack>
                </ModalSentMail>
              </div>
            </Tooltip>
          </HStack>
        </ItemRowTable>
      </RowTable>
    </>
  );
};

export default RowTableList;
