import { DialogTitle } from '@radix-ui/react-dialog';
import type { UseMutateFunction } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { HStack, VStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

import Tag from '../../TagComponent';
import { TextArea } from '../../ui/textarea';
import Base3 from '../../ui/typography/base3';

interface IModalAddNoteProps {
  addNote: UseMutateFunction<
    any,
    any,
    {
      note: string;
      company_id: string;
    }[],
    unknown
  >;
  companyId?: string;
  companyName?: string;
  valueNote?: string;
  onSuccess?: (newNote: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalAddNote: FCC<IModalAddNoteProps> = ({
  children,
  addNote,
  companyId,
  companyName,
  valueNote,
  onSuccess,
  isOpen,
  setIsOpen,
}) => {
  const [value, setValue] = useState<string>('');
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setValue('');
  };

  const handleAddNote = () =>
    addNote(
      [
        {
          company_id: String(companyId),
          note: value,
        },
      ],
      {
        onSuccess: () => {
          toast.success('Save note successfully!');
          handleToggle();
          onSuccess?.(value);
        },
      }
    );

  useEffect(() => {
    if (isOpen && valueNote) {
      setValue(valueNote);
    }
  }, [valueNote, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Tag className="bg-secondary-blue" classNameContent="text-lg">
              {companyName} Notes
            </Tag>
          </DialogTitle>
        </DialogHeader>
        <VStack spacing={12}>
          <Base3>Private note</Base3>
          <TextArea
            variant={'default'}
            maxLength={500}
            placeholder="Add notes here..."
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
          <Button fullWidth onClick={handleAddNote} disabled={!value && !valueNote}>
            Save
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddNote;
