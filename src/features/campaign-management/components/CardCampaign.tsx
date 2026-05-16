import { useMutation } from '@tanstack/react-query';
import { CalendarRange, Edit, MoreVertical } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { type ICampaignList, updateStatusCampaign } from '@/api/campaign';
import ModalActionCampaign from '@/components/Modal/Campaign/ModalActionCampaign';
import ModalRenameCampagn from '@/components/Modal/Campaign/ModalRenameCampagn';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { Tooltip } from '@/components/ui/tooltip';
import Title1 from '@/components/ui/typography/title1';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';

import { campaignActions } from '../utils/const';
import { getColorStatus } from '../utils/getColorStatus';

interface IProps {
  item?: ICampaignList;
  loading?: boolean;
  refetch?: () => void;
}
const CardCampaign = ({ item, loading, refetch }: IProps) => {
  const router = useRouter();
  const [campaignName, setCampaignName] = useState<string>('');
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const { mutate, isLoading } = useMutation(updateStatusCampaign, {
    onSuccess: () => {
      refetch?.();
      setShouldCloseModal(true);
    },
    onError: onMutateError,
  });

  const handleRenameClick = () => {
    setCampaignName(item?.campaign_name || '');
  };

  const handleRenameChange = (name: string) => {
    if (item) {
      item.campaign_name = name;
    }
    setCampaignName(name);
  };

  const handleAction = (status: string) => {
    mutate(
      { id: String(item?.campaign_id), status_campaign: status },
      { onSuccess: () => toast.success(`${status} campaign successfully!`) }
    );
  };

  return (
    <div className="flex max-w-md flex-col justify-between gap-3 overflow-hidden rounded-lg border border-gray-300 bg-white p-2">
      <VStack spacing={0}>
        <HStack pos={'apart'} noWrap>
          <SkeletonWrapper loading={loading} className="h-8 w-[200px]">
            <Tooltip label={item?.campaign_name}>
              <div
                className="line-clamp-1 cursor-pointer hover:opacity-50"
                onClick={() => router.push(`/campaign-management/campaign-detail/${item?.campaign_id}`)}
              >
                <Title1>{item?.campaign_name}</Title1>
              </div>
            </Tooltip>
          </SkeletonWrapper>
          <Popover>
            <PopoverTrigger asChild>
              <div>
                <SkeletonWrapper loading={loading} className="h-5 w-2">
                  <div className="cursor-pointer">
                    <MoreVertical size={20} color="#6F767E" />
                  </div>
                </SkeletonWrapper>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden rounded-sm border border-white/25 p-1 shadow-xl"
              align="start"
            >
              <VStack spacing={4}>
                {campaignActions
                  .filter(
                    ({ title }) =>
                      (item?.campaign_status === 'Active' &&
                        ['Pause Campaign', 'Stop Campaign', 'Remove Campaign'].includes(title)) ||
                      (item?.campaign_status === 'Paused' &&
                        ['Resume Campaign', 'Stop Campaign', 'Remove Campaign'].includes(title)) ||
                      (item?.campaign_status === 'Completed' && title === 'Remove Campaign')
                  )
                  .map(({ title, content, buttonText, buttonVariant, icon }, index: number) => (
                    <ModalActionCampaign
                      key={index}
                      title={title}
                      content={<Title1 className="p-3 text-center">{content}</Title1>}
                      action={
                        <Button
                          className="w-full"
                          loading={isLoading}
                          variant={buttonVariant as any}
                          onClick={() => handleAction(buttonText)}
                        >
                          {buttonText}
                        </Button>
                      }
                      closeModal={shouldCloseModal}
                      setCloseModal={setShouldCloseModal}
                    >
                      <HStack spacing={8} className="hover:bg-neutral-30 cursor-pointer rounded-sm p-2">
                        {icon}
                        <span className="text-neutral-40 text-xs font-semibold">{buttonText}</span>
                      </HStack>
                    </ModalActionCampaign>
                  ))}
                <ModalRenameCampagn
                  valueName={campaignName}
                  onNameChange={handleRenameChange}
                  campaignId={item?.campaign_id}
                >
                  <HStack
                    spacing={8}
                    className="hover:bg-neutral-30 cursor-pointer rounded-sm p-2"
                    onClick={handleRenameClick}
                  >
                    <Edit size={18} color="#6F767E" />
                    <span className="text-neutral-40 text-xs font-semibold">Rename</span>
                  </HStack>
                </ModalRenameCampagn>
              </VStack>
            </PopoverContent>
          </Popover>
        </HStack>
        <SkeletonWrapper loading={loading} className="h-5 w-[50px]">
          <p className={`text-xs font-medium ${getColorStatus(item?.campaign_status || '')}`}>
            {item?.campaign_status}
          </p>
        </SkeletonWrapper>
      </VStack>
      <VStack spacing={8}>
        <HStack spacing={8}>
          <SkeletonWrapper loading={loading} className="h-5 w-12">
            <div className="basis-8">
              <CalendarRange size={16} />
            </div>
          </SkeletonWrapper>
          <SkeletonWrapper loading={loading} className="h-5 w-32">
            <p className="text-xs font-medium">{moment(item?.day_created).format('DD MMM, YYYY')}</p>
          </SkeletonWrapper>
        </HStack>

        <HStack spacing={8}>
          <SkeletonWrapper loading={loading} className="h-5 w-12">
            <p className="text-main basis-8 text-left text-sm font-bold">{item?.total_email_sent || 0}</p>
          </SkeletonWrapper>
          <SkeletonWrapper loading={loading} className="h-5 w-32">
            <p className="text-xs font-medium">Emails Sent</p>
          </SkeletonWrapper>
        </HStack>
        <HStack spacing={8}>
          <SkeletonWrapper loading={loading} className="h-5 w-12">
            <p className="text-main-purple basis-8 text-left text-sm font-bold">{item?.total_email_opened || 0}</p>
          </SkeletonWrapper>
          <SkeletonWrapper loading={loading} className="h-5 w-32">
            <p className="text-xs font-medium">Emails Opened</p>
          </SkeletonWrapper>
        </HStack>
        <HStack spacing={8}>
          <SkeletonWrapper loading={loading} className="h-5 w-12">
            <p className="text-main-green basis-8 text-left text-sm font-bold">{item?.total_email_replied || 0}</p>
          </SkeletonWrapper>
          <SkeletonWrapper loading={loading} className="h-5 w-32">
            <p className="text-xs font-medium">Emails Replied</p>
          </SkeletonWrapper>
        </HStack>
      </VStack>
    </div>
  );
};

export default CardCampaign;
