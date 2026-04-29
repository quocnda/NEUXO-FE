import type { IPagination } from '@/types';

export interface ICampaignList {
  campaign_id: string;
  campaign_name: string;
  day_created: string;
  total_email_sent: number;
  total_email_replied: number;
  total_email_opened: number;
  campaign_status: string;
  status_choice: string[];
}

export interface ICampaignResponse {
  data: ICampaignList[];
  pagination: IPagination;
}

export interface IParamsCampaignList {
  page: number;
  limit: number;
  campaign_status?: string;
  end_date?: string;
  start_date?: string;
  search_key?: string;
}

export interface ICampaignDetail {
  data_report: ICampaignDetailDataReport;
  data: ICampaignDetailDataResponse[];
  data_status: ICampaignDetailDataStatus;
  pagination: IPagination;
}

export interface ICampaignDetailDataReport {
  contacts_count: number;
  total_email_sent: number;
  replied_rate: number;
  error_rate: number;
}

export interface ICampaignDetailDataResponse {
  email: string;
  contact_name: string;
  company_name: string;
  email_sent: string;
  last_sent_date: string;
  error_message: string;
  email_status: string;
  open_count: number;
}

export interface IParamsCampaignDetail {
  page: number;
  limit: number;
  search_key?: string;
  id?: string;
  email_status?: string;
}

export interface ICampaignDetailDataStatus {
  campaign_status: string;
  status_choice: string[];
}

export interface ICampaignDetailAbout {
  campaign_creation_date: string;
  campaign_name: string;
  sender_email: string;
  total_contacts: number;
  total_steps: number;
  campaign_schedule: string[];
}

export interface IParamsCampaignReport {
  campaign_status?: string;
  limit: number;
  list_user_id?: string;
  page: number;
  orderByVal?: string;
  sortByVal?: string;
  search_key?: string;
}
