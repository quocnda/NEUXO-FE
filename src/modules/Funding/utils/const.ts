import { typeHeaderTable } from '@/utils/const';

export const titleHeader = {
  COMPANY: 'company',
  LINK: 'link',
  FUNDING_CATEGORY: 'funding_category',
  ROUND: 'round',
  FUNDING_AMOUNT: 'funding_amount',
  TIME: 'time',
  ACTION: 'action',
};
export const listHeaderCourse = [
  {
    title: titleHeader.COMPANY,
    key: titleHeader.COMPANY,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.LINK,
    // key: titleHeader.LINK,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.FUNDING_CATEGORY,
    key: 'category',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: titleHeader.ROUND,
    key: 'round',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: titleHeader.FUNDING_AMOUNT,
    key: titleHeader.FUNDING_AMOUNT,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.TIME,
    key: 'time',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'DATE',
    name_filter: ['start_date', 'end_date'],
  },
  {
    title: titleHeader.ACTION,
    type: typeHeaderTable.DATA,
  },
];

export const dateOptions = [
  { label: 'All time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'Date range', value: 'date_range' },
];
