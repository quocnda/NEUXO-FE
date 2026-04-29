import { typeHeaderTable } from '@/utils/const';

export const listHeaderAccount = [
  {
    title: 'company_name',
    key: 'company_name',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'contact_name',
    key: 'contact_name',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'contact_email',
    key: 'contact_email',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'email_sent',
    key: 'email_sent',
    type: typeHeaderTable.DATA,
    filter_type: 'NUMBER_RANGE',
    canFilter: true,
    name_filter: ['email_count_start', 'email_count_end'],
  },
  {
    title: 'last_activity_date',
    key: 'last_activity_date',
    type: typeHeaderTable.DATA,
    filter_type: 'DATE',
    canFilter: true,
    name_filter: ['last_activity_start_date', 'last_activity_end_date'],
  },
  {
    title: 'email_status',
    key: 'email_status',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'follow_up_date',
    key: 'follow_up_date',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'DATE',
    name_filter: ['follow_up_start_date', 'follow_up_end_date'],
  },
  {
    title: 'follow_up_status',
    key: 'follow_up_status',
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
    title: 'priority',
    key: 'priority',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
  },
  {
    title: 'action',
    type: typeHeaderTable.BUTTON,
  },
];

export const dataOpenStatus = [
  {
    label: 'Opened',
    value: 'YES',
  },
  {
    label: 'Unopened',
    value: 'NO',
  },
];

export const dataReplyStatus = [
  {
    label: 'Replied',
    value: 'YES',
  },
  {
    label: 'Unreplied',
    value: 'NO',
  },
];

export const valueVariables = [
  {
    label: '{{first_name}}',
    value: '{{first_name}}',
  },
  {
    label: '{{last_name}}',
    value: '{{last_name}}',
  },
  {
    label: '{{company_name}}',
    value: '{{company_name}}',
  },
];

export const dataEmailStatus = [
  {
    label: 'Sent',
    value: 'SENT',
  },
  {
    label: 'Seen',
    value: 'SEEN',
  },
  {
    label: 'Replied',
    value: 'REPLIED',
  },
  {
    label: 'Error',
    value: 'ERROR',
  },
];

export const dataFollowUpStatus = [
  {
    label: 'Focused',
    value: 'Focused',
  },
  {
    label: 'Overdue',
    value: 'Overdue',
  },
  {
    label: 'Upcoming',
    value: 'Upcoming',
  },
];

export const dataPriority = [
  {
    label: 'High',
    value: 'HIGH',
  },
  {
    label: 'Medium',
    value: 'MEDIUM',
  },
  {
    label: 'Low',
    value: 'LOW',
  },
];

export const tabs_email_tracking = [
  { label: 'Prospected', value: 'prospected' },
  { label: 'Replied', value: 'replied' },
  { label: 'Unresponsive', value: 'unresponsive' },
];
