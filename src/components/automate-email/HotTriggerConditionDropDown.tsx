import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { HStack, VStack } from '../ui/Utilities';
import Wrapper from '../Wrapper';

interface IProps {
  data: { label: string; value: string }[];
  setValueHotTrigger: React.Dispatch<React.SetStateAction<string[]>>;
  valueHotTrigger: string[];
}
const HotTriggerConditionDropDown = ({ data, setValueHotTrigger, valueHotTrigger }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (data) {
      setValueHotTrigger(data.map((item) => item.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckboxChange = (checkedValue: string) => {
    setValueHotTrigger((prev) =>
      prev.includes(checkedValue) ? prev.filter((val) => val !== checkedValue) : [...prev, checkedValue]
    );
  };
  return (
    <Wrapper className="border-neutral-30 bg-neutral-10 flex cursor-pointer flex-col rounded-md border p-3">
      <HStack pos="apart" onClick={handleToggle}>
        <span className="text-shades-0 text-xs font-light">Hot Trigger Condition</span>
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-300', isOpen ? 'rotate-180' : 'rotate-0')}
        />
      </HStack>
      <VStack
        spacing={8}
        className="cursor-default"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
        }}
      >
        <Separator className="my-3" />
        {data?.map((i: { label: string; value: string }, z: number) => {
          return (
            <Label key={z} className="text-grey-600 flex w-full items-center space-x-2 text-xs font-medium">
              <Input
                type="checkbox"
                className="h-3 w-3"
                checked={valueHotTrigger.includes(i.value)}
                onChange={() => handleCheckboxChange(i.value)}
              />
              <span className="line-clamp-1 pr-2">{i.label}</span>
            </Label>
          );
        })}
      </VStack>
    </Wrapper>
  );
};

export default HotTriggerConditionDropDown;
