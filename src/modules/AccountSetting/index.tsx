import React, { useState } from 'react';

import NotImplement from '@/components/NotImplement';
import Tag from '@/components/TagComponent';
import { Separator } from '@/components/ui/separator';
import Base1 from '@/components/ui/typography/base1';
import { Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { cn } from '@/lib/utils';
import withAuth from '@/lib/withAuth';

import Password from './components/AccountStep/Password';
import ProfileInformation from './components/AccountStep/ProfileInformation';
import { DataSteps } from './utils/const';

const AccountSetting = () => {
  const [activeStep, setActiveStep] = useState<number>(DataSteps[0].key);

  const renderStepItem = (step: (typeof DataSteps)[0]) => (
    <div
      key={step.key}
      onClick={() => setActiveStep(step.key)}
      className={cn(
        'flex w-full cursor-pointer items-center rounded-md px-4 py-2',
        step.key === activeStep ? 'bg-neutral-30' : 'text-white'
      )}
    >
      <Base1 className="text-neutral-70">{step.label}</Base1>
    </div>
  );

  return (
    <VStack spacing={24}>
      <Wrapper>
        <Tag className="bg-secondary-orange">Settings</Tag>
        <div className="flex flex-col gap-[21px] rounded-md border-0 bg-white py-4 md:flex-row">
          <div className="flex flex-col items-start gap-[13px] border-b border-gray-300 md:w-1/5 md:border-b-0">
            {DataSteps.map(renderStepItem)}
          </div>
          <VStack className="flex-1 gap-12 px-3 xl:max-w-[800px] 2xl:max-w-[1200px]">
            <Show when={activeStep === 1}>
              <VStack className="gap-8">
                <ProfileInformation />
                <Separator />
                <Password />
              </VStack>
            </Show>
            <Show when={activeStep === 2}>
              <NotImplement />
            </Show>
          </VStack>
        </div>
      </Wrapper>
    </VStack>
  );
};

export default withAuth(AccountSetting);
