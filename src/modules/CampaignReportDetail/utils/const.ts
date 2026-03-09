import { Icons } from '@/assets/icons';
import { typeHeaderTable } from '@/utils/const';

export const tabs = [
  { label: 'Statistics', value: 'statistics' },
  { label: 'About', value: 'about' },
];

export const data_overview = [
  { label: 'Contacts', value: '200', icon: Icons.campaignUser, key: 'contacts_count' },
  { label: 'Emails Sent', value: '1000', icon: Icons.campaignSend, key: 'total_email_sent' },
  // {
  //   label: 'Opened Rate',
  //   value: '52.5%',
  //   key:'total_email_opened',
  //   icon: Icons.campaignRate,
  // },
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
  },
  {
    title: 'Email Status',
    type: typeHeaderTable.DATA,
    key: 'email_status',
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
];
