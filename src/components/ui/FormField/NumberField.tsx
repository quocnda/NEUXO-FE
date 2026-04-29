import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import type { InputCardNumberProps } from '../input';
import { InputCardNumber } from '../input';

interface Props<T extends FieldValues = FieldValues> extends InputCardNumberProps {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: string;
  required?: boolean;
  showMessage?: boolean;
  suffixInput?: string;
  labelClassName?: string;
  decimalScaleType?: string;
  thousandSeparator?: boolean;
}

const NumberField = <T extends FieldValues>({
  control,
  defaultValue,
  label,
  required,
  labelClassName,
  suffixInput,
  showMessage = true,
  thousandSeparator,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className={`flex ${labelClassName}`}>
              <p className="font-semibold">{label}</p>
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <InputCardNumber {...field} {...props} />
              {suffixInput && (
                <p className="text-neutral-30 absolute bottom-0 right-2 top-0 z-[99] my-auto">{suffixInput}</p>
              )}
            </div>
          </FormControl>
          {showMessage && <FormMessage className="mt-1 text-left font-normal" />}
        </FormItem>
      )}
    />
  );
};

export { NumberField };
