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
  const [value, setValue] = useState(note || '');
  const router = useRouter();
  const { id, user_id } = router.query;

  const { mutate: addNote } = useMutation(addNoteWatchMatching, {
    onError: onMutateError,
    onSuccess: () => {
      toast.success('Save note successfully!');
      refetch?.();
    },
  });
  const handleAddNote = () =>
    addNote([
      {
        company_id: String(id),
        note: value,
      },
    ]);

  useEffect(() => {
    if (note) {
      setValue(note);
    }
  }, [note]);

  return (
    <VStack spacing={12}>
      <Base3 className="text-neutral-50">Private note</Base3>
      <Tooltip label={value} className="max-w-[500px] text-xs" hidden={!value}>
        <div className="bg-neutral-20 flex min-h-[112px] w-full flex-col gap-4 rounded-md border-2 border-[#9A9FA540] p-3">
          <TextArea
            variant={'unstyled'}
            value={value}
            placeholder="Add notes..."
            disabled={!!user_id}
            className="bg-neutral-20 max-h-[70px] p-0"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <Button variant={'outline'} disabled={!!user_id} className="h-10 w-fit p-3" onClick={handleAddNote}>
            Save
          </Button>
        </div>
      </Tooltip>
    </VStack>
  );
};

export default NoteCompany;
