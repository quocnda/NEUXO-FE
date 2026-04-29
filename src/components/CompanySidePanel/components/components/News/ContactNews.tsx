/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react';

import { useListWatchContactNews } from '@/api/news';
import ContactNewsCard from '@/components/News/ContactNewsCard';
import { Button, LoadingIcon } from '@/components/ui/button';
import { Show, VStack } from '@/components/ui/Utilities';

const ContactNews = ({ id }: { id?: string }) => {
  const lastItemRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {
    data: dataNews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListWatchContactNews({
    variables: {
      id: String(id),
      offset: 0,
      limit: 5,
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

  return (
    <VStack className="max-h-[400px] gap-[23px] overflow-auto pb-2">
      <VStack spacing={8}>
        {dataNews?.pages?.map((page: any, pageIndex: number) =>
          page?.data?.map((item: any, index: number) => <ContactNewsCard item={item} key={`${pageIndex}-${index}`} />)
        )}
      </VStack>

      <Show when={!dataNews?.pages || dataNews?.pages[0].data.length === 0}>
        <div className="flex items-center justify-center">
          <p className="text-xs font-medium">There are no news recently</p>
        </div>
      </Show>
      {!isInitialLoad && hasNextPage && (
        <Show when={hasNextPage}>
          <div className="flex h-10 w-full items-center justify-center">
            <div ref={lastItemRef}>
              <LoadingIcon />
            </div>
          </div>
        </Show>
      )}
      {isInitialLoad && hasNextPage && (
        <div className="flex w-full items-center justify-center">
          <Button
            variant={'outline'}
            fullWidth
            onClick={() => {
              fetchNextPage();
              setIsInitialLoad(false);
            }}
          >
            See previous news
          </Button>
        </div>
      )}
    </VStack>
  );
};
export default ContactNews;
