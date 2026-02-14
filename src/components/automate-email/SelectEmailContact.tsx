import React from 'react';

import { cn } from '@/lib/utils';

import { VStack } from '../ui/Utilities';

const SelectEmailContact = ({
  listEmailAction,
  handleChangEmail,
  valueEmail,
  isFetching,
}: {
  listEmailAction: any[];
  handleChangEmail: (email: string) => Promise<void>;
  valueEmail: string;
  isFetching: boolean;
}) => {
  return (
    <VStack spacing={12} className="sticky top-0">
      <p className="text-xs font-bold">Contact</p>
      <VStack spacing={12} className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {listEmailAction.map((item, index) => {
          return (
            <div
              key={index}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md border border-[#00000026] p-3 hover:opacity-60',
                valueEmail === item && 'bg-main text-white',
                isFetching && valueEmail !== item && 'bg-neutral-10 cursor-not-allowed hover:opacity-100'
              )}
              onClick={() => {
                if (isFetching) return;
                handleChangEmail(item);
              }}
            >
              <p className="text-xs font-normal">{item}</p>
            </div>
          );
        })}
      </VStack>
    </VStack>
  );
};

export default SelectEmailContact;
