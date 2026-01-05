import { createInfiniteQuery } from 'react-query-kit';

import { listAllNews, listNews, listWatchContactNews, listWatchNew } from './requests';
import type { INews, IParamsNews, IParamsWatchNews } from './types';

export const useListNews = createInfiniteQuery<INews, IParamsNews>({
  primaryKey: '/news/list',
  queryFn: ({ queryKey: [, params], pageParam = 1 }) => listNews({ ...params, page: pageParam }),
  getNextPageParam: ({ pagination }) => {
    if (Number(pagination?.page) >= Number(pagination?.total_page)) return undefined;
    return Number(pagination?.page) + 1;
  },
});

export const useListWatchNews = createInfiniteQuery<any, IParamsWatchNews>({
  primaryKey: '/news/list',
  queryFn: ({ queryKey: [, params], pageParam = 0 }) =>
    listWatchNew({ ...params, limit: params.limit, offset: pageParam }),

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

export const useListWatchContactNews = createInfiniteQuery<any, IParamsWatchNews>({
  primaryKey: '/news/contact',
  queryFn: ({ queryKey: [, params], pageParam = 0 }) =>
    listWatchContactNews({ ...params, limit: params.limit, offset: pageParam }),

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
export const useListNewsCompany = createInfiniteQuery<any, IParamsWatchNews>({
  primaryKey: '/company/list-news-company',
  queryFn: ({ queryKey: [, params], pageParam = null }) => {
    return listWatchNew({
      ...params,
      limit: pageParam !== null || params.offset !== null ? 10 : params.limit || 10,
      ...(pageParam !== null ? { offset: pageParam } : {}),
    });
  },

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

export const useListAllNews = createInfiniteQuery<any, IParamsWatchNews>({
  primaryKey: '/watchlist/list-all-news',
  queryFn: ({ queryKey: [, params], pageParam = 0 }) =>
    listAllNews({ ...params, limit: params.limit, offset: pageParam }),

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
