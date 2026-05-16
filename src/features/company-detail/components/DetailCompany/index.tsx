import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import toast from 'react-hot-toast';

import { type ICompanyDetails, updateCompany } from '@/api/company';
import { LoadingIcon } from '@/components/ui/button';
import { Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { onMutateError } from '@/lib/common';

import CompanyDescription from './CompanyDescription';
import CompanyDetails from './CompanyDetail';
import NoteCompany from './NoteCompany';

interface IProps {
  data: ICompanyDetails | undefined;
  isFetching: boolean;
  refetch?: () => void;
}
const DetailCompany = ({ data, isFetching, refetch }: IProps) => {
  const router = useRouter();
  const { page } = router.query;
  const { mutate } = useMutation(updateCompany, {
    onSuccess: () => {
      toast.success('Update successfully!');
      refetch?.();
    },
    onError: onMutateError,
  });

  const viewNote = page === 'watch-list-all' || page === 'watch-list' || page === 'watch-list-other-user';

  return (
    <div className="relative w-full lg:col-span-2">
      <Wrapper className="flex h-fit max-h-screen w-full flex-col gap-[23px] overflow-auto p-3">
        <Show when={!isFetching && !!data}>
          <CompanyDetails mutate={mutate} data={data} />
        </Show>
        <Show when={isFetching}>
          <div className="flex items-center justify-center">
            <LoadingIcon size="2rem" />
          </div>
        </Show>
        <CompanyDescription data={data!} mutate={mutate} refetch={refetch} />
        {viewNote && <NoteCompany note={data?.note_watchlist} refetch={refetch} />}
      </Wrapper>
    </div>
  );
};

export default DetailCompany;
