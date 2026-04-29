import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Tooltip } from './ui/tooltip';

interface CardProps {
  content: string;
  isError?: boolean;
  handleRemove?: (content: string) => void;
  className?: string;
}

const ContentCard = ({ content, handleRemove, isError, className }: CardProps) => {
  return (
    <Tooltip label={content} className="text-xs">
      <div
        className={cn(
          'flex max-h-[2.875rem] items-center justify-between rounded-md bg-gray-100 px-[1.125rem] py-[.625rem]',
          className,
          { 'bg-[#FFCCCC] text-red-700': isError }
        )}
      >
        <p className="max-w-[80%] truncate">{content}</p>
        <X
          size={12}
          className="cursor-pointer transition-all hover:scale-150"
          onClick={() => handleRemove?.(content)}
        />
      </div>
    </Tooltip>
  );
};

export default ContentCard;
