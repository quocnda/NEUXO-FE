import type { IPagination } from '@/types';

export interface IParamsEmailTracking {
  user_id?: string;
  timeZone?: string;
  page: number;
  limit: number;
  open_status?: string;
  reply_status?: string;
  email_sent?: string;
  search_key?: string;
  email_count_start?: number;
  email_count_end?: number;
  start_date?: string;
  end_date?: string;
  follow_up_start_date?: string;
  follow_up_end_date?: string;
  source?: string;
}
export interface IEmailTracking {
  pagination: IPagination;
  data: IResponseEmailTracking[];
}
export interface IResponseEmailTracking {
  id: string;
  email: string;
  contact_name: string;
  company_id: string;
  company_name: string;
  email_sent: string;
  last_sent_date: string;
  email_status: string;
  open_status: string;
  follow_up_date: string;
  follow_up_status: string;
  user_note: string;
  priority: string;
  error_message: string;
}

export interface IResponseEmailDetail {
  mail_send: string;
  email_status: string;
  mail_recieve: string;
  content: string;
  time_send: string;
  title: string;
  html_content: string;
  attachments: { name_file: string; file_path: string }[];
}
