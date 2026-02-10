import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { renameCampaign } from '@/api/campaign';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';

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
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            <Tag className="bg-secondary-orange" classNameContent="line-clamp-1">
              Rename Campaign
            </Tag>
          </DialogTitle>
        </DialogHeader>
        <VStack spacing={12}>
          <Input
            variant={'default'}
            placeholder="Campaign name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </VStack>
        <HStack pos={'center'} spacing={12} noWrap>
          <Button variant={'outline'} onClick={handleToggle} type="button" fullWidth>
            Cancel
          </Button>
          <Button loading={isLoading} fullWidth onClick={handleChangeName} disabled={!value.trim() && !valueName}>
            Save
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRenameCampagn;
