import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { FCC } from '@/types';

import { AlertCircle } from 'lucide-react';

import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '../../ui/button';

interface IModalRemoveWatchListProps {
  removeWatch: () => void;
  isLoading: boolean;
}
const ModalRemoveWatchList: FCC<IModalRemoveWatchListProps> = ({ children, isLoading, removeWatch }) => {
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
        <DialogHeader className="flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-slate-900">
            Remove from Watchlist
          </DialogTitle>
        </DialogHeader>
        <div className="mb-6 mt-2 text-center text-sm text-slate-500">
          Are you sure you want to remove the selected companies from the watchlist? This action cannot be undone.
        </div>
        <DialogFooter className="w-full sm:justify-center">
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full sm:w-32">
            Cancel
          </Button>
          <Button
            loading={isLoading}
            onClick={() => {
              removeWatch();
              handleToggle();
            }}
            variant={'error'}
            className="w-full sm:w-32"
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRemoveWatchList;
