import { useMutation } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import type { IDataLumaGuests } from '@/api/company';
import { addNoteGuest, updateEmailGuest } from '@/api/guest';
import { Icons } from '@/assets/icons';
import { useExpandedRow } from '@/components/contexts/ExpandedRowContext';
import renderIcon from '@/components/RenderExternal';
import { LoadingIcon } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { HoverCardComponent } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { onMutateError, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';
import { colorStatus } from '@/modules/EmailTracking/utils/getStatus';
import type { TypeItemTable } from '@/types/common.type';

import ModalAddNoteGuest from './ModalAddNoteGuest';

interface Props extends TypeItemTable {
  item: IDataLumaGuests;
  checkExist: string | undefined;
  isDownloadAll: boolean;
  setSelectedIds?: React.Dispatch<React.SetStateAction<any[]>>;
  setIsDownloadAll?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIds?: any[];
}
const RowTableModalGuestByEvent = (props: Props) => {
  const { item, indexRow, tableLength, checkExist, isDownloadAll, setSelectedIds, setIsDownloadAll, selectedIds } =
    props;
  const [valueNote, setValueNote] = useState<string>('');
  const [currentEmailGuest, setCurrentEmailGuest] = useState<string>(item?.email);
  const [originalEmailGuest, setOriginalEmailGuest] = useState<string>(item?.email);
  const { expandedRow, toggleRow } = useExpandedRow();
  const { mutate: addNote } = useMutation(addNoteGuest, {
    onError: onMutateError,
  });

  const { mutate: updateEmail, isLoading } = useMutation(updateEmailGuest, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Update email successfully!');
    },
  });

  const handleToggleEditEmail = useCallback(
    (id: string) => {
      if (expandedRow === id) {
        setCurrentEmailGuest(originalEmailGuest);
      } else {
        setOriginalEmailGuest(currentEmailGuest);
      }
      toggleRow(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandedRow, originalEmailGuest, currentEmailGuest]
  );

  const handleSaveEmail = (id_guest: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!currentEmailGuest) {
      toast.error('Email is required');
      return;
    }

    if (!emailRegex.test(currentEmailGuest)) {
      toast.error('Invalid email format');
      return;
    }
    updateEmail(
      {
        guest_id: id_guest,
        email: currentEmailGuest,
      },
      {
        onSuccess: () => {
          setOriginalEmailGuest(currentEmailGuest);
          toggleRow(id_guest);
        },
      }
    );
  };
  return (
    <RowTable rowClassName={cn((checkExist !== undefined || isDownloadAll) && 'bg-blue-50 hover:bg-blue-50')}>
      <ItemRowTable
        indexRow={indexRow}
        tableLength={tableLength}
        className="sm:bg-neutral-10 w-[50px] border-l text-center sm:sticky sm:left-[-1px] sm:z-10 sm:border-r-0"
      >
        <Checkbox
          checked={checkExist !== undefined && checkExist !== 'Email unavailable'}
          disabled={!item?.email || item?.email === 'Email unavailable'}
          onCheckedChange={(e: any) => {
            setIsDownloadAll?.(false);
            if (e) {
              setSelectedIds?.([...(selectedIds as any[]), item?.email]);
            } else {
              setSelectedIds?.(selectedIds?.filter((s) => s !== item?.email) as any[]);
            }
          }}
        />
      </ItemRowTable>
      <ItemRowTable
        indexRow={indexRow}
        tableLength={tableLength}
        className="bg-neutral-10 sticky left-[-1px] z-10 border-l-0 border-r-0 before:absolute before:right-0 before:top-0 before:h-full before:w-[8px] before:shadow-[3px_0px_4.1px_0px_#0000000F] sm:left-[47px]"
      >
        <Tooltip
          label={item?.name}
          hidden={!(item?.name && item?.name.length > 15)}
          className="max-w-[200px] whitespace-pre-wrap text-xs"
        >
          <div>
            <TextBody1 className="text-xs">{shortenName(item?.name ?? '-', 15)}</TextBody1>
          </div>
        </Tooltip>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <div className="flex items-center gap-3">
          {renderIcon(Icons.website, item?.website, () => window.open(item?.website, '_blank'))}
          {renderIcon(Icons.xTwitter, item?.twitter_url, () => window.open(item?.twitter_url, '_blank'))}
          {renderIcon(Icons.linkedin, item?.linkedin_url, () => window.open(item?.linkedin_url, '_blank'))}
        </div>
      </ItemRowTable>
      <ItemRowTable tableLength={tableLength} indexRow={indexRow}>
        <Tooltip hidden={!(item?.role && item?.role.length > 20)} side="bottom" label={item?.role}>
          <div>
            <TextBody1 className="text-xs">{shortenName(item?.role, 20) || '-'}</TextBody1>
          </div>
        </Tooltip>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        {item?.email_status === 'EMAIL UNAVAILABLE' || item?.email_input_from_user ? (
          <>
            <Show when={expandedRow === item?.id}>
              <HStack pos={'apart'} noWrap>
                <Input
                  inputSize={'xs'}
                  className="h-6"
                  value={currentEmailGuest === 'Email unavailable' ? '' : currentEmailGuest}
                  onChange={(e) => setCurrentEmailGuest(e.target.value)}
                />
                <HStack spacing={8} noWrap>
                  <X
                    size={14}
                    color="red"
                    className="cursor-pointer hover:opacity-50"
                    onClick={() => handleToggleEditEmail(item?.id)}
                  />
                  {isLoading ? (
                    <LoadingIcon size={'14px'} />
                  ) : (
                    <Check
                      size={14}
                      color="green"
                      className="cursor-pointer hover:opacity-50"
                      onClick={() => handleSaveEmail(item?.id)}
                    />
                  )}
                </HStack>
              </HStack>
            </Show>
            <Show when={expandedRow !== item?.id}>
              <TextBody1 className="cursor-pointer hover:opacity-50" onClick={() => handleToggleEditEmail(item?.id)}>
                {currentEmailGuest}
              </TextBody1>
            </Show>
          </>
        ) : (
          <TextBody1>{item?.email ?? '-'}</TextBody1>
        )}
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <Tooltip
          hidden={!(item?.company__name && item?.company__name.length > 20)}
          side="bottom"
          label={item?.company__name}
        >
          <div>
            <TextBody1 className="text-xs">{shortenName(item?.company__name, 20) ?? '-'}</TextBody1>
          </div>
        </Tooltip>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <Tooltip
          hidden={!(item?.company__headquarters && item?.company__headquarters.length > 20)}
          side="bottom"
          label={item?.company__headquarters}
        >
          <div>
            <TextBody1 className="text-xs">{shortenName(item?.company__headquarters, 20) || '-'}</TextBody1>
          </div>
        </Tooltip>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1 className="text-xs">{item?.company__country ?? '-'}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <TextBody1 className="text-xs">{item?.category ?? '-'}</TextBody1>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <Tooltip
          hidden={!(item?.note && item?.note.length > 20)}
          label={
            <div className="text-grey-600 max-w-[200px] whitespace-pre-wrap rounded-sm px-1.5 text-xs">
              {item?.note}
            </div>
          }
        >
          <div>
            <ModalAddNoteGuest
              addNote={addNote}
              guest_id={item?.id}
              guest_name={item?.name}
              valueNote={valueNote}
              onSuccess={(newNote) => {
                item.note = newNote;
                setValueNote(newNote);
              }}
            >
              <TextBody1
                className="cursor-pointer"
                onClick={() => {
                  setValueNote(item?.note);
                }}
              >
                {shortenName(item?.note, 20) || '-'}
              </TextBody1>
            </ModalAddNoteGuest>
          </div>
        </Tooltip>
      </ItemRowTable>
      <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
        <HStack spacing={12} noWrap>
          {colorStatus(item?.email_status)}
          <Show when={item?.email_status !== 'EMAIL UNAVAILABLE' && item?.email_status !== 'UNREACHED'}>
            <HoverCardComponent
              label={
                <VStack spacing={24} className="max-h-[400px] overflow-auto">
                  {item?.email_information?.map((i, z) => (
                    <VStack spacing={8} key={z}>
                      <HStack noWrap className="text-xs">
                        Contact email: <span className="font-medium">{i?.contact_email || '-'}</span>
                      </HStack>
                      <HStack noWrap className="text-xs">
                        Sent by: <span className="font-medium">{i?.send_by || '-'}</span>
                      </HStack>
                      <HStack noWrap className="text-xs">
                        Last activity date:{' '}
                        <span className="font-medium">{moment(i?.last_activity).format('DD MMM, YYYY') || '-'}</span>
                      </HStack>
                      <HStack noWrap className="text-xs">
                        Email status: <span className="font-medium">{i?.email_status || '-'}</span>
                      </HStack>
                    </VStack>
                  ))}
                </VStack>
              }
              btnClassName="w-full"
            >
              <div>
                <Icons.infor width={12} height={12} />
              </div>
            </HoverCardComponent>
          </Show>
        </HStack>
      </ItemRowTable>
    </RowTable>
  );
};

export default RowTableModalGuestByEvent;
