import { LucideFileText } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

import type { IDataLumaFunding, IParamsMatchingCompaniesList } from '@/api/company';
import { Icons } from '@/assets/icons';
import SheetCompany from '@/components/CompanySidePanel/SheetCompany';
import ModalLoginEmail from '@/components/Modal/Email/ModalLoginEmail';
import renderIcon from '@/components/RenderExternal';
import { Avatar } from '@/components/ui/avatar';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show } from '@/components/ui/Utilities';
import { formatAmount, shortenName } from '@/lib/common';
import { ENUM_PAGE } from '@/lib/const';
import { getIconsEmail, getTooltipLabel } from '@/lib/getIconsEmail';
import { cn } from '@/lib/utils';
import ModalSentMail from '@/modules/EmailTracking/components/EmailTracking/ModalSentMail';
import { useUserStore } from '@/stores';
import type { TypeItemTable } from '@/types/common.type';

interface Props extends TypeItemTable {
  item: IDataLumaFunding;
  refetch?: () => void;
  validEmails: string[];
  paramsQuery: IParamsMatchingCompaniesList;
}
const RowTableList = ({ indexRow, tableLength, item, refetch, validEmails, paramsQuery }: Props) => {
  const router = useRouter();
  const { user } = useUserStore.getState();
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [contactEmail, setContactEmail] = useState<string[]>([]);
  const [isOpenModalLoginEmail, setIsOpenModalLoginEmail] = useState(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const url = `/matching-companies/company-detail/${item?.company_id}?page=funding`;
      if (item?.company_id) {
        localStorage.setItem(ENUM_PAGE.FUNDING_PAGE, paramsQuery.page.toString());
        if (event.ctrlKey || event.metaKey) {
          window.open(url, '_blank');
        } else {
          router.push(url);
        }
      }
    },
    [router, item?.company_id, paramsQuery]
  );

  return (
    <>
      <RowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <Show when={!!item?.company_id}>
            <SheetCompany
              companyName={item?.name}
              avatarUrl={item?.logo_url}
              handleClick={handleClick}
              companyId={item?.company_id}
            />
          </Show>
          <Show when={!item?.company_id}>
            <div className="flex items-center gap-2">
              <Avatar src={item?.logo_url ?? '/images/profile.svg'} className="h-5 w-5 rounded-full" />
              <TextBody1>{shortenName(item?.name, 30) || '-'}</TextBody1>
            </div>
          </Show>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <div className="flex items-center gap-2">
            {renderIcon(Icons.website, item?.website, () => window.open(item?.website, '_blank'))}
            {renderIcon(LucideFileText, item?.project_url, () => window.open(item?.project_url, '_blank'))}
            {renderIcon(Icons.linkedin, item?.linkedin_url, () => window.open(item?.linkedin_url, '_blank'))}
          </div>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.category ?? '-'}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.round ?? '-'}</TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>
            {item?.funding_amount === '0' ? '-' : `$ ${formatAmount(Number(item?.funding_amount))}`}
          </TextBody1>
        </ItemRowTable>
        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <TextBody1>{item?.date ? moment(item.date).format('DD MMM, YYYY') : '-'}</TextBody1>
        </ItemRowTable>

        <ItemRowTable indexRow={indexRow} tableLength={tableLength}>
          <Show when={user?.has_mail_app_pass}>
            <Tooltip label={getTooltipLabel(item?.status_mail, user?.user_name)}>
              <div>
                <ModalSentMail
                  refetch={refetch}
                  setIsOpenSendEmail={setIsOpenSendEmail}
                  isOpenSendEmail={isOpenSendEmail}
                  contact_email={contactEmail}
                  event_id={[item?.company_id]}
                >
                  <HStack
                    spacing={8}
                    className={cn(
                      'bg-neutral-20 flex h-6 w-6 justify-center rounded-full',
                      validEmails.length === 0 && 'pointer-events-none'
                    )}
                    onClick={() =>
                      setContactEmail(
                        item?.lst_email.filter((email) => email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                      )
                    }
                  >
                    {getIconsEmail(item?.status_mail, user?.user_name, validEmails.length !== 0 ? 1 : 0.4)}
                  </HStack>
                </ModalSentMail>
              </div>
            </Tooltip>
          </Show>
          <Show when={!user?.has_mail_app_pass}>
            <Tooltip label={getTooltipLabel(item?.status_mail, user?.user_name)}>
              <div>
                <ModalLoginEmail setIsOpen={setIsOpenModalLoginEmail} isOpen={isOpenModalLoginEmail}>
                  <HStack
                    spacing={8}
                    className={cn(
                      'bg-neutral-20 flex h-6 w-6 justify-center rounded-full',
                      validEmails.length === 0 && 'pointer-events-none'
                    )}
                  >
                    {getIconsEmail(item?.status_mail, user?.user_name, validEmails.length !== 0 ? 1 : 0.4)}
                  </HStack>
                </ModalLoginEmail>
              </div>
            </Tooltip>
          </Show>
        </ItemRowTable>
      </RowTable>
    </>
  );
};

export default RowTableList;
