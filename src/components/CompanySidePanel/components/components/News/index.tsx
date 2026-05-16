import React, { useState } from 'react';

import { Show } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { tabNewsWatchList } from '@/features/watchlist-all/utils/const';

import CompanyNews from './CompanyNews';
import ContactNews from './ContactNews';
import HeaderNews from './HeaderNews';

const News = ({ isHidden, id, isWatchList }: { isHidden?: boolean; id?: string; isWatchList?: boolean }) => {
  const [tab, setTab] = useState<number | string>(tabNewsWatchList[0].value);
  return (
    <Wrapper className="flex h-fit max-h-screen w-full flex-col gap-4 overflow-auto p-3">
      <HeaderNews tab={tab} setTab={setTab} isHidden={isHidden} isWatchList={isWatchList} id={id} />
      <Show when={tab === tabNewsWatchList[0].value}>
        <CompanyNews id={id} />
      </Show>
      <Show when={tab === tabNewsWatchList[1].value}>
        <ContactNews id={id} />
      </Show>
    </Wrapper>
  );
};

export default News;
