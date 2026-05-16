import { DialogTitle } from '@radix-ui/react-dialog';
import type { UseMutateFunction } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { TextArea } from '@/components/ui/textarea';
import Base3 from '@/components/ui/typography/base3';
import { HStack, VStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

interface IModalAddNoteProps {
  addNote: UseMutateFunction<
    any,
    any,
    {
      note?: string;
      email: string;
      priority?: string;
    },
    unknown
  >;
  email?: string;
  valueNote?: string;
  onSuccess?: (newNote: string) => void;
}
const ModalAddNote: FCC<IModalAddNoteProps> = ({ children, addNote, email, valueNote, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [noteValue, setNoteValue] = useState<string>('');
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setNoteValue('');
  };
  const handleAddNote = () =>
    addNote(
      {
        email: String(email),
        note: noteValue,
      },
      {
        onSuccess: () => {
          toast.success('Save note successfully!');
          handleToggle();
          onSuccess?.(noteValue);
        },
      }
    );

  useEffect(() => {
    if (valueNote) {
      setNoteValue(valueNote);
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
            <Tag className="bg-secondary-blue text-xl">Notes</Tag>
          </DialogTitle>
        </DialogHeader>
        <VStack spacing={12}>
          <Base3>Private note</Base3>
          <TextArea
            variant={'default'}
            placeholder="Add notes here..."
            value={noteValue}
            maxLength={500}
            onChange={(e) => {
              setNoteValue(e.target.value);
            }}
          />
        </VStack>

        <HStack pos={'center'} spacing={12} noWrap>
          <Button variant={'outline'} onClick={handleToggle} type="button" fullWidth>
            Cancel
          </Button>
          <Button fullWidth onClick={handleAddNote} disabled={!noteValue.trim() && !valueNote}>
            Save
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddNote;
