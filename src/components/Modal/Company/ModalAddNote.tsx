import type { UseMutateFunction } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { StickyNote } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { HStack, VStack } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

import { TextArea } from '../../ui/textarea';

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-col items-start gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <StickyNote className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {companyName} Notes
              </DialogTitle>
              <div className="text-sm text-slate-500">Private note</div>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <TextArea
            variant={'default'}
            maxLength={500}
            placeholder="Add notes here..."
            value={value}
            className="min-h-[120px] resize-none text-base"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>

        <DialogFooter className="pt-2">
          <Button variant={'outline'} onClick={handleToggle} type="button" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleAddNote} disabled={!value && !valueNote} className="w-full sm:w-auto">
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddNote;
