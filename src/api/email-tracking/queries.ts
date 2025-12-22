import { createQuery } from 'react-query-kit';

import { listEmailTracking, listEmailTrackingFromUser, listMailDetail, listMailDetailFromUser } from './requests';
import type { IEmailTracking, IParamsEmailTracking, IResponseEmailDetail } from './types';

export const useListEmailTracking = createQuery<IEmailTracking, IParamsEmailTracking>({
  primaryKey: '/email-tracking/list',
  queryFn: ({ queryKey: [_, variables] }) => listEmailTracking(variables),
});

export const useListEmailTrackingFromUser = createQuery<IEmailTracking, IParamsEmailTracking>({
  primaryKey: '/email-tracking-user/list',
  queryFn: ({ queryKey: [_, variables] }) => listEmailTrackingFromUser(variables),
});

export const useListEmailDetail = createQuery<IResponseEmailDetail[], { email: string; campaign_id: string }>({
  primaryKey: '/email-detail/list',
  queryFn: ({ queryKey: [_, variables] }) => listMailDetail(variables),
});

export const useListEmailDetailFromUser = createQuery<IResponseEmailDetail[], { email: string; id: string }>({
  primaryKey: '/email-detail-user/list',
  queryFn: ({ queryKey: [_, variables] }) => listMailDetailFromUser(variables),
});
