/* eslint-disable react/no-unescaped-entities */

import { useMutation } from '@tanstack/react-query';
import { Eye, Mail } from 'lucide-react';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { addNode, type IResponseEmailTracking } from '@/api/email-tracking';
import { Checkbox } from '@/components/ui/checkbox';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show } from '@/components/ui/Utilities';
import { onMutateError, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';
import type { TypeItemTable } from '@/types/common.type';

import ModalViewDetailEmail from '../../../../components/Modal/Email/ModalViewDetailEmail';
import { tabs_email_tracking } from '../../utils/const';
import { colorStatus } from '../../utils/getStatus';
import ModalAddNote from './ModalAddNote';
import ModalSentMail from './ModalSentMail';

interface Props extends TypeItemTable {
  item: IResponseEmailTracking;
  refetch: () => void;
  checkExist: any;
  isDownloadAll: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIds: any[];
  isEmailValid: boolean;
  tabs: string | number;
}
const RowTableList = ({
  indexRow,
  tableLength,
  item,
  refetch,
  checkExist,
  setSelectedIds,
  setIsDownloadAll,
  isEmailValid,
  tabs,
}: Props) => {
  const router = useRouter();
  const { user_id } = router.query;

  const [mailPreview, setMailPreview] = useState<{ contactName: string; email: string }>({
    contactName: '',
    email: '',
  });
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [selectedContactEmail, setSelectedContactEmail] = useState<string>('');
  const [noteValue, setNoteValue] = useState<string>('');

  const { mutate: mutateAddNote } = useMutation(addNode, {
    onError: onMutateError,
  });

  const handleCheckboxChange = useCallback(
    (isChecked: boolean) => {
      setIsDownloadAll(false);
      if (isChecked && isEmailValid) {
        setSelectedIds((prev) => [...prev, { email: item.email, company_id: item.id }]);
      } else {
        setSelectedIds((prev) => prev.filter((s) => s.email !== item.email));
      }
    },
    [isEmailValid, item.email, item.id, setIsDownloadAll, setSelectedIds]
  );

  return (
    <>
      <RowTable rowClassName={cn(checkExist && 'bg-blue-50 hover:bg-blue-50')}>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength} className="text-center">
          <Checkbox
            checked={checkExist}
            disabled={!isEmailValid || !!user_id}
            onCheckedChange={(e: any) => handleCheckboxChange(e)}
          />
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <Tooltip
            label={item?.company_name}
            hidden={!(item?.company_name && item?.company_name.length > 25)}
            className="max-w-[200px] whitespace-pre-wrap text-xs"
          >
            <div>
              <TextBody1>{shortenName(item?.company_name, 25) || 'TBD'}</TextBody1>
            </div>
          </Tooltip>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <Tooltip
            label={item?.contact_name}
            hidden={!(item?.contact_name && item?.contact_name.length > 25)}
            className="max-w-[200px] whitespace-pre-wrap text-xs"
          >
            <div>
              <TextBody1>{shortenName(item?.contact_name, 25) || 'TBD'}</TextBody1>
            </div>
          </Tooltip>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <Tooltip
            hidden={!(item?.email && String(item?.email).length > 25)}
            label={item?.email}
            className="max-w-[300px] whitespace-pre-wrap text-xs"
          >
            <div>
              <TextBody1>{shortenName(item?.email, 25) || 'TBD'}</TextBody1>
            </div>
          </Tooltip>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.email_sent || '-'}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.last_sent_date ? moment(item.last_sent_date).format('DD MMM, YYYY') : 'TBD'}</TextBody1>
        </ItemRowTable>
        <Show when={tabs === tabs_email_tracking[0].value}>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
            <Tooltip
              hidden={item?.email_status !== 'ERROR' && !item?.error_message}
              label={item?.error_message}
              className="border-main-red text-main-red border-2"
            >
              <div>{colorStatus(item?.email_status)}</div>
            </Tooltip>
          </ItemRowTable>
        </Show>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <Show when={!user_id}>
            <Tooltip
              hidden={!(item?.user_note && item?.user_note.length > 30)}
              label={
                <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                  {item?.user_note}
                </div>
              }
            >
              <div>
                <ModalAddNote
                  addNote={mutateAddNote}
                  email={item?.email}
                  valueNote={noteValue}
                  onSuccess={(newNote) => {
                    item.user_note = newNote;
                    setNoteValue(newNote);
                  }}
                >
                  <TextBody1
                    className="cursor-pointer"
                    onClick={() => {
                      setNoteValue(item?.user_note);
                    }}
                  >
                    {shortenName(item?.user_note, 30) || '-'}
                  </TextBody1>
                </ModalAddNote>
              </div>
            </Tooltip>
          </Show>
          <Show when={!!user_id}>
            <Tooltip
              hidden={!(item?.user_note && item?.user_note.length > 30)}
              label={
                <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                  {item?.user_note}
                </div>
              }
            >
              <div>
                <TextBody1>{shortenName(item?.user_note, 30) || '-'}</TextBody1>
              </div>
            </Tooltip>
          </Show>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <div className="flex items-center gap-3">
            <ModalViewDetailEmail isMail={mailPreview.email} contactName={mailPreview.contactName}>
              <div>
                <Tooltip label="View email record">
                  <HStack
                    spacing={8}
                    onClick={() => setMailPreview({ contactName: item?.contact_name, email: item?.email })}
                    className={cn(
                      'bg-neutral-20 flex h-6 w-6 cursor-pointer justify-center rounded-full hover:opacity-50'
                    )}
                  >
                    <Eye size={12} color="#6F767E" />
                  </HStack>
                </Tooltip>
              </div>
            </ModalViewDetailEmail>
            <Show when={!user_id}>
              <Tooltip label="Send email">
                <div>
                  <ModalSentMail
                    refetch={refetch}
                    setIsOpenSendEmail={setIsOpenSendEmail}
                    isOpenSendEmail={isOpenSendEmail}
                    contact_email={[selectedContactEmail]}
                    event_id={[item?.company_id]}
                  >
                    <HStack
                      spacing={8}
                      onClick={() => setSelectedContactEmail(item?.email)}
                      className={cn('bg-neutral-20 flex h-6 w-6 justify-center rounded-full hover:opacity-50')}
                    >
                      <Mail size={12} color="#6F767E" />
                    </HStack>
                  </ModalSentMail>
                </div>
              </Tooltip>
            </Show>
          </div>
        </ItemRowTable>
      </RowTable>
    </>
  );
};

export default RowTableList;
