import { useMutation } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';

import { changeRole } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalConfirmChangeRoleProps {
  refetch?: () => void;
  isOpenConfirmChangeRole: { isOpen: boolean; role: string };
  setIsOpenConfirmChangeRole: React.Dispatch<React.SetStateAction<{ isOpen: boolean; role: string }>>;
  user_name: string;
  id: string;
}
const ModalConfirmChangeRole: FCC<IModalConfirmChangeRoleProps> = ({
  children,
  refetch,
  isOpenConfirmChangeRole,
  setIsOpenConfirmChangeRole,
  user_name,
  id,
}) => {
  const handleToggle = () => {
    setIsOpenConfirmChangeRole({
      isOpen: !isOpenConfirmChangeRole.isOpen,
      role: '',
    });
  };
  const { mutate, isLoading } = useMutation(changeRole, {
    onSuccess: () => {
      refetch?.();
      handleToggle();
      toast.success('Change role successfully');
    },
    onError: onMutateError,
  });
  const handleChangeRole = () => {
    mutate({
      role: isOpenConfirmChangeRole.role,
      id: String(id),
    });
  };

  return (
    <Dialog open={isOpenConfirmChangeRole.isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <p className="text-center text-lg font-medium">Are you sure you want to change the role for {user_name}?</p>
        <HStack pos={'center'} noWrap>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full">
            Cancel
          </Button>
          <Button onClick={handleChangeRole} loading={isLoading} className="w-full">
            Change
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmChangeRole;
