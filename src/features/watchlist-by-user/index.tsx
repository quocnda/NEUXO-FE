import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';
import withAuth from '@/lib/withAuth';

import TableWatchList from './components/WatchListTable/TableWatchList';

const WatchListByUserPage = () => {
  const router = useRouter();
  const { user_name } = router.query;
  const breadcrumbItems = useMemo(
    () => [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      { label: 'Account Management', type: breadcrumbTypes.link, href: '/account-management' },
      { label: `Watchlist: ${user_name}`, type: breadcrumbTypes.page },
    ],
    [user_name]
  );
  return (
    <BreadcrumbLayout data={breadcrumbItems}>
      <TableWatchList />
    </BreadcrumbLayout>
  );
};

export default withAuth(WatchListByUserPage);
