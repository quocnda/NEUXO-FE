import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { removeWatchListById } from '@/api/company';
import { Icons } from '@/assets/icons';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import ModalRemoveWatchList from '@/components/Modal/Watchlist/ModalRemoveWatchList';
import { Button } from '@/components/ui/button';
import Caption1 from '@/components/ui/typography/caption1';
import { HStack, Show } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import ModalSentMail from '@/features/email-tracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';

const ActionBar = ({
  isListContactEmail,
  selectedIds,
  refetch,
}: {
  isListContactEmail: any[];
  selectedIds: any[];
  refetch: () => void;
}) => {
  const { user } = useUserStore.getState();
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);
  const { mutate: removeWatch, isLoading } = useMutation(removeWatchListById, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Remove watchlist successfully!');
      refetch();
    },
  });
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="bg-neutral-10 fixed bottom-10 z-[9999] flex h-fit w-[100%] max-w-[587px] flex-col items-center justify-between gap-2 rounded-lg p-2 px-5 py-2 shadow-xl sm:flex-row">
        <HStack spacing={12}>
          <Icons.checked width={14} height={14} />
          <Caption1 className="text-neutral-40 text-xs">
            {selectedIds.length || 0} {`${selectedIds.length < 2 ? 'Account' : 'Accounts'}`} selected
          </Caption1>
        </HStack>
        <HStack spacing={8}>
          <Show when={!user?.has_mail_app_pass}>
            <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
              <Button className="flex h-10 items-center gap-2 text-xs">
                Send Email
                <Mail size={18} />
              </Button>
            </ModalLoginEmail>
          </Show>
          <Show when={user?.has_mail_app_pass}>
            <ModalSentMail
              setIsOpenSendEmail={setIsOpenSendEmail}
              isOpenSendEmail={isOpenSendEmail}
              contact_email={isListContactEmail.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}
              event_id={selectedIds}
            >
              <Button className="flex h-10 items-center gap-2 text-xs">
                Send Email
                <Mail size={18} />
              </Button>
            </ModalSentMail>
          </Show>
          <ModalRemoveWatchList removeWatch={() => removeWatch({ ids: selectedIds.join(',') })} isLoading={isLoading}>
            <Button variant={'error'} className="flex h-10 items-center gap-2 text-xs">
              Remove
              <Icons.remove width={18} height={18} />
            </Button>
          </ModalRemoveWatchList>
        </HStack>
      </div>
    </motion.div>
  );
};

export default ActionBar;
