/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React from 'react';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { shortenName } from '@/lib/common';

import { Avatar } from '../ui/avatar';
import { Tooltip } from '../ui/tooltip';
import TextBody1 from '../ui/typography/TextBody1';
import CompanyDetail from './components/CompanyDetail';

interface IProps {
  companyName?: string;
  avatarUrl?: string;
  handleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  companyId?: string;
  user_id?: string;
  isWatchList?: boolean;
}
const SheetCompany = (props: IProps) => {
  const { companyName, avatarUrl, companyId, handleClick, user_id, isWatchList } = props;
  const [opened, { toggle }] = useDisclosure(false);

  const router = useRouter();

  const handleDivClick = () => {
    if (companyId) {
      const currentPath = router.pathname;
      const currentQuery = { ...router.query, id: companyId };

      router.push({
        pathname: currentPath,
        query: currentQuery,
      });

      toggle();
    }
  };
  return (
    <>
      <Tooltip label={companyName} side="top" hidden={!(companyName && String(companyName).length > 15)}>
        <div className="flex items-center gap-2" onClick={handleDivClick}>
          <Avatar src={avatarUrl ?? '/images/profile.svg'} className="h-5 w-5 rounded-full" />
          <TextBody1 className="cursor-pointer">{shortenName(companyName, 15) || '-'}</TextBody1>
        </div>
      </Tooltip>
      <Sheet open={opened} onOpenChange={toggle}>
        <SheetContent className="border-neutral-30 max-h-screen overflow-auto border bg-[#f9f8f7] p-0" side={'default'}>
          <CompanyDetail
            id={companyId}
            handleClick={handleClick}
            user_id={user_id}
            isWatchList={isWatchList}
            toggle={toggle}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SheetCompany;
