import { cn } from '@/lib/utils';

interface Props extends React.TdHTMLAttributes<HTMLTableCellElement> {
  indexRow: number;
  tableLength: number;
}

const ItemRowTable = ({ indexRow, tableLength, children, className, ...props }: Props) => {
  return (
    <>
      <td
        {...props}
        className={cn(
          'h-9 whitespace-nowrap px-3 py-2 text-sm text-neutral-800 group-hover:text-white',
          {
            'border border-neutral-200/60 border-l-0': indexRow !== tableLength,
          },
          className
        )}
      >
        {children}
      </td>
    </>
  );
};

export default ItemRowTable;
