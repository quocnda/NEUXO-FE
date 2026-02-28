/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import type { IContactDetail } from '@/api/company';
import { updateContact, useContactDetailCompany } from '@/api/company';
import Empty from '@/components/Empty';
import { Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { onMutateError } from '@/lib/common';

import ContactItem from './ContactItem';
import HeaderContact from './HeaderContact';

const ContactsCompany = () => {
  const router = useRouter();
  const { id } = router.query;
  const [visibleContacts, setVisibleContacts] = useState<{ [key: number]: boolean }>({});
  const toggleVisibility = (index: number) => {
    setVisibleContacts((prev) => ({
      [index]: !prev[index],
    }));
  };

  const { data, refetch } = useContactDetailCompany({ variables: String(id), enabled: !!id });

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = useMutation(updateContact, {
    onSuccess: () => {
      toast.success('Successfully!');
      refetch?.();
    },
    onError: onMutateError,
  });

  return (
    <Wrapper>
      <div className="flex h-fit max-h-screen w-full flex-col gap-[23px] overflow-auto">
        <HeaderContact id={String(id)} refetch={refetch} />
        <Show when={!!data && data?.length > 0}>
          <VStack spacing={8}>
            {data?.map((item: IContactDetail, index) => (
              <ContactItem
                key={index}
                item={item}
                visibleContacts={visibleContacts[index]}
                toggleVisibility={() => toggleVisibility(index)}
                mutateUpdate={mutateUpdate}
                isLoadingUpdate={isLoadingUpdate}
                refetch={refetch}
              />
            ))}
          </VStack>
        </Show>
      </div>
      <Show when={data?.length === 0 || !data}>
        <Empty content="No contacts" />
      </Show>
    </Wrapper>
  );
};

export default ContactsCompany;
