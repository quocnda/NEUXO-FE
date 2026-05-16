/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';

import { seenNews, useListWatchNews } from '@/api/news';
import Empty from '@/components/Empty';
import NewsCardCompany from '@/components/News/CompanyNewsCard';
import { LoadingIcon } from '@/components/ui/button';
import Base1 from '@/components/ui/typography/base1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';

import { dataTags } from '../utils/const';

interface IProps {
  companyId: string;
  refetchCount: () => void;
}
const CompanyNews = (props: IProps) => {
  const { companyId, refetchCount } = props;
  const [paramsQuery, setParamsQuery] = useState<{ filter: string }>();
  const [valueTag, setValueTag] = useState<string[]>([]);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevUnseenNewsIds = useRef<string[]>([]);
  const {
    data: dataNews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useListWatchNews({
    variables: {
      ...paramsQuery,
      id: String(companyId),
      offset: 0,
      limit: 5,
    },
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
    enabled: !!companyId,
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
      <HStack spacing={12} className="py-1">
        {dataTags.map((item, index) => (
          <div
            key={index}
            className={cn(
              'text-neutral-40 flex h-8 cursor-pointer items-center justify-center rounded-md bg-white px-2',
              valueTag.includes(item.value) && 'bg-main text-white'
            )}
            onClick={() => handleSetValueTag(item.value)}
          >
            <Base1 className="text-xs">{item.label}</Base1>
          </div>
        ))}
      </HStack>
      <VStack className="max-h-[300px] gap-[23px] overflow-auto py-2">
        {isLoading ? (
          <div className="flex h-12 items-center justify-center">
            <LoadingIcon />
          </div>
        ) : (
          <>
            <VStack spacing={8}>
              {dataNews?.pages?.map((page: any, pageIndex: number) =>
                page?.data?.map((item: any, index: number) => (
                  <NewsCardCompany item={item} key={`${pageIndex}-${index}`} />
                ))
              )}
            </VStack>
            <Show when={hasNextPage}>
              <div className="flex h-10 w-full items-center justify-center">
                <div ref={lastItemRef}>
                  <LoadingIcon />
                </div>
              </div>
            </Show>
            <Show when={dataNews?.pages[0]?.data?.length === 0}>
              <div className="flex items-center justify-center">
                <Empty content="There are no news recently" />
              </div>
            </Show>
          </>
        )}
      </VStack>
    </>
  );
};

export default CompanyNews;
