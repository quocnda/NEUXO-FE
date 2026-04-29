import { createQuery } from 'react-query-kit';

import { campaignDetail, campaignDetailAbout, getListCampaignReport, listCampaignReport } from './requests';
import type {
  ICampaignDetail,
  ICampaignDetailAbout,
  ICampaignResponse,
  IParamsCampaignDetail,
  IParamsCampaignList,
  IParamsCampaignReport,
} from './types';

export const useListCampaign = createQuery<ICampaignResponse, IParamsCampaignList>({
  primaryKey: '/campaign/list',
  queryFn: ({ queryKey: [_, variables] }) => listCampaignReport(variables),
});

export const useDetailCampaign = createQuery<ICampaignDetail, IParamsCampaignDetail>({
  primaryKey: '/campaign/detail',
  queryFn: ({ queryKey: [_, variables] }) => campaignDetail(variables),
});

export const useAboutCampaign = createQuery<ICampaignDetailAbout, any>({
  primaryKey: '/campaign/about',
  queryFn: ({ queryKey: [_, variables] }) => campaignDetailAbout(variables),
});

export const useListCampaignlReport = createQuery<any, IParamsCampaignReport>({
  primaryKey: '/campaign-report/list',
  queryFn: ({ queryKey: [_, variables] }) => getListCampaignReport(variables),
});
