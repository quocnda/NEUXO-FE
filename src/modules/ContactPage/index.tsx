import React from 'react';

import Tag from '@/components/TagComponent';
import { HStack, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

import ContactTable from './components/ContactTable';

const ContactPage = () => {
  return (
    <Wrapper>
      <HStack pos={'apart'}>
        <Tag className="bg-secondary-purple">Contact</Tag>
      </HStack>
      <VStack spacing={0}>
        <ContactTable />
      </VStack>
    </Wrapper>
  );
};

export default ContactPage;
