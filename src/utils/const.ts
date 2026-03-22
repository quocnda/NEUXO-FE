import { Icons } from '@/assets/icons';

export const typeHeaderTable = {
  INDEX: 'index',
  BUTTON: 'button',
  DATA: 'data',
};

export const DataTrigger = [
  {
    value: '1',
    label: '1 Trigger',
  },
  {
    value: '2',
    label: '2 Trigger',
  },
  {
    value: '3',
    label: '3 Trigger',
  },
  {
    value: '4',
    label: '4 Trigger',
  },
];

export const tabs = [
  { label: 'All', value: 'company' },
  { label: 'Blacklist', value: 'blacklist', icons: Icons.blacklistCompany },
];

export const tabsGuest = [
  { label: 'Lume Guest', value: 'luma-guest' },
  { label: 'Prospects', value: 'prospects' },
];

export const tabsWatchList = [
  { label: 'Watch List', value: 'watchlist' },
  { label: 'Watch News', value: 'watchnews' },
];

export const tabsEmailManagement = [
  { label: 'Email Tracking', value: 'emailtracking' },
  { label: 'Email Template', value: 'emailtemplate' },
];

export const FOLLOWERS_RANGE = [
  {
    value: '0-1000',
    label: '0-1000',
  },
  {
    value: '1001-10000',
    label: '1001-10000',
  },
  {
    value: '10001-100000',
    label: '10001-100000',
  },
  {
    value: '100001-1000000',
    label: '100001-1000000',
  },
  {
    value: '1000001+',
    label: '1000001+',
  },
];

export const COMPANY_SIZE = [
  {
    value: '2-10',
    label: '2-10',
  },
  {
    value: '11-50',
    label: '11-50',
  },
  {
    value: '51-200',
    label: '51-200',
  },
  {
    value: '201-500',
    label: '201-500',
  },
  {
    value: '501-1000',
    label: '501-1000',
  },
  {
    value: '1001-5000',
    label: '1001-5000',
  },
  {
    value: '5001-10000',
    label: '5001-10000',
  },
  {
    value: '10001+',
    label: '10001+',
  },
];

export const HAVE_EMAIL = [
  {
    value: '1',
    label: 'Available email',
  },
  {
    value: '0',
    label: 'No available email',
  },
];

export const listHeaderGuestByEvent = [
  {
    title: 'contact_name',
    key: 'contact_name',
    type: typeHeaderTable.DATA,
    pin: 'sticky sm:left-[47px] left-[-1px]',
  },
  {
    title: 'link',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'role',
    key: 'role',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'contact_email',
    key: 'contact_email',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'company_name',
    key: 'company_name',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'headquarter',
    key: 'headquarter',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'country',
    key: 'country',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'category',
    key: 'category',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'note',
    key: 'note',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'email_status',
    key: 'email_status',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
];

export const CATEGORY_LIST = [
  {
    value: 'Blockchain',
    label: 'Blockchain',
  },
  {
    value: 'AI',
    label: 'AI',
  },
  {
    value: 'General',
    label: 'General',
  },
  {
    value: 'Unity game',
    label: 'Unity game',
  },
];

export const dateOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'Date range', value: 'date_range' },
];

export const condition_dropdown = [
  'Hiring for specific roles',
  'Funding or investment updates',
  'CxO role changes',
  'New projects, partnerships, mergers & acquisitions, or technology adoptions',
];
