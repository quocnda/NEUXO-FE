/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query';
import { Pin, X } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import type { IBodyWatchlist, IParamsMatchingCompaniesList } from '@/api/company';
import { addNoteWatchMatching, removeWatchListById, useNotificationsWatchListById } from '@/api/company';
import { pinCompanyWatchlist, saveICPWatchlist } from '@/api/watchlist';
import { Icons } from '@/assets/icons';
import SheetCompany from '@/components/CompanySidePanel/SheetCompany';
import { useExpandedRow } from '@/components/contexts/ExpandedRowContext';
import ModalAddNote from '@/components/Modal/Company/ModalAddNote';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import ModalRemoveWatchList from '@/components/Modal/Watchlist/ModalRemoveWatchList';
import renderIcon from '@/components/RenderExternal';
import Tabs from '@/components/Tabs';
import { Checkbox } from '@/components/ui/checkbox';
import ProgressBar from '@/components/ui/progress';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { formatItem, onMutateError, shortenName } from '@/lib/common';
import { getIconsEmail, getTooltipLabel } from '@/lib/getIconsEmail';
import { cn } from '@/lib/utils';
import ModalSentMail from '@/features/email-tracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';
import type { TypeItemTable } from '@/types/common.type';

import { tabNewsWatchList } from '../utils/const';
import CompanyNews from './CompanyNews';

