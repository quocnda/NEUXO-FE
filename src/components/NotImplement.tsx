import React from 'react';

import { VStack } from './ui/Utilities';

const NotImplement = () => {
  return (
    <VStack align={'center'} spacing={12} className="container mx-auto flex justify-center px-6 py-12">
      <img src="/images/404.png" alt="No Page" className="mx-auto h-40 w-40" />

      <h1 className="text-main-red text-center text-xl font-bold">Sorry, this function is not implemented yet</h1>
    </VStack>
  );
};

export default NotImplement;
