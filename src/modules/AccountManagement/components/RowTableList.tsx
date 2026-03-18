/* eslint-disable react/no-unescaped-entities */
import { useMutation } from '@tanstack/react-query';
import { Check, ChevronDown, Eye } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { deleteAccount, type ISignupResponse } from '@/api/auth';
import { Icons } from '@/assets/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LoadingIcon } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';
import type { TypeItemTable } from '@/types/common.type';

import ModalConfirmChangeRole from './ModalConfirmChangeRole';

interface Props extends TypeItemTable {
  item: ISignupResponse;
  index: number;
  refetch?: () => void;
}
const RowTableList = ({ indexRow, tableLength, item, index, refetch }: Props) => {
  const { user } = useAuth();
  const [isOpenConfirmChangeRole, setIsOpenConfirmChangeRole] = useState<{
    isOpen: boolean;
    role: string;
  }>({
    isOpen: false,
    role: '',
  });
  const router = useRouter();
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const { mutate: removeAccount, isLoading } = useMutation(deleteAccount, {
    onSuccess: () => {
      setIsRemove(false);
      refetch?.();
      toast.success('Remove account successfully!');
    },
    onError: onMutateError,
  });

  return (
    <>
      <RowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{index + 1}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.user_name}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.email}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <Show when={item?.role !== 'Super_Admin' && user?.role !== item?.role}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <HStack>
                  <TextBody1 className={cn('cursor-pointer')}>{item?.role}</TextBody1>
                  <ChevronDown size={18} color="#0077B5" />
                </HStack>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit border">
                <DropdownMenuItem
                  disabled={item?.role === 'User'}
                  className="flex cursor-pointer items-center justify-between gap-4 px-5 py-2 text-xs font-normal hover:bg-[#E5E4E4]"
                  onClick={() => setIsOpenConfirmChangeRole({ isOpen: true, role: 'User' })}
                >
                  User {item?.role === 'User' && <Check size={18} color="#10A37F" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={item?.role === 'Admin'}
                  className="flex cursor-pointer items-center justify-between gap-4 px-5 py-2 text-xs font-normal hover:bg-[#E5E4E4]"
                  onClick={() => setIsOpenConfirmChangeRole({ isOpen: true, role: 'Admin' })}
                >
                  Admin {item?.role === 'Admin' && <Check size={18} color="#10A37F" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Show>
          <Show when={item?.role === 'Super_Admin' || user?.role === item?.role}>
            <TextBody1>{item?.role}</TextBody1>
          </Show>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{moment(item?.created_at).format('YYYY-MM-DD')}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <HStack spacing={12} noWrap>
            <Tooltip label="View watch list" className="text-xs">
              <button
                disabled={user?.email === item?.email}
                className={cn(user?.email === item?.email ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
              >
                <HStack spacing={8} className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full">
                  <Eye
                    onClick={() => router.push(`watch-list-other-user/${item?.id}?user_name=${item?.user_name}`)}
                    size={12}
                    color="#6F767E"
                  />
                </HStack>
              </button>
            </Tooltip>
            <AlertDialog open={isRemove} onOpenChange={() => setIsRemove(!isRemove)}>
              <AlertDialogTrigger asChild>
                <button
                  disabled={(user?.email === item?.email && item?.role !== 'User') || item?.role === 'Super_Admin'}
                  className={cn(
                    (user?.email === item?.email && item?.role !== 'User') || item?.role === 'Super_Admin'
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  )}
                >
                  <HStack spacing={8} className="bg-neutral-20 flex h-6 w-6 justify-center rounded-full">
                    <Icons.remove width={12} height={12} color="#6F767E" />
                  </HStack>
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogTitle className="text-center">
                  Are you sure you want to remove this user account?
                </AlertDialogTitle>
                <HStack pos={'center'} noWrap>
                  <AlertDialogCancel
                    className="border-secondary w-full border text-xs"
                    onClick={() => setIsRemove(false)}
                  >
                    Cancel
                  </AlertDialogCancel>{' '}
                  <AlertDialogAction
                    onClick={() => removeAccount({ id: item?.id })}
                    className="bg-error w-full text-xs"
                  >
                    Remove
                    {isLoading && <LoadingIcon className="ml-4" />}
                  </AlertDialogAction>
                </HStack>
              </AlertDialogContent>
            </AlertDialog>
          </HStack>
        </ItemRowTable>
      </RowTable>
      <ModalConfirmChangeRole
        refetch={refetch}
        isOpenConfirmChangeRole={isOpenConfirmChangeRole}
        setIsOpenConfirmChangeRole={setIsOpenConfirmChangeRole}
        user_name={item?.user_name}
        id={item?.id}
      />
    </>
  );
};

export default RowTableList;
