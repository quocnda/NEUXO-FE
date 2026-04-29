import { useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { logoutRequest } from '@/api/auth';
import { Icons } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import Base1 from '@/components/ui/typography/base1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { formatItem, onMutateError } from '@/lib/common';
import { useUserStore } from '@/stores';
import { ROUTE } from '@/types';

const Caption2Component = dynamic(() => import('@/components/ui/typography/caption2'), { ssr: false });

const AuthProfile = () => {
  const { user } = useAuth();
  const { setIsLogin, role } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetStorage = useUserStore.use.logout();

  const { mutate: logoutUser } = useMutation(logoutRequest, {
    onError: onMutateError,
    onSuccess: () => {
      queryClient.removeQueries();
      resetStorage();
      setIsLogin(false);
      router.replace(ROUTE.SIGN_IN);
      localStorage.clear();
      toast.success('Logout successfully!');
    },
  });
  const handleLogoutClick = () => {
    logoutUser();
  };
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="pr-10">
      <Popover open={isOpen} onOpenChange={handleToggle}>
        <PopoverTrigger asChild>
          <HStack className="cursor-pointer hover:opacity-90" spacing={12}>
            <Avatar
              src={user?.avatar?.file_path || '/images/no-avatar-user.png'}
              style={{ width: '38px', height: '38px' }}
            />
            <VStack spacing={0}>
              <p className="text-neutral-80 text-[14px] font-semibold">
                {`${user?.first_name || ''} ${user?.last_name || ''}` || user?.email}
              </p>
              <Caption2Component className="text-neutral-40 text-xs">{formatItem(role) || ''}</Caption2Component>
            </VStack>
          </HStack>
        </PopoverTrigger>

        <PopoverContent className="mr-2 flex w-[content] flex-col gap-3 rounded-xl p-4 shadow-[32px_0px_32px_0px_#0000001A]">
          <Show when={role === 'Admin' || role === 'Super_Admin'}>
            <HStack
              spacing={12}
              className="text-neutral-40 cursor-pointer rounded-lg p-3 hover:bg-gray-100"
              onClick={() => router.push(ROUTE.ACCOUNT_MANAGEMENT)}
            >
              <Icons.accountManagement />
              <Base1 className="ml-1">Account Management</Base1>
            </HStack>
          </Show>
          <Show when={role === 'Admin'}>
            <Separator />
          </Show>
          <HStack spacing={12} className="text-main-purple cursor-pointer rounded-lg p-3 hover:bg-gray-100">
            <Icons.upgade />
            <Base1 className="ml-1">Upgrade to Pro</Base1>
          </HStack>
          <Separator />
          <HStack
            className="text-neutral-40 cursor-pointer rounded-lg p-3 hover:bg-gray-100"
            onClick={() => router.push(ROUTE.ACCOUNT_SETTING)}
          >
            <Base1 className="ml-1">Account Setting</Base1>
          </HStack>
          <HStack
            className="text-neutral-40 cursor-pointer rounded-lg p-3 hover:bg-gray-100"
            onClick={handleLogoutClick}
          >
            <Base1 className="ml-1">Logout</Base1>
          </HStack>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AuthProfile;
