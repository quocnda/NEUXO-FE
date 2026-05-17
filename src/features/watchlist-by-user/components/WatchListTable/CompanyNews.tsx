/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { useListWatchNewsView } from '@/api/admin-watchlist';
import Empty from '@/components/Empty';
import CompanyNewsCard from '@/components/News/CompanyNewsCard';
import { LoadingIcon } from '@/components/ui/button';
import Base1 from '@/components/ui/typography/base1';
import { HStack, Show } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

import { dataTags } from '../../utils/const';

interface IProps {
  companyId: string;
}
const CompanyNews = (props: IProps) => {
  const { companyId } = props;
  const [queryParams] = useState<{ filter: string }>();
  const router = useRouter();
  const { id } = router.query;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const {
    data: dataNews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListWatchNewsView({
    variables: {
      ...queryParams,
      id: String(companyId),
      user_id: String(id),
      offset: 0,
      limit: 5,
    },
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
    enabled: !!companyId && !!id,
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

  const toggleTag = (value: string) => {
    if (selectedTags.includes(value)) {
      setSelectedTags((prevState) => prevState.filter((item) => item !== value));
      return;
    }
    setSelectedTags((prevState) => [...prevState, value]);
  };
  const isEmpty = dataNews?.pages[0]?.data?.length === 0;

  return (
    <>
      <HStack spacing={12} className="py-1">
        {dataTags.map((item, index) => (
          <div
            key={index}
            className={cn(
              'text-neutral-40 flex h-8 cursor-pointer items-center justify-center rounded-md bg-white px-2',
              selectedTags.includes(item.value) && 'bg-main text-white'
            )}
            onClick={() => toggleTag(item.value)}
          >
            <Base1 className="text-xs">{item.label}</Base1>
          </div>
        ))}
      </HStack>
      <div className="mb-5">
        {dataNews?.pages?.map((page: any, pageIndex: number) =>
          page?.data?.map((item: any, index: number) => (
            <div key={`${pageIndex}-${index}`} className="mb-2">
              <CompanyNewsCard item={item} />
            </div>
          ))
        )}
      </div>
      <Show when={hasNextPage}>
        <div className="flex h-10 w-full items-center justify-center">
          <div ref={lastItemRef}>
            <LoadingIcon />
          </div>
        </div>
      </Show>
      <Show when={isEmpty}>
        <div className="my-2 mb-5 flex items-center justify-center">
          <Empty content="There are no news recently" />
        </div>
      </Show>
    </>
  );
};

export default CompanyNews;
