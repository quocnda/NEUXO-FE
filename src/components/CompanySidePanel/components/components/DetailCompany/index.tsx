import { useMutation } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';

import { type ICompanyDetails, updateCompany } from '@/api/company';
import { LoadingIcon } from '@/components/ui/button';
import { Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { onMutateError } from '@/lib/common';

import CompanyDescription from './CompanyDescription';
import NoteCompany from './NoteCompany';

interface IProps {
  data: ICompanyDetails | undefined;
  isFetching: boolean;
  refetch?: () => void;
  isWatchList?: boolean;
  id?: string;
  user_id?: string;
}
const DetailCompany = ({ data, isFetching, refetch, isWatchList, id, user_id }: IProps) => {
  const { mutate } = useMutation(updateCompany, {
    onSuccess: () => {
      toast.success('Update successfully!');
      refetch?.();
    },
    onError: onMutateError,
  });

  return (
    <div className="relative w-full lg:col-span-2">
      <Wrapper className="flex h-fit max-h-screen w-full flex-col gap-[23px] overflow-auto p-3">
        <Show when={isFetching}>
          <div className="flex items-center justify-center">
            <LoadingIcon size="2rem" />
          </div>
        </Show>
        <CompanyDescription data={data!} mutate={mutate} refetch={refetch} />
        {isWatchList && <NoteCompany note={data?.note_watchlist} refetch={refetch} id={id} user_id={user_id} />}
      </Wrapper>
    </div>
  );
};

export default DetailCompany;
