export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? '',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  URL_SKYNET: process.env.NEXT_PUBLIC_URL_SKYNET ?? '',
  URL_TEMPLATE_INSERT_WATCHLIST: process.env.NEXT_PUBLIC_URL_TEMPLATE_INSERT_WATCHLIST ?? '',
  API_KEY_CHATGPT: process.env.NEXT_PUBLIC_API_KEY_CHATGPT ?? '',
  MODEL_CHATGPT: process.env.NEXT_PUBLIC_MODEL_CHATGPT ?? '',
  API_URL_CHATGPT: process.env.NEXT_PUBLIC_API_URL_CHATGPT ?? '',
  WEB_GOOGLE_SOCIAL_APP_ID: process.env.NEXT_PUBLIC_WEB_GOOGLE_SOCIAL_APP_ID ?? '',
  APP_SOCKET_URL: process.env.NEXT_PUBLIC_APP_SOCKET_URL ?? '',
};

export const isServer = typeof window === 'undefined';

export const LIMIT_PAGE = 10;
export enum DateTimeFormat {
  SHORT = 'DD/MM/YYYY HH:mm',
  LONG = 'DD MMM YYYY HH:mm',
  YMD = 'YYYY-MM-DD',
  DMY = 'DD-MM-YYYY',
  HOUR_MINUTE = 'HH:mm',
}
export const DATETIME_FORMAT = {
  FULL_DATE_TIME: "yyyy-M-dd'T'HH:mm:ss.SSSX",
  DATETIME_SECONDS: 'dd/MM/yyyy HH:mm:ss',
  MONTH_DATE_YEAR: 'LLL dd, y',
  DATE_MONTH_YEAR: 'dd LLL yyyy',
  DATETIME_MINUTES: 'dd/MM/yyyy HH:mm',
  REVERT_DATETIME: 'yyyy-MM-dd HH:mm',
  DATE_TIME: 'yyyy-MM-dd',
  DATE_YEAR: 'dd-MM-yyyy',
  DATE_TIME_SECONDS: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_LOCAL: 'yyyy-MM-dd HH:mm:ss',
};
export const TIME_FORMAT = {
  HOUR_MIN: 'hh:mm a',
};

export const ENUM_PAGE = {
  STORAGE_PAGE: 'storagePage',
  FUNDING_PAGE: 'fundingPage',
  LINKEDIN_JOB_PAGE: 'linkedinJobPage',
  MATCHING_COMPANIES_PAGE: 'matchingCompaniesPage',
  WATCH_LIST_PAGE: 'watchListPage',
};
