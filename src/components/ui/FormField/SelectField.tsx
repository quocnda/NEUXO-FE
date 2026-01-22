import type { VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import type { selectTriggerVariants } from '../select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import Base3 from '../typography/base3';
import { Show, VStack } from '../Utilities';

interface IData {
  label: string;
  value: string;
  image?: string;
  group?: string;
}

interface Props<T extends FieldValues = FieldValues>
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectTriggerVariants> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  labelClassName?: string;
  valueClassName?: string;
  data: IData[];
  placeholder: string;
}

const SelectField = <T extends FieldValues>({
  name,
  defaultValue,
  control,
  label,
  required,
  data,
  variant,
  inputSize,
  fullWidth,
  className,
  valueClassName,
  labelClassName,
  placeholder,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <div className={cn('relative', fullWidth ? 'w-full' : '')}>
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value} disabled={props.disabled}>
                <FormControl>
                  <VStack spacing={0}>
                    <Show when={!!label}>
                      <FormLabel className={labelClassName}>
                        <Base3 className="text-neutral-50">
                          {required && <span className="text-red-500">*</span>} {label}
                        </Base3>
                      </FormLabel>
                    </Show>
                    <SelectTrigger
                      variant={fieldState.error ? 'error' : variant}
                      inputSize={inputSize}
                      className={cn(
                        { 'w-full': fullWidth },
                        'text-neutral-70 flex justify-start text-xs font-normal',
                        className,
                        fieldState.error ? 'text-main-red' : 'text-neutral-70'
                      )}
                    >
                      <div className="w-full text-left">
                        {data.length === 0 && placeholder}
                        <SelectValue placeholder={placeholder} className="text-neutral-70" />
                      </div>
                      <ChevronDown className="h-4 w-4" color={fieldState.error ? '#EF4444' : '#6B7280'} />
                    </SelectTrigger>
                  </VStack>
                </FormControl>

                <SelectContent className="z-[9999] max-h-[300px] overflow-auto">
                  {data.map((x) => (
                    <SelectItem key={x.value} value={x.value}>
                      {x.image ? (
                        <div className="flex items-center space-x-2">
                          {x.image && <img src={x.image!} alt="" className="h-6 w-6" />}
                          <p>{x.label}</p>
                        </div>
                      ) : (
                        x.label
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="mt-1 text-xs" />
            </FormItem>
          </div>
        );
      }}
    />
  );
};

export { SelectField };
