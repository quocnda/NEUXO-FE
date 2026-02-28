import { motion } from 'framer-motion';
import { useState } from 'react';

import { Icons } from '@/assets/icons';
import ModalRemoveBlackList from '@/components/Modal/Watchlist/ModalRemoveBlackList';
import { Button } from '@/components/ui/button';
import Caption1 from '@/components/ui/typography/caption1';
import { HStack } from '@/components/ui/Utilities';
import { useUserStore } from '@/stores';

const ActionBar = ({
  selectedIds,
  refetch,
  setIsDownloadAll,
  setSelectedIds,
}: {
  selectedIds: any[];
  refetch: () => void;
  setIsDownloadAll: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { user } = useUserStore.getState();
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="bg-neutral-10 fixed bottom-10 z-[9999] flex h-fit w-[100%] max-w-[587px] flex-col items-center justify-between gap-2 rounded-lg p-2 px-5 py-2 shadow-xl sm:flex-row">
        <HStack spacing={12}>
          <Icons.checked width={14} height={14} />
          <Caption1 className="text-neutral-40 text-xs">{selectedIds.length || 0} Account selected</Caption1>
        </HStack>
        <HStack spacing={8}>
          <ModalRemoveBlackList
            selectedIds={selectedIds}
            refetch={refetch}
            setIsDownloadAll={setIsDownloadAll}
            setSelectedIds={setSelectedIds}
          >
            <Button variant={'error'} className="flex h-10 items-center gap-2 border-2 text-xs">
              Remove
              <Icons.remove width={16} height={16} />
            </Button>
          </ModalRemoveBlackList>
        </HStack>
      </div>
    </motion.div>
  );
};

export default ActionBar;
