import { createQuery } from 'react-query-kit';

import { getFilterColumns } from './requests';

export const useGetFilterColumns = createQuery<any, { event_id: string }>({
  primaryKey: '/filterGuest/list',
  queryFn: ({ queryKey: [_, variables] }) => getFilterColumns(variables),
});
