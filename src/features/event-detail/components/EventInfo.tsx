import { Instagram, MessageSquare, Youtube } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import type { IResponseEventParentInfor } from '@/api/company';
import { Icons } from '@/assets/icons';
import renderIcon from '@/components/RenderExternal';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import H4 from '@/components/ui/typography/h4';
import { HStack, VStack } from '@/components/ui/Utilities';

interface IProps {
  data: IResponseEventParentInfor | undefined;
  loading: boolean;
}
const EventInfo = ({ data, loading }: IProps) => {
  const socialLinks = [
    {
      Icon: Instagram,
      url: data?.instagram_url ?? '',
      size: 14,
    },
    {
      Icon: Icons.xTwitter,
      url: data?.twitter_url ?? '',
      size: 10,
    },
    {
      Icon: Youtube,
      url: data?.youtube_url ?? '',
      size: 16,
    },
    {
      Icon: Icons.linkedin,
      url: data?.linkedin_url ?? '',
      size: 14,
    },
    {
      Icon: Icons.website,
      url: data?.website ?? '',
      size: 14,
    },
  ];

  return (
    <div className="flex items-start gap-6">
      <div className="mt-1">
        <SkeletonWrapper loading={loading}>
          <Image
            src={data?.avatar_image_url || '/images/no-avatar.png'}
            width={100}
            height={100}
            alt="avatar"
            className="rounded-full bg-black object-cover"
          />
        </SkeletonWrapper>
      </div>

      <VStack spacing={12} className="w-full">
        <HStack spacing={24}>
          <SkeletonWrapper loading={loading}>
            <H4 className="text-neutral-70 text-xl">{data?.name}</H4>
          </SkeletonWrapper>
          <SkeletonWrapper loading={loading}>
            <HStack spacing={8}>
              {socialLinks.map(({ Icon, url, size }, index) => (
                <React.Fragment key={`${url}-${size}-${index}`}>
                  {renderIcon(Icon, url, () => window.open(url, '_blank'), false, size, size)}
                </React.Fragment>
              ))}
            </HStack>
          </SkeletonWrapper>
        </HStack>
        <div className="flex items-start gap-4">
          <SkeletonWrapper loading={loading}>
            <div className="mt-1">
              <MessageSquare size={16} color="black" />
            </div>
          </SkeletonWrapper>
          <SkeletonWrapper loading={loading}>
            <p className="text-sm font-medium">{data?.description || 'N/A'}</p>
          </SkeletonWrapper>
        </div>
      </VStack>
    </div>
  );
};

export default EventInfo;
