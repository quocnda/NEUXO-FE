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
  const [closeModal, setCloseModal] = useState(false);
  const [isCampaignName, setIsCampaignName] = useState(campaign_name || '');
  const { id } = useRouter().query;
  const { mutate, isLoading } = useMutation(updateStatusCampaign, {
    onSuccess: () => {
      refetch();
      setCloseModal(true);
    },
    onError: onMutateError,
  });

  useEffect(() => {
    if (setIsCampaignName) setIsCampaignName(campaign_name || '');
  }, [campaign_name]);

  return (
    <HStack pos={'apart'} spacing={8}>
      <HStack spacing={12}>
        <SkeletonWrapper loading={isFetching}>{getColorStatus(data?.campaign_status || '')}</SkeletonWrapper>
        <SkeletonWrapper loading={isFetching}>
          <Title2>{isCampaignName}</Title2>
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
              {campaignActions
                .filter(
                  ({ title }) =>
                    (data?.campaign_status === 'Active' &&
                      ['Pause Campaign', 'Stop Campaign', 'Remove Campaign'].includes(title)) ||
                    (data?.campaign_status === 'Paused' &&
                      ['Resume Campaign', 'Stop Campaign', 'Remove Campaign'].includes(title)) ||
                    (data?.campaign_status === 'Completed' && title === 'Remove Campaign')
                )
                .map(({ title, content, buttonText, buttonVariant, icon }, index: number) => (
                  <ModalActionCampaign
                    key={index}
                    title={title}
                    content={<Title1 className="p-3 text-center">{content}</Title1>}
                    action={
                      <Button
                        className="w-full"
                        variant={buttonVariant as any}
                        loading={isLoading}
                        onClick={() =>
                          mutate(
                            { id: String(id), status_campaign: buttonText },
                            { onSuccess: () => toast.success(`${buttonText} campaign successfully!`) }
                          )
                        }
                      >
                        {buttonText}
                      </Button>
                    }
                    closeModal={closeModal}
                    setCloseModal={setCloseModal}
                  >
                    <HStack spacing={8} className="hover:bg-neutral-30 cursor-pointer rounded-sm p-2">
                      {icon}
                      <span className="text-neutral-40 text-xs font-semibold">{buttonText}</span>
                    </HStack>
                  </ModalActionCampaign>
                ))}
              <ModalRenameCampagn
                valueName={isCampaignName}
                onNameChange={(name) => {
                  setIsCampaignName(name);
                }}
                campaignId={String(id)}
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
