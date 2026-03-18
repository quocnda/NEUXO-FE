import React, { useState } from 'react';

import type { IResponsiveTrigger } from '@/api/company';
import { useTriggerCompanyById } from '@/api/company';
import { Icons } from '@/assets/icons';
import Tag from '@/components/TagComponent';
import { LoadingIcon } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import Subtitle1 from '@/components/ui/typography/Subtitle1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';

interface IModalTriggerProps {
  companyId: string;
  tag: string;
  start_date: string | undefined;
}

const RenderField = ({ label, value, isLink = false }: { label: string; value?: string; isLink?: boolean }) => (
  <HStack pos="apart" className="mb-1">
    <Subtitle1>{label}</Subtitle1>
    <Show when={label === 'Amount'}>
      <p className="text-sm">{Number(value).toLocaleString() ?? '-'}</p>
    </Show>
    <Show when={isLink}>
      <a href={value || undefined} target="_blank" className="text-sm text-blue-500">
        {value ?? '-'}
      </a>
    </Show>
    <Show when={!isLink && label !== 'Amount'}>
      <p className="text-sm">{value ?? '-'}</p>
    </Show>
  </HStack>
);

const RenderDataSection = ({
  title,
  data,
  fields,
}: {
  title: string;
  data: any;
  fields: { label: string; key: string; isLink?: boolean }[];
}) => (
  <>
    {data.map((item: { [x: string]: string }, index: React.Key | null | undefined) => (
      <Wrapper key={index}>
        {fields.map(({ label, key, isLink }) => (
          <RenderField key={key} label={label} value={item[key as keyof typeof item]} isLink={isLink} />
        ))}
      </Wrapper>
    ))}
  </>
);

const ModalTrigger: FCC<IModalTriggerProps> = ({ children, companyId, tag, start_date }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  const { data, isLoading } = useTriggerCompanyById<IResponsiveTrigger>({
    variables: { id: companyId, start_date: start_date || undefined },
    enabled: !!companyId && isOpen,
  });

  const contentMapping: Record<string, { title: string; fields: { label: string; key: string; isLink?: boolean }[] }> =
    {
      funding: {
        title: 'Funding',
        fields: [
          { label: 'Name', key: 'name' },
          { label: 'Date', key: 'date' },
          { label: 'Amount', key: 'amount' },
          { label: 'Project URL', key: 'project_url', isLink: true },
          { label: 'Category', key: 'category' },
        ],
      },
      hiring: {
        title: 'Hiring',
        fields: [
          { label: 'Title', key: 'title' },
          { label: 'Category Name', key: 'category__name' },
          { label: 'Linkedin URL', key: 'linkedin_url', isLink: true },
          { label: 'Label Name', key: 'label__name', isLink: true },
          { label: 'Created At', key: 'created_at' },
        ],
      },
      event: {
        title: 'Event Attended',
        fields: [
          { label: 'Name', key: 'name' },
          { label: 'Event URL', key: 'event_url', isLink: true },
          { label: 'Start Date', key: 'start_date' },
        ],
      },
      news: {
        title: 'News',
        fields: [
          { label: 'News URL', key: 'link_news', isLink: true },
          { label: 'Category', key: 'category' },
          { label: 'Time Post', key: 'time_post' },
        ],
      },
    };

  const selectedContent = contentMapping[tag];

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-screen-md overflow-auto">
        <DialogHeader>
          <Tag classNameContent="text-xl">{selectedContent.title}</Tag>
        </DialogHeader>
        <VStack spacing={4}>
          <Show
            when={
              data &&
              tag in data &&
              selectedContent &&
              Array.isArray(data[tag as keyof IResponsiveTrigger]) &&
              (data[tag as keyof IResponsiveTrigger]?.length || 0) > 0
            }
          >
            <RenderDataSection
              title={selectedContent.title}
              data={data ? data[tag as keyof IResponsiveTrigger] || [] : []}
              fields={selectedContent.fields}
            />
          </Show>
        </VStack>
        <Show
          when={data && !Object.keys(contentMapping).some((key) => data[key as keyof IResponsiveTrigger]?.length > 0)}
        >
          <VStack align="center" className="mt-5">
            <Icons.empty />
            <p className="text-sm font-medium">No data</p>
          </VStack>
        </Show>
        <Show when={isLoading}>
          <div className={cn('flex items-center justify-center backdrop-blur-md')}>
            <LoadingIcon size="1.5rem" />
          </div>
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTrigger;