interface Props extends TypeItemTable {
  item: IBodyWatchlist;
  refetch: () => void;
  listHeaderWatchList: (
    | {
        title: string;
        type: string;
        canFilter?: undefined;
        pin?: string | undefined;
      }
    | {
        title: string;
        type: string;
        canFilter: boolean;
        pin?: string | undefined;
      }
  )[];
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
  checkExist: any;
  isDownloadAll: boolean;
  validEmails: string[];
  selectedIds: any[];
  setIsListContactEmail: React.Dispatch<React.SetStateAction<any[]>>;
  isListContactEmail: any[];
  paramsQuery: IParamsMatchingCompaniesList;
}
const RowTableList = ({
  indexRow,
  tableLength,
  item,
  selectedIds,
  refetch,
  listHeaderWatchList,
  setIsDownloadAll,
  setSelectedIds,
  isDownloadAll,
  checkExist,
  validEmails,
  setIsListContactEmail,
  isListContactEmail,
  paramsQuery,
}: Props) => {
  const router = useRouter();
  const rowId = item?.company_id;
  const [companyId, setCompanyId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number | string>(tabNewsWatchList[0].value);
  const [valueNote, setValueNote] = useState<string>('');
  const { data: countNotify, refetch: refetchCount } = useNotificationsWatchListById({ variables: item?.company_id });
  const { expandedRow, toggleRow, setExpandedRow } = useExpandedRow();
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [contactEmail, setContactEmail] = useState<string[]>([]);
  const [isOpenNote, setIsOpenNote] = useState(false);
  const [isOpenICP, setIsOpenICP] = useState(false);
  const [valueICP, setValueICP] = useState<string>('');
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);
  const { user } = useUserStore.getState();

  const { mutate: removeWatch, isLoading } = useMutation(removeWatchListById, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Remove watchlist successfully!');
      refetch();
    },
  });
  const isChecked = checkExist !== undefined || isDownloadAll;
  const isPinned = Boolean(item?.PIN);
  const hasMailAppPass = Boolean(user?.has_mail_app_pass);
  const isRowExpanded = expandedRow === rowId;
  const handleCompanyClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const url = `/matching-companies/company-detail/${item?.company_id}?page=watch-list`;
    if (event.ctrlKey || event.metaKey) {
      window.open(url, '_blank');
    } else {
      router.push(url);
    }
  };

  const handleRowToggle = (targetRowId: string) => toggleRow(targetRowId);

  const rowRef = useRef<HTMLTableRowElement>(null);

  const { mutate: addNote } = useMutation(addNoteWatchMatching, {
    onError: onMutateError,
  });

  const { mutate: mutateSaveICP } = useMutation(saveICPWatchlist, {
    onError: onMutateError,
  });

  const { mutate } = useMutation(pinCompanyWatchlist, {
    onSuccess: () => {
      refetch?.();
      toast.success(item?.PIN ? 'Unpin company successfully!' : 'Pin company successfully!');
    },
    onError: onMutateError,
  });

  useEffect(() => {
    setExpandedRow(null);
  }, []);

  const handleSelectRow = (checked: boolean) => {
    setIsDownloadAll(false);
    if (checked) {
      setSelectedIds([...selectedIds, item?.company_id]);
      setIsListContactEmail([...isListContactEmail, ...item?.lst_email]);
      return;
    }
    setSelectedIds(selectedIds?.filter((s) => s !== item?.company_id));
    setIsListContactEmail(isListContactEmail.filter((email) => !item?.lst_email.includes(email)));
  };

  const renderColumnContent = useCallback(
    (column: any) => {
      switch (column?.title) {
        case 'company':
          return (
            <SheetCompany
              companyName={item?.company}
              avatarUrl={item?.avatar_url}
              handleClick={handleCompanyClick}
              companyId={item?.company_id}
              isWatchList
            />
          );
        case 'news':
          return (
            <div className="pr-10">
              <div className="relative">
                <HStack
                  spacing={8}
                  className="bg-main flex h-6 w-6 cursor-pointer justify-center rounded-full hover:opacity-60"
                  onClick={() => {
                    handleRowToggle(item.company_id);
                    setCompanyId(item?.company_id);
                  }}
                >
                  <Icons.news color={countNotify > 0 ? '#0077b5' : 'gray'} strokeWidth={2} width={12} height={12} />
                </HStack>

                <Show when={countNotify > 0}>
                  <HStack className="absolute -top-1 left-4 flex min-h-[14px] w-fit min-w-[14px] items-center justify-center rounded-full bg-red-500 text-white">
                    <span className="mt-[2px] text-[7px]">{countNotify || 0}</span>
                  </HStack>
                </Show>
              </div>
            </div>
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
        case 'action':
          return (
            <div className="flex items-center gap-3">
              <Show when={hasMailAppPass}>
                <Tooltip label={getTooltipLabel(item?.status_mail, user?.user_name)}>
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
                        onClick={() =>
                          setContactEmail(
                            item?.lst_email.filter((email) => email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                          )
                        }
                      >
                        {getIconsEmail(item?.status_mail, user?.user_name, validEmails.length !== 0 ? 1 : 0.4)}
                      </HStack>
                    </ModalSentMail>
                  </div>
                </Tooltip>
              </Show>
              <Show when={!hasMailAppPass}>
                <Tooltip label={getTooltipLabel(item?.status_mail, user?.user_name)}>
                  <div>
                    <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
                      <HStack
                        spacing={8}
                        className={cn(
                          'bg-neutral-20 flex h-6 w-6 justify-center rounded-full',
                          validEmails.length === 0 && 'pointer-events-none'
                        )}
                      >
                        {getIconsEmail(item?.status_mail, user?.user_name, validEmails.length !== 0 ? 1 : 0.4)}
                      </HStack>
                    </ModalLoginEmail>
                  </div>
                </Tooltip>
              </Show>
              <Tooltip
                label={isPinned ? 'Unpin' : 'Pin'}
                className="text-main border-main rounded-[21px] px-3 text-xs font-medium"
              >
                <HStack
                  spacing={8}
                  className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full"
                  onClick={() => mutate({ company_id: String(item?.company_id) })}
                >
                  {!isPinned ? (
                    <Pin className="cursor-pointer" color="#6B7280" width={12} height={12} />
                  ) : (
                    <Pin className="cursor-pointer" color="#FFC800" width={12} height={12} />
                  )}
                </HStack>
              </Tooltip>
              <Tooltip
                label="Remove watchlist"
                className="text-main border-main rounded-[21px] px-3 text-xs font-medium"
              >
                <div>
                  <ModalRemoveWatchList removeWatch={() => removeWatch({ ids: item.company_id })} isLoading={isLoading}>
                    <HStack spacing={8} className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full">
                      <Icons.remove className="cursor-pointer" color="#6B7280" width={12} height={12} />
                    </HStack>
                  </ModalRemoveWatchList>{' '}
                </div>
              </Tooltip>
            </div>
          );
        case 'insert_time':
          return <TextBody1>{item?.created_at ? moment(item.created_at).format('DD MMM, YYYY') : '-'}</TextBody1>;
        case 'followers':
          return <TextBody1>{Number(item?.followers).toLocaleString() || '-'}</TextBody1>;
        case 'note':
          return (
            <Tooltip
              hidden={!(item.note && item.note.length > 20)}
              label={
                <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                  {item?.note}
                </div>
              }
            >
              <div>
                <TextBody1
                  className={cn('cursor-pointer')}
                  onClick={() => {
                    setCompanyId(item?.company_id);
                    setValueNote(item?.note);
                    setIsOpenNote(true);
                  }}
                >
                  {shortenName(item?.note, 20) || '-'}
                </TextBody1>
              </div>
            </Tooltip>
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
              <p className="text-xs font-normal">
                {(item as any)[column?.title] ? shortenName(String((item as any)[column?.title]), 20) : '-'}
              </p>
            </Tooltip>
          );
      }
    },
    [companyId, item, countNotify, contactEmail, isOpenSendEmail, isOpenModalLoginEmail, valueNote, valueICP]
  );

  return (
    <>
      <React.Fragment>
        <RowTable rowClassName={cn(checkExist && 'bg-blue-50 hover:bg-blue-50')}>
          <ItemRowTable
            indexRow={indexRow}
            tableLength={tableLength}
            className="sm:bg-neutral-10 w-[50px] border-l text-center sm:sticky sm:left-[-1px] sm:z-10 sm:border-r-0"
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={(e: any) => handleSelectRow(Boolean(e))}
            />
          </ItemRowTable>
          {listHeaderWatchList.map((column, i) => (
            <ItemRowTable
              indexRow={indexRow}
              tableLength={tableLength}
              key={i}
              className={cn(
                column.pin &&
                  'sm:bg-neutral-10 before:right-0 before:h-full sm:relative sm:z-10 sm:border-l-0 sm:border-r-0 sm:before:absolute sm:before:top-0 sm:before:w-[8px] sm:before:shadow-[3px_0px_4.1px_0px_#0000000F]',
                column.pin
              )}
            >
              {renderColumnContent(column)}
            </ItemRowTable>
          ))}
        </RowTable>
        <tr ref={rowRef}>
          <td colSpan={listHeaderWatchList.length + 1} style={{ padding: 0 }} className="relative">
            <div
              style={{
                maxHeight: isRowExpanded ? '500px' : '0',
                opacity: isRowExpanded ? 1 : 0,
                overflow: 'auto',
                transition: 'max-height 0.3s ease, opacity 0.3s ease',
                width: '100%',
              }}
            >
              <Wrapper className="w-full rounded-sm border-0 border-b bg-gray-100">
                <div className="mx-auto">
                  <div className="sticky top-0 bg-gray-100 pb-2">
                    <Tabs
                      onChange={(value) => setActiveTab(value)}
                      value={activeTab}
                      data={tabNewsWatchList}
                      layoutId="tab-sidebar-searchs"
                      className="border-white bg-gray-100 px-4 py-2"
                      borderItemClassName="h-[2px] bottom-[-9px]"
                    />
                    <div className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <X
                        color="#6F767E"
                        size={14}
                        className="cursor-pointer hover:opacity-50"
                        onClick={() => handleRowToggle(item.company_id)}
                      />
                    </div>
                  </div>

                  <Show when={activeTab === 'company_news'}>
                    <CompanyNews companyId={companyId} refetchCount={refetchCount} />
                  </Show>
                </div>
              </Wrapper>
            </div>
          </td>
        </tr>
      </React.Fragment>
      <Show when={isOpenNote}>
        <ModalAddNote
          addNote={addNote}
          companyId={companyId}
          companyName={item?.company}
          valueNote={valueNote}
          onSuccess={(newNote) => {
            item.note = newNote;
            setValueNote(newNote);
          }}
          isOpen={isOpenNote}
          setIsOpen={setIsOpenNote}
        />
      </Show>
    </>
  );
};
export default RowTableList;
