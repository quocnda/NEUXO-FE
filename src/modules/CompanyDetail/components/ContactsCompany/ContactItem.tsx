import { type UseMutateFunction, useMutation } from '@tanstack/react-query';
import { Eye, Mail } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import type { IContactDetail } from '@/api/company';
import { addEmailContact, removeEmailContact, updateEmailContact } from '@/api/guest';
import { Icons } from '@/assets/icons';
import ContactEmail from '@/components/Modal/Contact/ContactEmail';
import ContactLinks from '@/components/Modal/Contact/ContactLinks';
import ModalRemoveContactByAdmin from '@/components/Modal/Contact/ModalRemoveContactByAdmin';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import { Separator } from '@/components/ui/separator';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';
import ModalSentMail from '@/modules/EmailTracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';

import Experiences from './Experiences';

const ContactItem = ({
  item,
  visibleContacts,
  toggleVisibility,
  mutateUpdate,
  isLoadingUpdate,
  refetch,
}: {
  item: IContactDetail;
  visibleContacts: boolean;
  toggleVisibility: () => void;
  mutateUpdate: UseMutateFunction<
    any,
    any,
    {
      twitter_url?: string;
      id: string;
      linkedin_url?: string;
    },
    unknown
  >;
  isLoadingUpdate: boolean;
  refetch?: () => void;
}) => {
  const router = useRouter();
  const { user } = useUserStore.getState();
  const { id } = router.query;
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [contactEmail, setContactEmail] = useState<string[]>([]);
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(true);

  const handleImageError = () => {
    setIsImageVisible(false);
  };
  const { mutate: mutateAddEmail } = useMutation(addEmailContact, {
    onSuccess() {
      refetch?.();
      toast.success('Add email successfully!');
    },
    onError: onMutateError,
  });

  const { mutate: mutateRemoveEmail } = useMutation(removeEmailContact, {
    onSuccess() {
      refetch?.();
      toast.success('Remove email successfully!');
    },
    onError: onMutateError,
  });

  const { mutate: mutateUpdateEmail } = useMutation(updateEmailContact, {
    onSuccess() {
      refetch?.();
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
    <div onClick={toggleVisibility}>
      <Wrapper className="flex cursor-pointer flex-col rounded-[7.21px] border-[1.8px] px-[7.21px] py-[10.82px]">
        <HStack pos={'apart'}>
          <HStack className="cursor-default gap-[10.82px]">
            <Show when={isImageVisible}>
              <img
                className="rounded-full"
                src={item?.avatar_linkedin_url ?? '/images/Avatar.png'}
                alt=""
                width={44}
                height={44}
                onClick={(e) => e.stopPropagation()}
                onError={handleImageError}
              />
            </Show>
            <Show when={!isImageVisible}>
              <img
                className="rounded-full"
                src={'/images/Avatar.png'}
                alt=""
                width={44}
                height={44}
                onClick={(e) => e.stopPropagation()}
              />
            </Show>
            <VStack className="gap-[3.61px]">
              <span className="text-neutral-80 text-sm font-semibold" onClick={(e) => e.stopPropagation()}>
                {item?.name || '-'}
              </span>
              <span className="text-neutral-40 text-xs font-medium" onClick={(e) => e.stopPropagation()}>
                {item?.role || '-'}
              </span>
            </VStack>
          </HStack>
          <HStack spacing={8} onClick={(e) => e.stopPropagation()}>
            <Show when={!!item?.twitter_url}>
              <div
                className="bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:opacity-50"
                onClick={() => window.open(item?.twitter_url, '_blank')}
              >
                <Icons.xTwitter color="#6F767E" width={14} height={14} />
              </div>
            </Show>

            <Show when={!!item?.linkedin_url}>
              <div
                className="bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:opacity-50"
                onClick={() => window.open(item?.linkedin_url, '_blank')}
              >
                <Icons.linkedin color="#6F767E" width={14} height={14} />
              </div>
            </Show>
            <div className="border-neutral-30 h-8 border-r-[1px]" />
            <Show when={user?.has_mail_app_pass}>
              <ModalSentMail
                refetch={refetch}
                setIsOpenSendEmail={setIsOpenSendEmail}
                isOpenSendEmail={isOpenSendEmail}
                contact_email={contactEmail.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}
                event_id={[String(id)]}
              >
                <HStack
                  className={cn(
                    'bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full',
                    item?.emails.length === 0 && 'pointer-events-none cursor-not-allowed opacity-50'
                  )}
                  onClick={() => setContactEmail(item?.emails?.map((emailObj) => emailObj.email) || [])}
                >
                  <Mail size={16} color="gray" />
                </HStack>
              </ModalSentMail>
            </Show>
            <Show when={!user?.has_mail_app_pass}>
              <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
                <div className="bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full">
                  <Mail size={16} color="gray" />
                </div>
              </ModalLoginEmail>
            </Show>
            <div
              className="bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:opacity-50"
              onClick={toggleVisibility}
            >
              <Eye color="#6F767E" width={16} height={16} />
            </div>
            <Show when={user?.role !== 'User'}>
              <ModalRemoveContactByAdmin contactId={item?.id} refetch={refetch}>
                <div className="bg-neutral-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:opacity-50">
                  <Icons.remove color="#6F767E" width={14} height={13} />
                </div>
              </ModalRemoveContactByAdmin>
            </Show>
          </HStack>
        </HStack>
        <VStack
          spacing={0}
          className="cursor-default"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxHeight: visibleContacts ? '500px' : '0',
            opacity: visibleContacts ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.3s ease',
          }}
        >
          <Separator className="my-[10.82px]" />
          <div className="flex flex-col items-center gap-[10.82px] px-[10.82px]">
            <ContactEmail item={item} onAdd={onAdd} onDelete={onDelete} onUpdate={onUpdate} />
            <ContactLinks item={item} mutateUpdate={mutateUpdate} />
          </div>
          <Show when={item?.experiences?.length !== 0}>
            <Separator className="my-[10.82px]" />
            <Experiences experiences={item?.experiences} />
          </Show>
        </VStack>
      </Wrapper>
    </div>
  );
};

export default ContactItem;
