import { HStack, Show } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

const renderIcon = (
  IconComponent: any,
  url: string,
  onClick: () => void,
  loading?: boolean,
  width = 12 as number,
  height = 12 as number
) => (
  <>
    <Show when={loading}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-gray-500 border-l-transparent border-r-transparent border-t-gray-500"></div>
    </Show>
    <Show when={!loading}>
      <HStack
        className={cn('bg-neutral-20 flex h-6 w-6 justify-center rounded-full', url ? 'cursor-pointer' : 'opacity-50')}
      >
        <IconComponent
          width={width}
          height={height}
          color="#6f767e"
          onClick={url ? onClick : undefined}
          loading={loading}
        />
      </HStack>
    </Show>
  </>
);

export default renderIcon;
