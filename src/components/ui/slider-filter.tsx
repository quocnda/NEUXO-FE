import type { SliderProps } from 'rc-slider';
import Slider from 'rc-slider';
import React, { useEffect, useState } from 'react';

import { formatNumber } from '@/lib/common';
import { cn } from '@/lib/utils';

import { HStack, VStack } from './Utilities';

type Props = {
  onChange?: (range: number[]) => void;
  onChangeComplete?: (range: number[]) => void;
  onApply?: (range: number[]) => void; // Add onApply prop
  classNames?: {
    handle?: string;
    rail?: string;
    track?: string;
    tracks?: string;
  };
} & Omit<SliderProps, 'onChange' | 'onChangeComplete'>;

const SliderFilter = ({ onChange, onChangeComplete, onApply, classNames, ...props }: Props) => {
  const [range, setRange] = useState<number[]>([(props.value as any)?.[0] || 0, (props.value as any)?.[1] || 100]);

  const handleChange = (rangeValue: any) => {
    setRange(rangeValue);
    onChange?.(rangeValue);
  };

  useEffect(() => {
    if (props.value && (props?.value as any)?.[0]) {
      setRange(props.value as number[]);

      return;
    }

    if ((props.min || props.min === 0) && props.max) {
      setRange([props.min, props.max]);
    }
  }, [props.value, props.min, props.max]);

  return (
    <VStack spacing={4}>
      <HStack noWrap pos="apart" className="text-xs">
        <span>{formatNumber(range[0]) || 0}</span>
        <span>{formatNumber(range[1]) || 100}</span>
      </HStack>

      <div className="px-1">
        <Slider
          range
          allowCross={false}
          classNames={{
            handle: cn(
              '!bg-blue-400 !border-4 !border-grey-100 !w-4 !h-4 !opacity-100 hover:!shadow-[0px_0px_0px_2px_#96dbfa]',
              classNames?.handle
            ),
            rail: cn('!bg-grey-100', classNames?.rail),
            track: cn('!bg-blue-400', classNames?.track),
            tracks: cn('', classNames?.tracks),
          }}
          {...props}
          value={range}
          onChange={handleChange}
          onChangeComplete={() => onChangeComplete?.(range)}
        />
      </div>
    </VStack>
  );
};

export default SliderFilter;
