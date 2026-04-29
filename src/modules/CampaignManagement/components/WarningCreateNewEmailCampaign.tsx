import { FileSpreadsheetIcon, X } from 'lucide-react';
import React from 'react';

import { Icons } from '@/assets/icons';
import ModalGuide from '@/components/Modal/Campaign/ModalGuide';
import { HStack } from '@/components/ui/Utilities';

const WarningCreateNewEmailCampaign = ({
  setIsOpenWarning,
}: {
  setIsOpenWarning: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="relative flex flex-col items-start justify-start gap-3 rounded-md bg-[#FFE9BF] px-3 py-2 sm:flex-row sm:items-center sm:justify-center">
      <HStack pos={'apart'} noWrap className="w-full sm:w-fit">
        <HStack spacing={12} noWrap>
          <div>
            <Icons.library />
          </div>
          <span>Learn how to create a new automated email campaign ?</span>
        </HStack>
        <div
          onClick={() => {
            setIsOpenWarning(false);
            localStorage.setItem('isOpenWarning', 'false');
          }}
        >
          <X className="right-2 top-[10px] cursor-pointer sm:absolute" />
        </div>
      </HStack>
      <ModalGuide>
        <div className="flex items-center gap-2 rounded-[5px] border border-[#2A85FF] bg-white px-[10px] py-1 text-xs hover:opacity-50">
          <FileSpreadsheetIcon size={18} />
          Read guide
        </div>
      </ModalGuide>
    </div>
  );
};

export default WarningCreateNewEmailCampaign;
