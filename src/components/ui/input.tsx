/* eslint-disable no-nested-ternary */
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { NumericFormat, PatternFormat } from 'react-number-format';

import { Icons } from '@/assets/icons';
import { cn } from '@/lib/utils';

import { Show } from './Utilities';

export const inputVariants = cva(
  cn(
    'text-sm text-foreground placeholder:text-muted-foreground bg-background ring-offset-background peer transition-all duration-200',
    'flex w-full file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:bg-muted/60 disabled:border-0'
  ),
  {
    variants: {
      variant: {
        default: 'border border-input hover:border-border/70 focus-visible:border-primary/50 shadow-sm',
        search: 'border border-input h-8 text-xs',
        outline: 'border border-input hover:border-primary/50 focus-visible:border-primary/50 shadow-sm',
        filled: 'bg-surface border border-transparent shadow-sm focus-visible:border-primary/30',
        error: 'bg-error-light text-error placeholder:text-error border border-error/50 focus-visible:ring-error/30',
        check: 'bg-main-dark-gray text-white border-none',
        table: '',
      },
      inputSize: {
        xs: 'h-9 text-xs px-3 rounded-md',
        sm: 'h-11 px-4 py-2 text-sm rounded-md file:text-sm',
        md: 'h-12 p-3 text-sm rounded-lg',
        default: 'h-12 px-10 text-sm rounded-lg file:text-base',
        number: 'h-7 border-[.0938rem] pl-2 pr-8 rounded-md',
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  errorClassName?: string;
  suffix?: any;
  fullWidth?: boolean;
  label?: React.ReactNode;
  format?: string;
  onError?: any;
  suffixSelect?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      label,
      children,
      fullWidth,
      inputSize,
      type,
      suffix,
      id,
      onError,
      suffixSelect,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        <input
          id={id}
          type={type === 'password' ? (show ? 'text' : 'password') : type}
          className={cn(inputVariants({ variant, inputSize, className }))}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div
            className={cn(
              'text-neutral-40 absolute left-[15px] top-1/2 -translate-y-1/2 font-normal italic',
              onError && 'text-main-red'
            )}
          >
            {suffix}
          </div>
        )}
        <Show when={type === 'password'}>
          <div onClick={() => setShow(!show)} className="absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer">
            {show ? (
              <Eye size={18} color={onError ? '#ff6a55' : '#6F767E'} />
            ) : (
              <EyeOff size={18} color={onError ? '#ff6a55' : '#6F767E'} />
            )}
          </div>
        </Show>
        <Show when={suffixSelect}>
          <div className="absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer">
            <Icons.arrowDown size={18} color={onError ? '#ff6a55' : '#6F767E'} />
          </div>
        </Show>
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface InputCardNumberProps extends InputProps {
  decimalScaleType?: string;
}

const InputCardNumber = React.forwardRef<HTMLInputElement, InputCardNumberProps>(
  ({ className, placeholder, format, variant = 'default', inputSize, type, onChange, ...props }, ref) => {
    const value = props.value as string;
    return format ? (
      <PatternFormat
        className={cn(inputVariants({ variant, inputSize, className }))}
        disabled={props.disabled}
        format={format}
        allowEmptyFormatting={false}
        placeholder={placeholder}
        onValueChange={(values) => {
          if (onChange) {
            onChange({
              target: {
                name: props.name ?? '',
                value: values.value,
              },
            } as any);
          }
        }}
        customInput={Input}
      />
    ) : (
      <NumericFormat
        allowNegative={false}
        disabled={props.disabled}
        readOnly={props.readOnly}
        value={value}
        prefix={props.prefix}
        className={cn(inputVariants({ variant, inputSize, className }))}
        suffix={props.suffix}
        thousandSeparator={true}
        placeholder={placeholder}
        onValueChange={(values) => {
          if (onChange) {
            onChange({
              target: {
                name: props.name ?? '',
                value: values.value,
              },
            } as any);
          }
        }}
        customInput={Input}
      />
    );
  }
);

InputCardNumber.displayName = 'InputCardNumber';

export { Input, InputCardNumber };
