import moment from 'moment';
import React from 'react';

import type { ICampaignDetailAbout } from '@/api/campaign';
import { HStack, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';

const getOrdinalSuffix = (index: number) => {
  const j = index % 10;
  const k = index % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};
const AboutComponent = ({ data }: { data: ICampaignDetailAbout | undefined }) => {
  const renderScheduleItem = (schedule: any, index: number) => (
    <div key={index} className="border-neutral-30 bg-neutral-10 rounded-md border-2 p-3 text-xs font-normal">
      Send the {index + 1}
      <sup>{getOrdinalSuffix(index + 1)}</sup> email after <span className="font-bold">{schedule}</span>{' '}
      <span>{index === 0 ? 'days from present' : 'days from the previous email'}</span>
    </div>
  );

  return (
    <Wrapper className="mx-auto flex w-full max-w-[800px] flex-col gap-5 px-3 py-5 shadow-lg md:px-10">
      <HStack pos={'apart'}>
        <p className="text-sm font-semibold">Campaign Name:</p>
        <p className="text-sm font-normal">{data?.campaign_name || '-'}</p>
      </HStack>
      <HStack pos={'apart'}>
        <p className="text-sm font-semibold">Campaign Creation Date:</p>
        <p className="text-sm font-normal">{moment(data?.campaign_creation_date).format('DD MMM, YYYY')}</p>
      </HStack>
      <HStack pos={'apart'}>
        <p className="text-sm font-semibold">Sender Email:</p>
        <p className="text-sm font-normal">{data?.sender_email || '-'}</p>
      </HStack>
      <HStack pos={'apart'}>
        <p className="text-sm font-semibold">Total Contacts:</p>
        <p className="text-sm font-normal">{data?.total_contacts || 0}</p>
      </HStack>
      <VStack spacing={24}>
        <p className="text-sm font-semibold">Campaign Schedule:</p>
        <VStack spacing={16}>
          {data?.campaign_schedule?.map(renderScheduleItem)}
        </VStack>
      </VStack>
    </Wrapper>
  );
};

export default AboutComponent;
