export interface INews {
  message: string;
  pagination: IPagination;
  data: Array<IDataNews>;
}
export interface IParamsNews {
  page: number;
  limit: number;
}
export interface IPagination {
  page: number;
  total_page: number;
  total_item: number;
}
export interface IDataNews {
  id: string;
  name: string;
  title: string;
  link: string;
  description: string;
  avatar_url: string;
  score: number;
  posted_date: string;
  updated_at: string;
}
export interface IParamsWatchNews {
  id?: string;
  offset?: number | null;
  limit?: number;
  filter?: any;
  type?: string;
  range_time?: string;
}
