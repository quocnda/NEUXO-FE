import React, { useMemo } from 'react';

import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';
import withAuth from '@/lib/withAuth';

import EmailReportTable from './components/EmailReportTable';

const EmailReport = () => {
  const BREADCRUMB = useMemo(
    () => [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      { label: 'Account Management', type: breadcrumbTypes.link, href: '/account-management' },
      { label: 'Email Report', type: breadcrumbTypes.page },
    ],
    []
  );
  return (
    <BreadcrumbLayout data={BREADCRUMB}>
      <EmailReportTable />
    </BreadcrumbLayout>
  );
};

export default withAuth(EmailReport);
