import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { IParamsCampaignDetail } from '@/api/campaign';
import { useAboutCampaign, useDetailCampaign } from '@/api/campaign';
import { Icons } from '@/assets/icons';
import { breadcrumbTypes } from '@/components/breadscrumb-custom';
import BreadcrumbLayout from '@/components/breadscrumb-custom/BreadcrumbLayout';
import { Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import AboutComponent from './components/AboutComponent';
import CampaignTable from './components/CampaignTable/CampaignTable';
import Header from './components/Header';
import Overview from './components/Overview';
import { tabs } from './utils/const';

const BREADCRUMB = [
  { label: <Icons.folderOpen width={20} height={20} />, type: breadcrumbTypes.page },
  { label: 'Campaign Management', type: breadcrumbTypes.link, href: '/campaign-management' },
  { label: 'Campaign Details', type: breadcrumbTypes.page },
];
const CampaignDetail = () => {
  const defaultParams: IParamsCampaignDetail = {
    page: 1,
    limit: 50,
  };
  const [queryParams, setQueryParams] = useState<IParamsCampaignDetail>(defaultParams);
  const { id } = useRouter().query;
  const campaignId = String(id);

  const { data: aboutData } = useAboutCampaign({ variables: { id: campaignId }, enabled: !!id });

  const { data: detailData, isFetching, refetch } = useDetailCampaign({
    variables: { ...queryParams, id: campaignId },
    enabled: !!id,
  });
  const [activeTab, setActiveTab] = useState<string | number>(tabs[0].value);
  return (
    <BreadcrumbLayout data={BREADCRUMB}>
      <Wrapper className="flex flex-col gap-3">
        <Header
          tab={activeTab}
          setTab={setActiveTab}
          data={detailData?.data_status}
          refetch={refetch}
          isFetching={isFetching}
          campaign_name={aboutData?.campaign_name}
        />
        <Show when={activeTab === tabs[0].value}>
          <Overview data={detailData?.data_report} isFetching={isFetching} />
          <CampaignTable
            data={detailData?.data}
            paramsQuery={queryParams}
            setParamsQuery={setQueryParams}
            isFetching={isFetching}
            pagination={detailData?.pagination}
            refetch={refetch}
          />
        </Show>
        <Show when={activeTab === tabs[1].value}>
          <AboutComponent data={aboutData} />
        </Show>
      </Wrapper>
    </BreadcrumbLayout>
  );
};

export default CampaignDetail;
