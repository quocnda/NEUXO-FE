import React from 'react';

import Body2 from '@/components/ui/typography/body2';
import Caption3 from '@/components/ui/typography/caption3';
import { HStack, VStack } from '@/components/ui/Utilities';

interface IProps {
  experiences: any;
}
const Experiences = ({ experiences }: IProps) => {
  return (
    <VStack spacing={12} className="px-3">
      <Body2 className="text-sm">Experiences</Body2>
      <VStack spacing={20} className="max-h-[300px] overflow-auto">
        {experiences?.map((item: any, index: number) => (
          <HStack key={index} spacing={8} align={'start'}>
            <img src={item?.linkedin_company_logo ?? '/images/expreriences.png'} className="h-10 w-10 rounded-full" />
            <VStack spacing={4}>
              <Caption3>{item.title}</Caption3>
              <div>
                <Caption3 className="text-neutral-40">{item.company_name}</Caption3>
                <Caption3 className="text-neutral-40">{item.time_period}</Caption3>
              </div>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default Experiences;
