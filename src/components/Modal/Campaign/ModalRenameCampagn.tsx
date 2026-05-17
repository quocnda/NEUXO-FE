import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Pencil } from 'lucide-react';

import { renameCampaign } from '@/api/campaign';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

interface IModalRenameCampagnProps {
  onNameChange?: (name: string) => void;
  valueName?: string;
  campaignId?: string;
}
const ModalRenameCampagn: FCC<IModalRenameCampagnProps> = ({ children, onNameChange, valueName, campaignId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useMutation(renameCampaign, {
    onSuccess: () => {
      toast.success('Rename successfully!');
      handleToggle();
      onNameChange?.(value);
    },
    onError: onMutateError,
  });
  const [value, setValue] = useState<string>('');
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setValue('');
  };

  const handleChangeName = () => {
    mutate({
      name_campaign: value,
      id: String(campaignId),
    });
  };

  useEffect(() => {
    if (valueName) {
      setValue(valueName);
    }
  }, [valueName, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center border-b border-slate-100 pb-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <Pencil className="h-6 w-6 text-orange-500" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-slate-900">
            Rename Campaign
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-2 text-sm font-medium text-slate-700">Campaign Name</div>
          <Input
            variant={'default'}
            placeholder="Enter new campaign name"
            value={value}
            className="text-base"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>
        <DialogFooter className="pt-2">
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleChangeName} disabled={!value.trim() && !valueName} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRenameCampagn;
