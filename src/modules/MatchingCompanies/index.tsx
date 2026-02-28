import React, { useState } from 'react';

import Tag from '@/components/TagComponent';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { formatItem } from '@/lib/common';
import { cn } from '@/lib/utils';
import withAuth from '@/lib/withAuth';
import { tabs } from '@/utils/const';

import TabelCompanyBlackList from './components/BlackList/TabelCompanyBlackList';
import TableMatching from './components/Companies/TableMatching';

const MatchingCompanies = () => {
  const [tab, setTab] = useState<string | number>(tabs[0].value);
  return (
    <>
      <Wrapper>
        <HStack pos={'apart'}>
          <Tag className="bg-secondary-purple">{formatItem(tab as string)}</Tag>
          <HStack>
            {tabs.map((item, index) => {
              return (
                <div
                  className={cn(
                    'text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-sm px-4 text-xs font-semibold hover:opacity-50',
                    tab === item.value && 'bg-main text-white'
                  )}
                  key={index}
                  onClick={() => setTab(item.value)}
                >
                  {item.label}
                </div>
              );
            })}
          </HStack>
        </HStack>
        <VStack spacing={0}>
          <Show when={tab === 'company'}>
            <TableMatching />
          </Show>
          <Show when={tab === 'blacklist'}>
            <TabelCompanyBlackList />
          </Show>
        </VStack>
      </Wrapper>
    </>
  );
};

export default withAuth(MatchingCompanies);
