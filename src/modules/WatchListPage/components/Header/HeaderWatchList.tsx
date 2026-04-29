import { FilePlus, Plus } from 'lucide-react';
import React from 'react';

import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { HStack } from '@/components/ui/Utilities';

import NewsAllWatchlist from './NewsAllWatchlist';

interface IProps {
  openModal: () => void;
  setIsShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenDropdown: boolean;
  openChange: (open: boolean) => void;
}
const HeaderWatchList = ({ openModal, setIsShowUpload, isOpenDropdown, openChange }: IProps) => {
  return (
    <HStack className="mb-4" pos={'apart'} spacing={24}>
      <Tag className="bg-secondary-purple">Watchlist</Tag>
      <HStack spacing={8}>
        <DropdownMenu open={isOpenDropdown} onOpenChange={openChange}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex h-8 cursor-pointer items-center gap-2 px-2 text-xs hover:opacity-50"
            >
              <Plus size={16} />
              Add Watchlist
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-start gap-1 rounded-xl p-2">
            <DropdownMenuItem
              className="text-neutral-40 flex cursor-pointer items-start justify-start gap-3 text-xs font-semibold"
              onClick={() => setIsShowUpload(true)}
            >
              <Plus size={16} />
              Upload Excel
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem
              className="text-neutral-40 flex w-full cursor-pointer items-start justify-start gap-3 text-xs font-semibold"
              onClick={openModal}
            >
              <FilePlus size={16} />
              Add manually
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NewsAllWatchlist />
      </HStack>
    </HStack>
  );
};

export default HeaderWatchList;
