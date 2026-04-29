import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import type { InputProps } from '../input';
import { Input } from '../input';
import Base3 from '../typography/base3';
import { Show, VStack } from '../Utilities';

interface Props<T extends FieldValues = FieldValues> extends InputProps {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  onError?: boolean;
}

const TextField = <T extends FieldValues>({
  className,
  labelClassName,
  control,
  defaultValue,
  label,
  required,
  variant,
  onError,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <VStack spacing={0}>
              <Show when={!!label}>
                <FormLabel className={labelClassName}>
                  <Base3 className="text-neutral-50">
                    {required && <span className="text-red-500">*</span>} {label}
                  </Base3>
                </FormLabel>
              </Show>
              <Input
                {...field}
                {...props}
                className={className}
                variant={fieldState.error ? 'error' : variant}
                onError={onError || fieldState.error}
                disabled={props.disabled}
              />
              <FormMessage className="mt-1 text-xs" />
            </VStack>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { TextField };
