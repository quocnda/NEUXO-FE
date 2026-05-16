import React, { useMemo } from 'react';

import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';

import CampaignReportTable from './components/CampaignReportTable';

const CampaignReport = () => {
  const breadcrumbItems = useMemo(
    () => [
      { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
      { label: 'Account Management', type: breadcrumbTypes.link, href: '/account-management' },
      { label: 'Campaign Management Report', type: breadcrumbTypes.page },
    ],
    []
  );
  return (
    <BreadcrumbLayout data={breadcrumbItems}>
      <CampaignReportTable />
    </BreadcrumbLayout>
  );
};

export default CampaignReport;
