import { request } from '../axios';
import type {
  IBodyCreateEmailTemplate,
  IParamsEmailTemplate,
  IRequestEmailSignature,
  IResponseEmailTemplate,
} from './types';

export const listEmailTemplate = async (params: IParamsEmailTemplate): Promise<IResponseEmailTemplate[]> => {
  const { data } = await request({
    url: '/data/email/template/list',
    method: 'GET',
    params,
  });
  return data.data;
};

export const createNewEmailTemplate = async (body: IBodyCreateEmailTemplate) => {
  const { data } = await request({
    url: '/data/email/template/create',
    method: 'POST',
    data: body,
  });
  return data.data;
};

export const removeEmailTemplate = async (id: string) => {
  const { data } = await request({
    url: `/data/email/template/delete/${id}`,
    method: 'DELETE',
  });
  return data.data;
};

export const emailTemplateDetailById = async (params: { id: string }): Promise<IResponseEmailTemplate> => {
  const { data } = await request({
    url: `/data/email/template/${params.id}`,
    method: 'GET',
  });
  return data.data;
};

export const updateEmailTemplate = async (body: IBodyCreateEmailTemplate) => {
  const { data } = await request({
    url: `/data/email/template/update/${body.id}`,
    method: 'PUT',
    data: body,
  });
  return data.data;
};

export const getMeialSignature = async (): Promise<any> => {
  const { data } = await request({
    url: '/data/mail/getSignatures',
    method: 'GET',
  });
  return data.data;
};

export const createMailSignature = async (body: IRequestEmailSignature) => {
  const { data } = await request({
    url: '/data/mail/putSignature/',
    method: 'PUT',
    data: body,
  });
  return data.data;
};

export const removeSignature = async (id: string) => {
  const { data } = await request({
    url: `/data/mail/deleteSignature/${id}`,
    method: 'DELETE',
  });
  return data.data;
};
