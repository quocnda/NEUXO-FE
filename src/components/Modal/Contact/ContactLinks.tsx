import type { UseMutateFunction } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

import type { IContactDetail } from '@/api/company';
import { Icons } from '@/assets/icons';
import { Input } from '@/components/ui/input';
import { HStack, Show } from '@/components/ui/Utilities';

type IconComponent = React.ComponentType<{ size: number; color: string; className?: string }>;
const ContactLinks = ({
  item,
  mutateUpdate,
}: {
  item: IContactDetail;
  mutateUpdate: UseMutateFunction<any, any, { twitter_url?: string; id: string; linkedin_url?: string }, unknown>;
}) => (
  <>
    <LinkItem
      icon={Icons.linkedin as IconComponent}
      link={item?.linkedin_url}
      isEditTwitter
      onClick={(linkedin_url: string) => mutateUpdate({ id: item.id, linkedin_url })}
    />
    <LinkItem
      icon={Icons.xTwitter as IconComponent}
      link={item?.twitter_url}
      isEditTwitter
      onClick={(twitter_url: string) => mutateUpdate({ id: item.id, twitter_url })}
    />
  </>
);
const LinkItem = ({
  icon: Icon,
  link,
  isEditTwitter,
  onClick,
}: {
  icon: React.ComponentType<{ size: number; color: string; className?: string }>;
  link?: string | null;
  isEditTwitter?: boolean;
  onClick?: (value: string) => void;
}) => {
  const [isEdit, setIsEdit] = useState<{ [key: string]: boolean }>({});
  const [tempLink, setTempLink] = useState<string>(link || '');

  const toggleEdit = (linkKey: string) => {
    setIsEdit((prev) => ({
      ...prev,
      [linkKey]: !prev[linkKey],
    }));
    if (!isEdit[linkKey]) {
      setTempLink(link || '');
    }
  };

  const handleSave = (linkKey: string) => {
    if (onClick) {
      onClick(tempLink);
    }
    toggleEdit(linkKey);
  };

  return (
    <div className="flex w-full flex-nowrap items-center gap-[10.82px]">
      <div className="flex h-5 w-5 items-center justify-center">
        <Icon size={20} color="gray" className="h-4 w-4" />
      </div>
      <Show when={isEditTwitter}>
        {isEdit[link || ''] ? (
          <div className="group flex items-center gap-2">
            <Input
              variant={'outline'}
              value={tempLink}
              inputSize={'xs'}
              onChange={(e) => setTempLink(e.target.value)}
            />
            <HStack spacing={8}>
              <X size={14} color="red" className="cursor-pointer" onClick={() => toggleEdit(link || '')} />
              <Check size={14} color="green" className="cursor-pointer" onClick={() => handleSave(link || '')} />
            </HStack>
          </div>
        ) : (
          <div className="group flex items-center gap-2">
            <p className="text-neutral-40 line-clamp-1 text-sm hover:opacity-50">
              {link?.replace(/^https?:\/\/(www\.)?/, '') || '-'}
            </p>
            <div className="hidden group-hover:block">
              <Icons.edit
                width={14}
                height={14}
                color="green"
                className="cursor-pointer"
                onClick={() => toggleEdit(link || '')}
              />
            </div>
          </div>
        )}
      </Show>
      <Show when={!isEditTwitter}>
        <a href={link || undefined} target="_blank" className="text-neutral-40 truncate text-xs hover:opacity-50">
          {link?.replace(/^https?:\/\/(www\.)?/, '') || '-'}
        </a>
      </Show>
    </div>
  );
};
export default ContactLinks;
