import { Icons } from '@/assets/icons';
import { typeHeaderTable } from '@/utils/const';

export const tabs = [
  { label: 'Statistics', value: 'statistics' },
  { label: 'About', value: 'about' },
];

export const data_overview = [
  { label: 'Contacts', value: '200', icon: Icons.campaignUser, key: 'contacts_count' },
  { label: 'Emails Sent', value: '1000', icon: Icons.campaignSend, key: 'total_email_sent' },
  {
    label: 'Opened Rate',
    value: '52.5%',
    key: 'opened_rate',
    icon: Icons.campaignRate,
    suffix: '%',
  },
  {
    label: 'Replied Rate',
    value: '5.5%',
    key: 'replied_rate',
    icon: Icons.watchlist,
    suffix: '%',
  },
  {
    label: 'Error Rate',
    value: '2.5%',
    icon: Icons.campaignError,
    key: 'error_rate',
    suffix: '%',
  },
];

export const listHeader = [
  {
    title: 'Contact Name',
    key: 'contact_name',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'Contact Email',
    key: 'contact_email',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'Company Name',
    key: 'company_name',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'Emails Sent',
    type: typeHeaderTable.DATA,
    key: 'email_sent',
    filter_type: 'NUMBER_RANGE',
    canFilter: true,
    name_filter: ['emails_send_start', 'emails_send_end'],
  },
  {
    title: 'Open Count',
    type: typeHeaderTable.DATA,
    key: 'open_count',
    filter_type: 'NUMBER_RANGE',
    canFilter: true,
    name_filter: ['open_count_start', 'open_count_end'],
  },
  {
    title: 'Email Status',
    type: typeHeaderTable.DATA,
    key: 'email_status',
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'Action',
    type: typeHeaderTable.DATA,
  },
];
