import { typeHeaderTable } from '@/utils/const';

const watchlistHeaders = [
  {
    title: 'company',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'ICP',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'link',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'news',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'progress',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'note',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'company_size',
    key: 'company_size',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'followers',
    key: 'followers',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'country',
    key: 'country',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'insert_time',
    type: typeHeaderTable.DATA,
  },

  {
    title: 'action',
    type: typeHeaderTable.DATA,
  },
];

export const listHeaderWatchList = watchlistHeaders;

export const tabNewsWatchList = [
  {
    label: 'Company News',
    value: 'company_news',
  },
  {
    label: 'Contact News',
    value: 'contact_news',
  },
];

export const dataTags = [
  {
    value: 'HIRING',
    label: 'Hiring',
  },
  {
    value: 'EVENT',
    label: 'Event',
  },
  {
    value: 'LINKEDIN',
    label: 'LinkedIn',
  },
  {
    value: 'TWITTER',
    label: 'Twitter',
  },
  {
    value: 'SUB_DOMAIN',
    label: 'Subdomain',
  },
  {
    value: 'NEWS',
    label: 'News',
  },
  {
    value: 'FUNDING',
    label: 'Funding',
  },
  {
    value: 'JOB_CHANGE',
    label: 'Job Change',
  },
];
