/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';

import type { IBodyBlackList } from '@/api/company';
import { Icons } from '@/assets/icons';
import renderIcon from '@/components/RenderExternal';
import { Checkbox } from '@/components/ui/checkbox';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { formatAmount, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';
import type { TypeItemTable } from '@/types/common.type';

import { bgTrigger, getColorLabel } from '../../utils/style';
import ModalTrigger from '../Companies/ModalTrigger';

interface Props extends TypeItemTable {
  item: IBodyBlackList;
  refetch: () => void;
  checkExist: any;
  selectedIds: any[];
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  isDownloadAll: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
  columns: any;
  start_date: string | undefined;
}
const RowTableList = ({
  indexRow,
  tableLength,
  item,
  checkExist,
  selectedIds,
  setIsDownloadAll,
  isDownloadAll,
  setSelectedIds,
  columns,
  start_date,
}: Props) => {
  const isChecked = checkExist !== undefined || isDownloadAll;
  const [companyId, setCompanyId] = useState<string>('');

  const renderColumnContent = useCallback(
    (column: any) => {
      switch (column?.title) {
        case 'company':
          return (
            <div className="flex items-center gap-2">
              <TextBody1>{shortenName(item?.name, 15) || '-'}</TextBody1>
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
        case 'trigger':
          return (
            <div className="flex items-center gap-2">
              {item?.trigger?.map((t: string, index: React.Key | null | undefined) => (
                <ModalTrigger companyId={companyId} key={index} tag={t} start_date={start_date}>
                  <TextBody1
                    onClick={() => setCompanyId(item?.id)}
                    className={cn('flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold', bgTrigger(t))}
                  >
                    {t === 'funding'
                      ? `$ ${formatAmount(item?.funding_amount || 0)}`
                      : t.charAt(0).toUpperCase() + t.slice(1) || '-'}
                  </TextBody1>
                </ModalTrigger>
              ))}
            </div>
          );
        case 'label':
          const labels = Array.isArray(item?.label)
            ? item?.label
            : Array.isArray((item as any)?.labels)
              ? (item as any)?.labels
              : item?.label
                ? [item?.label]
                : [];
          return (
            <div className="flex items-center gap-3">
              {labels.slice(0, 2).map((label, index) => (
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

              {labels.length > 2 && (
                <Tooltip
                  label={
                    <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
                      {labels.slice(2).join(', ')}
                    </div>
                  }
                >
                  <div className="text-grey-500 text-neutral-40 flex h-[24px] items-center justify-center rounded-[6px] border border-[#6F767E66] px-2 text-xs font-medium">
                    + {(labels.length || 0) - 2}
                  </div>
                </Tooltip>
              )}
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
    [item, companyId]
  );

  return (
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
              setSelectedIds([...selectedIds, item?.id]);
            } else {
              setSelectedIds(selectedIds?.filter((s) => s !== item?.id));
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
  );
};

export default RowTableList;
