import { exportAsyncCSVFile } from '@/lib/utils';

import { request } from '../axios';
import type {
  IBlackList,
  ICompanyDetails,
  IContactDetail,
  ICreateFilterCustom,
  ICustomFilterList,
  IFundingList,
  ILinkedinJobList,
  ILumaEventsList,
  ILumaGuestsList,
  IMatchingCompaniesList,
  IParamsInsertMutipleCompany,
  IParamsMatchingCompaniesList,
  IParamsViewContactRecord,
  IRequestAddContactToGuest,
  IRequestAddGuest,
  IRequestCheckHadOtherWatchlist,
  IResponseContactRecord,
  IResponseEventParentInfor,
  IResponsiveTrigger,
  ITopTriggerMatchingCompaniesList,
  IWatchList,
} from './types';

export const listMatchingCompanies = async (params: IParamsMatchingCompaniesList): Promise<IMatchingCompaniesList> => {
  const { data } = await request({
    url: '/data/matching-companies/list',
    method: 'GET',
    params,
  });
  return data;
};

export const listStorage = async (params: IParamsMatchingCompaniesList): Promise<IMatchingCompaniesList> => {
  const { data } = await request({
    url: '/data/data/storage',
    method: 'GET',
    params,
  });
  return data;
};
export const listMatchingCompaniesTopTrigger = async (
  params: IParamsMatchingCompaniesList
): Promise<ITopTriggerMatchingCompaniesList> => {
  const { data } = await request({
    url: '/data/matching-companies/getTopTriggerCompany',
    method: 'GET',
    params,
  });
  return data;
};
export const listLumaEvents = async (params: IParamsMatchingCompaniesList): Promise<ILumaEventsList> => {
  const searchParams = new URLSearchParams(params as any);
  const { data } = await request({
    url: '/data/events/list',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: searchParams,
  });
  return data;
};

export const listLumaGuests = async (params: IParamsMatchingCompaniesList): Promise<ILumaGuestsList> => {
  const { data } = await request({
    url: '/data/guests/list',
    method: 'GET',
    params,
  });
  return data;
};

export const listFunding = async (params: IParamsMatchingCompaniesList): Promise<IFundingList> => {
  const { data } = await request({
    url: '/data/funds/list',
    method: 'GET',
    params,
  });
  return data;
};

export const listLinkedinJob = async (params: IParamsMatchingCompaniesList): Promise<ILinkedinJobList> => {
  const { data } = await request({
    url: '/data/jobs/list',
    method: 'GET',
    params,
  });
  return data;
};

export const getDetailCompanyById = async (id: string): Promise<ICompanyDetails> => {
  const { data } = await request({
    url: `/data/companies/${id}`,
    method: 'GET',
  });
  return data.data;
};

