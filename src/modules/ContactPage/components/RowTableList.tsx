/* eslint-disable no-nested-ternary */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
import { Mail } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import type { IDataMatchingCompaniesList } from '@/api/company';
import { Icons } from '@/assets/icons';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import renderIcon from '@/components/RenderExternal';
import { Checkbox } from '@/components/ui/checkbox';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show } from '@/components/ui/Utilities';
import { shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';
import ModalSentMail from '@/modules/EmailTracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';
import type { TypeItemTable } from '@/types/common.type';

interface Props extends TypeItemTable {
  item: IDataMatchingCompaniesList;
  refetch: () => void;
  checkExist: any;
  selectedIds: any[];
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  isDownloadAll: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
  columns: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  validEmails: string[];
  isListContactEmail: any[];
  setIsListContactEmail: React.Dispatch<React.SetStateAction<any[]>>;
}
const RowTableList = ({
  indexRow,
  tableLength,
  item,
  refetch,
  checkExist,
  selectedIds,
  setIsDownloadAll,
  isDownloadAll,
  setSelectedIds,
  columns,
  validEmails,
  isListContactEmail,
  setIsListContactEmail,
}: Props) => {
  const isChecked = checkExist !== undefined || isDownloadAll;
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [contactEmail, setContactEmail] = useState<string[]>([]);
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);
  const { user } = useUserStore.getState();

  const renderColumnContent = useCallback(
    (column: any) => {
      switch (column?.title) {
        case 'link':
          return (
            <div className="flex items-center gap-2">
              {renderIcon(Icons.website, item?.external?.website, () => window.open(item?.external?.website, '_blank'))}
              {renderIcon(Icons.xTwitter, item?.external?.twitter, () =>
                window.open(item?.external?.twitter, '_blank')
              )}
              {renderIcon(Icons.linkedin, item?.external?.linkedin, () =>
                window.open(item?.external?.linkedin, '_blank')
              )}
            </div>
          );

        case 'action':
          return (
            <div className="flex items-center gap-3">
              <Show when={user?.has_mail_app_pass}>
                <HStack spacing={8}>
                  <Tooltip label="Send email">
                    <div>
                      <ModalSentMail
                        refetch={refetch}
                        setIsOpenSendEmail={setIsOpenSendEmail}
                        isOpenSendEmail={isOpenSendEmail}
                        contact_email={contactEmail}
                        event_id={[item?.company_id]}
                      >
                        <HStack
                          spacing={8}
                          className={cn(
                            'bg-neutral-20 flex h-6 w-6 cursor-pointer justify-center rounded-full',
                            validEmails.length === 0 && 'pointer-events-none'
                          )}
                          onClick={() => setContactEmail(validEmails)}
                        >
                          <Mail size={12} color="#6F767E" opacity={validEmails.length !== 0 ? 1 : 0.4} />
                        </HStack>
                      </ModalSentMail>
                    </div>
                  </Tooltip>
                </HStack>
              </Show>
              <Show when={!user?.has_mail_app_pass}>
                <Tooltip label="Send email">
                  <div>
                    <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
                      <HStack
                        spacing={8}
                        className={cn(
                          'bg-neutral-20 flex h-6 w-6 justify-center rounded-full',
                          validEmails.length === 0 && 'pointer-events-none'
                        )}
                      >
                        <Mail size={12} color="#6F767E" opacity={validEmails.length !== 0 ? 1 : 0.4} />
                      </HStack>
                    </ModalLoginEmail>
                  </div>
                </Tooltip>
              </Show>
            </div>
          );
        default:
          return (
            <Tooltip
              hidden={!((item as any)[column?.title] && String((item as any)[column?.title]).length > 20)}
              label={
                <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                  {(item as any)[column?.title]}
                </div>
              }
            >
              <div>
                <TextBody1>
                  {(item as any)[column?.title] ? shortenName(String((item as any)[column?.title]), 20) : '-'}
                </TextBody1>
              </div>
            </Tooltip>
          );
      }
    },
    [item, contactEmail, isOpenSendEmail, isOpenModalLoginEmail]
  );

  return (
    <>
      <RowTable rowClassName={cn(isChecked && 'bg-blue-50 hover:bg-blue-50')}>
        <ItemRowTable
          indexRow={indexRow}
          tableLength={tableLength}
          className="sm:bg-neutral-10 w-[50px] border-l text-center sm:sticky sm:left-[-1px] sm:z-10 sm:border-r-0"
        >
          <Checkbox
            checked={isChecked}
            onCheckedChange={(e: any) => {
              setIsDownloadAll(false);
              if (e) {
                setSelectedIds([...selectedIds, item?.company_id]);
                setIsListContactEmail([...isListContactEmail, ...item?.lst_email]);
              } else {
                setSelectedIds(selectedIds?.filter((s) => s !== item?.company_id));
                setIsListContactEmail(isListContactEmail.filter((email) => !item?.lst_email.includes(email)));
              }
            }}
          />
        </ItemRowTable>
        {columns?.map((column: any, i: number) => {
          return (
            <ItemRowTable
              indexRow={indexRow}
              tableLength={tableLength}
              key={i}
              className={cn(
                column.pin &&
                  'bg-neutral-10 relative z-10 border-l-0 border-r-0 before:absolute before:right-0 before:top-0 before:h-full before:w-[8px] before:shadow-[3px_0px_4.1px_0px_#0000000F]',
                column.pin
              )}
            >
              {renderColumnContent(column)}
            </ItemRowTable>
          );
        })}
      </RowTable>
    </>
  );
};

export default RowTableList;
