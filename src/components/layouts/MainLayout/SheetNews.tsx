/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useDisclosure } from '@mantine/hooks';
import { CircleEllipsis, Newspaper, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

import type { IDataNews } from '@/api/news';
import { useListNews } from '@/api/news';
import Empty from '@/components/Empty';
import { LoadingCustomIcon } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip } from '@/components/ui/tooltip';
import Title2 from '@/components/ui/typography/title2';
import { Show } from '@/components/ui/Utilities';
import { env } from '@/lib/const';

import SheetContentComponent from './SheetContent';

const SheetNews = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useListNews({
    variables: {
      page: 1,
      limit: 10,
    },
    enabled: opened,
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

  return (
    <>
      <Newspaper onClick={toggle} className="cursor-pointer" color="#6F767E" size={20} />
      <Sheet open={opened} onOpenChange={toggle}>
        <SheetContent className="max-h-screen overflow-auto bg-blue-400 pb-5">
          <SheetHeader>
            <SheetTitle className="sticky top-0 z-10 mt-0 bg-blue-400 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Title2>News</Title2>
                  <Tooltip label="See more">
                    <Link href={env.URL_SKYNET} target="_blank">
                      <CircleEllipsis size={18} className="cursor-pointer" />
                    </Link>
                  </Tooltip>
                </div>

                <button onClick={toggle}>
                  <X />
                </button>
              </div>
            </SheetTitle>
            {data?.pages && data?.pages[0]?.pagination?.total_item > 0 ? (
              <>
                {data?.pages?.map((page: any, pageIndex: number) =>
                  page?.data?.map((item: IDataNews, index: number) => (
                    <SheetContentComponent key={`${pageIndex}-${index}`} item={item} />
                  ))
                )}
              </>
            ) : (
              <div className="flex min-h-screen items-center justify-center">
                <Empty className="text-white" />
              </div>
            )}
            <Show when={hasNextPage}>
              <div className="flex h-20 w-full items-center justify-center">
                <div ref={lastItemRef}>
                  <LoadingCustomIcon />
                </div>
              </div>
            </Show>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SheetNews;
