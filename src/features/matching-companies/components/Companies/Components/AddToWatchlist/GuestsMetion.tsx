import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { addWatchList, useContactDetailCompany } from '@/api/company';
import ContactAddNew from '@/components/Modal/Contact/ContactAddNew';
import ContactList from '@/components/Modal/Contact/ContactList';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';

const GuestsMetion = ({
  companyId,
  active,
  handleToggle,
  refetch,
}: {
  companyId: string;
  active: number;
  handleToggle: () => void;
  refetch?: () => void;
}) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isRemovingContact, setIsRemovingContact] = useState(false);
  const {
    data,
    isFetching,
    refetch: refetchContacts,
  } = useContactDetailCompany({
    variables: companyId,
    refetchOnMount: true,
    enabled: !!companyId && active === 2,
  });

  const { mutate: addWatchListMutate } = useMutation(addWatchList, {
    onError: onMutateError,
    onSuccess: () => {
      refetch?.();
      handleToggle();
      toast.success('Add watch list successfully!');
    },
  });

  const handleAddToWatchlist = () => {
    addWatchListMutate({ id: String(companyId) });
  };
  return (
    <>
      <Show when={!isContactFormOpen}>
        <ContactList
          setIsOpen={setIsContactFormOpen}
          data={data}
          isFetching={isFetching}
          refetchContacts={refetchContacts}
          isRemoveContact={isRemovingContact}
          setIsRemoveContact={setIsRemovingContact}
        />
      </Show>
      <Show when={isContactFormOpen}>
        <ContactAddNew
          isOpen={isContactFormOpen}
          setIsOpen={setIsContactFormOpen}
          companyId={companyId}
          refetchContacts={refetchContacts}
        />
      </Show>
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${active === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>
      <Button
        type="submit"
        onClick={handleAddToWatchlist}
        className="px-3"
        disabled={isContactFormOpen || isRemovingContact}
      >
        Add to watchlist
      </Button>
    </>
  );
};

export default GuestsMetion;
