import { Search } from 'lucide-react';
import React from 'react';

import { Input } from '@/components/ui/input';
import { HStack } from '@/components/ui/Utilities';
import { debounceV2 } from '@/lib/utils';

interface IProps {
  paramsQuery: { search_key?: string };
  setParamsQuery: React.Dispatch<React.SetStateAction<{ search_key?: string }>>;
}
const Filter = (props: IProps) => {
  const { paramsQuery, setParamsQuery } = props;

  const handleInputChange = debounceV2((e: React.ChangeEvent<HTMLInputElement>) => {
    setParamsQuery({ ...paramsQuery, search_key: e.target.value });
  }, 500);

  return (
    <HStack spacing={8} pos={'apart'}>
      <HStack spacing={16}>
        <div className="max-w-[400px]">
          <Input
            placeholder={'Search'}
            name="search"
            className="border-neutral-30 h-8 border-2 text-xs"
            suffix={<Search size={16} color="#808080" />}
            onChange={handleInputChange}
          />
        </div>
      </HStack>
    </HStack>
  );
};

export default Filter;
