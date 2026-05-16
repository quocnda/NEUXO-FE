import { Search } from 'lucide-react';
import React from 'react';

import type { IParamsEmailTracking } from '@/api/email-tracking';
import { Input } from '@/components/ui/input';
import { HStack } from '@/components/ui/Utilities';
import { debounceV2, removeUndefinedKeys } from '@/lib/utils';

interface IProps {
  setParamsQuery: React.Dispatch<React.SetStateAction<IParamsEmailTracking>>;
  paramsQuery: IParamsEmailTracking;
}
const FilterEmailTracking = ({ setParamsQuery, paramsQuery }: IProps) => {
  const updateParamsQuery = (newParams: Partial<IParamsEmailTracking>) => {
    setParamsQuery((prev) => removeUndefinedKeys({ ...prev, ...newParams }));
  };

  const handleSearchChange = debounceV2((e: React.ChangeEvent<HTMLInputElement>) => {
    updateParamsQuery({ search_key: e.target.value });
  }, 300);

  return (
    <HStack spacing={8} pos={'apart'} className="mb-4">
      <div className="w-full max-w-[350px]">
        <Input
          placeholder={'Search Company Name, Contact Name or Email'}
          name="search"
          className="border-neutral-30 h-8 border-2 text-xs"
          suffix={<Search size={16} color="#808080" />}
          onChange={handleSearchChange}
        />
      </div>
    </HStack>
  );
};

export default FilterEmailTracking;
