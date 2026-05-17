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
  const [activeTab, setActiveTab] = useState<string | number>(tabs[0].value);

  const handleTabChange = (value: string | number) => {
    setActiveTab(value);
  };

  return (
    <>
      <Wrapper>
        <HStack pos={'apart'}>
          <Tag className="bg-secondary-purple">{formatItem(activeTab as string)}</Tag>
          <HStack>
            {tabs.map((item) => {
              return (
                <div
                  className={cn(
                    'text-neutral-40 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-sm px-4 text-xs font-semibold hover:opacity-50',
                    activeTab === item.value && 'bg-main text-white'
                  )}
                  key={item.value}
                  onClick={() => handleTabChange(item.value)}
                >
                  {item.label}
                </div>
              );
            })}
          </HStack>
        </HStack>
        <VStack spacing={0}>
          <Show when={activeTab === 'company'}>
            <TableMatching />
          </Show>
          <Show when={activeTab === 'blacklist'}>
            <TabelCompanyBlackList />
          </Show>
        </VStack>
      </Wrapper>
    </>
  );
};

export default withAuth(MatchingCompanies);
