import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export const inputSizeVariants = cva('', {
  variants: {
    inputSize: {
      xs: 'h-8 px-2 py-1.5 text-xs rounded-sm',
      default: 'h-10 rounded-md',
      md: 'h-11 rounded-md',
      lg: 'h-12 rounded-lg',
    },
  },
  defaultVariants: {
    inputSize: 'default',
  },
});

export type InputSize = VariantProps<typeof inputSizeVariants>['inputSize'];
