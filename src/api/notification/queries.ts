import { createInfiniteQuery, createQuery } from 'react-query-kit';

import { countNotification, dataToggle, getEmailDetailNotification, listNotification } from './requests';
import type { IParamsNotification } from './types';

export const useListNotification = createInfiniteQuery<any, IParamsNotification>({
  primaryKey: '/notification/list',
  queryFn: ({ queryKey: [, params], pageParam = 1 }) => listNotification({ ...params, page: pageParam }),
  getNextPageParam: ({ pagination }) => {
    if (Number(pagination?.page) >= Number(pagination?.total_page)) return undefined;
    return Number(pagination?.page) + 1;
  },
});

export const useCountEmailNotification = createQuery({
  primaryKey: '/notification/count',
  queryFn: () => countNotification(),
});

export const useDataToggle = createQuery({
  primaryKey: '/toggle/data',
  queryFn: () => dataToggle(),
});

export const useGetDetailEmailNotification = createQuery<any, { id: string }>({
  primaryKey: '/email/detail',
  queryFn: ({ queryKey: [_, variables] }) => getEmailDetailNotification(variables.id),
});
