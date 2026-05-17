import React from 'react';

import { VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import withAuth from '@/lib/withAuth';

import TableWatchList from './components/TableWatchList';

const WatchListPage = () => (
  <Wrapper>
    <VStack spacing={0}>
      <TableWatchList />
    </VStack>
  </Wrapper>
);

export default withAuth(WatchListPage);
