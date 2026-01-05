import { request } from '../axios';

export const findEmail = async (id: string) => {
  const { data } = await request({
    url: `/data/guests/findEmail/${id}/`,
    method: 'PUT',
  });
  return data;
};

export const creatProspect = async (params: { prospect_list_name: string }) => {
  const { data } = await request({
    url: '/data/guests/createProspectList',
    method: 'POST',
    data: params,
  });
  return data;
};

export const addToListProspect = async (params: { guest_ids: string; list_id: string }): Promise<any> => {
  const { data } = await request({
    url: '/data/guests/addProspectToList',
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const getFilterColumns = async (params: { event_id: string }) => {
  const { data } = await request({
    url: '/data/guests/getFilterColumns',
    method: 'GET',
    params,
  });
  return data.data;
};

export const addNoteGuest = async (params: { note: string; guest_id: string }) => {
  const { data } = await request({
    url: '/data/guests/noteUpdate',
    method: 'POST',
    data: params,
    params,
  });
  return data.data;
};

export const addEmailContact = async (params: { id: string; email: string }) => {
  const { data } = await request({
    url: `/data/companies/contact/${params.id}/addEmail`,
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const removeEmailContact = async (id: string) => {
  const { data } = await request({
    url: `/data/companies/contact/removeEmail/${id}`,
    method: 'DELETE',
  });
  return data.data;
};

export const updateEmailContact = async (params: { id: string; contact_id: string; email: string }) => {
  const { data } = await request({
    url: `/data/companies/contact/${params.contact_id}/updateEmail/${params.id}`,
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const updateEmailGuest = async (params: { guest_id: string; email: string }) => {
  const { data } = await request({
    url: '/data/guests/updateEmail',
    method: 'PUT',
    data: params,
  });
  return data.data;
};
