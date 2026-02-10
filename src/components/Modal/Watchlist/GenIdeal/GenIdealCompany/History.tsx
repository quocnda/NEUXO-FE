import { useMutation } from '@tanstack/react-query';
import { isThisMonth, isThisWeek, isToday } from 'date-fns';
import { Check, MoreVertical, Trash, X } from 'lucide-react';
import React, { useState } from 'react';

import { editSubjectChat, type IResponseHistoryChat } from '@/api/watchlist';
import { Icons } from '@/assets/icons';
import Empty from '@/components/Empty';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';

import ModalRemoveChat from './ModalRemoveChat';

interface IHistoryProps {
  isSidebarOpen: boolean;
  listHistoryChat: IResponseHistoryChat | undefined;
  isEdit: string | null;
  toggleEdit: (id: string) => void;
  refetchListHistory?: () => void;
  setCompletionsId: React.Dispatch<React.SetStateAction<string | null>>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  completionsId: string | null;
  handleNews: () => Promise<void>;
  onClick?: () => void;
}

const History = ({
  isSidebarOpen,
  listHistoryChat,
  isEdit,
  toggleEdit,
  refetchListHistory,
  setCompletionsId,
  setMessages,
  completionsId,
  handleNews,
  onClick,
}: IHistoryProps) => {
  const [editValue, setEditValue] = useState('');
  const [valueSearch, setValueSearch] = useState('');
  const { mutate: editSubject } = useMutation(editSubjectChat, {
    onSuccess: () => {
      toggleEdit('');
      refetchListHistory?.();
    },
    onError: onMutateError,
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value);
  };

  const handleEditSubmit = (id: string) => {
    editSubject({ completion_id: String(id), subject: editValue });
  };

  const categorizeItems = (items: any[]) => {
    const filteredItems = items.filter((item) => {
      const subject = item?.subject?.toLowerCase() || '';
      return subject.includes(valueSearch.toLowerCase());
    });

    const todayItems = filteredItems.filter((item) => isToday(new Date(item.time_updated)));
    const thisWeekItems = filteredItems.filter(
      (item) => isThisWeek(new Date(item.time_updated)) && !isToday(new Date(item.time_updated))
    );
    const thisMonthItems = filteredItems.filter(
      (item) => isThisMonth(new Date(item.time_updated)) && !isThisWeek(new Date(item.time_updated))
    );
    const olderItems = filteredItems.filter((item) => !isThisMonth(new Date(item.time_updated)));

    return { todayItems, thisWeekItems, thisMonthItems, olderItems };
  };

  const { todayItems, thisWeekItems, thisMonthItems, olderItems } = categorizeItems(listHistoryChat?.data || []);

  const renderItems = (items: any[]) => {
    return items.map((item, index) => {
      const isColor = completionsId === item?.id && !isEdit;
      return (
        <HStack
          pos={'apart'}
          noWrap
          className={cn('cursor-pointer', isColor ? 'bg-main rounded-md p-2 text-white' : 'px-2 text-neutral-50')}
          key={index}
        >
          <Show when={isEdit === item?.id}>
            <HStack pos={'apart'} noWrap>
              <Input inputSize={'xs'} value={editValue} className="px-2" onChange={handleEditChange} />
              <HStack spacing={8} noWrap>
                <X
                  size={14}
                  color="red"
                  className="cursor-pointer hover:opacity-50"
                  onClick={() => toggleEdit(item?.id)}
                />
                <Check
                  size={14}
                  color="green"
                  className="cursor-pointer hover:opacity-50"
                  onClick={() => handleEditSubmit(item?.id)}
                />
              </HStack>
            </HStack>
          </Show>
          <Show when={isEdit !== item?.id}>
            <div
              onClick={() => {
                setCompletionsId(item?.id);
                setMessages(item?.completions?.map((msg: any) => ({ role: msg.role, content: msg.content })) || []);
                onClick?.();
              }}
              className="truncate text-xs font-normal hover:opacity-60"
            >
              {item?.subject || '--'}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <div className="size-4 flex items-center justify-center">
                  <MoreVertical width={16} height={16} className="cursor-pointer hover:opacity-60" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="border-white/15 flex w-fit flex-col gap-2 rounded border bg-white px-3 py-2"
                align="end"
              >
                <ModalRemoveChat
                  refetch={refetchListHistory}
                  completion_id={item?.id}
                  currentId={completionsId}
                  handleNews={handleNews}
                >
                  <HStack className="text-error-500 text-sm font-medium hover:opacity-60" spacing={8}>
                    <Trash size={16} />
                    <span>Delete</span>
                  </HStack>
                </ModalRemoveChat>
                <HStack
                  className="cursor-pointer text-sm font-medium text-black hover:opacity-60"
                  spacing={8}
                  onClick={() => {
                    toggleEdit(item?.id);
                    setEditValue(item?.subject || '');
                  }}
                >
                  <Icons.edit width={12} height={12} className="cursor-pointer hover:opacity-60" />
                  <span>Rename</span>
                </HStack>
              </PopoverContent>
            </Popover>
          </Show>
        </HStack>
      );
    });
  };

  const isEmpty = !todayItems.length && !thisWeekItems.length && !thisMonthItems.length && !olderItems.length;

  return (
    <div className={cn('h-full pl-2', isSidebarOpen ? 'w-[30%]' : 'w-0')}>
      <div
        className={`border-neutral-30 h-full max-h-[530px] overflow-auto rounded-md border bg-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? '' : 'hidden'
        }`}
      >
        <VStack spacing={12}>
          <div className="sticky top-0 bg-white p-2">
            <Input
              className="border-neutral-30 h-8 border-2 text-xs"
              placeholder="Search..."
              value={valueSearch}
              onChange={handleSearchChange}
            />
            <div className="absolute bottom-1/2 left-3 translate-y-1/2">
              <Icons.search fill="#fff" className="m-auto h-[1.1rem]" />
            </div>
          </div>
          <VStack spacing={12} className="px-2 pb-2">
            {isEmpty ? (
              <Empty />
            ) : (
              <>
                {todayItems.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-neutral-50">Today</p>
                    {renderItems(todayItems)}
                  </>
                )}

                {thisWeekItems.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-neutral-50">This week</p>
                    {renderItems(thisWeekItems)}
                  </>
                )}

                {thisMonthItems.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-neutral-50">This month</p>
                    {renderItems(thisMonthItems)}
                  </>
                )}

                {olderItems.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-neutral-50">Older</p>
                    {renderItems(olderItems)}
                  </>
                )}
              </>
            )}
          </VStack>
        </VStack>
      </div>
    </div>
  );
};

export default History;
