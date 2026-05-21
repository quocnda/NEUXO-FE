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


interface IProps {
  openModal: () => void;
  setIsShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenDropdown: boolean;
  openChange: (open: boolean) => void;
}
const HeaderWatchList = ({ openModal, setIsShowUpload, isOpenDropdown, openChange }: IProps) => {
  const handleOpenUpload = () => setIsShowUpload(true);
  return (
    <HStack className="mb-4" pos={'apart'} spacing={24}>
      <Tag className="bg-secondary-purple">Watchlist</Tag>
      <HStack spacing={8}>
      </HStack>
    </HStack>
  );
};

export default HeaderWatchList;
