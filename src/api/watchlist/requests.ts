import { request } from '../axios';
import type { IParamsHistoryChat, IRequestHistoryChat, IResponseHistoryChat } from './types';

export const pinCompanyWatchlist = async (params: { company_id: string }) => {
  const { data } = await request({
    url: '/data/watchlist/PIN',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const listICPWatchlist = async () => {
  const { data } = await request({
    url: '/data/watchlist/ICP/list',
    method: 'GET',
  });
  return data.data;
};

export const saveICPWatchlist = async (params: { company_id: string; icp_id: string }) => {
  const { data } = await request({
    url: '/data/watchlist/ICP/save',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const sendChatCompany = async (params: IRequestHistoryChat) => {
  const { data } = await request({
    url: '/data/company/send-message-company',
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const getHistoryChat = async (params: IParamsHistoryChat): Promise<IResponseHistoryChat> => {
  const { data } = await request({
    url: `/data/watchlist/company/${params.id}/get-history-chat`,
    method: 'GET',
    params,
  });
  return data;
};

export const editSubjectChat = async (params: { completion_id: string; subject: string }) => {
  const { data } = await request({
    url: '/data/watchlist/edit-subject-chat',
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const handleRemoveChatHistory = async (params: { completion_id: string }) => {
  const { data } = await request({
    url: '/data/watchlist/delete-history-chat',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const getIdChatCompany = async (id: string) => {
  const { data } = await request({
    url: `/data/watchlist/company/${id}/create-id-completions`,
    method: 'GET',
  });
  return data;
};

export const genIdealCompany = async (id: string) => {
  const { data } = await request({
    url: `/data/company/${id}/gen-completions-id`,
    method: 'GET',
  });
  return data;
};

export const getIdChatContact = async (id: string) => {
  const { data } = await request({
    url: `/data/watchlist/contact/${id}/create-id-completions`,
    method: 'GET',
  });
  return data;
};

export const genIdealContact = async (id: string) => {
  const { data } = await request({
    url: `/data/contact/${id}/gen-completions-id`,
    method: 'GET',
  });
  return data;
};

export const getHistoryChatContact = async (params: IParamsHistoryChat): Promise<IResponseHistoryChat> => {
  const { data } = await request({
    url: `/data/watchlist/contact/${params.id}/get-history-chat`,
    method: 'GET',
    params,
  });
  return data;
};

export const checkHadCreateManual = async (company_linkedin: string): Promise<any> => {
  const { data } = await request({
    url: '/data/watchlist/company/checkHadCreateManual',
    method: 'POST',
    data: { company_linkedin },
  });
  return data;
};
