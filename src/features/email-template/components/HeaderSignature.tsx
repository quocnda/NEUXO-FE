import type { UseMutateFunction } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import React from 'react';

import { Icons } from '@/assets/icons';
import ModalRemoveSignature from '@/components/Modal/Email/ModalRemoveSignature';
import Base1 from '@/components/ui/typography/base1';
import { HStack, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

interface HeaderSignatureProps {
  dataSignature: any;
  setIsDataSignature: React.Dispatch<React.SetStateAction<any>>;
  isDataSignature: any;
  deleteSignature: UseMutateFunction<any, any, string, unknown>;
  isLoading: boolean;
}
const HeaderSignature = (props: HeaderSignatureProps) => {
  const { dataSignature, setIsDataSignature, isDataSignature, deleteSignature, isLoading } = props;

  const handleSelectSignature = (item: any) => {
    setIsDataSignature(item);
  };

  const handleCreateNew = () =>
    setIsDataSignature({
      id: '',
      signature_html: '',
      signature_name: '',
    });

  return (
    <VStack spacing={12} className="w-full">
      <div className="flex flex-col gap-3">
        {dataSignature?.list_signatures?.map((item: any, index: number) => (
          <div
            key={item.id}
            onClick={() => handleSelectSignature(item)}
            className={cn(
              'border-neutral-30 flex h-10 cursor-pointer items-center justify-between rounded-md border-2 px-2 py-3 hover:opacity-50',
              isDataSignature?.id === item?.id && 'bg-blue-500 text-white'
            )}
          >
            <HStack spacing={8} noWrap>
              <Base1 className="flex cursor-pointer items-center gap-2 text-xs">{item?.signature_name}</Base1>
            </HStack>
            <ModalRemoveSignature
              onRemove={() => {
                deleteSignature(item?.id);
              }}
              isLoading={isLoading}
            >
              <HStack spacing={8} noWrap className="bg-neutral-30 rounded-full p-1">
                <Icons.remove
                  width={12}
                  height={12}
                  color={isDataSignature?.id === item?.id ? '#3B82F6' : '#6F767E'}
                  className="cursor-pointer hover:opacity-60"
                />
              </HStack>
            </ModalRemoveSignature>
          </div>
        ))}
        <div
          onClick={handleCreateNew}
          className={cn(
            'border-neutral-30 flex h-10 cursor-pointer items-center justify-between rounded-md border-2 px-2 py-3 hover:opacity-50'
          )}
        >
          <HStack spacing={8} noWrap className="mx-auto">
            <Plus size={14} color="#6F767E" />
          </HStack>
        </div>
      </div>
    </VStack>
  );
};

export default HeaderSignature;
