import { Icons } from '@/assets/icons';

export const listSideBar = [
  {
    group: 'Prospects',
    items: [
      {
        key: '1',
        title: 'Companies',
        route: '/matching-companies',
        Icon: Icons.companySidebar,
      }
    ],
  },
  {
    group: 'Sales Signals',
    items: [
      {
        key: '2',
        title: 'Luma Events',
        route: '/luma-events',
        Icon: Icons.calendardays,
      },
      {
        key: '3',
        title: 'Funding',
        route: '/funding',
        Icon: Icons.filter,
      },
      {
        key: '4',
        title: 'Linkedin Job',
        route: '/linkedin-job',
        Icon: Icons.job,
      },
    ],
  },
  {
    group: 'Lead Management ',
    items: [
      {
        key: '6',
        title: 'Watch List',
        route: '/watch-list',
        Icon: Icons.watchlist,
      },
      {
        key: '7',
        title: 'Email Management',
        childrenItems: [
          {
            key: '7-1',
            title: 'Email Tracking',
            route: '/email-tracking',
          },
          {
            key: '7-2',
            title: 'Email Template',
            route: '/email-template',
          },
        ],
        Icon: Icons.tracking,
      },

      {
        key: '8',
        title: 'Campaign Management',
        route: '/campaign-management',
        Icon: Icons.campaign,
      },
    ],
  }
];

export const pageTitles = {
  '/matching-companies': 'Company',
  '/luma-events': 'Events',
  '/funding': 'Funding',
  '/linkedin-job': 'Linkedin Job',
  '/watch-list': 'Watch List',
  '/email-tracking': 'Email Management',
  '/storage': 'Storage',
};
