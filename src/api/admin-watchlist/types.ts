import type { IPagination } from '@/types';

export interface IWatchListView {
  id: string;
  company_id: string;
  company: string;
  external: {
    hubspot: string;
    linkedin: string;
    website: string;
    email: string;
    twitter: string;
  };
  label: string;
  trigger: string[];
  updated_at: string;
  created_at: string;
  icp_name: string;
  funding_amount: number;
  contacts: boolean;
  company_size: string;
  location: string[];
  category: string[];
  followers: number | null;
  headquarters: string;
  organization_type: string;
  industry: string;
  note: string;
  is_crawl: boolean;
  action: {
    is_email_sent: boolean;
    is_linkedin_sent: boolean;
    is_whatsapp_sent: boolean;
  };
  assignee: string;
  score: number;
  completeness: number;
  completeness_missing: string[];
  avatar_url: string;
  lst_email: string[];
  user: string;
  user_id: string;
}
export interface IResponseViewAllWatchList {
  data: IWatchListView[];
  pagination: IPagination;
}

export interface IParamsWatchNewsView {
  id?: string;
  offset?: number | null;
  limit?: number;
  filter?: any;
  type?: string;
  user_id?: string;
}

export interface IResponseContacts {
  id: string;
  first_name: string;
  last_name: string;
  linkedin_url: string;
  email: string;
  role: string;
  twitter_url: string;
  created_at: string;
  name: string;
  target_guest: boolean;
  avatar_linkedin_url: string;
  note: string;
}

export interface IParamsViewWatchlistAll {
  search_key?: string;
  page: number;
  limit: number;
  list_user_id?: string;
}
