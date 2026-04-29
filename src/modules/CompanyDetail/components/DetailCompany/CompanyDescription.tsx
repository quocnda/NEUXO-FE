import type { UseMutateFunction } from '@tanstack/react-query';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { type ICompanyDetails } from '@/api/company';
import { Icons } from '@/assets/icons';
import ModalUpdateCompany from '@/components/Modal/Company/ModalUpdateCompany';
import Tag from '@/components/TagComponent';
import { Separator } from '@/components/ui/separator';
import Base1 from '@/components/ui/typography/base1';
import Body1 from '@/components/ui/typography/body1';
import Caption1 from '@/components/ui/typography/caption1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { formatAmount } from '@/lib/common';

import SocialLink from './SocialLink';

type IconComponent = React.ComponentType<{ size?: number; color: string; width?: number; height?: number }>;

const CompanyDescription = ({
  data,
  mutate,
  refetch,
}: {
  data: ICompanyDetails;
  mutate: UseMutateFunction<
    any,
    any,
    {
      twitter_url?: string;
      website?: string;
      country?: string;
      id: string;
    },
    unknown
  >;
  refetch?: () => void;
}) => {
  const [isView, setIsView] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  return (
    <VStack className="gap-[23px]">
      <HStack pos={'apart'}>
        <Tag className="bg-secondary-blue h-6 w-3" classNameContent="text-lg">
          Overview
        </Tag>
        <div className="cursor-pointer" onClick={() => setIsView(!isView)}>
          {isView ? <ChevronDown size={20} /> : <ChevronLeft size={20} />}
        </div>
      </HStack>
      <Show when={isView}>
        <VStack spacing={20}>
          <Body1 className="text-sm text-neutral-50">{data?.short_description}</Body1>
          <div className="grid grid-cols-2 gap-5">
            <VStack spacing={4}>
              <Caption1 className="text-neutral-40 text-xs">Industry</Caption1>
              <Base1 className="truncate text-sm">{data?.industry || '-'}</Base1>
            </VStack>
            <VStack spacing={4}>
              <Caption1 className="text-neutral-40 text-xs">Category</Caption1>
              <Base1 className="truncate text-sm">{data?.category.length > 0 ? data?.category.join(', ') : '-'}</Base1>
            </VStack>
            <Show when={data?.funding && data?.funding?.length !== 0}>
              <VStack spacing={4}>
                <Caption1 className="text-neutral-40 text-xs">Funding Raise</Caption1>
                {data?.funding?.map((item, index) => (
                  <Base1 key={index} className="whitespace-nowrap">
                    Raised: ${formatAmount(item?.amount)}{' '}
                    <span className="text-neutral-40 text-sm">({moment(item?.date).format('YYYY-MM-DD')})</span>
                  </Base1>
                ))}
              </VStack>
            </Show>
          </div>
        </VStack>
      </Show>
      <Separator />
      <HStack pos={'apart'}>
        <SocialLink icon={Icons.website as IconComponent} link={data?.website} name={data?.name} />
        <SocialLink icon={Icons.linkedin as IconComponent} link={data?.linkedin_url} name={data?.name} />
        <SocialLink icon={Icons.xTwitter as IconComponent} link={data?.twitter_url} name={data?.name} />
        <ModalUpdateCompany refetch={refetch} data={data} companyId={String(id)}>
          <Icons.edit color="#9A9FA5" width={16} height={16} className="hover:opacity-50" />
        </ModalUpdateCompany>
      </HStack>
      <Separator />
    </VStack>
  );
};

export default CompanyDescription;
