import type { FC } from 'react';
import React, { useMemo } from 'react';
import Select from 'react-select';

import { cn } from '@/lib/utils';

interface IData {
  label: string;
  value: string;
  image?: string;
  group?: string;
}

interface Props {
  placeholder?: string;
  fullWidth?: boolean;
  data: IData[];
  onChangeValue?: (option: { value: string; label: string }) => void;
  wrapperClassName?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  right?: string;
  isMutiple?: boolean;
  disabled?: boolean;
}

const SelectComp: FC<Props> = ({
  data,
  fullWidth,
  placeholder = 'Please select',
  wrapperClassName,
  onChangeValue,
  className,
  value,
  defaultValue,
  isMutiple,
  right,
  disabled,
  ...props
}) => {
  const _value: any = useMemo(() => {
    if (!value || !data) return null;
    // eslint-disable-next-line consistent-return
    return data.find((x) => x.value === value) || {};
  }, [value, data]);

  const _defaultValue: any = useMemo(() => {
    if (!defaultValue || !data) return null;
    // eslint-disable-next-line consistent-return
    return data.find((x) => x.value === defaultValue) || {};
  }, [defaultValue, data]);

  return (
    <div className={cn('relative z-[100]', fullWidth ? 'w-full' : '', wrapperClassName)}>
      <Select
        isDisabled={disabled}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            height: '34px',
            borderRadius: '8px',
            border: '2px solid #efefef',
            boxShadow: '',
            fontSize: '12px',
          }),
          menu: (base) => ({
            ...base,
            width: 'max-content',
            minWidth: '100%',
            maxWidth: '400px',
            overflow: 'hidden',
            right,
          }),

          option: (base, state) => ({
            ...base,
            fontSize: '12px',
            wordBreak: 'break-word',
            color: state.isSelected ? 'white' : '#000',
          }),
        }}
        onChange={(e) => {
          onChangeValue?.(e || '');
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: '#F3F4F6',
            primary: '#1078F3',
          },
        })}
        value={_value}
        defaultValue={_defaultValue}
        placeholder={placeholder}
        className={cn('min-w-[100px]', className)}
        options={data}
        isMulti={isMutiple}
        instanceId="react-select-comp"
        {...props}
      />
    </div>
  );
};

export { SelectComp };
