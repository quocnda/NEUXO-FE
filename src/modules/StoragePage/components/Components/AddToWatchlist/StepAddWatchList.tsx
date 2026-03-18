import React, { useState } from 'react';

import Tag from '@/components/TagComponent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Show } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

import CompanyInfomation from './CompanyInfomation';
import GuestsMetion from './GuestsMetion';

interface IStepAddWatchListProps {
  companyId: string;
  setCompanyId?: React.Dispatch<React.SetStateAction<string>>;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: () => void;
}
const StepAddWatchList: FCC<IStepAddWatchListProps> = ({ children, companyId, isOpen, setIsOpen, refetch }) => {
  const [active, setActive] = useState(1);
  const handleToggle = () => {
    setActive(1);
    setIsOpen?.(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-xl flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <Tag classNameContent="text-xl">{active === 1 ? 'Company Information' : 'Contact'}</Tag>
          </DialogTitle>
        </DialogHeader>
        <Show when={active === 1}>
          <CompanyInfomation active={active} setActive={setActive} handleToggle={handleToggle} companyId={companyId} />
        </Show>
        <Show when={active === 2}>
          <GuestsMetion companyId={companyId} active={active} handleToggle={handleToggle} refetch={refetch} />
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default StepAddWatchList;
