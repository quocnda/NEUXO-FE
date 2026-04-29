/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { DialogTitle } from '@radix-ui/react-dialog';
import { Eye, Loader, Mail, SendHorizontalIcon, SquareEqualIcon, User } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

import type { IContactRecord } from '@/api/company';
import { useListContactRecord } from '@/api/company';
import { useExpandedRow } from '@/components/contexts/ExpandedRowContext';
import Empty from '@/components/Empty';
import Tag from '@/components/TagComponent';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import Info from '@/components/ui/Info';
import { Separator } from '@/components/ui/separator';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

interface IModalContactRecordProps {
  companyId: string;
}
const ModalContactRecord: FCC<IModalContactRecordProps> = ({ children, companyId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { expandedRow, toggleRow, setExpandedRow } = useExpandedRow();
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    limit: 10,
  });

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } = useListContactRecord({
    variables: { ...paramsQuery, id: String(companyId) },
    enabled: isOpen && !!companyId,
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
  });
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setExpandedRow('');
  };
  const lastItemRef = useRef<HTMLDivElement>(null);
  const handleRowClick = (rowId: string) => {
    toggleRow(rowId);
  };

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
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-100px)] max-w-screen-lg overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-blue">Communication Record</Tag>
          </DialogTitle>
        </DialogHeader>
        <VStack spacing={0}>
          {data?.pages && data?.pages[0]?.pagination?.total_item > 0 ? (
            <>
              {data?.pages?.map((page: any, pageIndex: number) =>
                page?.data?.map((item: IContactRecord, index: number) => (
                  <Info height="large" key={`${pageIndex}-${index}`} isExpandedRow={expandedRow === item?.id}>
                    <VStack spacing={12}>
                      <p className="text-xs font-normal">{moment(item?.time_send).format('DD MMM YYYY - hh:mm A')}</p>
                      <HStack spacing={8}>
                        <User size={12} />
                        <span className="text-xs font-normal">{item?.mail_send}</span>
                      </HStack>
                      <HStack spacing={8}>
                        <SendHorizontalIcon size={12} />
                        <span className="text-xs font-normal">{item?.mail_recieved}</span>
                      </HStack>
                      <HStack spacing={8}>
                        <Mail size={12} />
                        <span className="text-xs font-normal">{item?.subject}</span>
                      </HStack>
                      <HStack pos={'apart'}>
                        <HStack spacing={8}>
                          <SquareEqualIcon size={12} />
                          <span className="text-xs font-normal">{item?.status || '-'}</span>
                        </HStack>
                        <HStack spacing={8} className="cursor-pointer" onClick={() => handleRowClick(item?.id)}>
                          <Eye size={12} />
                          <span className="text-xs font-normal">View email details</span>
                        </HStack>
                      </HStack>
                    </VStack>
                    <VStack
                      style={{
                        maxHeight: expandedRow === item.id ? '700px' : '0',
                        opacity: expandedRow === item.id ? 1 : 0,
                        overflow: 'auto',
                        transition: 'max-height 0.3s ease, opacity 0.3s ease',
                        width: '100%',
                      }}
                    >
                      <Separator className="mt-5 bg-black" />
                      <p className="mb-4 text-xs font-semibold">{item?.subject}</p>
                      <div
                        dangerouslySetInnerHTML={{ __html: item?.content || '' }}
                        className="w-full text-xs font-normal"
                      />
                    </VStack>
                  </Info>
                ))
              )}
            </>
          ) : !isFetching ? (
            <Empty content="No communication record" />
          ) : (
            <HStack className="items-center justify-center">
              <Loader className="animate-spin" />
            </HStack>
          )}
        </VStack>
        <Show when={hasNextPage}>
          <div className="flex h-20 w-full items-center justify-center">
            <div ref={lastItemRef}>
              <Loader className="animate-spin" />
            </div>
          </div>
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContactRecord;
