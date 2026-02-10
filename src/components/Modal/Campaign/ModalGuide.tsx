import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';

interface IModalGuideProps {}
const ModalGuide: FCC<IModalGuideProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            <Tag className="bg-secondary-orange" classNameContent="line-clamp-1">
              How to create a new automated email campaign?
            </Tag>
          </DialogTitle>
        </DialogHeader>
        <VStack spacing={20}>
          <div className="h-[300px]">
            <video src="/video/test.mov" controls autoPlay className="h-full w-full rounded-md"></video>
          </div>
          <VStack spacing={8}>
            <ul className="list-inside list-disc text-xs font-medium decoration-solid">
              <p className="text-xs font-medium">To create an automated email campaign, please follow step by steps:</p>
              <li className="my-1">
                <span className="font-bold">Step 1:</span> In the menu bar, select Company list, select all the
                companies that you want to send automated email
              </li>
              <li className="my-1">
                <span className="font-bold">Step 2:</span> Click Automate email button{' '}
                <span className="bg-main w-fit rounded-md px-2 py-1 text-[11px] text-white">Automate Email</span>
              </li>
              <li className="my-1">
                <span className="font-bold">Step 3:</span> Set up and launch email campaign
              </li>
            </ul>
          </VStack>
        </VStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalGuide;
