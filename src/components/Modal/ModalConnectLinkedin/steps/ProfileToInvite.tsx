/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';

import ContentCard from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HStack, VStack } from '@/components/ui/Utilities';

const ProfileToInvite = ({
  setActiveStep,
  activeStep,
  isLinkedinUrl,
  setIsLinkedinUrl,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  activeStep: number;
  isLinkedinUrl: string[];
  setIsLinkedinUrl: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [valueInput, setValueInput] = useState<string>('');
  const handleSubmit = (data: any) => {
    setActiveStep(activeStep + 1);
  };
  const handleAddLinkedinUrl = () => {
    if (valueInput) {
      setIsLinkedinUrl([...isLinkedinUrl, valueInput]);
      setValueInput('');
    }
  };
  const handleRemoveLinkedinUrl = (item: string) => {
    setIsLinkedinUrl(isLinkedinUrl.filter((i) => i !== item));
  };
  return (
    <div className="flex h-full flex-col justify-between">
      <VStack spacing={4}>
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          <span className="text-red-500">*</span> Linkedin URL to send invite connection ({isLinkedinUrl.length || 0})
        </label>
        <div className="flex max-h-[200px] flex-wrap gap-2 overflow-auto">
          {isLinkedinUrl.map((item, index) => (
            <ContentCard key={index} content={item} className="w-fit text-xs" handleRemove={handleRemoveLinkedinUrl} />
          ))}
        </div>
        <div className="relative mb-5 mt-2 w-full">
          <Input
            inputSize={'sm'}
            value={valueInput}
            className="w-full pr-10"
            placeholder="Type your Linkedin URL here"
            onChange={(e) => setValueInput(e.target.value)}
          />
          <div
            className="absolute right-1 top-[50%] translate-y-[-50%] cursor-pointer border-l px-3 text-xl"
            onClick={handleAddLinkedinUrl}
          >
            +
          </div>
        </div>
      </VStack>

      <HStack pos={'apart'}>
        <Button
          variant={'outline'}
          onClick={() => setActiveStep(activeStep - 1)}
          className="h-8 border-blue-500 text-sm text-blue-500 hover:text-blue-500"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="h-8 text-sm" disabled={isLinkedinUrl.length === 0}>
          Save
        </Button>
      </HStack>
    </div>
  );
};

export default ProfileToInvite;
