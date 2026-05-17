import React from 'react';

import { Info } from 'lucide-react';

import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Show } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

interface IModalcheckHadOtherWatchlistProps {
  isOpenConfirm: boolean;
  setIsOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: any;
  warningCompanyNames?: string[];
}
const ModalcheckHadOtherWatchlist: FCC<IModalcheckHadOtherWatchlistProps> = ({
  children,
  setIsOpenConfirm,
  isOpenConfirm,
  mutate,
  warningCompanyNames,
}) => {
  const handleToggle = () => {
    setIsOpenConfirm(!isOpenConfirm);
  };
  const addWatchList = () => {
    mutate();
  };
  return (
    <Dialog open={isOpenConfirm} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-slate-900">
            Already in another watchlist
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 px-4 pb-6 pt-2">
          <div className="flex items-center justify-center space-x-[-12px]">
            {Array.from({ length: 3 }).map((src, index) => (
              <div key={index} className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm">
                <img src="/images/Avatar.png" alt={`Avatar ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <Show when={!!warningCompanyNames}>
            <div className="text-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{warningCompanyNames}</span> is already in another watchlist. Do you want to continue to add it into your watchlist?
            </div>
          </Show>
          <Show when={!warningCompanyNames}>
            <div className="text-center text-sm text-slate-500">
              This company is already in another watchlist. Do you want to continue to add it into your watchlist?
            </div>
          </Show>
        </div>
        <DialogFooter className="flex-row gap-3 sm:justify-center sm:space-x-0">
          <Button variant={'outline'} onClick={handleToggle} className="w-full sm:w-32">
            Cancel
          </Button>
          <Button onClick={addWatchList} className="w-full sm:w-32">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalcheckHadOtherWatchlist;
