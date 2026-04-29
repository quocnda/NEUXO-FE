import { createQuery } from 'react-query-kit';

import { emailTemplateDetailById, getMeialSignature, listEmailTemplate } from './requests';
import type { IParamsEmailTemplate, IResponseEmailTemplate } from './types';

export const useListEmailTemplate = createQuery<IResponseEmailTemplate[], IParamsEmailTemplate>({
  primaryKey: '/email-template/list',
  queryFn: ({ queryKey: [_, variables] }) => listEmailTemplate(variables),
});

export const useDetailEmailTemplate = createQuery<IResponseEmailTemplate, { id: string }>({
  primaryKey: '/email-template/detail',
  queryFn: ({ queryKey: [_, variables] }) => emailTemplateDetailById(variables),
});

export const useEmailSignature = createQuery({
  primaryKey: '/email-template/signature',
  queryFn: () => getMeialSignature(),
});
