/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useNotificationAll } from '@/api/company';
import { seenAllNews } from '@/api/news';
import { Icons } from '@/assets/icons';
import Tabs from '@/components/Tabs';
import { LoadingIcon } from '@/components/ui/buttonlimit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatItem, onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';

import { tabAllNews } from './const';
import CompanyNews from './tabs/CompanyNews';
import ContactNews from './tabs/ContactNews';

const NewsAllWatchlist = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<number | string>(tabAllNews[0].value);
  const { data: countNotify, refetch: refetchCount } = useNotificationAll({ refetchOnMount: true });
  const { mutate, isLoading } = useMutation(seenAllNews, {
    onError: onMutateError,
    onSuccess: () => {
      refetchCount();
      toast.success('Mark all as read successfully!');
    },
  });
  const hasNotifications = Number(countNotify) > 0;
  const isCompanyTab = activeTab === 'company';
  const handleSeenAll = () => {
    mutate({
      type: String(activeTab),
    });
  };
  const handleTabChange = (value: number | string) => setActiveTab(value);
  return (
    <>
      <div className="relative" onClick={toggle}>
        <HStack spacing={8} className="bg-main flex h-7 w-7 justify-center rounded-full">
          <Icons.news strokeWidth={2} className={cn('cursor-pointer hover:opacity-60')} width={14} height={14} />
        </HStack>
        <Show when={hasNotifications}>
          <HStack className="absolute -top-1 left-5 flex min-h-[14px] w-fit min-w-[14px] items-center justify-center rounded-full bg-red-500 text-white">
            <span className="mt-[2px] text-[7px]">{countNotify || 0}</span>
          </HStack>
        </Show>
      </div>

      <Sheet open={opened} onOpenChange={toggle}>
        <SheetContent className="flex max-h-screen flex-col gap-4 overflow-auto bg-blue-400 px-6 pb-6">
          <SheetHeader className="sticky top-0 z-10 mt-0 flex flex-col gap-4 bg-blue-400 pt-6">
            <SheetTitle>
              <div className="relative">
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  {isCompanyTab ? (
                    <Icons.company color="white" width={18} height={18} />
                  ) : (
                    <Icons.contact color="white" width={18} height={18} />
                  )}
                  {formatItem(activeTab as string)}
                </div>
                <div className="absolute right-0 top-[20%]">
                  <Show when={isLoading}>
                    <LoadingIcon className="text-white" />
                  </Show>
                  <Show when={!isLoading}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button>
                          <Icons.ellipsis color="white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 whitespace-nowrap"
                          onClick={handleSeenAll}
                        >
                          <Check size={14} /> <p className="text-xs">Mark as all read</p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Show>
                </div>
              </div>
            </SheetTitle>
            <Tabs
              onChange={handleTabChange}
              value={activeTab}
              data={tabAllNews}
              layoutId="tab-sidebar-searchs"
              className="p-2"
              borderItemClassName="h-[3px] bottom-[-9px] bg-yellow-400"
              activeItemClassName="active relative inline-block pb-2 text-yellow-400"
              inactiveItemClassName="text-white relative inline-block border-transparent pb-2 hover:text-yellow-400"
            />
          </SheetHeader>

          <VStack spacing={24}>
            <Show when={activeTab === 'company'}>
              <CompanyNews refetchCount={refetchCount} />
            </Show>
            <Show when={activeTab === 'contact'}>
              <ContactNews refetchCount={refetchCount} />
            </Show>
          </VStack>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NewsAllWatchlist;
