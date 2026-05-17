/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { useListWatchContactNewsView } from '@/api/admin-watchlist';
import Empty from '@/components/Empty';
import ContactNewsCard from '@/components/News/ContactNewsCard';
import { LoadingIcon } from '@/components/ui/button';
import { Show } from '@/components/ui/Utilities';

interface IProps {
  companyId: string;
}
const ContactNews = (props: IProps) => {
  const { companyId } = props;
  const router = useRouter();
  const { id } = router.query;
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevUnseenNewsIds = useRef<string[]>([]);
  const {
    data: dataNews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useListWatchContactNewsView({
    variables: {
      id: String(companyId),
      user_id: String(id),
      offset: 0,
      limit: 5,
    },
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
    enabled: !!companyId,
  });
  const isEmpty = dataNews?.pages[0]?.data?.length === 0;

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
    <div className="px-3">
      <div className="mb-5">
        {dataNews?.pages?.map((page: any, pageIndex: number) =>
          page?.data?.map((item: any, index: number) => (
            <div key={`${pageIndex}-${index}`} className="mb-2">
              <ContactNewsCard item={item} />
            </div>
          ))
        )}
      </div>
      <Show when={hasNextPage}>
        <div className="flex h-20 w-full items-center justify-center">
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
    </div>
  );
};

export default ContactNews;
