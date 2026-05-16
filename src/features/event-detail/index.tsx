import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { useEventParentInfo } from '@/api/company';
import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';
import { VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import withAuth from '@/lib/withAuth';

import EventDetailCard from './components/EventDetailCard';
import EventInfo from './components/EventInfo';

const EventDetail = () => {
  const router = useRouter();
  const { event_name, event_id } = router.query;
  const { data, isLoading } = useEventParentInfo({ variables: event_id as string, enabled: !!event_id });

  const BREADCRUMB = useMemo(
    () => [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      { label: 'Event', type: breadcrumbTypes.link, href: '/luma-events' },
      { label: event_name, type: breadcrumbTypes.page },
    ],
    [event_name]
  );
  return (
    <BreadcrumbLayout data={BREADCRUMB}>
      <VStack spacing={8}>
        <Wrapper className="px-3">
          <EventInfo data={data} loading={isLoading} />
        </Wrapper>

        <EventDetailCard />
      </VStack>
    </BreadcrumbLayout>
  );
};

export default withAuth(EventDetail);
