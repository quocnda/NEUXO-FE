import React from 'react';

import { VStack } from '../ui/Utilities';

const UnresponsiveHandling = () => {
  return (
    <VStack className="gap-3">
      <span className="text-xs font-bold">Unresponsive handling </span>
      <VStack spacing={0}>
        <p className="text-xs font-medium text-black">Move to unresponsive group after sequence completion</p>
        <span className="text-neutral-40 text-[10px] font-medium">
          Recipients who don’t open emails 3 times in a row or don’t respond after all follow-ups will be marked as
          unresponsive
        </span>
      </VStack>
    </VStack>
  );
};

export default UnresponsiveHandling;
