import { request } from '../axios';
import type { IParamsWatchNewsView, IResponseContacts, IResponseViewAllWatchList, IWatchListView } from './types';

export const listWatchListView = async (params: { search_key?: string; id: string }): Promise<IWatchListView[]> => {
  const { data } = await request({
    url: `/data/admin/watchlist/${params.id}/list`,
    method: 'GET',
    params,
  });
  return data.data;
};

export const getNotificationWatchListView = async (params: { company_id: string; user_id: string }): Promise<any> => {
  const { data } = await request({
    url: `/data/admin/company/${params.company_id}/notify`,
    method: 'GET',
    params,
  });

  return data.new_notify;
};

export const listWatchNewView = async (params: IParamsWatchNewsView): Promise<any> => {
  const { data } = await request({
    url: `/data/admin/watchlist/mention/${params.id}`,
    method: 'GET',
    params,
  });
  return data;
};

export const listWatchContactNewsView = async (params: IParamsWatchNewsView): Promise<any> => {
  const { data } = await request({
    url: `/data/admin/watchlist/mention/${params.id}/people`,
    method: 'GET',
    params,
  });
  return data;
};

export const getContactsWatchListViewById = async (params: {
  id: string;
  user_id: string;
}): Promise<IResponseContacts[]> => {
  const { data } = await request({
    url: `/data/admin/watchlist/contact/${params.id}`,
    method: 'GET',
    params,
  });
  return data.data;
};

export const listWatchListViewAll = async (params: { search_key?: string }): Promise<IResponseViewAllWatchList> => {
  const { data } = await request({
    url: '/data/admin/watchlist/all-member',
    method: 'GET',
    params,
  });
  return data;
};
