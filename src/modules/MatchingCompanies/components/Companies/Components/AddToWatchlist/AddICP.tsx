/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { useListICPWatchlist } from '@/api/watchlist';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { SelectField } from '@/components/ui/FormField';
import { VStack } from '@/components/ui/Utilities';
import type { SchemaAddICPWatchlist } from '@/lib/validations/company';
import { schemaAddICPWatchlist } from '@/lib/validations/company';

interface Props {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  handleToggle: () => void;
  companyId: string;
  setIcpId: React.Dispatch<React.SetStateAction<string>>;
}
const AddICP = (props: Props) => {
  const { active, setActive, setIcpId } = props;
  const form = useForm<SchemaAddICPWatchlist>({
    defaultValues: {
      icp_id: '',
    },
    resolver: zodResolver(schemaAddICPWatchlist),
  });

  const { data } = useListICPWatchlist();

  const data_list_icp = [
    {
      label: 'Please select',
      value: '',
    },
    ...(data?.map((item: { id: string; icp_name: string }) => ({
      label: item.icp_name,
      value: item.id,
    })) || []),
  ];

  const handleSubmit: SubmitHandler<any> = (formData) => {
    setIcpId(formData.icp_id);
    setActive(active + 1);
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit}>
      <VStack spacing={32}>
        <SelectField
          required
          name="icp_id"
          label="ICP"
          inputSize="sm"
          data={data_list_icp}
          control={form.control}
          placeholder="Select ICP"
        />
        <div className="flex items-center justify-center space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${active === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
        <Button type="submit" fullWidth>
          Continue
        </Button>{' '}
      </VStack>
    </FormWrapper>
  );
};

export default AddICP;
