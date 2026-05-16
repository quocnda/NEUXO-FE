import { Plus } from 'lucide-react';
import React from 'react';

import ModalAddGuestMention from '@/components/Modal/Watchlist/ModalAddGuestMention';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/Utilities';

const HeaderContact = ({ id, refetch }: { id: string; refetch: () => void }) => (
  <HStack pos={'apart'}>
    <Tag className="bg-secondary-orange h-6 w-3" classNameContent="text-lg">
      Contacts
    </Tag>
    <ModalAddGuestMention companyId={id} refetch={refetch}>
      <Button className="flex items-center gap-2" size={'sm'}>
        <Plus size={16} />
        <span>Add</span>
      </Button>
    </ModalAddGuestMention>
  </HStack>
);

export default HeaderContact;
