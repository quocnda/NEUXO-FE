import { ChevronRightIcon, MapPinIcon, Users2 } from 'lucide-react';
import moment from 'moment-timezone';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { IDataLumaEvents } from '@/api/company';
import ModalGuestsByEvent from '@/components/Modal/Event/ModalGuestsByEvent';
import { Button } from '@/components/ui/button';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { Tooltip } from '@/components/ui/tooltip';
import { Show, VStack } from '@/components/ui/Utilities';
import { formatStatus } from '@/lib/common';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores';

interface IProps {
  item?: IDataLumaEvents;
  loading?: boolean;
  setSelectedIds?: React.Dispatch<React.SetStateAction<any[]>>;
  selectedIds?: any[];
  paramsQuery?: any;
}
const colorStatus = (status: string) => {
  switch (status) {
    case 'ONGOING':
      return 'text-green-500';
    case 'UPCOMING':
      return 'text-yellow-500';
    case 'PAST':
      return 'text-red-500';
    default:
      return 'text-[#374151]';
  }
};
const CardEvent = ({ item, loading, setSelectedIds, selectedIds, paramsQuery }: IProps) => {
  const router = useRouter();
  const { fullSidebar } = useLayoutStore();
  const { event_id } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const [event_info, setEvent_info] = React.useState<{ event_name: string | undefined; event_id: string | undefined }>({
    event_name: '',
    event_id: '',
  });

  const handleRedirectEventById = () => {
    if (!event_id && item?.main_event__id) {
      localStorage.setItem('lumaEventsPage', paramsQuery.page.toString());
      router.push(`/luma-events/event-detail/${item?.main_event__id}?event_name=${item?.event_parent}`);
    }
  };

  return (
    <div className="flex max-w-md flex-col justify-between overflow-hidden rounded-lg border border-gray-300 bg-white">
      <VStack spacing={4}>
        <SkeletonWrapper loading={loading} className="h-36 w-full">
          <Image
            className="h-32 w-full object-cover"
            src={item?.event_image ?? '/images/no-banner.jpg'}
            alt="Event Image"
            width={400}
            height={0}
            placeholder="blur"
            blurDataURL="/images/no-banner.jpg"
            loading="lazy"
          />
        </SkeletonWrapper>
        <div className="px-2 py-2 sm:px-4">
          <SkeletonWrapper loading={loading}>
            <Show when={!!item?.status}>
              <div className="mb-2 flex items-center font-semibold text-green-600">
                <span className={cn('rounded-full text-xs', colorStatus(item?.status || ''))}>
                  {formatStatus(item?.status)}
                </span>
              </div>
            </Show>
          </SkeletonWrapper>
          <div className="mb-2 flex items-center">
            <SkeletonWrapper loading={loading} className="mb-2 flex items-center">
              <Tooltip label={<p className="max-w-[300px] text-xs font-normal">Featured in {item?.event_parent}</p>}>
                <span
                  className="flex cursor-pointer items-center gap-2 truncate whitespace-nowrap rounded-full bg-purple-100 px-2 text-xs text-purple-700"
                  onClick={handleRedirectEventById}
                >
                  <p className="truncate"> Featured in {item?.event_parent}</p>
                  <ChevronRightIcon size={14} />
                </span>
              </Tooltip>
            </SkeletonWrapper>
          </div>
          <SkeletonWrapper loading={loading}>
            <Tooltip label={<p className="max-w-[300px] text-xs font-normal">{item?.name}</p>}>
              <Link href={item?.event_url || ''} target="_blank">
                <h2 className="mb-1 cursor-pointer truncate whitespace-nowrap text-sm font-bold text-gray-900">
                  {item?.name}
                </h2>
              </Link>
            </Tooltip>
          </SkeletonWrapper>
          <SkeletonWrapper loading={loading}>
            <p className="mb-2 text-xs text-gray-600">
              {`${moment(item?.start_at).format('dddd, MMM DD, h:mmA')} - ${moment(item?.end_at).format(
                'h:mmA'
              )} (GMT${moment(item?.end_at).format('Z').replace(':00', '')})`}
            </p>
          </SkeletonWrapper>
          <div className="mb-2 flex items-start gap-2 text-xs text-gray-600">
            <Show when={!!item?.location || !!item?.country}>
              <SkeletonWrapper loading={loading}>
                <div>
                  <MapPinIcon size={16} color="#0077b5" />
                </div>
              </SkeletonWrapper>
              <SkeletonWrapper loading={loading}>
                <p>
                  {item?.location}
                  {`${item?.country ? `, ${item?.country}` : ''}`}
                </p>
              </SkeletonWrapper>
            </Show>
          </div>
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
            <SkeletonWrapper loading={loading}>
              <div>
                <Users2 size={16} color="#0077b5" />
              </div>
            </SkeletonWrapper>
            <SkeletonWrapper loading={loading}>
              <Show when={!!item?.guests && item?.guests !== '0'}>
                <p>
                  {item?.companies || 0} companies - {item?.guests} guests
                </p>
              </Show>
              <Show when={!item?.guests || item?.guests === '0'}>
                <p>Private Event</p>
              </Show>
            </SkeletonWrapper>
          </div>
        </div>
      </VStack>

      <div className="mb-2 ml-4">
        <Button
          className="h-7 px-3 text-xs"
          disabled={!item?.guests || item?.guests === '0'}
          onClick={() => {
            setEvent_info({ event_name: item?.name, event_id: item?.id });
            setIsOpen(true);
          }}
        >
          Guests →
        </Button>
        {isOpen && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black bg-opacity-50">
            <div
              className={cn(
                'relative max-h-screen max-w-screen-xl overflow-auto rounded-lg bg-white p-3 shadow-lg 2xl:max-w-screen-2xl',
                {
                  'ml-0 md:ml-[13.9375rem]': fullSidebar,
                  'ml-0 md:ml-[3.75rem]': !fullSidebar,
                }
              )}
            >
              <ModalGuestsByEvent
                event_id={event_info.event_id}
                event_name={event_info.event_name}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
                setIsOpen={setIsOpen}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardEvent;
