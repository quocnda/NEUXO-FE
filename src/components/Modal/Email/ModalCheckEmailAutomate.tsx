import { DialogTitle } from '@radix-ui/react-dialog';
import { Loader } from 'lucide-react';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

import Tag from '@/components/TagComponent';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import type { FCC } from '@/types';

interface IModalCheckEmailAutomateProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalAutomateEmail: React.Dispatch<React.SetStateAction<boolean>>;
  listEmailAction: any[];
}
const ModalCheckEmailAutomate: FCC<IModalCheckEmailAutomateProps> = ({
  children,
  isOpen,
  setIsOpen,
  setIsOpenModalAutomateEmail,
  listEmailAction,
}) => {
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleContinue = () => {
    setIsOpenModalAutomateEmail(true);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (listEmailAction.length > 0) {
        setTimeout(() => {
          handleContinue();
        }, 3000);
      } else {
        setTimeout(() => {
          setIsOpen(false);
          toast.error(
            'No contacts are currently in the sequence. Please select new companies to send automated emails.'
          );
        }, 3000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-orange">Automate Email</Tag>
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-lg font-medium">
          Some contacts are in another active automated email campaign. To avoid spam, we will remove those contacts
          from this email campaign
        </p>
        <div className="mx-auto w-fit animate-spin">
          <Loader />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCheckEmailAutomate;
