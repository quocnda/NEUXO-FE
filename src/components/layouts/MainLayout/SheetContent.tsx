import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import React from 'react';

import type { IDataNews } from '@/api/news';
import { Tooltip } from '@/components/ui/tooltip';
import Subtitle1 from '@/components/ui/typography/Subtitle1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { shortenName } from '@/lib/common';

interface Props {
  item: IDataNews;
}
const SheetContentComponent = (props: Props) => {
  const { item } = props;
  const isMobile = useMediaQuery('(max-width: 639px)');
  const pos = isMobile ? 'center' : 'left';
  return (
    <Wrapper className="rounded-xl p-3 transition hover:bg-[#F3F6FB]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
        <div className="mx-auto px-2 sm:col-span-1">
          <img src={item?.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover shadow-sm" />
        </div>
        <VStack spacing={4} className="sm:col-span-6">
          <div className="mb-2 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <Link href={item?.link} target="_blank">
              <Subtitle1>{item?.title ?? '-'}</Subtitle1>
            </Link>
          </div>
          <VStack spacing={4} className="mb-2">
            <Tooltip
              hidden={!(item?.description && item?.description.length > 100)}
              label={<p className="max-w-[300px] text-xs">{item?.description}</p>}
            >
              <p className="text-sm">{shortenName(item?.description, 100) ?? '-'}</p>
            </Tooltip>
          </VStack>
          <HStack spacing={4} className="mb-2" pos={pos}>
            <Subtitle1>{item?.name}</Subtitle1>
            <Show when={!!item?.score}>
              <p className="rounded-full border border-[#DDE3EA] bg-white px-2.5 py-1 text-xs text-[#1F2937]">
                {item?.score}
              </p>
            </Show>
          </HStack>
        </VStack>
      </div>
    </Wrapper>
  );
};

export default SheetContentComponent;
