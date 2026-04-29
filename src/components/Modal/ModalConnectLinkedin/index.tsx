/* eslint-disable no-nested-ternary */
import { Check } from 'lucide-react';
import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Show } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';

import ConfirmConnect from './steps/ConfirmConnect';
import ConnectToLinkedin from './steps/ConnectToLinkedin';
import FollowUpMessage from './steps/FollowUpMessage';
import InvitationMessage from './steps/InvitationMessage';
import ProfileToInvite from './steps/ProfileToInvite';
import { DataSteps } from './utils/const';

interface IModalConnectLinkedinProps {
  isShowPopupConnectLinkedin: boolean;
  setIsShowPopupConnectLinkedin: React.Dispatch<React.SetStateAction<boolean>>;
  isLinkedinUrl: string[];
  setIsLinkedinUrl: React.Dispatch<React.SetStateAction<string[]>>;
}

const ModalConnectLinkedin: FCC<IModalConnectLinkedinProps> = ({
  children,
  isShowPopupConnectLinkedin,
  setIsShowPopupConnectLinkedin,
  isLinkedinUrl,
  setIsLinkedinUrl,
}) => {
  const [activeStep, setActiveStep] = useState<number>(DataSteps[0].key);

  const handleToggle = () => setIsShowPopupConnectLinkedin(!isShowPopupConnectLinkedin);

  const renderStepItem = (step: (typeof DataSteps)[0]) => (
    <div
      key={step.key}
      className={cn(
        'flex cursor-pointer items-center gap-4 px-2 py-3',
        step.key <= activeStep ? 'text-blue-500' : 'text-[#adafb5]'
      )}
    >
      <span
        className={cn(
          'flex h-[25px] w-[25px] items-center justify-center rounded-full text-white',
          step.key <= activeStep ? 'bg-blue-500' : 'bg-[#d9d9d9]'
        )}
      >
        {step.key < activeStep ? <Check size={20} color="white" /> : <span>{step.key}</span>}
      </span>
      <p className="text-base">{step.label}</p>
    </div>
  );

  return (
    <Dialog open={isShowPopupConnectLinkedin}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen max-w-[1256px] overflow-y-auto overflow-x-hidden px-10 py-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">LinkedIn Connection</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col rounded-md border border-gray-300 bg-white shadow-sm lg:flex-row">
          <div className="flex flex-col items-start border-b border-gray-300 p-6 lg:w-1/4 lg:border-b-0 lg:border-r">
            {DataSteps.map(renderStepItem)}
          </div>
          <div className="flex-1 px-5 py-5">
            <Show when={activeStep === DataSteps[0].key}>
              <ConnectToLinkedin setActiveStep={setActiveStep} activeStep={activeStep} handleToggle={handleToggle} />
            </Show>
            <Show when={activeStep === DataSteps[1].key}>
              <ProfileToInvite
                setActiveStep={setActiveStep}
                activeStep={activeStep}
                isLinkedinUrl={isLinkedinUrl}
                setIsLinkedinUrl={setIsLinkedinUrl}
              />
            </Show>
            <Show when={activeStep === DataSteps[2].key}>
              <InvitationMessage setActiveStep={setActiveStep} activeStep={activeStep} />
            </Show>
            <Show when={activeStep === DataSteps[3].key}>
              <FollowUpMessage setActiveStep={setActiveStep} activeStep={activeStep} />
            </Show>
            <Show when={activeStep === 5}>
              <ConfirmConnect
                setActiveStep={setActiveStep}
                activeStep={activeStep}
                setIsShowPopupConnectLinkedin={setIsShowPopupConnectLinkedin}
              />
            </Show>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConnectLinkedin;
