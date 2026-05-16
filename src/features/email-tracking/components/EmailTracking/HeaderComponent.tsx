import React from 'react';

import Tag from '@/components/TagComponent';
import { HStack } from '@/components/ui/Utilities';

interface IProps {
  setIsDataEmailTemplate: React.Dispatch<React.SetStateAction<{ value: string; label: string } | undefined>>;
  isDataEmailTemplate: { value: string; label: string } | undefined;
}
const HeaderComponent = (props: IProps) => {
  const { isDataEmailTemplate } = props;
  const titleLabel = isDataEmailTemplate?.label || 'New Email';

  return (
    <>
      <Tag className="bg-neutral-0">
        <HStack spacing={4} noWrap className="text-lg font-semibold text-white">
          <span>{titleLabel}</span>
        </HStack>
      </Tag>
    </>
  );
};

export default HeaderComponent;
