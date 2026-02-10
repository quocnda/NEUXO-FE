import { DialogTitle } from '@radix-ui/react-dialog';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

interface IModalRemoveSignatureProps {
  onRemove: () => void;
  isLoading?: boolean;
}
const ModalRemoveSignature: FCC<IModalRemoveSignatureProps> = ({ onRemove, children, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium"></DialogTitle>
        </DialogHeader>
        <p className="text-center text-base font-medium lg:text-xl">Are you sure you want to remove signature?</p>
        <HStack pos={'center'} className="mt-5" spacing={32}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="h-10">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={onRemove} className="h-10">
            Remove
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveSignature;
