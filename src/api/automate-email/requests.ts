import { request } from '../axios';
import type { IBodyCreateSequence, IBodySubmitSequence, IParamsPreviewEmail } from './types';

export const createSequence = async (params: IBodyCreateSequence): Promise<any> => {
  const { data } = await request({
    url: '/data/automate/email/create-sequence',
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const getPreviewEmail = async (params: IParamsPreviewEmail): Promise<any> => {
  const { data } = await request({
    url: '/data/automate/email/preview-email',
    method: 'GET',
    params,
  });
  return data.data;
};

export const submitSequence = async (params: IBodySubmitSequence) => {
  const { data } = await request({
    url: '/data/automate/email/submit-sequence',
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const checkEmailAutomate = async (list_email: string[]) => {
  const { data } = await request({
    url: '/data/automate/email/check-email-sent',
    method: 'POST',
    data: { list_email },
  });
  return data;
};
