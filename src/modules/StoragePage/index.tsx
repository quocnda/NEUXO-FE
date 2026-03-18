import React from 'react';

import Tag from '@/components/TagComponent';
import { VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import withAuth from '@/lib/withAuth';

import StorageTable from './components/StorageTable';

const StoragePage = () => {
  return (
    <Wrapper>
      <VStack spacing={0}>
        <Tag className="bg-secondary-purple">Storage</Tag>
        <StorageTable />
      </VStack>
    </Wrapper>
  );
};

export default withAuth(StoragePage);
