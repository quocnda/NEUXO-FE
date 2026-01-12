import * as Progress from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const ProgressBar = ({
  process,
  value,
  progressType,
}: {
  process: number | string;
  value?: string;
  progressType?: string;
}) => {
  return (
    <Progress.Root
      className="translate-z-0 relative h-4 w-full transform overflow-hidden rounded-sm bg-gray-200"
      value={Number(process)}
    >
      <Progress.Indicator
        className={`h-full w-full ${
          // eslint-disable-next-line no-nested-ternary
          Number(process) < 30 ? 'bg-main-red' : Number(process) < 70 ? 'bg-yellow-500' : 'bg-main'
        } `}
        style={{ transform: `translateX(-${100 - Number(process)}%)`, height: '30px' }}
      />
      <div
        className={cn(
          'absolute left-0 top-0 ml-2 text-left text-[11px] font-normal text-white',
          process === 0 && 'ml-2 text-black'
        )}
        style={{ width: `${process}%` }}
      >
        {progressType === '1' ? value : `${process}%`}
      </div>
      <div
        className={'absolute right-0 top-0 text-center font-medium'}
        style={{ width: `${100 - Number(process)}%` }}
      ></div>
    </Progress.Root>
  );
};
export default ProgressBar;
