import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLTableRowElement> {
  rowClassName?: Props['className'];
}

const RowTable = (props: Props) => {
  const { rowClassName, children } = props;
  return (
    <>
      <tr className={cn('group transition-colors hover:bg-neutral-50/80 hover:[&_*]:text-neutral-0', rowClassName)}>{children}</tr>
    </>
  );
};

export default RowTable;
