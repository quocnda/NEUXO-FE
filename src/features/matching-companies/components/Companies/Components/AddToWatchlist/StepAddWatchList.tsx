import React, { useState } from 'react';

import Tag from '@/components/TagComponent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { FCC } from '@/types';

import { Show } from '../../../../../../components/ui/Utilities';
import AddICP from './AddICP';
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
  const [activeStep, setActiveStep] = useState(1);
  const [icpId, setIcpId] = useState('');
  const toggleDialog = () => {
    setActiveStep(1);
    setIsOpen?.(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger onClick={toggleDialog} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-xl flex-col overflow-auto sm:max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>
            <Tag classNameContent="text-xl">{activeStep === 3 ? 'Contact' : 'Company Information'}</Tag>
          </DialogTitle>
        </DialogHeader>
        <Show when={activeStep === 1}>
          <CompanyInfomation
            active={activeStep}
            setActive={setActiveStep}
            handleToggle={toggleDialog}
            companyId={companyId}
          />
        </Show>
        <Show when={activeStep === 2}>
          <AddICP
            companyId={companyId}
            active={activeStep}
            setActive={setActiveStep}
            handleToggle={toggleDialog}
            setIcpId={setIcpId}
          />
        </Show>
        <Show when={activeStep === 3}>
          <GuestsMetion
            companyId={companyId}
            active={activeStep}
            handleToggle={toggleDialog}
            refetch={refetch}
            icpId={icpId}
          />
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default StepAddWatchList;
