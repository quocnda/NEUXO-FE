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

const normalizeCampaignDetail = (raw: any): ICampaignDetail => {
  const payload = raw?.data ?? raw;
  const emailDetails = Array.isArray(payload?.email_details)
    ? payload.email_details
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  const pagination = payload?.pagination ?? {};
  const statistics = payload?.statistics ?? {};

  return {
    data_report: {
      contacts_count: statistics.total_targets ?? payload?.email_targets_count ?? 0,
      total_email_sent: statistics.total_sent ?? 0,
      replied_rate: statistics.total_received ?? 0,
      error_rate: statistics.total_error ?? 0,
    },
    data: emailDetails.map((item: any) => ({
      email: item?.email ?? '',
      contact_name: item?.contact_name ?? '',
      company_name: item?.company_name ?? '',
      email_sent: String(item?.sent_count ?? item?.email_sent ?? ''),
      last_sent_date: item?.last_sent_date ?? '',
      error_message: item?.error_message ?? '',
      email_status: item?.status ?? item?.email_status ?? '',
      open_count: item?.opened_count ?? item?.open_count ?? 0,
    })),
    data_status: {
      campaign_status: payload?.campaign_status ?? '',
      status_choice: Array.isArray(payload?.status_choice) ? payload.status_choice : [],
    },
    pagination: {
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 0,
      total_page: pagination.total_page ?? 1,
      total_item: pagination.total_item ?? emailDetails.length,
      current_page: pagination.current_page ?? pagination.page ?? 1,
    },
  };
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
  return normalizeCampaignDetail(data);
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
