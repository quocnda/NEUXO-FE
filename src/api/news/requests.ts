import { request } from '../axios';
import type { INews, IParamsNews, IParamsWatchNews } from './types';

export const listNews = async (params: IParamsNews): Promise<INews> => {
  const { data } = await request({
    url: '/data/news/list',
    method: 'GET',
    params,
  });
  return data;
};

export const listWatchNew = async (params: IParamsWatchNews): Promise<any> => {
  const { data } = await request({
    url: `/data/watchlist/mention/${params.id}`,
    method: 'GET',
    params,
  });
  return data;
};
export const listWatchContactNews = async (params: IParamsWatchNews): Promise<any> => {
  const { data } = await request({
    url: `/data/watchlist/mention/${params.id}/people`,
    method: 'GET',
    params,
  });
  return data;
};

export const listNewsCompany = async (params: IParamsWatchNews): Promise<any> => {
  const { data } = await request({
    url: `/data/company/${params.id}/recentNews`,
    method: 'GET',
    params,
  });
  return data;
};

export const seenNews = async (params: { ids: string }) => {
  const { data } = await request({
    url: '/data/company/notify/seen',
    method: 'POST',
    data: params,
  });
  return data;
};

export const listAllNews = async (params: IParamsWatchNews): Promise<any> => {
  const { data } = await request({
    url: '/data/watchlist/mention',
    method: 'GET',
    params,
  });
  return data;
};
export const seenAllNews = async (params: { type: string }) => {
  const { data } = await request({
    url: '/data/watchlist/seenAll',
    method: 'POST',
    data: params,
  });
  return data;
};
