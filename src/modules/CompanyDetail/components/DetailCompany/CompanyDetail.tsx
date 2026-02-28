import type { UseMutateFunction } from '@tanstack/react-query';
import { Check, Edit2, MapPin, Users2, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { ICompanyDetails } from '@/api/company';
import { Icons } from '@/assets/icons';
import { Input } from '@/components/ui/input';
import Base1 from '@/components/ui/typography/base1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';

const CompanyDetails = ({
  data,
  mutate,
}: {
  data: ICompanyDetails | undefined;
  mutate: UseMutateFunction<
    any,
    any,
    {
      twitter_url?: string;
      website?: string;
      country?: string;
      id: string;
    },
    unknown
  >;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [isEdit, setIsEdit] = useState(false);
  const [tempLink, setTempLink] = useState<string>(data?.country || '');
  const toggleEdit = () => {
    setIsEdit(!isEdit);
    if (!isEdit) {
      setTempLink(data?.country || '');
    }
  };
  const handleSave = () => {
    if (mutate) {
      mutate({
        id: String(id),
        country: tempLink,
      });
    }
    toggleEdit();
  };
  return (
    <>
      <div className="flex items-center gap-4">
        {data?.avatar_url ? (
          <img className="rounded-full" src={data?.avatar_url || ''} width={50} height={50} alt="logo" />
        ) : (
          <div className="bg-neutral-30 flex h-16 w-[75px] items-center justify-center rounded-full">
            <Icons.company width={20} height={20} color="#9A9FA5" />
          </div>
        )}

        <div className="w-full items-start">
          <VStack spacing={8}>
            <p className="text-lg font-bold leading-6">{data?.name}</p>
            <HStack spacing={16}>
              <div className="group flex items-center gap-2">
                <MapPin size={14} color="gray" />
                <Show when={isEdit}>
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempLink}
                      onChange={(e) => setTempLink(e.target.value)}
                      className="min-w-[250px]"
                      inputSize={'xs'}
                    />
                    <HStack spacing={8}>
                      <X size={14} color="red" className="cursor-pointer hover:opacity-50" onClick={toggleEdit} />
                      <Check size={14} color="green" className="cursor-pointer hover:opacity-50" onClick={handleSave} />
                    </HStack>
                  </div>
                </Show>
                <Show when={!isEdit}>
                  <div className="flex items-center gap-2">
                    <Base1 className="text-xs text-neutral-50">{data?.country || '---'}</Base1>
                    <Edit2
                      size={14}
                      color="green"
                      className="hidden cursor-pointer hover:opacity-50 group-hover:block"
                      onClick={toggleEdit}
                    />
                  </div>
                </Show>
              </div>
              <div className="flex items-center gap-1">
                <Users2 size={14} color="gray" />
                <Base1 className="text-xs text-neutral-50">{data?.size}</Base1>
              </div>
            </HStack>
          </VStack>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
