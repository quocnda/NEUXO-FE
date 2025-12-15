import { createInfiniteQuery, createQuery } from 'react-query-kit';

import {
  getContactsWatchListViewById,
  getNotificationWatchListView,
  listWatchContactNewsView,
  listWatchListView,
  listWatchListViewAll,
  listWatchNewView,
} from './requests';
import type {
  IParamsViewWatchlistAll,
  IParamsWatchNewsView,
  IResponseContacts,
  IResponseViewAllWatchList,
  IWatchListView,
} from './types';

export const useListWatchListView = createQuery<IWatchListView[], { search_key?: string; id: string }>({
  primaryKey: '/admin/watch-list',
  queryFn: ({ queryKey: [_, variables] }) => listWatchListView(variables),
});

export const useNotificationsWatchListViewById = createQuery<any, { company_id: string; user_id: string }>({
  primaryKey: '/admin/notify-watchlist',
  queryFn: ({ queryKey: [_, variables] }) => getNotificationWatchListView(variables),
});

export const useListWatchNewsView = createInfiniteQuery<any, IParamsWatchNewsView>({
  primaryKey: '/admin/company-news/list',
  queryFn: ({ queryKey: [, params], pageParam = 0 }) =>
    listWatchNewView({ ...params, limit: params.limit, offset: pageParam }),

  getNextPageParam: ({ pagination }) => {
    if (!pagination) return undefined;

    const { offset, total_item, limit } = pagination;
    if (offset === null) {
      return Number(total_item || 0);
    }
    const nextOffset = Number(offset || 0) + Number(limit || 0);

    if (nextOffset >= Number(total_item)) return undefined;
    return nextOffset;
  },
});

export const useListWatchContactNewsView = createInfiniteQuery<any, IParamsWatchNewsView>({
  primaryKey: '/admin/news/contact',
  queryFn: ({ queryKey: [, params], pageParam = 0 }) =>
    listWatchContactNewsView({ ...params, limit: params.limit, offset: pageParam }),

  getNextPageParam: ({ pagination }) => {
    if (!pagination) return undefined;

    const { offset, total_item, limit } = pagination;
    if (offset === null) {
      return Number(total_item || 0);
    }
    const nextOffset = Number(offset || 0) + Number(limit || 0);

    if (nextOffset >= Number(total_item)) return undefined;
    return nextOffset;
  },
});

export const useContactsWatchListViewById = createQuery<IResponseContacts[], { id: string; user_id: string }>({
  primaryKey: '/watchList-view/Contacts',
  queryFn: ({ queryKey: [_, variables] }) => getContactsWatchListViewById(variables),
});

export const useListWatchListViewAll = createQuery<IResponseViewAllWatchList, IParamsViewWatchlistAll>({
  primaryKey: '/admin/watch-list-all',
  queryFn: ({ queryKey: [_, variables] }) => listWatchListViewAll(variables),
});
