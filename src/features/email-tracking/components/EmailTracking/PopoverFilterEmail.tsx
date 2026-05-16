import { Check, ChevronDownIcon, X } from 'lucide-react';
import React, { useState } from 'react';

import type { IParamsEmailTracking } from '@/api/email-tracking';
import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

import { dataOpenStatus, dataReplyStatus } from '../../utils/const';

interface PopoverFilterEmailProps {
  updateParamsQuery: (newParams: Partial<IParamsEmailTracking>) => void;
}

const FilterOption = ({
  label,
  data,
  selectedValue,
  onSelect,
  isMutiple = false,
}: {
  label: string;
  data: { value: string; label: string }[];
  selectedValue: any;
  onSelect: (value: string) => void;
  isMutiple?: boolean;
}) => (
  <VStack spacing={4}>
    <HStack pos={'apart'}>
      <label className="text-sm text-gray-800">{label}</label>
    </HStack>
    <Show when={!isMutiple}>
      <HStack spacing={12}>
        {data.map((item) => (
          <div
            key={item.value}
            className={cn(
              'cursor-pointer rounded-full border border-gray-500 px-2 py-1 text-xs text-gray-500',
              selectedValue === item.value && 'border border-blue-500 text-blue-500'
            )}
            onClick={() => onSelect(item.value)}
          >
            {item.label}
          </div>
        ))}
      </HStack>
    </Show>
    <Show when={isMutiple}>
      <div className="grid grid-cols-3">
        {data?.map((i: { label: string; value: string }, z: number) => {
          return (
            <Label
              key={z}
              className="text-grey-600 flex cursor-pointer items-center justify-start space-x-2 px-2 text-sm font-medium"
            >
              <Input
                type="checkbox"
                onChange={() => onSelect(i.value)}
                checked={selectedValue?.includes(i.value)}
                className="hidden"
              />
              <div
                className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border-2 ${
                  selectedValue?.includes(i.value) ? 'border-blue-600 bg-blue-600' : ''
                }`}
              >
                {selectedValue?.includes(i.value) && <Check className="h-4 w-4 text-white" />}
              </div>
              <span className="line-clamp-1 max-w-[12rem] break-all pr-2">{i.label}</span>
            </Label>
          );
        })}
      </div>
    </Show>
  </VStack>
);

const PopoverFilterEmail = (props: PopoverFilterEmailProps) => {
  const { updateParamsQuery } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState<string | undefined>(undefined);
  const [replyStatus, setReplyStatus] = useState<string | undefined>(undefined);
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const handleToggle = () => setIsOpen(!isOpen);

  const handleReset = () => {
    setMinValue(null);
    setMaxValue(null);
    setOpenStatus(undefined);
    setReplyStatus(undefined);
    updateParamsQuery({
      email_sent: undefined,
      open_status: undefined,
      reply_status: undefined,
      email_count_end: undefined,
      email_count_start: undefined,
    });
  };

  const clearSelection =
    (setter: React.Dispatch<React.SetStateAction<any>>, field: string, currentValue: string | string[] | undefined) =>
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (Array.isArray(currentValue)) {
        setter([]);
        updateParamsQuery({ [field]: undefined });
      } else {
        setter(undefined);
        updateParamsQuery({ [field]: undefined });
      }
    };
  const handleFilter = () => {
    updateParamsQuery({
      open_status: openStatus,
      reply_status: replyStatus,
      email_count_end: maxValue || undefined,
      email_count_start: minValue || undefined,
    });
  };

  const getLabelFromData = (data: { value: string; label: string }[], value: string | string[] | undefined) => {
    if (Array.isArray(value) && value.length > 0) {
      return (
        value
          .map((val) => data.find((item) => item.value === val)?.label)
          .filter(Boolean)
          .join(', ') || ''
      );
    }
    return data.find((item) => item.value === value)?.label || '';
  };

  return (
    <Popover open={isOpen} onOpenChange={handleToggle}>
      <PopoverTrigger asChild>
        <div className="flex h-9 w-fit cursor-pointer items-center rounded-sm border border-gray-300 px-2 py-1">
          <Show when={!minValue || !maxValue || (!!openStatus && !replyStatus)}>
            <p className="text-xs text-[#828282]">Filter</p>
          </Show>
          <HStack spacing={8}>
            <Show when={!!minValue && !!maxValue}>
              <FilterBadge
                label={`Email sent: ${minValue} - ${maxValue}`}
                onClear={(event) => {
                  event.stopPropagation();
                  setMinValue(null);
                  setMaxValue(null);
                  updateParamsQuery({
                    email_count_end: undefined,
                    email_count_start: undefined,
                  });
                }}
              />
            </Show>
            <Show when={!!openStatus}>
              <FilterBadge
                label={getLabelFromData(dataOpenStatus, openStatus)}
                onClear={clearSelection(setOpenStatus, 'open_status', openStatus)}
              />
            </Show>
            <Show when={!!replyStatus}>
              <FilterBadge
                label={getLabelFromData(dataReplyStatus, replyStatus)}
                onClear={clearSelection(setReplyStatus, 'reply_status', replyStatus)}
              />
            </Show>
          </HStack>
          <Separator orientation="vertical" className="mx-2 h-5" />
          <ChevronDownIcon size={18} color="#ccc" strokeWidth={3} />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="z-[100] w-[content] rounded-sm border py-0">
        <VStack spacing={12} className="relative px-3 py-2">
          <div className="absolute right-3 cursor-pointer hover:opacity-60" onClick={handleReset}>
            <Icons.reload width="20" color="#828282" />
          </div>
          <VStack className="mt-6" spacing={4}>
            <label className="text-sm text-gray-800">Email sent</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={minValue || ''}
                onChange={(e) => setMinValue(Number(e.target.value))}
                placeholder="From"
                className="max-w-[70px] rounded border px-2 py-1 text-xs"
              />
              <p>-</p>
              <input
                type="number"
                value={maxValue || ''}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                placeholder="To"
                className="max-w-[70px] rounded border px-2 py-1 text-xs"
              />
            </div>
          </VStack>

          <FilterOption
            label="Reply status"
            data={dataReplyStatus}
            selectedValue={replyStatus}
            onSelect={(value) => setReplyStatus(value === replyStatus ? undefined : value)}
          />
          <Button className="h-7 text-xs" onClick={handleFilter}>
            Apply
          </Button>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

const FilterBadge = ({ label, onClear }: { label: string; onClear: (event: React.MouseEvent) => void }) => (
  <div className="flex cursor-pointer items-center rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-[#828282]">
    {label}
    <X size={12} color="#828282" strokeWidth={3} onClick={onClear} className="ml-2 cursor-pointer" />
  </div>
);

export default PopoverFilterEmail;
