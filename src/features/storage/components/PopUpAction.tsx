import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useState } from 'react';

import { Icons } from '@/assets/icons';
import ModalBlackList from '@/components/Modal/Account-Management/ModalBlackList';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import { Button } from '@/components/ui/button';
import Caption1 from '@/components/ui/typography/caption1';
import { HStack, Show } from '@/components/ui/Utilities';
import ModalSentMail from '@/features/email-tracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';

const ActionBar = ({
  isListContactEmail,
  selectedIds,
  refetch,
  setIsDownloadAll,
  setSelectedIds,
}: {
  isListContactEmail: any[];
  selectedIds: any[];
  refetch: () => void;
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { user } = useUserStore.getState();
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);
  const listEmailAction = isListContactEmail.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="bg-neutral-10 fixed bottom-10 z-[9999] flex h-fit w-[100%] max-w-[587px] flex-col items-center justify-between gap-2 rounded-lg p-2 px-10 py-3 shadow-lg sm:flex-row">
        <HStack spacing={12}>
          <Icons.checked width={14} height={14} />
          <Caption1 className="text-neutral-40 text-xs">
            {selectedIds.length || 0} {`${selectedIds.length < 2 ? 'Account' : 'Accounts'}`} selected
          </Caption1>
        </HStack>
        <HStack spacing={8}>
          <Show when={!user?.has_mail_app_pass}>
            <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
              <Button className="flex h-10 items-center gap-2 text-xs sm:h-12 sm:text-[15px]">
                Send Email
                <Mail size={24} />
              </Button>
            </ModalLoginEmail>
          </Show>
          <Show when={user?.has_mail_app_pass}>
            <ModalSentMail
              setIsOpenSendEmail={setIsOpenSendEmail}
              isOpenSendEmail={isOpenSendEmail}
              contact_email={listEmailAction}
              event_id={selectedIds}
            >
              <Button className="flex h-10 items-center gap-2 text-xs" disabled={listEmailAction.length === 0}>
                Send Email
                <Mail size={18} />
              </Button>
            </ModalSentMail>
          </Show>
          <ModalBlackList
            selectedIds={selectedIds}
            refetch={refetch}
            setIsDownloadAll={setIsDownloadAll}
            setSelectedIds={setSelectedIds}
          >
            <Button variant={'error'} className="flex h-10 items-center gap-2 border-2 text-xs">
              Blacklist
              <Icons.blacklistCompany width={18} height={18} />
            </Button>
          </ModalBlackList>
        </HStack>
      </div>
    </motion.div>
  );
};

export default ActionBar;