export const getTriggerCompanyById = async (params: {
  id: string;
  start_date?: string;
}): Promise<IResponsiveTrigger> => {
  const { data } = await request({
    url: `/data/getTriggerByCompanyID/${params.id}`,
    method: 'GET',
    params,
  });
  return data.data;
};
export const getListSales = async (): Promise<string[]> => {
  const { data } = await request({
    url: '/data/matching-companies/all-sales',
    method: 'GET',
  });
  return data.data;
};
export const assigneeSales = async (params: { id: string; assignee_name: string }) => {
  const { data } = await request({
    url: `/data/matching-companies/updateAssignee/${params.id}/`,
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const checkMessageSent = async (params: {
  id: string;
  is_email_sent: boolean;
  is_linkedin_sent: boolean;
  is_whatsapp_sent: boolean;
}) => {
  const { data } = await request({
    url: `/data/matching-companies/isMessageSent/${params.id}/`,
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const mutipleAssigneeSales = async (params: { ids: string; assignee_name: string }) => {
  const { data } = await request({
    url: '/data/matching-companies/bulkUpdateAssignee/',
    method: 'PUT',
    data: params,
  });
  return data.data;
};
export const toggleColumnsAction = async (params: any) => {
  const { data } = await request({
    url: '/data/matching-companies/updateShowingColumns',
    method: 'PUT',
    data: params,
  });
  return data.data;
};
export const addNoteCompanyMatching = async (params: { note: string; company_id: string }[]) => {
  const { data } = await request({
    url: 'data/addNoteCompanyFromUser',
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const downloadCSVCompanyMatching = async (params: Partial<IParamsMatchingCompaniesList>) => {
  return exportAsyncCSVFile({
    url: '/data/matching-companies/downloadMasterCompany',
    fileName: 'data-report',
    params,
  });
};

export const downloadCSVEvents = async (params: Partial<IParamsMatchingCompaniesList>) => {
  return exportAsyncCSVFile({
    url: '/data/events/downloadEvents',
    fileName: 'data-report',
    params,
  });
};

export const downloadCSVGuests = async (params: Partial<IParamsMatchingCompaniesList>) => {
  return exportAsyncCSVFile({
    url: '/data/guests/downloadGuests',
    fileName: 'data-report',
    params,
  });
};

export const downloadCSVFunding = async (params: Partial<IParamsMatchingCompaniesList>) => {
  return exportAsyncCSVFile({
    url: '/data/funds/downloadFundings',
    fileName: 'data-report',
    params,
  });
};

export const downloadCSVLinkedInJob = async (params: Partial<IParamsMatchingCompaniesList>) => {
  return exportAsyncCSVFile({
    url: '/data/jobs/downloadLinkedinJobs',
    fileName: 'data-report',
    params,
  });
};

export const downloadCSVCompanyAttended = async (params: Partial<IParamsMatchingCompaniesList>, id: string) => {
  return exportAsyncCSVFile({
    url: `/data/events/downloadCompanyInEvents/${id}/`,
    fileName: 'data-report',
    params,
  });
};

export const crawlDataCompany = async (params: { id: string }) => {
  const { data } = await request({
    url: `/data/matching-companies/startCrawlData/${params.id}/`,
    method: 'POST',
  });
  return data.data;
};

export const getContentById = async (params: { id: string }) => {
  const { data } = await request({
    url: `/data/getEmailContentByCompanyID/${params.id}/`,
    method: 'GET',
  });
  return data;
};

export const getListCountryAndEvent = async () => {
  const { data } = await request({
    url: '/data/events/getListCountryAndParentEvent',
    method: 'GET',
  });
  return data.data;
};

export const handleAddBlackList = async (params: { ids: string }) => {
  const { data } = await request({
    url: '/data/matching-companies/addBlackList/',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const listBlackList = async (params: IParamsMatchingCompaniesList): Promise<IBlackList> => {
  const { data } = await request({
    url: '/data/matching-companies/getBlacklist',
    method: 'GET',
    params,
  });
  return data;
};

export const handleRemoveBlackList = async (params: { ids: string }) => {
  const { data } = await request({
    url: '/data/matching-companies/removeBlacklist',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const getListCountry = async (): Promise<string[]> => {
  const { data } = await request({
    url: '/data/matching-companies/listCountryCompany',
    method: 'GET',
  });
  return data.data;
};

export const addWatchList = async (params: { id: string }) => {
  const { data } = await request({
    url: '/data/watchlist/add',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const listWatchList = async (params: IParamsMatchingCompaniesList): Promise<IWatchList> => {
  const { data } = await request({
    url: '/data/watchlist/list',
    method: 'GET',
    params,
  });
  return data;
};

export const removeWatchListById = async (params: { ids: string }) => {
  const { data } = await request({
    url: '/data/watchlist/remove',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const getColumnCompany = async (): Promise<any> => {
  const { data } = await request({
    url: '/data/companies/field-column',
    method: 'GET',
  });
  return data;
};

export const createNewCompany = async (params: { linkedin_url: string }) => {
  const { data } = await request({
    url: '/data/company/addNewCompany',
    method: 'POST',
    data: params,
  });
  return data;
};
export const addGuestMention = async (params: IRequestAddGuest) => {
  const { data } = await request({
    url: `/data/companies/${params.id}/addContact`,
    method: 'POST',
    data: params,
  });
  return data;
};

export const updateContact = async (params: { twitter_url?: string; id: string; linkedin_url?: string }) => {
  const { data } = await request({
    url: `/data/watchlist/company/contact/${params.id}/updateContact`,
    method: 'PUT',
    data: params,
  });
  return data;
};

export const removeGuestMention = async (params: { id: string; guest_id: string }) => {
  const { data } = await request({
    url: `/data/watchlist/company/${params.id}/removeGuestMention`,
    method: 'PUT',
    data: params,
  });
  return data;
};

export const getListCustomFilter = async (): Promise<ICustomFilterList[]> => {
  const { data } = await request({
    url: '/data/customFilter/list',
    method: 'GET',
  });
  return data.data;
};

export const creatFilter = async (params: ICreateFilterCustom) => {
  const { data } = await request({
    url: '/data/customFilter/save',
    method: 'PUT',
    data: params,
  });
  return data;
};

export const removeFilter = async (id: string) => {
  const { data } = await request({
    url: `/data/customFilter/delete/${id}`,
    method: 'DELETE',
  });
  return data;
};

export const addTwitterUrl = async (params: { id: string; url_twitter: string }) => {
  const { data } = await request({
    url: `/data/companies/addTwitter/${params.id}/`,
    method: 'POST',
    data: params,
  });
  return data;
};

export const addContactToGuestMention = async (params: IRequestAddContactToGuest) => {
  const { data } = await request({
    url: `/data/watchlist/company/${params.id}/addGuestAvailableMention`,
    method: 'POST',
    data: params,
  });
  return data;
};

export const addNoteWatchMatching = async (params: { note: string; company_id: string }[]) => {
  const { data } = await request({
    url: '/data/watchlist/company/editNote',
    method: 'PUT',
    data: params,
  });
  return data.data;
};

export const getNotificationWatchList = async (id: string): Promise<any> => {
  const { data } = await request({
    url: `/data/company/${id}/notify`,
    method: 'GET',
  });

  return data.new_notify;
};
export const updateCompany = async (params: {
  twitter_url?: string;
  website?: string;
  country?: string;
  linkedin_url?: string;
  id: string;
}) => {
  const { data } = await request({
    url: `/data/watchlist/company/${params.id}/updateCompany`,
    method: 'PUT',
    data: params,
  });
  return data.data;
};
export const getContactDetailCompany = async (id: string): Promise<IContactDetail[]> => {
  const { data } = await request({
    url: `/data/companies/${id}/contact`,
    method: 'GET',
  });
  return data.data;
};

export const checkHadOtherWatchlist = async (params: IRequestCheckHadOtherWatchlist) => {
  const { data } = await request({
    url: '/data/watchlist/company/checkHadOtherWatchlist',
    method: 'POST',
    data: params,
  });
  return data.data;
};

export const getCountNotificationAll = async (): Promise<any> => {
  const { data } = await request({
    url: '/data/watchlist/notify',
    method: 'GET',
  });

  return data.new_notify;
};

export const insertMutipleCompany = async (params: IParamsInsertMutipleCompany) => {
  const { data } = await request({
    url: '/data/company/insertWatchlist',
    method: 'POST',
    data: params,
  });
  return data;
};

export const eventParentInfo = async (id: string): Promise<IResponseEventParentInfor> => {
  const { data } = await request({
    url: `/data/events/${id}/`,
    method: 'GET',
  });
  return data.data;
};

export const getDetailCompanyByUserId = async (params: { user_id: string; id: string }): Promise<ICompanyDetails> => {
  const { data } = await request({
    url: `/data/admin/company/${params.id}`,
    method: 'GET',
    params,
  });
  return data.data;
};

export const listMetaDataFunding = async () => {
  const { data } = await request({
    url: '/data/funds/metaData',
    method: 'GET',
  });
  return data.data;
};

export const listMetaDataHiring = async () => {
  const { data } = await request({
    url: '/data/jobs/metaData',
    method: 'GET',
  });
  return data.data;
};

export const getContactRecord = async (params: IParamsViewContactRecord): Promise<IResponseContactRecord> => {
  const { data } = await request({
    url: `/data/matching-companies/view-details/${params.id}/`,
    method: 'GET',
    params,
  });
  return data;
};

export const removeContactByAdmin = async (id: string) => {
  const { data } = await request({
    url: `/data/companies/delete-contact/${id}`,
    method: 'PUT',
  });
  return data;
};
