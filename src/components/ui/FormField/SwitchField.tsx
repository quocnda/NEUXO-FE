import React, { useId } from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '../form';
import { Switch } from '../switch';
import { Show, VStack } from '../Utilities';

interface SwitchProps<T extends FieldValues = FieldValues> {
  isChecked?: boolean;
  control: Control<T>;
  label?: string;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  disabled?: boolean;
  description?: string;
  className?: string;
  classNameThumb?: string;
}

const SwitchField = <T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  description,
  className,
  classNameThumb,
  ...props
}: SwitchProps<T>) => {
  const id = useId();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-start gap-2">
              <Switch
                id={id}
                checked={field.value}
                className={className}
                onCheckedChange={field.onChange}
                disabled={disabled}
                classNameThumb={classNameThumb}
                {...props}
              />
              <VStack spacing={0}>
                <Show when={!!label}>
                  <FormLabel className="text-xs text-neutral-50">{label}</FormLabel>
                </Show>
                <Show when={!!description}>
                  <FormLabel className="text-neutral-40 text-[10px]">{description}</FormLabel>
                </Show>
              </VStack>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { SwitchField };
