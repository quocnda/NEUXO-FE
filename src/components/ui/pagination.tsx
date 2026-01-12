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
    <div className="flex items-center justify-center gap-4 py-1">
      <Button
        size={'sm'}
        variant="link"
        className="hidden text-sm font-normal text-[#777777] md:block"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        {'<'}
      </Button>
      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return (
            <div className="mb-1 text-[#777777]" key={pageNumber + i}>
              {pageNumber}
            </div>
          );
        }

        return (
          <Button
            size={'sm'}
            key={pageNumber}
            variant={`${pageNumber === currentPage ? 'primary' : 'white'}`}
            className={cn('w-9 text-xs font-normal', pageNumber === currentPage ? 'text-white' : 'text-[#777777]')}
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
        className="hidden text-sm font-normal text-[#777777] md:block"
        onClick={onNext}
        disabled={currentPage === lastPage}
      >
        {'>'}
      </Button>
    </div>
  );
};

export default Pagination;
