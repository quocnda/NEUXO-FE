import React from 'react';

import { cn } from '@/lib/utils';

import { DOTS, usePagination } from '../../hooks/usePagination';
import { Button } from './button';

type Props = {
  onPageChange: (pageNumber: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
  pageNameLocalStorage?: string;
};

const Pagination = (props: Props) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, pageNameLocalStorage } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (paginationRange?.length === 0) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
    localStorage.setItem(String(pageNameLocalStorage), String(currentPage + 1));
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
    localStorage.setItem(String(pageNameLocalStorage), String(currentPage - 1));
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <Button
        size={'sm'}
        variant="link"
        className="hidden text-sm font-normal text-neutral-500 hover:text-neutral-700 md:block"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        {'<'}
      </Button>
      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return (
            <div className="mb-0.5 text-xs text-neutral-400" key={pageNumber + i}>
              {pageNumber}
            </div>
          );
        }

        return (
          <Button
            size={'sm'}
            key={pageNumber}
            variant={`${pageNumber === currentPage ? 'primary' : 'white'}`}
            className={cn(
              'h-7 w-7 rounded-md text-xs font-medium',
              pageNumber === currentPage
                ? 'text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 border border-neutral-200/70'
            )}
            onClick={() => {
              onPageChange(pageNumber as number);
              localStorage.setItem(String(pageNameLocalStorage), String(pageNumber));
            }}
          >
            {pageNumber}
          </Button>
        );
      })}
      <Button
        size={'sm'}
        variant="link"
        className="hidden text-sm font-normal text-neutral-500 hover:text-neutral-700 md:block"
        onClick={onNext}
        disabled={currentPage === lastPage}
      >
        {'>'}
      </Button>
    </div>
  );
};

export default Pagination;
