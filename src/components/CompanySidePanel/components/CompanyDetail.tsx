/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import { useDetailCompanyById, useDetailCompanyByUserId } from '@/api/company';
import { Icons } from '@/assets/icons';
import ModalBlackList from '@/components/Modal/Account-Management/ModalBlackList';
import ModalConfirmWatchList from '@/components/Modal/Contact/ModalConfirmWatchList';
import { Tooltip } from '@/components/ui/tooltip';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import StepAddWatchList from '@/features/matching-companies/components/Companies/Components/AddToWatchlist/StepAddWatchList';

import ContactsCompany from './components/ContactsCompany';
import DetailCompany from './components/DetailCompany';
import Header from './components/Header';
import News from './components/News';

const CompanyDetail = ({
  id,
  handleClick,
  user_id,
  isWatchList,
  toggle,
}: {
  id?: string;
  handleClick?: ((event: React.MouseEvent<HTMLDivElement>) => void) | undefined;
  user_id?: string;
  isWatchList?: boolean;
  toggle?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  return (
    <>
      <VStack>
        <Header
          data={user_id ? companyDetailByUserId : data}
          isFetching={user_id ? isFetchingCompanyDetailByUserId : isFetching}
          refetch={user_id ? refetchCompanyDetailByUserId : refetch}
          handleClick={handleClick}
          toggle={toggle}
        />
        <HStack noWrap align={'start'} className="gap-[14px] p-3">
          <div className="grid w-full grid-cols-1 gap-[14px] lg:grid-cols-5">
            <DetailCompany
              data={user_id ? companyDetailByUserId : data}
              isFetching={user_id ? isFetchingCompanyDetailByUserId : isFetching}
              refetch={user_id ? refetchCompanyDetailByUserId : refetch}
              isWatchList={isWatchList}
              id={id}
              user_id={user_id}
            />
            <VStack className="relative w-full gap-[23px] lg:col-span-3">
              <ContactsCompany id={String(id)} isWatchList={isWatchList} />
              <News id={String(id)} isWatchList={isWatchList} />
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
      </VStack>
      <StepAddWatchList companyId={String(id)} isOpen={isOpen} setIsOpen={setIsOpen} refetch={refetch} />
    </>
  );
};

export default CompanyDetail;
