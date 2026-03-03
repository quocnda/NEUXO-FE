import { Icons } from '@/assets/icons';
import { typeHeaderTable } from '@/utils/const';

export const listHeaderWatchList = [
  {
    title: 'company',
    key: 'company',
    type: typeHeaderTable.DATA,
    pin: 'sm:sticky sm:left-[47px]',
  },
  {
    title: 'ICP',
    key: 'icp_id',
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: 'action',
    // key: 'action',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'link',
    // key: 'link',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'news',
    // key: 'news',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'note',
    key: 'note',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'label',
    key: 'label',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'company_size',
    key: 'company_size',
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: 'followers',
    key: 'followers',
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: 'country',
    key: 'country',
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: 'insert_time',
    type: typeHeaderTable.DATA,
  },
  // {
  //   title: 'progress_updated',
  //   key: 'progress_updated',
  //   type: typeHeaderTable.DATA,
  // },
];

export const tabNewsWatchList = [
  {
    label: 'Company',
    value: 'company_news',
    icon: Icons.company,
  },
  {
    label: 'Contact News',
    value: 'contact_news',
    icon: Icons.contact,
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

export const dateOptions = [
  { label: 'All time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
];
