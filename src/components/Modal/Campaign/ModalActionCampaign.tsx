import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';

interface IModalActionCampaignProps {
  title: string;
  content: any;
  action: any;
  closeModal?: boolean;
  setCloseModal?: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalActionCampaign: FCC<IModalActionCampaignProps> = ({
  children,
  title,
  content,
  action,
  closeModal,
  setCloseModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (closeModal) {
      setIsOpen(false);
      setCloseModal?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeModal]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            <Tag className="bg-secondary-orange">{title}</Tag>
          </DialogTitle>
        </DialogHeader>
        {content}

        <HStack pos={'center'} noWrap className="p-3" spacing={8}>
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full">
            Cancel
          </Button>
          {action}
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalActionCampaign;
