/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react';

import { useListNewsCompany } from '@/api/news';
import NewsCardCompany from '@/components/News/CompanyNewsCard';
import { Button, LoadingIcon } from '@/components/ui/button';
import Caption3 from '@/components/ui/typography/caption3';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { dataTags } from '@/features/watchlist/utils/const';

const CompanyNews = ({ id }: { id?: string }) => {
  const lastItemRef = useRef<HTMLDivElement>(null);
  const [paramsQuery, setParamsQuery] = useState<{ filter: string | undefined }>();
  const [valueTag, setValueTag] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [isOffset, setIsOffset] = useState<Number | null>(null);
  const {
    data: dataNews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListNewsCompany({
    variables: {
      ...paramsQuery,
      id: String(id),
      limit: 200,
      offset: isOffset as number,
    },
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
    enabled: !!id,
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

  const handleLoadMore = () => {
    fetchNextPage({ pageParam: dataNews?.pages?.[0]?.pagination?.total_item ?? 0 });
  };

  const handleSetValueTag = (value: string) => {
    if (valueTag.includes(value)) {
      setValueTag((prevState) => prevState.filter((item) => item !== value));
    } else {
      setValueTag((prevState) => [...prevState, value]);
    }
  };
  useEffect(() => {
    if (!isInitialLoad) {
      setIsOffset(0);
    }
    setParamsQuery((prev) => ({
      ...prev,
      filter: valueTag.length > 0 ? valueTag.join(',') : '',
    }));
  }, [valueTag]);

  return (
    <>
      <HStack spacing={12} className="sticky top-0 z-10 bg-white">
        {dataTags.map((item, index) => (
          <div
            key={index}
            className={cn(
              'bg-neutral-20 text-neutral-40 flex h-8 cursor-pointer items-center justify-center rounded-md px-2',
              valueTag.includes(item.value) && 'bg-main text-white'
            )}
            onClick={() => handleSetValueTag(item.value)}
          >
            <Caption3>{item.label}</Caption3>
          </div>
        ))}
      </HStack>
      <VStack className="max-h-[400px] gap-[23px] overflow-auto pb-2">
        <VStack spacing={8}>
          {dataNews?.pages?.map((page: any, pageIndex: number) =>
            page?.data?.map((item: any, index: number) => <NewsCardCompany item={item} key={`${pageIndex}-${index}`} />)
          )}
        </VStack>
        <Show when={(!dataNews?.pages || dataNews?.pages[0].data.length === 0) && isInitialLoad}>
          <div className="mb-5 flex items-center justify-center">
            <p className="text-xs font-medium">There have been no news in the last 7 days</p>
          </div>
        </Show>
        <Show
          when={
            ((!dataNews?.pages || dataNews?.pages[1]?.data?.length === 0) &&
              !isInitialLoad &&
              dataNews?.pages[0].data.length === 0) ||
            (!isInitialLoad && dataNews?.pages[0].data.length === 0 && dataNews?.pages.length === 1)
          }
        >
          <div className="mb-5 flex items-center justify-center">
            <p className="text-xs font-medium">There are no news recently</p>
          </div>
        </Show>

        {!isInitialLoad && hasNextPage && (
          <Show when={hasNextPage}>
            <div className="flex w-full items-center justify-center" ref={lastItemRef}>
              <div>
                <LoadingIcon />
              </div>
            </div>
          </Show>
        )}
        {isInitialLoad && (
          <div className="flex w-full items-center justify-center">
            <Button
              variant={'outline'}
              fullWidth
              onClick={() => {
                handleLoadMore();
                setIsInitialLoad(false);
              }}
            >
              See previous news
            </Button>
          </div>
        )}
      </VStack>
    </>
  );
};
export default CompanyNews;
