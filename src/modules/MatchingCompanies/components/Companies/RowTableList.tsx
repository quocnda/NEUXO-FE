/* eslint-disable no-nested-ternary */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
import { FilePlus, Mail, MessageCircle } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

import type { IDataMatchingCompaniesList, IParamsMatchingCompaniesList } from '@/api/company';
import { Icons } from '@/assets/icons';
import SheetCompany from '@/components/CompanySidePanel/SheetCompany';
import ModalBlackList from '@/components/Modal/Account-Management/ModalBlackList';
import ModalAddNote from '@/components/Modal/Company/ModalAddNote';
import ModalConfirmWatchList from '@/components/Modal/Contact/ModalConfirmWatchList';
import ModalContactRecord from '@/components/Modal/Email/ModalContactRecord';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import renderIcon from '@/components/RenderExternal';
import { Checkbox } from '@/components/ui/checkbox';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show } from '@/components/ui/Utilities';
import { formatAmount, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';
import ModalSentMail from '@/modules/EmailTracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';
import type { TypeItemTable } from '@/types/common.type';

import useServices from '../../hooks/useServices';
import { bgTrigger, getColorLabel } from '../../utils/style';
import ModalTrigger from './ModalTrigger';

interface Props extends TypeItemTable {
  item: IDataMatchingCompaniesList;
  refetch: () => void;
  checkExist: any;
  selectedIds: any[];
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  isDownloadAll: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
  start_date: string | undefined;
  columns: any;
  companyId: string;
  setCompanyId: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  validEmails: string[];
  isListContactEmail: any[];
  setIsListContactEmail: React.Dispatch<React.SetStateAction<any[]>>;
  paramsQuery: IParamsMatchingCompaniesList;
  valueDate: string;
  selectedValues: { [key: string]: { value: string; label: string }[] };
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
  start_date,
  columns,
  companyId,
  setCompanyId,
  setIsOpen,
  validEmails,
  isListContactEmail,
  setIsListContactEmail,
  paramsQuery,
  valueDate,
}: Props) => {
  const router = useRouter();
  const [valueNote, setValueNote] = useState<string>('');
  const { addNote } = useServices(refetch);
  const [isOpenNote, setIsOpenNote] = useState(false);
  const isChecked = checkExist !== undefined || isDownloadAll;
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [contactEmail, setContactEmail] = useState<string[]>([]);
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);
  const { user } = useUserStore.getState();

  const labelArray = useMemo(() => item?.label.split(',').map((label) => label.trim()), [item?.label]);
  const listReachOut = item?.status_mail?.split(',').map((name) => name.trim());

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const queryParams = {
        page: 'matching-companies',
      };

      const filteredParams = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join('&');

      const url = `/matching-companies/company-detail/${item?.company_id}?${filteredParams}`;

      if (event.ctrlKey || event.metaKey) {
        window.open(url, '_blank');
      } else {
        router.push(url);
      }
    },
    [router, item?.company_id, paramsQuery, valueDate]
  );

  const renderColumnContent = useCallback(
    (column: any) => {
      switch (column?.title) {
        case 'company':
          return (
            <SheetCompany
              companyName={item?.company}
              avatarUrl={item?.avatar_url}
              handleClick={handleClick}
              companyId={item?.company_id}
            />
          );

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
        case 'trigger_time':
          return <TextBody1>{item?.updated_at ? moment(item.trigger_time).format('DD MMM, YYYY') : '-'}</TextBody1>;
        case 'trigger':
          return (
            <div className="flex items-center gap-2">
              {item?.trigger?.map((t, index) => (
                <ModalTrigger companyId={companyId} key={index} tag={t} start_date={start_date}>
                  <TextBody1
                    onClick={() => setCompanyId(item?.company_id)}
                    className={cn('flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold', bgTrigger(t))}
                  >
                    {t === 'funding'
                      ? `$ ${formatAmount(item?.funding_amount)}`
                      : t.charAt(0).toUpperCase() + t.slice(1)}
                  </TextBody1>
                </ModalTrigger>
              ))}
            </div>
          );
        case 'action':
          return (
            <div className="flex items-center gap-3">
              <Show when={!item?.watchlist && item?.is_in_watchlist > 0}>
                <Tooltip label="Added to your team member's watchlist">
                  <div>
                    <ModalConfirmWatchList
                      companyId={companyId}
                      setCompanyId={setCompanyId}
                      refetch={refetch}
                      setIsStepOpen={setIsOpen}
                    >
                      <HStack
                        spacing={8}
                        className="bg-neutral-20 flex h-6 w-6 cursor-pointer justify-center rounded-full"
                        onClick={() => {
                          setCompanyId(item?.company_id);
                        }}
                      >
                        <Icons.stars fill="#6B7280" width={12} height={12} className="cursor-pointer" />
                      </HStack>
                    </ModalConfirmWatchList>
                  </div>
                </Tooltip>
              </Show>
              <Show when={!item?.watchlist && item?.is_in_watchlist === 0}>
                <Tooltip label="Add to watchlist">
                  <div>
                    <HStack
                      spacing={8}
                      className="bg-neutral-20 flex h-6 w-6 cursor-pointer justify-center rounded-full"
                      onClick={() => {
                        setCompanyId(item?.company_id);
                        setIsOpen(true);
                      }}
                    >
                      <Icons.watchlistCompany color="#6B7280" width={12} height={12} className="cursor-pointer" />
                    </HStack>
                  </div>
                </Tooltip>
              </Show>
              <Show when={item?.watchlist && item?.is_in_watchlist === 1}>
                <Tooltip label="Added to your watchlist">
                  <div>
                    <HStack spacing={8} className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full">
                      <Icons.watchlistCompany color="#FFC800" width={12} height={12} />
                    </HStack>
                  </div>
                </Tooltip>
              </Show>
              <Show when={item?.watchlist && item?.is_in_watchlist > 1}>
                <Tooltip label="Added to both your watchlist and other teammates">
                  <div>
                    <HStack spacing={8} className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full">
                      <Icons.stars fill="#FFC800" width={12} height={12} />
                    </HStack>
                  </div>
                </Tooltip>
              </Show>

              <HStack spacing={8}>
                <Tooltip label="Add blacklist">
                  <div>
                    <ModalBlackList selectedIds={[`${item?.company_id}`]} refetch={refetch}>
                      <HStack spacing={8} className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full">
                        <Icons.blacklistCompany className="cursor-pointer" color="#6B7280" width={12} height={12} />
                      </HStack>
                    </ModalBlackList>
                  </div>
                </Tooltip>
              </HStack>
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
              <Tooltip label="Note">
                <div>
                  <HStack
                    spacing={8}
                    className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full"
                    onClick={() => {
                      setCompanyId(item?.company_id);
                      setValueNote(item?.note);
                      setIsOpenNote(true);
                    }}
                  >
                    <FilePlus size={12} className="cursor-pointer" color={item.note ? '#FFC800' : '#6F767E'} />
                  </HStack>
                </div>
              </Tooltip>
              <Tooltip label="View communication record" hidden={item?.status_mail === 'Send mail'}>
                <div>
                  <ModalContactRecord companyId={companyId}>
                    <HStack
                      className={cn(
                        'bg-neutral-20 relative flex h-6 w-6 justify-center rounded-full',
                        item?.status_mail === 'Send mail' && 'pointer-events-none cursor-not-allowed opacity-50'
                      )}
                      onClick={() => {
                        setCompanyId(item?.company_id);
                      }}
                    >
                      <MessageCircle size={12} className="cursor-pointer" color="#6F767E" />
                      <Show when={listReachOut.length > 0 && item?.status_mail !== 'Send mail'}>
                        <HStack className="absolute bottom-0 left-4 flex min-h-[14px] w-fit min-w-[14px] items-center justify-center rounded-full bg-red-500 text-white">
                          <span className="mt-[2px] text-[7px]">{listReachOut.length || 0}</span>
                        </HStack>
                      </Show>
                    </HStack>
                  </ModalContactRecord>
                </div>
              </Tooltip>
            </div>
          );

        case 'label':
          return (
            <div className="flex items-center gap-3">
              {labelArray.slice(0, 2).map((label, index) => (
                <Tooltip
                  key={index}
                  hidden={!(label && label.length > 20)}
                  label={
                    <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                      {label}
                    </div>
                  }
                >
                  <div
                    className={cn(
                      'flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold',
                      label && getColorLabel(String(item?.category))
                    )}
                  >
                    {shortenName(label, 20) || '-'}
                  </div>
                </Tooltip>
              ))}

              {labelArray.length > 2 && (
                <Tooltip
                  label={
                    <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                      {labelArray.slice(2).join(', ')}
                    </div>
                  }
                >
                  <div className="text-grey-500 text-neutral-40 flex h-[24px] items-center justify-center rounded-[6px] border border-[#6F767E66] px-2 text-xs font-medium">
                    + {labelArray.length - 2}
                  </div>
                </Tooltip>
              )}
            </div>
          );
        case 'followers':
          return <TextBody1>{Number(item?.followers).toLocaleString() || '-'}</TextBody1>;
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
    [companyId, item, contactEmail, isOpenSendEmail, isOpenModalLoginEmail, valueNote]
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
      <Show when={isOpenNote}>
        <ModalAddNote
          addNote={addNote}
          companyId={companyId}
          companyName={item?.company}
          isOpen={isOpenNote}
          setIsOpen={setIsOpenNote}
          valueNote={valueNote}
          onSuccess={(newNote) => {
            item.note = newNote;
            setValueNote(newNote);
          }}
        />
      </Show>
    </>
  );
};

export default RowTableList;
