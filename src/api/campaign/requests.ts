import { request } from '../axios';
import type {
  ICampaignDetail,
  ICampaignDetailAbout,
  ICampaignResponse,
  IParamsCampaignDetail,
  IParamsCampaignList,
  IParamsCampaignReport,
} from './types';

export const listCampaignReport = async (params: IParamsCampaignList): Promise<ICampaignResponse> => {
  const { data } = await request({
    url: '/data/campaign/email/get-report',
    method: 'GET',
    params,
  });
  return data;
};

export const updateStatusCampaign = async (params: { status_campaign: string; id: string }) => {
  const { data } = await request({
    url: `/data/campaign/email/updateStatus/${params.id}`,
    method: 'POST',
    data: params,
  });
  return data;
};

export const campaignDetail = async (params: IParamsCampaignDetail): Promise<ICampaignDetail> => {
  const { data } = await request({
    url: `/data/campaign/email/get-detail-static/${params.id}`,
    method: 'GET',
    params,
  });
  return data;
};

export const campaignDetailAbout = async (params: { id: string }): Promise<ICampaignDetailAbout> => {
  const { data } = await request({
    url: `/data/campaign/email/get-about/${params.id}`,
    method: 'GET',
  });
  return data.data;
};

export const renameCampaign = async (params: { name_campaign: string; id: string }) => {
  const { data } = await request({
    url: `/data/campaign/email/edit-name-campaign/${params.id}`,
    method: 'POST',
    data: params,
  });
  return data;
};

export const getListCampaignReport = async (params: IParamsCampaignReport): Promise<any> => {
  const { data } = await request({
    url: '/data/campaign/email/get-total-report-mail',
    method: 'GET',
    params,
  });
  return data.data;
};
