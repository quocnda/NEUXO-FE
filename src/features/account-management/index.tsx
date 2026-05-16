import React from 'react';

import withAuth from '@/lib/withAuth';
import NoPermission from '@/pages/no-permission';
import { useUserStore } from '@/stores';

import TableAccountManagement from './components/TableAccountManagement';

const AccountManagement = () => {
  const { role } = useUserStore();
  if (role !== 'Admin' && role !== 'Super_Admin') return <NoPermission />;
  return <TableAccountManagement />;
};

export default withAuth(AccountManagement);
