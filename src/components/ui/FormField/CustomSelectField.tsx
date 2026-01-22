import type { ReactNode } from 'react';
import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import CustomSelectWithSearch from '../custom-select-with-search';
import { FormField, FormItem, FormMessage } from '../form';

interface IData {
  label: string;
  value: string;
  image?: string;
  group?: string;
}

interface Props<T extends FieldValues = FieldValues> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  data: IData[];
  listCheck?: IData[];
  onRemove?: (value: number) => void;
  listValue?: number[];
  addList: (value: number) => void;
  inputSize?: 'sm' | 'default';
}

const CustomSelectField = <T extends FieldValues>({
  name,
  addList,
  onRemove,
  defaultValue,
  control,
  required,
  listCheck,
  data,
  label,
  listValue,
  inputSize,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <CustomSelectWithSearch
            listCheck={listCheck}
            fullWidth={props.fullWidth}
            data={data}
            onRemove={onRemove}
            listValue={listValue}
            onValueChange={(value) => addList(Number(value))}
            value={field.value}
            disabled={props.disabled}
            label={label}
            inputSize={inputSize}
          />
          <FormMessage className="mt-1 text-left text-base font-medium not-italic" />
        </FormItem>
      )}
    />
  );
};

export { CustomSelectField };
