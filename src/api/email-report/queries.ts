import { createQuery } from 'react-query-kit';

import { listEmailReport } from './requests';
import type { IEmailReport, IParamsEmailReport } from './types';

export const useListEmailReport = createQuery<IEmailReport, IParamsEmailReport>({
  primaryKey: '/email-report/list',
  queryFn: ({ queryKey: [_, variables] }) => listEmailReport(variables),
});
