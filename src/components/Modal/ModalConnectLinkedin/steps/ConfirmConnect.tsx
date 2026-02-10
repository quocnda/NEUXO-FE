import React from 'react';

import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';

const ConfirmConnect = ({
  activeStep,
  setActiveStep,
  setIsShowPopupConnectLinkedin,
}: {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setIsShowPopupConnectLinkedin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleSubmit = (data: any) => setIsShowPopupConnectLinkedin(false);
  return (
    <div className="flex h-full flex-col justify-between">
      <VStack spacing={4} className="text-md font-medium">
        <p>
          We’re ready to start sending linkedin connections, up to 20 LinkedIn connection invitations per day with a
          30-minute interval between each.
        </p>
        <p>Are you sure you want to proceed?</p>
      </VStack>
      <HStack pos={'apart'} className="mt-5">
        <Button
          variant={'outline'}
          onClick={() => setActiveStep(activeStep - 1)}
          className="h-8 border-blue-500 text-sm text-blue-500 hover:text-blue-500"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="h-8 text-sm">
          Proceed
        </Button>
      </HStack>
    </div>
  );
};

export default ConfirmConnect;
