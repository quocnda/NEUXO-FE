import React from 'react';

import Tag from '@/components/TagComponent';
import { HStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import withAuth from '@/lib/withAuth';

import TableTemplate from './components/TableTemplate';

const EmailTemplate = () => {
  const titleLabel = 'Email Template';

  return (
    <Wrapper>
      <HStack pos={'apart'} spacing={8}>
        <Tag className="bg-secondary-purple">{titleLabel}</Tag>
      </HStack>
      <TableTemplate />
    </Wrapper>
  );
};

export default withAuth(EmailTemplate);
