import { useMutation } from '@tanstack/react-query';
import { MoveDiagonal, X } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

import { type ICompanyDetails, updateCompany } from '@/api/company';
import { HStack, Show } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';

import CompanyDetails from '../DetailCompany/CompanyDetail';

interface IProps {
  data: ICompanyDetails | undefined;
  isFetching: boolean;
  refetch?: () => void;
  handleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  toggle?: () => void;
}
const Header = ({ data, isFetching, refetch, handleClick, toggle }: IProps) => {
  const { mutate } = useMutation(updateCompany, {
    onSuccess: () => {
      toast.success('Update successfully!');
      refetch?.();
    },
    onError: onMutateError,
  });
  return (
    <HStack pos={'apart'} className="bg-white px-6 py-5">
      <Show when={!isFetching && !!data}>
        <CompanyDetails mutate={mutate} data={data} />
      </Show>
      <HStack spacing={8}>
        <div onClick={handleClick}>
          <MoveDiagonal className="cursor-pointer" size={20} />
        </div>
        <div onClick={toggle}>
          <X className="cursor-pointer" size={20} />
        </div>
      </HStack>
    </HStack>
  );
};

export default Header;
