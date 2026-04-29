import type { IPagination } from '@/types';

export interface IParamsWatchList {
  page: number;
  limit: number;
}

export interface IRequestHistoryChat {
  completion_id: string;
  messages: '';
}

export interface IParamsHistoryChat {
  page?: number;
  limit?: number;
  search_key?: string;
  id?: string;
}

export interface IResponseHistoryChat {
  pagination: IPagination;
  data: {
    subject: string;
    completions: {
      role: string;
      content: string;
      order_number: number;
      time_updated: string;
    }[];
    time_updated: string;
    id: string;
  }[];
}
