import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { FC } from 'react';

import { cn } from '@/lib/utils';

import Base1 from './ui/typography/base1';
import { HStack } from './ui/Utilities';

interface Option {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}
interface Props {
  data: Option[];
  onChange: (value: string | number) => void;
  value: string | number;
  layoutId: string;
  className?: string;
  borderItemClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
}

const Tabs: FC<Props> = ({
  data,
  onChange,
  value,
  layoutId,
  className,
  borderItemClassName,
  activeItemClassName = 'active relative inline-block pb-2 text-main',
  inactiveItemClassName = 'text-neutral-40 relative inline-block border-transparent pb-2 hover:text-main',
}) => {
  return (
    <div className={cn('border-b', className)}>
      <ul className="flex flex-wrap gap-4">
        {data.map((tab) => {
          const Icon = tab?.icon as LucideIcon;
          return (
            <li
              onClick={() => {
                onChange(tab.value);
              }}
              className={cn(
                value === tab.value ? activeItemClassName : inactiveItemClassName,
                'cursor-pointer text-center'
              )}
              key={tab.value}
            >
              <HStack spacing={8}>
                {tab.icon && <Icon />}
                <Base1> {tab.label}</Base1>
              </HStack>
              {value === tab.value ? (
                <motion.div
                  layoutId={layoutId}
                  className={cn('bg-main absolute bottom-0 z-[5px] h-[.125rem] w-full', borderItemClassName)}
                  initial={{ width: '0' }}
                  animate={{ width: '100%' }}
                  exit={{ width: 0 }}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tabs;
