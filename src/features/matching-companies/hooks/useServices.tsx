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
  const { mutate: assignSales } = useMutation(assigneeSales, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Assignee successfully!');
      refetch?.();
    },
  });
  const { mutate: markMessageSent } = useMutation(checkMessageSent, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Message sent successfully!');
      refetch?.();
    },
  });
  const { mutate: addCompanyNote, isLoading } = useMutation(addNoteCompanyMatching, {
    onError: onMutateError,
  });
  const { mutate: crawlCompanyData } = useMutation(crawlDataCompany, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Crawl data successfully!');
      refetch?.();
    },
  });
  const { mutate: openEmailContent, isLoading: loadingGenEmail } = useMutation(getContentById, {
    onSuccess: (res: any) => {
      window.open(res?.url, '_blank');
    },
    onError: onMutateError,
  });

  const handleOpenEmailContent = (companyId: string) => {
    openEmailContent({
      id: companyId,
    });
  };
  return {
    listSales,
    mutateAssignee: assignSales,
    messageSent: markMessageSent,
    addNote: addCompanyNote,
    isLoading,
    crawlData: crawlCompanyData,
    listCountry,
    handleEmailClick: handleOpenEmailContent,
    loadingGenEmail,
    listCustomFilter,
  };
};

export default useServices;
