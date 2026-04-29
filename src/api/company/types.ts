export interface IParamsMatchingCompaniesList {
  id?: string;
  page: number;
  limit?: number;
  search_key?: string;
  sortByVal?: string;
  orderByVal?: 'ASC' | 'DESC';
  end_date?: string;
  start_date?: string;
  count_trigger?: string;
  assignee?: string;
  locations?: any;
  event_parent?: any;
  country?: any;
  company_size?: string;
  following_range?: string;
  event_id?: string;
  filter?: string;
  trigger?: string;
  status?: string;
  main_event?: string;
}
export interface IPagination {
  page: number;
  total_page: number;
  total_item: number;
}
export interface IDataMatchingCompaniesList {
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
  trigger_time: string;
  funding_amount: number;
  contacts: boolean;
  company_size: string;
  location: string[];
  category: string | null;
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
  watchlist: boolean;
  is_in_watchlist: number;
  avatar_url: string;
  lst_email: string[];
  status_mail: string;
}
export interface IMatchingCompaniesList {
  message: string;
  meta: {
    columns: {
      name: string;
      is_show: boolean;
      can_arrange: boolean;
    }[];
  };
  pagination: IPagination;
  data: Array<IDataMatchingCompaniesList>;
}

export interface IDataLumaEvents {
  id: string;
  name: string;
  location: string;
  country: string;
  event_parent: string;
  event_image: string;
  start_at: string;
  end_at: string;
  approval_status: string;
  main_event__id: string;
  full_event_url: string;
  full_start_date: string;
  full_created_at: string;
  companies: string | null;
  guests: string;
  event_url: string;
  start_date: string;
  created_at: string;
  status: string;
}
export interface ILumaEventsList {
  message: string;
  meta: {
    columns: {
      name: string;
      is_show: boolean;
      can_arrange: boolean;
    }[];
  };
  pagination: IPagination;
  data: Array<IDataLumaEvents>;
}
export interface IDataLumaGuests {
  id: string;
  name: string;
  linkedin_url: string;
  twitter_url: string;
  website: string;
  event__name: string;
  company__name: string;
  email: string;
  created_at: string;
  company__id: string;
  event__id: string;
  role: string;
  company__country?: string;
  email_status: string;
  email_input_from_user: boolean;
  company__headquarters: string;
  category: string;
  note: string;
  email_information: {
    email_status: string;
    send_by: string;
    last_activity: string;
    error: string;
    last_reply: string;
    contact_email: string;
  }[];
}
export interface ILumaGuestsList {
  message: string;
  meta: {
    columns: {
      name: string;
      is_show: boolean;
      can_arrange: boolean;
    }[];
  };
  pagination: IPagination;
  data: Array<IDataLumaGuests>;
}

