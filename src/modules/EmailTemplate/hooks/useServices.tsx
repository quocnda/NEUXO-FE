import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

import type { IParamsEmailTemplate } from '@/api/email-template';
import { removeEmailTemplate, useListEmailTemplate } from '@/api/email-template';
import { onMutateError } from '@/lib/common';

const useServices = (setIsRemove?: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [paramsQuery, setParamsQuery] = useState<IParamsEmailTemplate>({});
  const { data, isFetching, refetch } = useListEmailTemplate({ variables: paramsQuery });

  const { mutate: removeTemplate, isLoading } = useMutation(removeEmailTemplate, {
    onSuccess: () => {
      toast.success('Remove email template successfully!');
      setIsRemove?.(false);
      refetch?.();
    },
    onError: onMutateError,
  });

  return {
    data,
    isFetching,
    refetch,
    setParamsQuery,
    paramsQuery,
    removeTemplate,
    isLoading,
  };
};

export default useServices;
