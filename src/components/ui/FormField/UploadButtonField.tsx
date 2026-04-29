import React, { useRef } from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { type MIME_TYPE } from '@/lib/mime';
import { cn } from '@/lib/utils';

import type { ButtonProps } from '../button';
import { Button } from '../button';
import { FormControl, FormField, FormItem, FormMessage } from '../form';
import { HStack } from '../Utilities';

interface Props<T extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'accept'> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  fullWidth?: boolean;
  readonly?: boolean;
  accept?: MIME_TYPE[];
  loading?: boolean;
  btnProps?: ButtonProps;
}

const UploadButtonField = <T extends FieldValues>({
  accept = [],
  control,
  name,
  defaultValue,
  btnProps,
  loading,
  className,
  readonly,
  ...props
}: Props<T>) => {
  const ref = useRef<React.ElementRef<'input'>>(null);

  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const file = value as File;
        return (
          <FormItem>
            <Button
              disabled={props.disabled}
              className={cn('', className)}
              fullWidth
              loading={loading}
              variant={'white'}
              size={'sm'}
              onClick={() => {
                if (ref.current) {
                  ref.current.value = '';
                }
                ref.current?.click();
              }}
              {...btnProps}
            >
              <HStack spacing={16}>
                {/* <Icons.upload /> */}
                <div>Upload</div>
              </HStack>
            </Button>
            <FormControl>
              <input
                hidden
                accept={accept.length === 0 ? undefined : accept.join(', ')}
                type="file"
                onChange={(e) => {
                  onChange(e.target.files?.[0]);
                  e.target.files = null;
                }}
                {...props}
                ref={ref}
              />
            </FormControl>

            <FormMessage className="mt-1 text-xs" />
          </FormItem>
        );
      }}
    />
  );
};

export { UploadButtonField };
