import { request } from '../axios';
import type { IEmailReport, IParamsEmailReport } from './types';

export const listEmailReport = async (params: IParamsEmailReport): Promise<IEmailReport> => {
  const { data } = await request({
    url: '/data/report/email',
    method: 'GET',
    params,
  });
  return data.data;
};