export interface IDataLumaFunding {
  logo_url: string;
  name: string;
  round: string;
  amount: string;
  date: string;
  category: string;
  project_url: string;
  website: string;
  linkedin_url: string;
  created_at: string;
  company_id: string;
  funding_amount: string;
  lst_email: string[];
  status_mail: string;
}
export interface IFundingList {
  message: string;
  meta: {
    columns: {
      name: string;
      is_show: boolean;
      can_arrange: boolean;
    }[];
  };
  pagination: IPagination;
  data: Array<IDataLumaFunding>;
}
export interface IDataLinkedinJob {
  avatar_url: string;
  job_title: string;
  category: string;
  company: string;
  company_id: string;
  country: string;
  linkedin_url: string;
  created_at: string;
  label: string;
  note: string | null;
  lst_email: string[];
  status_mail: string;
}
export interface ILinkedinJobList {
  message: string;
  meta: {
    columns: {
      name: string;
      is_show: boolean;
      can_arrange: boolean;
    }[];
  };
  pagination: IPagination;
  data: Array<IDataLinkedinJob>;
}
export interface Funding {
  name: string;
  date: string;
  amount: number;
  project_url: string;
  category: string;
}
export interface Event {
  name: string;
  event_url: string;
  start_date: string;
}
export interface Hiring {
  title: string;
  category__name: string;
  linkedin_url: string;
  label__name: string;
  created_at: string;
}
export interface News {
  link_news: string;
  category: string;
  time_post: string;
}
export interface IResponsiveTrigger {
  funding: Funding[];
  event: Event[];
  hiring: Hiring[];
  news: News[];
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
export interface ITopTriggerMatchingCompaniesList {
  message: string;
  meta: {
    columns: {
      name: string;
      is_show: boolean;
      can_arrange: boolean;
    }[];
  };
  pagination: IPagination;
  data: Array<IDataMatchingCompaniesList>;
}
export interface IParamsCompanyAttendedList {
  id: string;
  page: number;
  limit: number;
  search_key?: string;
  sortByVal?: string;
  orderByVal?: 'ASC' | 'DESC';
  end_date?: string;
  start_date?: string;
  count_trigger?: string;
  assignee?: string;
}

export interface ICompanyDetails {
  label: string;
  name: string;
  linkedin_url: string;
  twitter_url: string;
  website: string;
  size: string;
  industry: string;
  organization_type: string;
  headquarters: string;
  followers: string;
  short_description: string | null;
  category: string[];
  funding: any[];
  hiring: any[];
  event: { name: string; event_url: string; start_date: string }[];
  news: { link_news: string; category: string; time_post: string }[];
  email_format: { email_format: string; email_example: string; percentage: number }[];
  contacts: IResponseContacts[];
  country: string;
  avatar_url: string | null;
  note_watchlist: string | null;
  watchlist: boolean;
  is_in_watchlist: number;
  is_blacklist: boolean;
}
export interface IBlackList {
  message: string;
  meta: {
    columns: {
      name: string;
      is_show: boolean;
      can_arrange: boolean;
    }[];
  };
  pagination: IPagination;
  data: Array<IBodyBlackList>;
}
export interface IBodyBlackList {
  id: string;
  name: string;
  website: string;
  industry: string;
  linkedin_url: string;
  headquarters: string;
  category: string;
  labels: string[];
  size: string;
  organization_type: string;
  short_description: string;
  note_of_user: string;
  created_at: string;
  updated_at: string;
  link_twitter: string;
  hubspot_url: string;
  followers: string;
  linkedin_funding_amt: number;
  country: string;
  external: {
    linkedin: string;
    website: string;
    twitter: string;
    hubspot: string;
  };
  label: string[];
  trigger: any[];
  company_size: string;
  company_id: string;
  company: string;
  funding_amount: number;
  trigger_time: string;
}
export interface IWatchList {
  pagination: {
    page: number;
    total_page: number;
    total_item: number;
  };
  data: IBodyWatchlist[];
}
export interface IBodyWatchlist {
  company_id: string;
  company: string;
  PIN: boolean;
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
  status_mail: string;
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
  created_at: string;
  icp_name: string;
}
export interface IRequestAddGuest {
  id: string;
  linkedin_url: string;
  twitter_url: string;
}
export interface IDetailGuestMention {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  linkedin_url: string;
  twitter_url: string;
  role: string;
  company_id: string;
  twitter_summary: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface ICustomFilterList {
  id: string;
  filter_name: string;
  filter: any;
}
export interface IRequestAddContactToGuest {
  id: string;
  guest_id: string;
}

export interface ICreateFilterCustom {
  id?: string;
  filter_name: string;
  filter?: any;
}

export interface IContactDetail {
  id: string;
  first_name: string;
  last_name: string;
  linkedin_url: string;
  emails: Array<{ id: string; email: string }>;
  role: string;
  twitter_url: string;
  created_at: string;
  avatar_linkedin_url: string | null;
  name: string;
  target_guest: boolean;
  experiences: Array<any>;
}
export interface IParamsInsertMutipleCompany {
  records: Array<{
    company_name: string;
    company_linkedin: string;
    company_website: string;
    company_twitter: string;
    contact_first_name: string;
    contact_last_name: string;
    contact_linkedin: string;
    contact_email: string;
    contact_twitter: string;
  }>;
}

export interface IResponseEventParentInfor {
  id: string;
  api_id: string;
  name: string;
  description: string;
  event_url: string;
  cover_image_url: string;
  avatar_image_url: string;
  geo_city: string;
  geo_country: string;
  geo_region: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  website: string;
  verified_at: string;
  created_at: string;
  updated_at: string;
  youtube_url: string;
}

export interface IContactRecord {
  id: string;
  email: string;
  mail_send: string;
  mail_recieved: string;
  user_id: number;
  type: string;
  subject: string;
  content: string;
  time_send: string;
  status: string;
  reason_error: string;
}

export interface IResponseContactRecord {
  data: IContactRecord[];
  pagination: IPagination;
}

export interface IRequestCheckHadOtherWatchlist {
  watchlist_info: {
    company_name?: string;
    company_linkedin: string;
    company_website?: string;
    company_twitter?: string;
    contact_first_name?: string;
    contact_last_name?: string;
    contact_linkedin?: string;
    contact_email?: string;
    contact_twitter?: string;
    company_ICP: string;
    company_role?: string;
  }[];
}

export interface IParamsViewContactRecord {
  page: number;
  limit: number;
  id?: string;
}
