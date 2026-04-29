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
  const defaultQuery: IParamsCampaignDetail = {
    page: 1,
    limit: 50,
  };
  const [paramsQuery, setParamsQuery] = useState<IParamsCampaignDetail>(defaultQuery);
  const { id } = useRouter().query;

  const { data: dataAbout } = useAboutCampaign({ variables: { id: String(id) }, enabled: !!id });

  const { data, isFetching, refetch } = useDetailCampaign({
    variables: { ...paramsQuery, id: String(id) },
    enabled: !!id,
  });
  const [tab, setTab] = useState<string | number>(tabs[0].value);
  return (
    <BreadcrumbLayout data={BREADCRUMB}>
      <Wrapper className="flex flex-col gap-3">
        <Header
          tab={tab}
          setTab={setTab}
          data={data?.data_status}
          refetch={refetch}
          isFetching={isFetching}
          campaign_name={dataAbout?.campaign_name}
        />
        <Show when={tab === tabs[0].value}>
          <Overview data={data?.data_report} isFetching={isFetching} />
          <CampaignTable
            data={data?.data}
            paramsQuery={paramsQuery}
            setParamsQuery={setParamsQuery}
            isFetching={isFetching}
            pagination={data?.pagination}
            refetch={refetch}
          />
        </Show>
        <Show when={tab === tabs[1].value}>
          <AboutComponent data={dataAbout} />
        </Show>
      </Wrapper>
    </BreadcrumbLayout>
  );
};

export default CampaignDetail;
