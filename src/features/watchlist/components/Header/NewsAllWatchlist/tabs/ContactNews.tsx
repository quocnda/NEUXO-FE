/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';

import { seenNews, useListAllNews } from '@/api/news';
import Empty from '@/components/Empty';
import ContactNewsCardAll from '@/components/News/ContactNewsCardAll';
import { LoadingCustomIcon } from '@/components/ui/button';
import { Show, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';

interface IProps {
  refetchCount: () => void;
}
const ContactNews = (props: IProps) => {
  const { refetchCount } = props;
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevUnseenNewsIds = useRef<string[]>([]);
  const {
    data: dataNews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useListAllNews({
    variables: {
      offset: 0,
      limit: 15,
      type: 'contact',
    },
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
  });

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

  const { mutate } = useMutation(seenNews, {
    onSuccess: () => {
      refetch();
      refetchCount();
    },
    onError: onMutateError,
  });

  const unseenNewsIds =
    dataNews?.pages
      ?.flatMap((page: any) => page.data)
      ?.filter((item: any) => !item?.is_read)
      ?.map((item: any) => item.id) || [];
  const isEmpty = dataNews?.pages[0]?.data?.length === 0;

  useEffect(() => {
    if (unseenNewsIds.length > 0 && unseenNewsIds.join(',') !== prevUnseenNewsIds.current.join(',')) {
      mutate({
        ids: unseenNewsIds.join(','),
      });
      prevUnseenNewsIds.current = unseenNewsIds;
    }
  }, [unseenNewsIds, dataNews]);

  return (
    <VStack className="gap-[23px] overflow-auto pb-8">
      {isLoading ? (
        <VStack spacing={8}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <ContactNewsCardAll isLoading key={index} />
            ))}
        </VStack>
      ) : (
        <>
          <VStack spacing={8}>
            {dataNews?.pages?.map((page: any, pageIndex: number) =>
              page?.data?.map((item: any, index: number) => (
                <ContactNewsCardAll item={item} key={`${pageIndex}-${index}`} />
              ))
            )}
          </VStack>
          <Show when={hasNextPage}>
            <div className="flex w-full items-center justify-center">
              <div ref={lastItemRef}>
                <LoadingCustomIcon />
              </div>
            </div>
          </Show>
          <Show when={isEmpty}>
            <div className="my-2 mb-5 flex items-center justify-center">
              <Empty content="There are no news recently" />
            </div>
          </Show>
        </>
      )}
    </VStack>
  );
};

export default ContactNews;
