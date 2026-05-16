import { Ban, PauseCircle, StepForward, Trash } from 'lucide-react';

export const campaignStatus = [
  {
    value: 'Active',
    label: 'Active',
  },
  {
    value: 'Paused',
    label: 'Paused',
  },
  {
    value: 'Completed',
    label: 'Completed',
  },
];

export const fake_data_campaign = [
  {
    id: 1,
    title: 'Consensus HK campaign',
    status: 'Active',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 2,
    title: 'Consensus HK campaign',
    status: 'Paused',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 3,
    title: 'Consensus HK campaign',
    status: 'Completed',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 4,
    title: 'Consensus HK campaign',
    status: 'Active',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 5,
    title: 'Consensus HK campaign',
    status: 'Paused',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 6,
    title: 'Consensus HK campaign',
    status: 'Completed',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 7,
    title: 'Consensus HK campaign',
    status: 'Completed',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 8,
    title: 'Consensus HK campaign',
    status: 'Active',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 9,
    title: 'Consensus HK campaign',
    status: 'Paused',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
  {
    id: 10,
    title: 'Consensus HK campaign',
    status: 'Completed',
    date: '01/01/2023',
    email_send: '123',
    email_opened: '40',
    email_replied: '2',
  },
];

export const campaignActions = [
  {
    title: 'Pause Campaign',
    content:
      'Are you sure you want to pause this email campaign? Emails will stop sending until you resume the campaign.',
    buttonText: 'Pause',
    buttonVariant: 'primary',
    icon: <PauseCircle size={18} color="#6F767E" />,
  },
  {
    title: 'Resume Campaign',
    content:
      'Are you sure you want to resume this email campaign? Emails will continue sending from where they left off.',
    buttonText: 'Resume',
    buttonVariant: 'primary',
    icon: <StepForward size={18} color="#6F767E" />,
  },
  {
    title: 'Stop Campaign',
    content:
      'Are you sure you want to stop this email campaign? It will immediately stop all emails and mark the campaign as complete.',
    buttonText: 'Stop',
    buttonVariant: 'error',
    icon: <Ban size={18} color="#6F767E" />,
  },
  {
    title: 'Remove Campaign',
    content: 'Are you sure you want to remove this email campaign? All campaign data will be permanently removed.',
    buttonText: 'Remove',
    buttonVariant: 'error',
    icon: <Trash size={18} color="#6F767E" />,
  },
];

export const dateOptions = [
  { label: 'All time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'Date range', value: 'date_range' },
];
