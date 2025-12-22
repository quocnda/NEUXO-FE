import { request } from '../axios';
import type { IEmailTracking, IParamsEmailTracking, IResponseEmailDetail } from './types';

export const listEmailTracking = async (params: IParamsEmailTracking): Promise<IEmailTracking> => {
  const { data } = await request({
    url: '/data/mail/get-list-email-tracking',
    method: 'GET',
    params,
  });
  return data;
};

export const listEmailTrackingFromUser = async (params: IParamsEmailTracking): Promise<IEmailTracking> => {
  const { data } = await request({
    url: `/data/admin/mail/getAllConversation/${params.user_id}`,
    method: 'GET',
    params,
  });
  return data;
};

export const listMailDetail = async (params: {
  email: string;
  campaign_id: string;
}): Promise<IResponseEmailDetail[]> => {
  const { data } = await request({
    url: '/data/mail/getMailDetails',
    method: 'GET',
    params,
  });
  return data.data;
};

export const listMailDetailFromUser = async (params: {
  email: string;
  id: string;
}): Promise<IResponseEmailDetail[]> => {
  const { data } = await request({
    url: `/data/admin/mail/getMailDetails/${params.id}`,
    method: 'GET',
    params,
  });
  return data.data;
};

export const addAccount = async (params: { email: string; password: string }) => {
  const { data } = await request({
    url: '/data/mail/addAccount',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const sendEmail = async (params: {
  list_email: string;
  title: string;
  content: string;
  list_email_cc?: string;
  list_email_bcc?: string;
  attachments?: Array<{ name_file: string; file_path: string }>;
}) => {
  const { data } = await request({
    url: '/data/mail/sendEmail',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const uploadFile = async (params: { file: File }) => {
  const { data } = await request({
    url: '/data/mail/uploadEmailFile',
    method: 'POST',
    data: params,
  });
  return data;
};

export const AIGeneration = async (params: { event_id?: string; company_id?: string[] }) => {
  const { data } = await request({
    url: '/data/email/template/genAI',
    method: 'POST',
    data: params,
  });
  return data;
};

export const addNode = async (params: { email: string; note?: string; priority?: string }) => {
  const { data } = await request({
    url: '/data/mail/updateRecord',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const updateFollowUpDate = async (params: { email: string; follow_up_date: any }) => {
  const { data } = await request({
    url: '/data/mail/setFollowUpDateForReplied',
    method: 'PUT',
    data: params,
  });
  return data.data;
};
