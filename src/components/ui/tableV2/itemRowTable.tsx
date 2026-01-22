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
          'h-8 whitespace-nowrap px-2',
          {
            'border-neutral-30 border border-l-0': indexRow !== tableLength,
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
