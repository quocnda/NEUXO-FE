import * as React from 'react';

import { cn } from '@/lib/utils';
import type { IPagination } from '@/types';

import Pagination from './pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { SkeletonWrapper } from './skeleton-wrapper';
import { HStack, Show, VStack } from './Utilities';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="grid">
      <div className="w-full overflow-auto">
        <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
      </div>
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('border-y [&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn('', className)} {...props} />
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('bg-primary text-primary-foreground font-medium', className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('data-[state=selected]:bg-muted border-b transition-colors hover:bg-gray-100', className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('border-b p-4 align-middle text-sm [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };

export const TableEmptyData = ({ col = 4, emptyText }: { col: number; emptyText?: string }) => {
  return (
    <TableRow className="pointer-events-none">
      <TableCell colSpan={col}>
        <VStack align="center" className="select-none pt-2 font-semibold text-gray-600">
          {/* <Icons.empty className="h-24" /> */}

          <p>{emptyText ?? 'No Data'}</p>
        </VStack>
      </TableCell>
    </TableRow>
  );
};

type TableSkeletonProps = {
  loading?: boolean;
  row?: number;
  col?: number;
};
export const TableSkeleton = ({ loading = false, row = 5, col = 4 }: TableSkeletonProps) => {
  return (
    <Show when={loading}>
      {Array.from({ length: row }, (_, index) => (
        <TableRow key={index}>
          {Array.from({ length: col }, (__, index2) => (
            <TableCell key={index2} className="py-2">
              <SkeletonWrapper loading={loading} className="h-7 w-full min-w-[16px]"></SkeletonWrapper>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </Show>
  );
};

export type TablePaginationProps = {
  onPageChange: (page: number) => void;
  pagination: Partial<IPagination>;
  onPageSizeChange?: (pageSize: string) => void;
  pageNameLocalStorage?: string;
};
export const TablePagination = ({
  onPageSizeChange,
  onPageChange,
  pagination,
  pageNameLocalStorage,
}: TablePaginationProps) => {
  return (
    <HStack className="items-center justify-center xl:justify-between">
      <HStack className="hidden xl:flex">
        <div className="mr-2 flex text-xs text-[#777777]">Showing</div>
        <Select value={String(pagination?.limit)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="bg-neutral-30 h-6 text-xs text-[#777777]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="text-xs text-[#777777]">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-2 flex text-xs text-[#777777]">
          {Number((Number(pagination?.page) - 1) * Number(pagination?.limit)) || 0 + 1}
          &nbsp;-&nbsp;
          {pagination?.total_page === pagination?.page
            ? pagination?.total_item
            : Number(pagination?.page) * Number(pagination?.limit)}
          &nbsp;of&nbsp;
          <SkeletonWrapper>{pagination?.total_item || 0}</SkeletonWrapper>
          &nbsp; {(pagination?.total_item ?? 0) > 1 ? 'items' : 'item'}
        </div>
      </HStack>

      <Pagination
        onPageChange={onPageChange}
        totalCount={pagination?.total_item || 0}
        currentPage={pagination?.current_page || 0}
        pageSize={pagination?.limit || 10}
        pageNameLocalStorage={pageNameLocalStorage}
      />
    </HStack>
  );
};
