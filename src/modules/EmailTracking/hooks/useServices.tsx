import { useState } from 'react';

import type { IParamsEmailTemplate } from '@/api/email-template';
import { useListEmailTemplate } from '@/api/email-template';

const useServices = () => {
  const [paramsQuery, setParamsQuery] = useState<IParamsEmailTemplate>({});
  const { data, isFetching, refetch } = useListEmailTemplate({ variables: paramsQuery });

  return {
    data,
    isFetching,
    refetch,
    setParamsQuery,
    paramsQuery,
  };
};

export default useServices;
