/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { X } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { IWatchListView } from '@/api/admin-watchlist';
import { useNotificationsWatchListViewById } from '@/api/admin-watchlist';
import { Icons } from '@/assets/icons';
import SheetCompany from '@/components/CompanySidePanel/SheetCompany';
import { useExpandedRow } from '@/components/contexts/ExpandedRowContext';
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
import { formatItem, shortenName } from '@/lib/common';
import type { TypeItemTable } from '@/types/common.type';

import { tabNewsWatchList } from '../../utils/const';
import CompanyNews from './CompanyNews';
import ContactNews from './ContactNews';

interface Props extends TypeItemTable {
  item: IWatchListView;
  refetch: () => void;
  listHeaderWatchList: (
    | {
        title: string;
        type: string;
        canFilter?: undefined;
      }
    | {
        title: string;
        type: string;
        canFilter: boolean;
      }
  )[];
}
const RowTableList = ({ indexRow, tableLength, item, listHeaderWatchList }: Props) => {
  const router = useRouter();
  const { user_id, user_name } = router.query;
  const rowId = item?.company_id;
  const [companyId, setCompanyId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number | string>(tabNewsWatchList[0].value);
  const { data: countNotify } = useNotificationsWatchListViewById({
    variables: {
      company_id: item?.company_id,
      user_id: String(user_id),
    },
  });
  const { expandedRow, toggleRow, setExpandedRow } = useExpandedRow();
  const isRowExpanded = expandedRow === rowId;

  const handleCompanyClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const url = `/matching-companies/company-detail/${item?.company_id}?page=watch-list-other-user&user_id=${user_id}&user_name=${user_name}`;
    if (event.ctrlKey || event.metaKey) {
      window.open(url, '_blank');
    } else {
      router.push(url);
    }
  };

  const handleRowToggle = (targetRowId: string) => toggleRow(targetRowId);

  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    setExpandedRow(null);
  }, []);

  const renderColumnContent = useCallback(
    (column: any) => {
      switch (column?.title) {
        case 'company':
          return (
            <SheetCompany
              companyName={item?.company}
              avatarUrl={item?.avatar_url}
              handleClick={handleCompanyClick}
              user_id={String(user_id)}
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
                    handleRowToggle(item?.company_id);
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
              <Tooltip label="Remove watchlist" className="text-xs">
                <div>
                  <HStack
                    spacing={8}
                    className="bg-neutral-20 flex h-6 w-6 cursor-not-allowed justify-center rounded-full"
                  >
                    <Icons.remove color="#6B7280" width={12} height={12} />
                  </HStack>
                </div>
              </Tooltip>
            </div>
          );
        case 'progress':
          return (
            <Tooltip
              hidden={item?.completeness_missing.length === 0}
              label={
                <div className="text-grey-600 max-w-[500px] whitespace-pre-wrap rounded-sm text-xs">
                  <p className="text-xs font-medium">Need more information:</p>
                  <ul className="ml-5 list-disc">
                    {item?.completeness_missing?.map((i: string, z: number) => {
                      return <li key={z}>{formatItem(i)}</li>;
                    })}
                  </ul>
                </div>
              }
            >
              <div>
                <ProgressBar process={item?.completeness.toFixed(0) || 0} />
              </div>
            </Tooltip>
          );

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
                <TextBody1>{shortenName(item?.note, 20) || '-'}</TextBody1>
              </div>
            </Tooltip>
          );
        case 'ICP':
          return (
            <Tooltip
              hidden={!(item.icp_name && item.icp_name.length > 20)}
              label={
                <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                  {item?.icp_name}
                </div>
              }
            >
              <div>
                <TextBody1>{shortenName(item?.icp_name, 20) || '-'}</TextBody1>
              </div>
            </Tooltip>
          );
        case 'insert_time':
          return <TextBody1>{item?.created_at ? moment(item.created_at).format('DD MMM, YYYY') : '-'}</TextBody1>;
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
              <p className="text-xs font-normal">
                {(item as any)[column?.title] ? shortenName(String((item as any)[column?.title]), 20) : '-'}
              </p>
            </Tooltip>
          );
      }
    },
    [companyId, item, countNotify]
  );

  return (
    <>
      <React.Fragment>
        <RowTable>
          <ItemRowTable indexRow={indexRow} tableLength={tableLength} className="text-center">
            <Checkbox checked={false} disabled />
          </ItemRowTable>
          {listHeaderWatchList.map((column, i) => (
            <ItemRowTable indexRow={indexRow} tableLength={tableLength} key={i}>
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
                      borderItemClassName="h-[3px] bottom-[-9px]"
                    />
                    <div className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <X
                        color="black"
                        size={14}
                        className="cursor-pointer"
                        onClick={() => handleRowToggle(item.company_id)}
                      />
                    </div>
                  </div>

                  <Show when={activeTab === 'company_news'}>
                    <CompanyNews companyId={companyId} />
                  </Show>
                  <Show when={activeTab === 'contact_news'}>
                    <ContactNews companyId={companyId} />
                  </Show>
                </div>
              </Wrapper>
            </div>
          </td>
        </tr>
      </React.Fragment>
    </>
  );
};
export default RowTableList;
