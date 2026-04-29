import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import type { IContactDetail } from '@/api/company';
import { updateContact } from '@/api/company';
import { addEmailContact, removeEmailContact, updateEmailContact } from '@/api/guest';
import { Icons } from '@/assets/icons';
import { Separator } from '@/components/ui/separator';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { useAuth } from '@/hooks/useAuth';
import { onMutateError } from '@/lib/common';

import ConfirmRemove from './ConfirmRemove';
import ContactEmail from './ContactEmail';
import ContactLinks from './ContactLinks';

const ContactList = ({
  setIsOpen,
  data,
  isFetching,
  refetchContacts,
  isRemoveContact,
  setIsRemoveContact,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: IContactDetail[];
  isFetching: boolean;
  refetchContacts?: () => void;
  isRemoveContact?: boolean;
  setIsRemoveContact?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [visibleContacts, setVisibleContacts] = useState<{ [key: number]: boolean }>({});
  const [idContact, setIdContact] = useState('');
  const { user } = useAuth();
  const toggleVisibility = (index: number) => {
    setVisibleContacts((prev) => ({
      [index]: !prev[index],
    }));
  };

  const { mutate: mutateUpdate } = useMutation(updateContact, {
    onSuccess: () => {
      toast.success('Update contact successfully!');
      refetchContacts?.();
    },
    onError: onMutateError,
  });

  const { mutate: mutateAddEmail } = useMutation(addEmailContact, {
    onSuccess() {
      refetchContacts?.();
      toast.success('Add email successfully!');
    },
    onError: onMutateError,
  });

  const { mutate: mutateRemoveEmail } = useMutation(removeEmailContact, {
    onSuccess() {
      refetchContacts?.();
      toast.success('Remove email successfully!');
    },
    onError: onMutateError,
  });

  const { mutate: mutateUpdateEmail } = useMutation(updateEmailContact, {
    onSuccess() {
      refetchContacts?.();
      toast.success('Update email successfully!');
    },
    onError: onMutateError,
  });

  const onAdd = (id_contact: string, email: string) => {
    mutateAddEmail({ id: id_contact, email });
  };

  const onDelete = (id_email: string) => {
    mutateRemoveEmail(id_email);
  };

  const onUpdate = (id_email: string, id_contact: string, email: string) => {
    mutateUpdateEmail({ id: id_email, contact_id: id_contact, email });
  };

  return (
    <div className="flex h-full flex-col gap-8">
      <Show when={!isRemoveContact}>
        <div>
          <Show when={!isFetching && !!data}>
            <VStack className="gap-2 p-3">
              {data?.map((item: IContactDetail, index: number) => (
                <>
                  <Wrapper
                    key={index}
                    className="flex flex-col rounded-[7.21px] border-[1.8px] px-[7.21px] py-[10.82px]"
                  >
                    <HStack pos={'apart'}>
                      <HStack className="gap-[10.82px]">
                        <div>
                          <img
                            src={item?.avatar_linkedin_url ?? '/images/Avatar.png'}
                            className="rounded-full"
                            alt=""
                            width={44}
                            height={44}
                          />
                        </div>
                        <VStack className="gap-[3.61px]">
                          <span className="text-neutral-80 text-xs font-semibold">{item?.name || '-'}</span>
                          <span className="text-neutral-40 text-xs font-medium">{item?.role || '-'}</span>
                        </VStack>
                      </HStack>
                      <HStack spacing={4}>
                        <div
                          className="bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:opacity-50"
                          onClick={() => toggleVisibility(index)}
                        >
                          <Icons.edit color="#6F767E" width={14} height={14} />
                        </div>
                        <Show when={user?.role !== 'User'}>
                          <div
                            onClick={() => {
                              setIsRemoveContact?.(true);
                              setIdContact(item.id);
                            }}
                            className="bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:opacity-50"
                          >
                            <Icons.remove color="#6F767E" width={14} height={13} />
                          </div>
                        </Show>
                      </HStack>
                    </HStack>
                    <VStack
                      spacing={0}
                      style={{
                        maxHeight: visibleContacts[index] ? '500px' : '0',
                        opacity: visibleContacts[index] ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease, opacity 0.3s ease',
                      }}
                    >
                      <Separator className="my-[10.82px]" />
                      <div className="flex flex-col items-center gap-[10.82px] px-[10.82px]">
                        <ContactEmail item={item} onAdd={onAdd} onDelete={onDelete} onUpdate={onUpdate} />
                        <ContactLinks item={item} mutateUpdate={mutateUpdate} />
                      </div>
                    </VStack>
                  </Wrapper>
                </>
              ))}
              <div
                className="flex cursor-pointer flex-col rounded-[7.21px] border-[1.8px] px-[7.21px] py-2 hover:opacity-50"
                onClick={() => setIsOpen(true)}
              >
                <Plus size={20} color="#9A9FA5" className="mx-auto" />
              </div>
            </VStack>
          </Show>
        </div>
      </Show>
      <Show when={isRemoveContact}>
        <ConfirmRemove
          contactId={idContact}
          refetch={refetchContacts}
          isOpen={isRemoveContact}
          setIsOpen={setIsRemoveContact}
        />
      </Show>
    </div>
  );
};

export default ContactList;
