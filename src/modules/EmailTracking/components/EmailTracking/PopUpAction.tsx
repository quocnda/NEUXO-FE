import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useState } from 'react';

import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import Caption1 from '@/components/ui/typography/caption1';
import { HStack } from '@/components/ui/Utilities';
import ModalSentMail from '@/modules/EmailTracking/components/EmailTracking/ModalSentMail';

const ActionBar = ({ selectedIds, refetch }: { selectedIds: any[]; refetch: () => void }) => {
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);

  return (
    <motion.div
      className="flex items-center justify-center"
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
          <ModalSentMail
            refetch={refetch}
            setIsOpenSendEmail={setIsOpenSendEmail}
            isOpenSendEmail={isOpenSendEmail}
            contact_email={selectedIds.map((id) => id.email)}
            event_id={selectedIds.map((id) => id.company_id)}
          >
            <Button className="flex h-10 items-center gap-2 text-xs">
              Send Email
              <Mail size={18} />
            </Button>
          </ModalSentMail>
        </HStack>
      </div>
    </motion.div>
  );
};

export default ActionBar;
