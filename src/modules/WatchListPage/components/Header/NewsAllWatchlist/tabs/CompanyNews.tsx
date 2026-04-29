/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';

import { seenNews, useListAllNews } from '@/api/news';
import Empty from '@/components/Empty';
import NewsCardCompanyAll from '@/components/News/CompanyNewsCardAll';
import { LoadingCustomIcon } from '@/components/ui/button';
import Base1 from '@/components/ui/typography/base1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';
import { dataTags } from '@/modules/WatchListPage/utils/const';

interface IProps {
  refetchCount: () => void;
}
const CompanyNews = (props: IProps) => {
  const { refetchCount } = props;
  const [paramsQuery, setParamsQuery] = useState<{ filter: string }>();
  const [valueTag, setValueTag] = useState<string[]>([]);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevUnseenNewsIds = useRef<string[]>([]);
  const {
    data: dataNews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useListAllNews({
    variables: {
      ...paramsQuery,
      offset: 0,
      limit: 15,
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

  const handleSetValueTag = (value: string) => {
    if (valueTag.includes(value)) {
      setValueTag((prevState) => prevState.filter((item) => item !== value));
    } else {
      setValueTag((prevState) => [...prevState, value]);
    }
  };

  const unseenNewsIds =
    dataNews?.pages
      ?.flatMap((page: any) => page.data)
      ?.filter((item: any) => !item?.is_read)
      ?.map((item: any) => item.id) || [];

  useEffect(() => {
    setParamsQuery({ filter: valueTag.join(',') });
  }, [valueTag]);

  useEffect(() => {
    if (unseenNewsIds.length > 0 && unseenNewsIds.join(',') !== prevUnseenNewsIds.current.join(',')) {
      mutate({
        ids: unseenNewsIds.join(','),
      });
      prevUnseenNewsIds.current = unseenNewsIds;
    }
  }, [unseenNewsIds, dataNews]);

  return (
    <>
      <HStack spacing={12}>
        {dataTags.map((item, index) => (
          <div
            key={index}
            className={cn(
              'text-neutral-40 flex h-8 cursor-pointer items-center justify-center rounded-md bg-white px-2',
              valueTag.includes(item.value) && 'bg-yellow-500 text-white'
            )}
            onClick={() => handleSetValueTag(item.value)}
          >
            <Base1 className="text-xs">{item.label}</Base1>
          </div>
        ))}
      </HStack>
      <VStack className="gap-[23px] overflow-auto pb-2">
        {isLoading ? (
          <VStack spacing={8}>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <NewsCardCompanyAll isLoading key={index} />
              ))}
          </VStack>
        ) : (
          <>
            <VStack spacing={8}>
              {dataNews?.pages?.map((page: any, pageIndex: number) =>
                page?.data?.map((item: any, index: number) => (
                  <NewsCardCompanyAll item={item} key={`${pageIndex}-${index}`} />
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

            <Show when={dataNews?.pages[0].pagination?.total_item === 0}>
              <Empty content="There are no news recently" className="text-white" />
            </Show>
          </>
        )}
      </VStack>
    </>
  );
};

export default CompanyNews;
