import clsx from 'clsx';
import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';
import type { FCC } from '@/types';

interface Props {
  height?: 'small' | 'large';
  isHasLine?: boolean;
  isExpandedRow?: boolean;
}

const Info: FCC<Props> = ({ children, isHasLine = true, isExpandedRow }) => {
  return (
    <div className={clsx('transition-1000 group z-[2] col-span-1 mb-[10px] flex min-h-[180px] flex-row')}>
      <div className="flex flex-col items-center pr-4 md:pr-[30px]">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 1 }}
          viewport={{ once: true }}
          className={cn(
            'bg-neutral-30 h-[14px] min-h-[14px] w-[14px] min-w-[14px] rounded-[7px]',
            isExpandedRow && 'bg-main'
          )}
        />
        {isHasLine && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 1 }}
            viewport={{ once: true }}
            className={cn('bg-neutral-30 mt-[14px] h-[100%] w-[3px] rounded-[7px]', isExpandedRow && 'bg-main')}
          />
        )}
      </div>
      <div className="bg-neutral-30 flex w-full flex-col rounded-md px-[20px] py-[20px]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={clsx('transition-1000 text-left text-sm leading-[18px]')}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default Info;
