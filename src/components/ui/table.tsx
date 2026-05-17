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
      <div className="w-full overflow-auto rounded-lg border border-neutral-200/70 bg-white">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm text-neutral-800', className)}
          {...props}
        />
      </div>
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-neutral-50/80 text-neutral-0 [&_tr]:border-b [&_tr]:border-neutral-200/70', className)}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-b-0 [&_tr:nth-child(even)]:bg-neutral-50/40', className)}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('bg-neutral-50 text-neutral-700 font-medium border-t border-neutral-200/70', className)}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'group data-[state=selected]:bg-neutral-100 border-b border-neutral-200/70 transition-colors hover:bg-neutral-50/80 hover:[&_*]:text-neutral-0',
        className
      )}
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
        'h-10 px-3 text-left align-middle text-xs font-semibold tracking-wide text-neutral-0 [&:has([role=checkbox])]:pr-0',
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
      className={cn(
        'border-b border-neutral-200/70 px-3 py-2 align-middle text-sm text-neutral-800 group-hover:text-neutral-0 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('text-neutral-500 mt-3 text-xs', className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };

export const TableEmptyData = ({ col = 4, emptyText }: { col: number; emptyText?: string }) => {
  return (
    <TableRow className="pointer-events-none">
      <TableCell colSpan={col}>
        <VStack align="center" className="select-none py-6 text-sm font-medium text-neutral-500">
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
              <SkeletonWrapper loading={loading} className="h-6 w-full min-w-[16px]"></SkeletonWrapper>
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
    <HStack className="items-center justify-center gap-4 xl:justify-between">
      <HStack className="hidden xl:flex" spacing={8}>
        <div className="mr-2 flex text-xs text-neutral-500">Showing</div>
        <Select value={String(pagination?.limit)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="h-7 min-w-[4.5rem] rounded-md border border-neutral-200/70 bg-white px-2 text-xs text-neutral-600 shadow-sm">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="text-xs text-neutral-600">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-2 flex text-xs text-neutral-500">
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
