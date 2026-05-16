import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { addNoteWatchMatching } from '@/api/company';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { Tooltip } from '@/components/ui/tooltip';
import Base3 from '@/components/ui/typography/base3';
import { VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';

const NoteCompany = ({ note, refetch }: { note?: string | null; refetch?: () => void }) => {
  const [noteValue, setNoteValue] = useState(note || '');
  const router = useRouter();
  const { id, user_id } = router.query;

  const { mutate: saveNote } = useMutation(addNoteWatchMatching, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Save note successfully!');
      refetch?.();
    },
  });

  const handleSaveNote = () =>
    saveNote([
      {
        company_id: String(id),
        note: noteValue,
      },
    ]);

  useEffect(() => {
    if (note) {
      setNoteValue(note);
    }
  }, [note]);

  return (
    <VStack spacing={12}>
      <Base3 className="text-neutral-50">Private note</Base3>
      <Tooltip label={noteValue} className="max-w-[500px] text-xs" hidden={!noteValue}>
        <div className="bg-neutral-20 flex min-h-[112px] w-full flex-col gap-4 rounded-md border-2 border-[#9A9FA540] p-3">
          <TextArea
            variant={'unstyled'}
            value={noteValue}
            placeholder="Add notes..."
            disabled={!!user_id}
            className="bg-neutral-20 max-h-[70px] p-0"
            onChange={(e) => {
              setNoteValue(e.target.value);
            }}
          />
          <Button variant={'outline'} disabled={!!user_id} className="h-10 w-fit p-3" onClick={handleSaveNote}>
            Save
          </Button>
        </div>
      </Tooltip>
    </VStack>
  );
};

export default NoteCompany;
