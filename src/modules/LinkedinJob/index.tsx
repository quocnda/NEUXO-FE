import React from 'react';

import withAuth from '@/lib/withAuth';

import TableLinkedinJob from './components/TableLinkedinJob';

const LinkedinJob = () => {
  return <TableLinkedinJob />;
};

export default withAuth(LinkedinJob);
