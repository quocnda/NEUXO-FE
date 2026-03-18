import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  addNoteCompanyMatching,
  assigneeSales,
  checkMessageSent,
  crawlDataCompany,
  getContentById,
  useListCountry,
  useListCustomFilter,
  useListSales,
} from '@/api/company';
import { onMutateError } from '@/lib/common';

const useServices = (refetch?: () => void) => {
  const { data: listSales } = useListSales();
  const { data: listCountry } = useListCountry();
  const { data: listCustomFilter } = useListCustomFilter();

  const { mutate: mutateAssignee } = useMutation(assigneeSales, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Assignee successfully!');
      refetch?.();
    },
  });
  const { mutate: messageSent } = useMutation(checkMessageSent, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Message sent successfully!');
      refetch?.();
    },
  });
  const { mutate: addNote, isLoading } = useMutation(addNoteCompanyMatching, {
    onError: onMutateError,
  });
  const { mutate: crawlData } = useMutation(crawlDataCompany, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Crawl data successfully!');
      refetch?.();
    },
  });
  const { mutate, isLoading: loadingGenEmail } = useMutation(getContentById, {
    onSuccess: (res: any) => {
      window.open(res?.url, '_blank');
    },
    onError: onMutateError,
  });

  const handleEmailClick = (company_id: string) => {
    mutate({
      id: company_id,
    });
  };
  return {
    listSales,
    mutateAssignee,
    messageSent,
    addNote,
    isLoading,
    crawlData,
    listCountry,
    handleEmailClick,
    loadingGenEmail,
    listCustomFilter,
  };
};

export default useServices;
