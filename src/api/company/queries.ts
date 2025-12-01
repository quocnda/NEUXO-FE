import { createInfiniteQuery, createQuery } from 'react-query-kit';

import {
  eventParentInfo,
  getColumnCompany,
  getContactDetailCompany,
  getContactRecord,
  getCountNotificationAll,
  getDetailCompanyById,
  getDetailCompanyByUserId,
  getListCountry,
  getListCountryAndEvent,
  getListCustomFilter,
  getListSales,
  getNotificationWatchList,
  getTriggerCompanyById,
  listBlackList,
  listFunding,
  listLinkedinJob,
  listLumaEvents,
  listLumaGuests,
  listMatchingCompanies,
  listMatchingCompaniesTopTrigger,
  listMetaDataFunding,
  listMetaDataHiring,
  listStorage,
  listWatchList,
} from './requests';
import type {
  IBlackList,
  ICompanyDetails,
  IContactDetail,
  ICustomFilterList,
  IFundingList,
  ILinkedinJobList,
  ILumaEventsList,
  ILumaGuestsList,
  IMatchingCompaniesList,
  IParamsMatchingCompaniesList,
  IParamsViewContactRecord,
  IResponseContactRecord,
  IResponseEventParentInfor,
  IResponsiveTrigger,
  ITopTriggerMatchingCompaniesList,
  IWatchList,
} from './types';

export const useListMatchingCompanies = createQuery<IMatchingCompaniesList, IParamsMatchingCompaniesList>({
  primaryKey: '/matching-companies/list',
  queryFn: ({ queryKey: [_, variables] }) => listMatchingCompanies(variables),
});

export const useListStorage = createQuery<IMatchingCompaniesList, IParamsMatchingCompaniesList>({
  primaryKey: '/storage/list',
  queryFn: ({ queryKey: [_, variables] }) => listStorage(variables),
});

export const useListMatchingCompaniesTopTrigger = createQuery<
  ITopTriggerMatchingCompaniesList,
  IParamsMatchingCompaniesList
>({
  primaryKey: '/matching-companies/top-trigger',
  queryFn: ({ queryKey: [_, variables] }) => listMatchingCompaniesTopTrigger(variables),
});
export const useListLumaEvents = createQuery<ILumaEventsList, IParamsMatchingCompaniesList>({
  primaryKey: '/luma-event/list',
  queryFn: ({ queryKey: [_, variables] }) => listLumaEvents(variables),
});
export const useListLumaGuests = createQuery<ILumaGuestsList, IParamsMatchingCompaniesList>({
  primaryKey: '/luma-guests/list',
  queryFn: ({ queryKey: [_, variables] }) => listLumaGuests(variables),
});
export const useListFunding = createQuery<IFundingList, IParamsMatchingCompaniesList>({
  primaryKey: '/funding/list',
  queryFn: ({ queryKey: [_, variables] }) => listFunding(variables),
});
export const useListLinkedinJob = createQuery<ILinkedinJobList, IParamsMatchingCompaniesList>({
  primaryKey: '/listLinkedinJob/list',
  queryFn: ({ queryKey: [_, variables] }) => listLinkedinJob(variables),
});

export const useDetailCompanyById = createQuery<ICompanyDetails, string>({
  primaryKey: '/companies/detail',
  queryFn: ({ queryKey: [_, variables] }) => getDetailCompanyById(variables),
});

export const useTriggerCompanyById = createQuery<IResponsiveTrigger, { id: string; start_date?: string }>({
  primaryKey: '/companies/trigger',
  queryFn: ({ queryKey: [_, variables] }) => getTriggerCompanyById(variables),
});

export const useListSales = createQuery({
  primaryKey: '/sales/list',
  queryFn: () => getListSales(),
});

export const useListCountryAndParentEvent = createQuery({
  primaryKey: '/metadata/countryAndParentEvent',
  queryFn: () => getListCountryAndEvent(),
});

export const useListBlackList = createQuery<IBlackList, IParamsMatchingCompaniesList>({
  primaryKey: '/matching-companies/black-list',
  queryFn: ({ queryKey: [_, variables] }) => listBlackList(variables),
});

export const useListCountry = createQuery({
  primaryKey: '/country/list',
  queryFn: () => getListCountry(),
});

export const useListWatchList = createQuery<IWatchList, IParamsMatchingCompaniesList>({
  primaryKey: '/matching-companies/watch-list',
  queryFn: ({ queryKey: [_, variables] }) => listWatchList(variables),
});

export const useListColumnCompany = createQuery({
  primaryKey: '/company/list-column',
  queryFn: () => getColumnCompany(),
});

export const useListCustomFilter = createQuery<ICustomFilterList[]>({
  primaryKey: '/custom-filter/list',
  queryFn: () => getListCustomFilter(),
});

export const useNotificationsWatchListById = createQuery<any, string>({
  primaryKey: '/watchList/Notifications',
  queryFn: ({ queryKey: [_, variables] }) => getNotificationWatchList(variables),
});

export const useContactDetailCompany = createQuery<IContactDetail[], string>({
  primaryKey: '/company/detail-contact',

  queryFn: ({ queryKey: [_, variables] }) => getContactDetailCompany(variables),
});

export const useNotificationAll = createQuery<any>({
  primaryKey: '/all/Notifications',
  queryFn: () => getCountNotificationAll(),
});

export const useEventParentInfo = createQuery<IResponseEventParentInfor, string>({
  primaryKey: '/event_parent/info',
  queryFn: ({ queryKey: [_, variables] }) => eventParentInfo(variables),
});

export const useDetailCompanyByUserId = createQuery<ICompanyDetails, { id: string; user_id: string }>({
  primaryKey: '/companydetailbyuser/info',
  queryFn: ({ queryKey: [_, variables] }) => getDetailCompanyByUserId(variables),
});

export const useListMetaDateFunding = createQuery({
  primaryKey: '/metadata/funding',
  queryFn: () => listMetaDataFunding(),
});

export const useListMetaDateHiring = createQuery({
  primaryKey: '/metadata/hiring',
  queryFn: () => listMetaDataHiring(),
});

export const useListContactRecord = createInfiniteQuery<IResponseContactRecord, IParamsViewContactRecord>({
  primaryKey: '/company/contact-record',
  queryFn: ({ queryKey: [, params], pageParam = 1 }) => getContactRecord({ ...params, page: pageParam }),
  getNextPageParam: ({ pagination }) => {
    if (Number(pagination?.page) >= Number(pagination?.total_page)) return undefined;
    return Number(pagination?.page) + 1;
  },
});
