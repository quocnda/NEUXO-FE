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
import ModalSentMail from '@/features/email-tracking/components/EmailTracking/ModalSentMail';
import { colorStatus } from '@/features/email-tracking/utils/getStatus';
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
  const [selectedMail, setSelectedMail] = useState<{ contactName: string; email: string }>({
    contactName: '',
    email: '',
  });
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const campaignId = String(id);

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      setIsDownloadAll(false);
      if (checked && isEmailValid) {
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
            <ModalViewDetailEmail
              isMail={selectedMail.email}
              contactName={selectedMail.contactName}
              campaign_id={campaignId}
            >
              <div>
                <Tooltip label="View email record">
                  <HStack
                    spacing={8}
                    onClick={() => setSelectedMail({ contactName: item?.contact_name, email: item?.email })}
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
                  setIsOpenSendEmail={setIsSendModalOpen}
                  isOpenSendEmail={isSendModalOpen}
                  contact_email={[selectedEmail]}
                >
                  <HStack
                    spacing={8}
                    onClick={() => setSelectedEmail(item?.email)}
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
