import { typeHeaderTable } from '@/utils/const';

export const titleHeader = {
  COMPANY: 'company',
  LINK: 'link',
  LABEL: 'label',
  TRIGGER: 'trigger',
  CONTACT: 'contacts',
  TRIGGER_TIME: 'trigger_time',
  ACTION: 'action',
  COMPANY_SIZE: 'company_size',
  CATEGORY: 'category',
  COUNTRY: 'country',
  FOLLOWERS: 'followers',
  INDUSTRY: 'industry',
  HEADQUARTERS: 'headquarters',
};
export const listHeaderCourse = [
  {
    title: titleHeader.COMPANY,
    key: titleHeader.COMPANY,
    type: typeHeaderTable.DATA,
    pin: 'sticky sm:left-[47px] left-[-1px]',
  },
  {
    title: titleHeader.LINK,
    // key: titleHeader.LINK,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.LABEL,
    key: titleHeader.LABEL,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.TRIGGER,
    key: titleHeader.TRIGGER,
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: titleHeader.HEADQUARTERS,
    key: titleHeader.HEADQUARTERS,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.TRIGGER_TIME,
    key: titleHeader.TRIGGER_TIME,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.ACTION,
    // key: titleHeader.ACTION,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.CATEGORY,
    key: titleHeader.CATEGORY,
    type: typeHeaderTable.DATA,
  },
  {
    title: titleHeader.COMPANY_SIZE,
    key: titleHeader.COMPANY_SIZE,
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: titleHeader.COUNTRY,
    key: titleHeader.COUNTRY,
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: titleHeader.FOLLOWERS,
    key: titleHeader.FOLLOWERS,
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
  {
    title: titleHeader.INDUSTRY,
    key: titleHeader.INDUSTRY,
    type: typeHeaderTable.DATA,
    canFilter: true,
    type_filter: 'CHECKBOX',
  },
];

export const dateOptions = [
  { label: 'All time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
];
