import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Icons } from '@/assets/icons';
import Base3 from '@/components/ui/typography/base3';
import H4 from '@/components/ui/typography/h4';
import { HStack, VStack } from '@/components/ui/Utilities';
import { ROUTE } from '@/types';

import { dataAlphaTest } from './const';

const LeftSignIn = () => {
  return (
    <div className="bg-neutral-20 relative col-span-1 hidden min-h-screen items-center justify-center md:flex">
      <Link href={ROUTE.SIGN_IN} className="absolute left-6 top-6">
        <Image src={'/images/auth/logo-small.svg'} width={48} height={48} alt="logo" priority />
      </Link>
      <VStack className="gap-12" align={'center'} justify={'center'}>
        <div className="">
          <Image src={'/images/auth/100M-logo.png'} width={128} height={128} alt="logo" priority />
        </div>
        <H4 className="text-neutral-60">Alpha Test Plan</H4>
        <VStack>
          {dataAlphaTest.map((item, index) => (
            <HStack noWrap key={index} spacing={12}>
              <Icons.light size={18} />
              <Base3 className="text-neutral-40">{item}</Base3>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </div>
  );
};

export default LeftSignIn;
