import React, { useMemo } from 'react';

import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';
import withAuth from '@/lib/withAuth';

import TableWatchList from './components/WatchListTable/TableWatchList';

const WatchListAll = () => {
  const BREADCRUMB = useMemo(
    () => [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      { label: 'Account Management', type: breadcrumbTypes.link, href: '/account-management' },
      { label: 'Watchlist all', type: breadcrumbTypes.page },
    ],
    []
  );
  return (
    <BreadcrumbLayout data={BREADCRUMB}>
      <TableWatchList />
    </BreadcrumbLayout>
  );
};

export default withAuth(WatchListAll);
