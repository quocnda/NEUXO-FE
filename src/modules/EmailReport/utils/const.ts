import { typeHeaderTable } from '@/utils/const';

export const listHeaderEmailReport = [
  {
    title: 'user_name',
    key: 'list_user_id',
    type: typeHeaderTable.DATA,
    canFilter: true,
    filter_type: 'CHECKBOX',
    pin: 'sticky left-0',
  },
  {
    title: 'unique_domain_sent',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'new_email_sent',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'new_email_replied',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'replied_rate',
    type: typeHeaderTable.DATA,
  },
  {
    title: '1st Email_followed_up',
    type: typeHeaderTable.DATA,
  },
  {
    title: '2nd Email_followed_up',
    type: typeHeaderTable.DATA,
  },
  {
    title: '3rd Email_followed_up',
    type: typeHeaderTable.DATA,
  },
  {
    title: '4th Email_followed_up',
    type: typeHeaderTable.DATA,
  },
  {
    title: '5th Email_followed_up',
    type: typeHeaderTable.DATA,
  },
  {
    title: '5th+ Email_followed_up',
    type: typeHeaderTable.DATA,
  },
  {
    title: 'action',
    type: typeHeaderTable.BUTTON,
  },
];
