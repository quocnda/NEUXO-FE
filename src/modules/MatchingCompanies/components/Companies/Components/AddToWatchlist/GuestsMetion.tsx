import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { addWatchList, useContactDetailCompany } from '@/api/company';
import { saveICPWatchlist } from '@/api/watchlist';
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
  icpId,
}: {
  companyId: string;
  active: number;
  handleToggle: () => void;
  refetch?: () => void;
  icpId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoveContact, setIsRemoveContact] = useState(false);
  const {
    data,
    isFetching,
    refetch: refetchContacts,
  } = useContactDetailCompany({
    variables: companyId,
    refetchOnMount: true,
    enabled: !!companyId && active === 3,
  });

  const { mutate } = useMutation(saveICPWatchlist, {
    onSuccess: () => {
      toast.success('Add ICP successfully!');
    },
    onError: onMutateError,
  });

  const { mutate: addWatchListMutate } = useMutation(addWatchList, {
    onError: onMutateError,
    onSuccess: () => {
      refetch?.();
      handleToggle();
      toast.success('Add watch list successfully!');
    },
  });

  const handleAddICP = () => {
    mutate({
      icp_id: String(icpId),
      company_id: String(companyId),
    });
  };

  const handleAddWatch = () => {
    addWatchListMutate(
      { id: String(companyId) },
      {
        onSuccess: () => {
          handleAddICP();
        },
      }
    );
  };
  return (
    <>
      <Show when={!isOpen}>
        <ContactList
          setIsOpen={setIsOpen}
          data={data}
          isFetching={isFetching}
          refetchContacts={refetchContacts}
          isRemoveContact={isRemoveContact}
          setIsRemoveContact={setIsRemoveContact}
        />
      </Show>
      <Show when={isOpen}>
        <ContactAddNew isOpen={isOpen} setIsOpen={setIsOpen} companyId={companyId} refetchContacts={refetchContacts} />
      </Show>
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${active === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>
      <Button type="submit" onClick={handleAddWatch} className="px-3" disabled={isOpen || isRemoveContact}>
        Add to watchlist
      </Button>
    </>
  );
};

export default GuestsMetion;
