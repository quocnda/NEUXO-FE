/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useMutation } from '@tanstack/react-query';
import { Loader, Mail, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import type { IParamsNotification } from '@/api/notification';
import {
  seenNotification,
  toggleNotification,
  useCountEmailNotification,
  useDataToggle,
  useListNotification,
} from '@/api/notification';
import { onMutateError } from '@/lib/common';
import { env } from '@/lib/const';
import { debounceV2, removeUndefinedKeys } from '@/lib/utils';
import { useUserStore } from '@/stores';

import Empty from '../Empty';
import { LoadingIcon } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Switch } from '../ui/switch';
import { HStack, Show, VStack } from '../ui/Utilities';
import NotificationRecord from './NotificationRecord';

const EmailNotification = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsNotification>({
    page: 1,
    limit: 10,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { access_token } = useUserStore();
  const lastItemRef = useRef<HTMLDivElement>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch, isLoading } = useListNotification({
    variables: {
      ...paramsQuery,
      limit: 10,
    },
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
    enabled: !!isOpen,
  });

  const { data: countEmailNotification, refetch: refetchCount } = useCountEmailNotification();
  const { data: dataToggle, refetch: refetchToggle } = useDataToggle({
    enabled: isOpen,
  });

  const { mutate, isLoading: isLoadingToggle } = useMutation(toggleNotification, {
    onSuccess: () => {
      refetchToggle();
      refetch();
    },
    onError: onMutateError,
  });

  const { mutate: seenNoti } = useMutation(seenNotification, {
    onSuccess: () => {
      refetch();
      refetchCount();
    },
    onError: onMutateError,
  });

  const updateParamsQuery = (newParams: Partial<IParamsNotification>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };

  const handleSearch = debounceV2((e: any) => {
    updateParamsQuery({ search_key: e.target.value, page: 1 });
  }, 500);

  const unreadIds = Array.isArray(data?.pages)
    ? data.pages.flatMap((page: any) =>
        Array.isArray(page?.data) ? page.data.filter((item: any) => !item.is_read).map((item: any) => item.id) : []
      )
    : [];

  const unreadCount = unreadIds.length;

  const handleToggle = () => {
    mutate(!dataToggle?.is_subscribed);
  };

  const handlePopover = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      seenNoti(unreadIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, unreadCount, data]);

  useEffect(() => {
    const ws = new WebSocket(`${env.APP_SOCKET_URL}?token=${access_token}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = () => {
      refetch();
      refetchCount();
    };

    ws.onerror = () => {};

    ws.onclose = () => {};

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!lastItemRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            fetchNextPage();
          }, 500);
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(lastItemRef.current);
    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <Popover open={isOpen} onOpenChange={handlePopover}>
        <PopoverTrigger asChild>
          <div className="size-4 relative">
            <Mail className="cursor-pointer" color="#6F767E" size={20} />
            <Show when={countEmailNotification?.count_unseen_mails > 0}>
              <HStack className="absolute -top-1 left-4 flex min-h-[14px] w-fit min-w-[14px] items-center justify-center rounded-full bg-red-500 text-white">
                <span className="mt-[2px] text-[7px]">{countEmailNotification?.count_unseen_mails || 0}</span>
              </HStack>
            </Show>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="border-white/15 flex max-h-[calc(100vh-200px)] w-fit flex-col gap-2 overflow-auto rounded-md border bg-white"
          align="end"
        >
          <VStack spacing={12}>
            <VStack spacing={12} className="sticky top-0 bg-white p-5">
              <HStack pos={'apart'} spacing={8}>
                <div className="text-lg font-medium">Email Tracking Notification</div>
                {isLoadingToggle ? (
                  <Loader size="1rem" className="animate-spin" color="#6F767E" />
                ) : (
                  <Switch
                    checked={dataToggle?.is_subscribed || false}
                    onCheckedChange={() => handleToggle()}
                    className="bg-gray-200"
                  />
                )}
              </HStack>

              <p className="text-sm text-gray-700">Recent email opens and clicks</p>

              <Input
                placeholder="Search Contact Email, Email Subject"
                suffix={<Search size={16} color="#808080" />}
                variant={'default'}
                className="h-9 text-xs"
                onChange={handleSearch}
              />
            </VStack>
            <VStack spacing={12} className="px-5 pb-5">
              {isLoading ? (
                <div className="flex h-12 items-center justify-center">
                  <LoadingIcon />
                </div>
              ) : (
                <>
                  {data?.pages?.map((page: any, pageIndex: number) =>
                    page?.data?.map((item: any, index: number) => (
                      <NotificationRecord key={`${pageIndex}-${index}`} item={item} dataToggle={dataToggle} />
                    ))
                  )}

                  <Show when={hasNextPage}>
                    <div className="flex h-10 w-full items-center justify-center">
                      <div ref={lastItemRef}>
                        <LoadingIcon />
                      </div>
                    </div>
                  </Show>
                  <Show when={data?.pages[0]?.data?.length === 0 || !data}>
                    <div className="flex items-center justify-center">
                      <Empty content="No data" />
                    </div>
                  </Show>
                </>
              )}
            </VStack>
          </VStack>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default EmailNotification;
