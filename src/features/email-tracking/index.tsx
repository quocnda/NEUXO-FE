import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';
import Tag from '@/components/TagComponent';
import { HStack, Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { cn } from '@/lib/utils';
import withAuth from '@/lib/withAuth';
import { useUserStore } from '@/stores';

import ModalLoginEmail from '../../components/Modal/Email/ModalLoginEmail';
import TableEmailTracking from './components/EmailTracking/TableEmailTracking';
import { tabs_email_tracking } from './utils/const';

const EmailTracking = () => {
  const { user } = useUserStore.getState();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [tabs, setTabs] = useState<string | number>(tabs_email_tracking[0].value);
  const { user_id, user_name, start_date, end_date, value_date } = router.query;

  const BREADCRUMB = useMemo(() => {
    const queryParams = {
      start_date,
      end_date,
      value_date,
    };

    const filteredParams = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&');

    return [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      {
        label: 'Email Report',
        type: breadcrumbTypes.link,
        href: `/email-report?${filteredParams}`,
      },
      { label: `Email Tracking_${user_name}`, type: breadcrumbTypes.page },
    ];
  }, [user_name, start_date, end_date, value_date]);

  useEffect(() => {
    if (!user?.has_mail_app_pass) {
      setIsOpen(true);
    }
  }, [user]);

  useEffect(() => {
    const handlePopState = () => {
      router.push({
        pathname: '/email-report',
        query: { start_date, end_date, value_date },
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!user?.has_mail_app_pass && !user_id)
    return <ModalLoginEmail setIsOpen={setIsOpen} isOpen={isOpen} redirectBack={() => router.push('/')} />;

  return (
    <>
      <Show when={!!user_id}>
        <BreadcrumbLayout data={BREADCRUMB} className="mb-2" />
      </Show>
      <Wrapper>
        <HStack pos={'apart'} spacing={8}>
          <Tag className="bg-secondary-purple">{`Email ${user_id ? `Tracking_${user_name}` : 'Tracking'}`}</Tag>
          <HStack spacing={4}>
            {tabs_email_tracking.map((item, index) => {
              return (
                <div
                  className={cn(
                    'text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-sm px-4 text-xs font-semibold hover:opacity-50',
                    tabs === item.value && 'bg-main text-white'
                  )}
                  key={index}
                  onClick={() => setTabs(item.value)}
                >
                  {item.label}
                </div>
              );
            })}
          </HStack>
        </HStack>
        <TableEmailTracking tabs={tabs} />
      </Wrapper>
    </>
  );
};

export default withAuth(EmailTracking);
