import { DialogTitle } from '@radix-ui/react-dialog';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useContactsWatchListViewById } from '@/api/admin-watchlist';
import type { IResponseContacts } from '@/api/company';
import { Icons } from '@/assets/icons';
import { LoadingIcon } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import type { FCC } from '@/types';

interface IModalContactsProps {
  companyId: string;
}
const ModalContacts: FCC<IModalContactsProps> = ({ children, companyId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [visibleContacts, setVisibleContacts] = useState<{ [key: number]: boolean }>({});

  const toggleVisibility = (index: number) => {
    setVisibleContacts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const { data, isFetching } = useContactsWatchListViewById({
    variables: {
      id: String(companyId),
      user_id: String(id),
    },
    enabled: !!companyId && isOpen && !!id,
  });
  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[700px] overflow-auto">
        <HStack className="justify-between">
          <DialogTitle className="text-xl">Contacts</DialogTitle>
        </HStack>

        <Show when={!isFetching}>
          {data?.map((item: IResponseContacts, index: number) => (
            <div key={index} className="mb-2 flex items-center gap-2 ">
              <Wrapper className="flex w-full flex-col gap-2 py-3">
                <HStack pos={'apart'} className="mb-1">
                  <span className="text-sm text-[#516f90]">Name</span>
                  <div className="flex cursor-pointer items-center gap-2" onClick={() => toggleVisibility(index)}>
                    <span className="text-sm">{item?.name || '-'}</span>
                    <button className="text-sm text-blue-500">
                      {visibleContacts[index] ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
                    </button>
                  </div>
                </HStack>
                <VStack
                  spacing={8}
                  style={{
                    maxHeight: visibleContacts[index] ? '500px' : '0',
                    opacity: visibleContacts[index] ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                  }}
                >
                  <HStack spacing={8} pos={'apart'}>
                    <span className="text-sm text-[#516f90]">Email</span>
                    <span className="text-sm">{item?.email || '-'}</span>
                  </HStack>
                  <HStack spacing={8} pos={'apart'}>
                    <span className="text-sm text-[#516f90]">Role</span>
                    <span className="text-sm">{item?.role || '-'}</span>
                  </HStack>
                  <HStack spacing={8} pos={'apart'} noWrap>
                    <span className="whitespace-nowrap text-sm text-[#516f90]">Linkedin Url</span>
                    <a href={item?.linkedin_url || undefined} className="truncate text-sm text-blue-500">
                      {item?.linkedin_url || '-'}
                    </a>
                  </HStack>
                  <HStack spacing={8} pos={'apart'} noWrap>
                    <span className="whitespace-nowrap text-sm text-[#516f90]">Twitter Url</span>
                    <a href={item?.twitter_url || undefined} className="truncate text-sm text-blue-500">
                      {item?.twitter_url || '-'}
                    </a>
                  </HStack>
                </VStack>
              </Wrapper>
            </div>
          ))}
        </Show>

        <Show when={data?.length === 0 && !isFetching}>
          <VStack align="center" className="mt-10">
            <Icons.empty />
            <p className="text-sm font-medium">No data</p>
          </VStack>
        </Show>
        <Show when={isFetching}>
          <VStack align="center" className="mt-10">
            <LoadingIcon size="3rem" />
          </VStack>
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContacts;
