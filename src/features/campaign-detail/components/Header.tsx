import { useMutation } from '@tanstack/react-query';
import { Edit, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { type ICampaignDetailDataStatus, updateStatusCampaign } from '@/api/campaign';
import ModalActionCampaign from '@/components/Modal/Campaign/ModalActionCampaign';
import ModalRenameCampagn from '@/components/Modal/Campaign/ModalRenameCampagn';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import Title1 from '@/components/ui/typography/title1';
import Title2 from '@/components/ui/typography/title2';
import { HStack, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { cn } from '@/lib/utils';
import { campaignActions } from '@/features/campaign-management/utils/const';

import { tabs } from '../utils/const';
import { getColorStatus } from '../utils/getColorStatus';

interface IProps {
  tab: number | string;
  data: ICampaignDetailDataStatus | undefined;
  setTab: React.Dispatch<React.SetStateAction<string | number>>;
  refetch: () => void;
  isFetching: boolean;
  campaign_name: string | undefined;
}
const Header = (props: IProps) => {
  const { tab, setTab, data, refetch, isFetching, campaign_name } = props;
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const [campaignName, setCampaignName] = useState(campaign_name || '');
  const { id } = useRouter().query;
  const campaignId = String(id);
  const { mutate, isLoading } = useMutation(updateStatusCampaign, {
    onSuccess: () => {
      refetch();
      setShouldCloseModal(true);
    },
    onError: onMutateError,
  });

  useEffect(() => {
    if (setCampaignName) setCampaignName(campaign_name || '');
  }, [campaign_name]);

  const availableActions = campaignActions.filter(({ title }) => {
    if (data?.campaign_status === 'Active') {
      return ['Pause Campaign', 'Stop Campaign', 'Remove Campaign'].includes(title);
    }
    if (data?.campaign_status === 'Paused') {
      return ['Resume Campaign', 'Stop Campaign', 'Remove Campaign'].includes(title);
    }
    return data?.campaign_status === 'Completed' && title === 'Remove Campaign';
  });

  const handleAction = (status: string) => {
    mutate(
      { id: campaignId, status_campaign: status },
      { onSuccess: () => toast.success(`${status} campaign successfully!`) }
    );
  };

  return (
    <HStack pos={'apart'} spacing={8}>
      <HStack spacing={12}>
        <SkeletonWrapper loading={isFetching}>{getColorStatus(data?.campaign_status || '')}</SkeletonWrapper>
        <SkeletonWrapper loading={isFetching}>
          <Title2>{campaignName}</Title2>
        </SkeletonWrapper>
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <SkeletonWrapper loading={isFetching}>
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
              {availableActions.map(({ title, content, buttonText, buttonVariant, icon }, index: number) => (
                <ModalActionCampaign
                  key={index}
                  title={title}
                  content={<Title1 className="p-3 text-center">{content}</Title1>}
                  action={
                    <Button
                      className="w-full"
                      variant={buttonVariant as any}
                      loading={isLoading}
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
                onNameChange={(name) => {
                  setCampaignName(name);
                }}
                campaignId={campaignId}
              >
                <HStack spacing={8} className="hover:bg-neutral-30 cursor-pointer rounded-sm p-2">
                  <Edit size={18} color="#6F767E" />
                  <span className="text-neutral-40 text-xs font-semibold">Rename</span>
                </HStack>
              </ModalRenameCampagn>
            </VStack>
          </PopoverContent>
        </Popover>
      </HStack>
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
  );
};

export default Header;
