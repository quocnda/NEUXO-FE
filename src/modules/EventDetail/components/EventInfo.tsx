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
              {renderIcon(
                Instagram,
                data?.instagram_url ?? '',
                () => window.open(data?.instagram_url, '_blank'),
                false,
                14,
                14
              )}
              {renderIcon(
                Icons.xTwitter,
                data?.twitter_url ?? '',
                () => window.open(data?.twitter_url, '_blank'),
                false,
                10,
                10
              )}

              {renderIcon(
                Youtube,
                data?.youtube_url ?? '',
                () => window.open(data?.youtube_url, '_blank'),
                false,
                16,
                16
              )}
              {renderIcon(
                Icons.linkedin,
                data?.linkedin_url ?? '',
                () => window.open(data?.linkedin_url, '_blank'),
                false,
                14,
                14
              )}
              {renderIcon(
                Icons.website,
                data?.website ?? '',
                () => window.open(data?.website, '_blank'),
                false,
                14,
                14
              )}
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
