import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { DateRange } from 'react-day-picker';

import { formatDate } from '@/lib/common';
import { DATETIME_FORMAT } from '@/lib/const';
import { removeUndefinedKeys } from '@/lib/utils';

import { DateRangePicker } from '../date-picker-custom/date-range-picker-v3';

interface Props {
  elementRef: React.RefObject<HTMLDivElement>;
  paramsQuery: any | undefined;
  setParamsQuery: Dispatch<SetStateAction<any>> | undefined;
  startDate?: string;
  endDate?: string;
}

const PopoverFilterDate = (props: Props) => {
  const { elementRef, paramsQuery, setParamsQuery, startDate, endDate } = props;
  const updateParamsQuery = (newParams: Partial<any>) => {
    setParamsQuery?.((prev: any) => removeUndefinedKeys({ ...prev, ...newParams }));
  };
  const handleDateRangeChange = (dateRange: DateRange) => {
    const { from, to } = dateRange;

    const formatToDateTime = (date: Date | undefined): string | undefined => {
      if (!date) return undefined;
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const localOffset = localDate.getTimezoneOffset();

      const adjustedDate = new Date(localDate.getTime() + localOffset * 60000);

      return formatDate(adjustedDate, DATETIME_FORMAT.DATE_TIME_LOCAL);
    };

    if (startDate && endDate) {
      if (startDate === 'last_activity_start_date' && endDate === 'last_activity_end_date') {
        updateParamsQuery({
          [startDate]: formatToDateTime(from),
          [endDate]: formatToDateTime(to),
        });
      } else if (startDate === 'follow_up_start_date' && endDate === 'follow_up_end_date') {
        updateParamsQuery({
          [startDate]: from ? formatDate(from, DATETIME_FORMAT.DATE_TIME_LOCAL) : undefined,
          [endDate]: to ? formatDate(to, DATETIME_FORMAT.DATE_TIME_LOCAL) : undefined,
        });
      } else {
        updateParamsQuery({
          [startDate]: from ? formatDate(from, DATETIME_FORMAT.DATE_TIME) : undefined,
          [endDate]: to ? formatDate(to, DATETIME_FORMAT.DATE_TIME) : undefined,
        });
      }
    }
  };

  return (
    <div className="max-h-[500px] overflow-hidden" ref={elementRef}>
      <DateRangePicker
        from={startDate ? paramsQuery?.[startDate] : undefined}
        to={endDate ? paramsQuery?.[endDate] : undefined}
        onChange={handleDateRangeChange}
      />
    </div>
  );
};

export default PopoverFilterDate;
