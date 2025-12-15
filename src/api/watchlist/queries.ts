import { createQuery } from 'react-query-kit';

import { getHistoryChat, getHistoryChatContact, listICPWatchlist } from './requests';
import type { IParamsHistoryChat, IResponseHistoryChat } from './types';

export const useListICPWatchlist = createQuery({
  primaryKey: '/data/watchlist/ICP/list',
  queryFn: () => listICPWatchlist(),
});

export const useListHistoryChat = createQuery<IResponseHistoryChat, IParamsHistoryChat>({
  primaryKey: '/historyChat/list',
  queryFn: ({ queryKey: [_, variables] }) => getHistoryChat(variables),
});

export const useListHistoryChatContact = createQuery<IResponseHistoryChat, IParamsHistoryChat>({
  primaryKey: '/historyChat/contact/list',
  queryFn: ({ queryKey: [_, variables] }) => getHistoryChatContact(variables),
});
