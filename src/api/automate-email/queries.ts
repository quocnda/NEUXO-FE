import { createQuery } from 'react-query-kit';

import { getPreviewEmail } from './requests';
import type { IParamsPreviewEmail } from './types';

export const usePreviewEmail = createQuery<any, IParamsPreviewEmail>({
  primaryKey: '/email-sequence/preview',
  queryFn: ({ queryKey: [_, variables] }) => getPreviewEmail(variables),
});
