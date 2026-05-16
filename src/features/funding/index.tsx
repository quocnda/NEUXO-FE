import React from 'react';

import withAuth from '@/lib/withAuth';

import TableFunding from './components/TableFunding';

const Funding = () => {
  return <TableFunding />;
};

export default withAuth(Funding);
