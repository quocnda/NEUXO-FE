/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { Mail, Search, SendHorizonal, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { checkEmailAutomate } from '@/api/automate-email';
import type { IDataLumaGuests, IParamsMatchingCompaniesList } from '@/api/company';
import { downloadCSVGuests, useListLumaGuests } from '@/api/company';
import { useGetFilterColumns } from '@/api/guest';
import Empty from '@/components/Empty';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import { TablePagination, TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { onMutateError, shortenName } from '@/lib/common';
import { cn } from '@/lib/utils';
import ModalSentMail from '@/features/email-tracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';
import type { FCC } from '@/types';
import { listHeaderGuestByEvent } from '@/utils/const';

import DownloadCSVButton from '../../DownloadCSVButton';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Tooltip } from '../../ui/tooltip';
import ModalAutomateEmail from '../Email/ModalAutomateEmail';
import ModalCheckEmailAutomate from '../Email/ModalCheckEmailAutomate';
import RowTableModalGuestByEvent from './RowTableModalGuestByEvent';

interface IModalGuestsByEventProps {
  event_id: string | undefined;
  event_name: string | undefined;
  setSelectedIds?: React.Dispatch<React.SetStateAction<any[]>>;
  selectedIds?: any[];
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalGuestsByEvent: FCC<IModalGuestsByEventProps> = ({
  event_id,
  event_name,
  setSelectedIds,
  selectedIds,
  setIsOpen,
}) => {
  const defaultQuery: IParamsMatchingCompaniesList = {
    page: 1,
    limit: 50,
    orderByVal: 'DESC',
  };
  const { user } = useUserStore.getState();
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const [paramsQuery, setParamsQuery] = useState<IParamsMatchingCompaniesList>(defaultQuery);
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [isOpenModalAutomateEmail, setIsOpenModalAutomateEmail] = useState(false);
  const [isOpenModalCheckEmailAutomate, setIsOpenModalCheckEmailAutomate] = useState(false);
  const [isListEmailExist, setIsListEmailExist] = useState<any[]>([]);

  const { data: dataFilterColumn } = useGetFilterColumns({
    variables: {
      event_id: event_id as string,
    },
    refetchOnMount: true,
    enabled: !!event_id,
  });

  const { data, isFetching } = useListLumaGuests({
    variables: {
      ...paramsQuery,
      event_id,
    },
    refetchOnMount: true,
    enabled: !!event_id,
  });

  const debouncedSearch = useCallback(
    debounce((value) => {
      setParamsQuery((prev) => ({ ...prev, search_key: value }));
    }, 500),
    []
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const temp: any = [];
    if (isDownloadAll) {
      data?.data?.forEach((s: IDataLumaGuests) => {
        temp.push(s.email);
      });
    } else {
      selectedIds?.forEach((s: any) => {
        temp.push(s);
      });
    }

    setSelectedIds?.(temp);
  }, [isDownloadAll, data]);

  const getDataFilter = [
    {
      name: 'category',
      value: dataFilterColumn?.category?.map((s: any) => {
        return { label: s, value: s };
      }),
    },
    {
      name: 'role',
      value: dataFilterColumn?.role?.map((s: any) => {
        return { label: s, value: s };
      }),
    },
    {
      name: 'headquarter',
      value: dataFilterColumn?.headquarter?.map((s: any) => {
        return { label: s, value: s };
      }),
    },
    {
      name: 'country',
      value: dataFilterColumn?.country?.map((s: any) => {
        return { label: s, value: s };
      }),
    },
    {
      name: 'email_status',
      value: dataFilterColumn?.email_status?.map((s: any) => {
        return { label: s.slice(0, 1).toUpperCase() + s.toLowerCase().slice(1), value: s };
      }),
    },
  ];

  const columns = listHeaderGuestByEvent?.map((item: any) => {
    return {
      title: item.title,
      key: item?.key,
      type: item?.type || '',
      pin: item?.pin,
      canFilter: item?.canFilter,
      filter_type: item?.filter_type,
      dataFilter: getDataFilter.find((s) => s.name === item?.title)?.value,
    };
  });

  const listEmailAction = selectedIds?.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

  const { mutate } = useMutation(checkEmailAutomate, {
    onSuccess: (res) => {
      if (res?.message === 'Success') {
        setIsOpenModalAutomateEmail(true);
      } else if (res?.message === 'Unsuccess') {
        setIsOpenModalCheckEmailAutomate(true);
        setIsListEmailExist(res?.data);
      }
    },
    onError: onMutateError,
  });

  return (
    <>
      <HStack noWrap pos="apart">
        <div className="truncate whitespace-pre-wrap text-lg font-medium">
          <Tooltip
            hidden={!(event_name && String(event_name).length > 30)}
            side="bottom"
            label={`Guest List for ${event_name}`}
          >
            <p>Guest List for {shortenName(event_name, 30)}</p>
          </Tooltip>
        </div>
        <div
          className="bg-neutral-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
          onClick={() => {
            setIsOpen?.(false);
            setSelectedIds?.([]);
          }}
        >
          <X className="h-4 w-4" color="#6B7280" />
        </div>
      </HStack>

      <Wrapper className="mt-2">
        <VStack spacing={12}>
          <HStack pos={'apart'}>
            <div className="max-w-[200px]">
              <Input
                placeholder={'Search'}
                name="search"
                className="border-neutral-30 h-8 border-2 text-xs"
                suffix={<Search size={16} color="#808080" />}
                onChange={handleInputChange}
                value={searchValue}
              />
            </div>
            <HStack spacing={8}>
              <Show when={!user?.has_mail_app_pass}>
                <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
                  <Button
                    className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-normal"
                    disabled={selectedIds?.length === 0}
                  >
                    <Mail size={16} />
                    Send Email
                  </Button>
                </ModalLoginEmail>
                <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
                  <Button className="flex h-10 items-center gap-2 text-xs" disabled={selectedIds?.length === 0}>
                    <SendHorizonal size={18} /> Automate Email
                  </Button>
                </ModalLoginEmail>
              </Show>
              <Show when={user?.has_mail_app_pass}>
                <ModalSentMail
                  setIsOpenSendEmail={setIsOpenSendEmail}
                  isOpenSendEmail={isOpenSendEmail}
                  contact_email={selectedIds?.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}
                  event_id={event_id}
                >
                  <Button className="flex h-8 items-center gap-2" disabled={selectedIds?.length === 0}>
                    <Mail size={16} />
                    Send Email
                  </Button>
                </ModalSentMail>
                <Button
                  onClick={() => mutate(listEmailAction || [])}
                  className="flex h-8 items-center gap-2 text-xs"
                  disabled={selectedIds?.length === 0}
                >
                  <SendHorizonal size={18} />
                  Automate Email
                </Button>
              </Show>
              <DownloadCSVButton
                className={cn('border-neutral-30 text-neutral-40 h-8 rounded-md border-2 text-xs font-medium')}
                iconClassName="w-[1.125rem]"
                handleDownloadCSV={() =>
                  downloadCSVGuests({
                    ...paramsQuery,
                    search_key: searchValue,
                    event_id,
                  })
                }
              />
            </HStack>
          </HStack>
          <CommonTable
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
            listHeader={columns}
            isPinCheckbox
            checkBox={
              <Checkbox
                checked={isDownloadAll}
                onCheckedChange={(e) => {
                  if (e) {
                    setIsDownloadAll(true);
                  } else {
                    setIsDownloadAll(false);
                    setSelectedIds?.([]);
                  }
                }}
              />
            }
            bodyComponent={
              <>
                <TableSkeleton loading={isFetching} col={(listHeaderGuestByEvent?.length ?? 0) + 1} />
                <Show when={!isFetching}>
                  {data?.data?.map((item: IDataLumaGuests, index: number) => {
                    const checkExist = selectedIds?.find((s) => s === item?.email);
                    return (
                      <RowTableModalGuestByEvent
                        key={index}
                        indexRow={index}
                        item={item}
                        checkExist={checkExist}
                        isDownloadAll={isDownloadAll}
                        tableLength={data?.data?.length}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        setIsDownloadAll={setIsDownloadAll}
                      />
                    );
                  })}
                </Show>
              </>
            }
            footerComponent={
              <Show when={data && data?.data?.length !== 0 && !isFetching}>
                <TablePagination
                  onPageChange={(page) => setParamsQuery({ ...paramsQuery, page })}
                  onPageSizeChange={(limit) => setParamsQuery({ ...paramsQuery, limit: Number(limit) })}
                  pagination={{ ...data?.pagination, current_page: paramsQuery.page, limit: paramsQuery.limit }}
                />
              </Show>
            }
          />
        </VStack>
        <Show when={!isFetching && (data?.data?.length === 0 || !data)}>
          <Empty className="mb-5" />
        </Show>
      </Wrapper>
      <ModalAutomateEmail
        listEmailAction={(selectedIds || []).filter(
          (item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item) && !isListEmailExist.includes(item)
        )}
        isOpen={isOpenModalAutomateEmail}
        setIsOpen={setIsOpenModalAutomateEmail}
        event_id={event_id}
        source="event"
      />
      <ModalCheckEmailAutomate
        isOpen={isOpenModalCheckEmailAutomate}
        setIsOpen={setIsOpenModalCheckEmailAutomate}
        setIsOpenModalAutomateEmail={setIsOpenModalAutomateEmail}
        listEmailAction={(selectedIds || []).filter(
          (item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item) && !isListEmailExist.includes(item)
        )}
      />
    </>
  );
};

export default ModalGuestsByEvent;
