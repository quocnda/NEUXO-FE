import { typeHeaderTable } from '@/utils/const';

export const listHeaderEmailReport = [
  {
    title: 'Campaign Name',
    key: 'campaign_name',
    type: typeHeaderTable.DATA,
    pin: 'sticky left-0',
  },
  {
    title: 'User',
    key: 'list_user_id',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'Status',
    key: 'campaign_status',
    canFilter: true,
    filter_type: 'CHECKBOX',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'Creation Date',
    key: 'created_at',
    type: typeHeaderTable.DATA,
    filter_type: 'DATE',
    canFilter: true,
    name_filter: ['start_date', 'end_date'],
  },
  {
    title: 'Emails Sent',
    key: 'email_sent',
    filter_type: 'NUMBER_RANGE',
    canFilter: true,
    type: typeHeaderTable.DATA,
    name_filter: ['emails_sent_start', 'emails_sent_end'],
  },
  {
    title: 'Emails Opened',
    key: 'email_opened',
    filter_type: 'NUMBER_RANGE',
    canFilter: true,
    type: typeHeaderTable.DATA,
    name_filter: ['emails_opened_start', 'emails_opened_end'],
  },
  {
    title: 'Emails Replied',
    key: 'email_replied',
    filter_type: 'NUMBER_RANGE',
    canFilter: true,
    type: typeHeaderTable.DATA,
    name_filter: ['emails_replied_start', 'emails_replied_end'],
  },
];
