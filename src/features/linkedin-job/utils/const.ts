import { typeHeaderTable } from '@/utils/const';

export const titleHeader = {
  JOB_TITLE: 'job_title',
  CATEGORY: 'category',
  COMPANY: 'company',
  LOCATION: 'location',
  JOB_LINK: 'job_link',
  TIME: 'time',
  ACTION: 'action',
};

export const listHeaderLinkedinJob = [
  {
    title: titleHeader.COMPANY,
    key: titleHeader.COMPANY,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.JOB_TITLE,
    key: titleHeader.JOB_TITLE,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.JOB_LINK,
    // key: titleHeader.JOB_LINK,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.CATEGORY,
    key: 'category',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: titleHeader.LOCATION,
    key: 'country',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
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
