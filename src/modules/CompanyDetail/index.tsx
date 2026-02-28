/* eslint-disable no-nested-ternary */
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { useDetailCompanyById, useDetailCompanyByUserId } from '@/api/company';
import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';
import ModalBlackList from '@/components/Modal/Account-Management/ModalBlackList';
import ModalConfirmWatchList from '@/components/Modal/Contact/ModalConfirmWatchList';
import { Tooltip } from '@/components/ui/tooltip';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatItem } from '@/lib/common';

import StepAddWatchList from '../MatchingCompanies/components/Companies/Components/AddToWatchlist/StepAddWatchList';
import ContactsCompany from './components/ContactsCompany';
import DetailCompany from './components/DetailCompany';
import News from './components/News';

const CompanyDetail = () => {
  const router = useRouter();
  const { id, page, user_id, user_name, start_date, end_date, value_date, filter } = router.query;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const BREADCRUMB_FROM_OTHER_PAGE = useMemo(() => {
    const baseBreadcrumb = [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      { label: formatItem(String(page)), type: breadcrumbTypes.link, href: `/${page}` },
      { label: 'Companies Detail', type: breadcrumbTypes.page },
    ];

    if (page === 'watch-list-other-user') {
      baseBreadcrumb[1].href = `/${page}/${user_id}?user_name=${user_name}`;
      baseBreadcrumb[1].label = `Watchlist: ${user_name}`;
    }

    return baseBreadcrumb;
  }, [page, user_id, user_name]);

  const BREADCRUMB = useMemo(() => {
    // const queryParams = {
    //   start_date,
    //   end_date,
    //   value_date,
    //   filter,
    // };

    // const filteredParams = Object.entries(queryParams)
    //   .filter(([_, value]) => value !== undefined)
    //   .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    //   .join('&');

    return [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      { label: 'Companies', type: breadcrumbTypes.link, href: '/matching-companies' },
      { label: 'Companies Detail', type: breadcrumbTypes.page },
    ];
  }, []);

  const { data, isFetching, refetch } = useDetailCompanyById({
    variables: String(id),
    enabled: !!id,
    refetchOnMount: true,
  });

  const {
    data: companyDetailByUserId,
    isFetching: isFetchingCompanyDetailByUserId,
    refetch: refetchCompanyDetailByUserId,
  } = useDetailCompanyByUserId({
    variables: {
      id: String(id),
      user_id: String(user_id),
    },
    enabled: !!id && !!user_id,
    refetchOnMount: true,
  });

  useEffect(() => {
    const handlePopState = () => {
      const queryParams = {
        start_date,
        end_date,
        value_date,
        filter,
        user_id,
        user_name,
      };

      const filteredParams = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join('&');

      router.push({
        pathname: `/${page}`,
        query: filteredParams ? { ...queryParams } : undefined,
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, page, start_date, end_date, value_date, filter, user_id, user_name]);

  return (
    <BreadcrumbLayout data={!page || page !== 'matching-companies' ? BREADCRUMB_FROM_OTHER_PAGE : BREADCRUMB}>
      <HStack noWrap align={'start'} className="gap-[14px]">
        <div className="grid w-full grid-cols-1 gap-[14px] lg:grid-cols-5">
          <DetailCompany
            data={user_id ? companyDetailByUserId : data}
            isFetching={user_id ? isFetchingCompanyDetailByUserId : isFetching}
            refetch={user_id ? refetchCompanyDetailByUserId : refetch}
          />
          <VStack className="relative w-full gap-[23px] lg:col-span-3">
            <ContactsCompany />
            <News />
          </VStack>
        </div>
        <VStack className="w-12 transform transition-all">
          <Show when={!data?.watchlist && data?.is_in_watchlist !== 0}>
            <Tooltip label="Added to your team member's watchlist">
              <div>
                <ModalConfirmWatchList companyId={String(id)} refetch={refetch} setIsStepOpen={setIsOpen}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    <Icons.stars fill="#6B7280" width={20} height={20} color="#FFC800" />
                  </div>
                </ModalConfirmWatchList>
              </div>
            </Tooltip>
          </Show>
          <Show when={!data?.watchlist && data?.is_in_watchlist === 0}>
            <Tooltip label="Add to watchlist">
              <div
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <Icons.watchlistCompany width={20} height={20} color="#6F767E" />
              </div>
            </Tooltip>
          </Show>
          <Show when={data?.watchlist && data?.is_in_watchlist === 1}>
            <Tooltip label="Added to your watchlist">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Icons.watchlistCompany color="#FFC800" width={20} height={20} />
              </div>
            </Tooltip>
          </Show>
          <Show when={data?.watchlist && data?.is_in_watchlist > 1}>
            <Tooltip label="Added to both your watchlist and other teammates">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Icons.stars fill="#FFC800" width={20} height={20} />
              </div>
            </Tooltip>
          </Show>

          <Show when={!data?.is_blacklist}>
            <Tooltip label="Add to blacklist">
              <div>
                <ModalBlackList selectedIds={[String(id)]} refetch={refetch}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    <Icons.blacklistCompany width={20} height={20} color="#6F767E" />
                  </div>
                </ModalBlackList>
              </div>
            </Tooltip>
          </Show>
        </VStack>
      </HStack>
      <StepAddWatchList companyId={String(id)} isOpen={isOpen} setIsOpen={setIsOpen} refetch={refetch} />
    </BreadcrumbLayout>
  );
};

export default CompanyDetail;
