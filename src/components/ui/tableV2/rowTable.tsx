import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLTableRowElement> {
  rowClassName?: Props['className'];
}

const RowTable = (props: Props) => {
  const { rowClassName, children } = props;
  return (
    <>
      <tr className={cn('hover:bg-gray-50', rowClassName)}>{children}</tr>
    </>
  );
};

export default RowTable;
