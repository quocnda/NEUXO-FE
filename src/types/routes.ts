export const ROUTE = {
  HOME: '/',
  SIGN_IN: '/login',
  MATCHING_COMPANIES: '/matching-companies',
  LUMA_EVENTS: '/luma-events',
  LUMA_GUESTS: '/luma-guests',
  FUNDING: '/funding',
  LINKEDIN_JOB: '/linkedin-job',
  SIGN_UP: '/sign-up',
  ACCOUNT_MANAGEMENT: '/account-management',
  CHANGE_PASSWORD: '/change-password',
  ACCOUNT_SETTING: '/account-setting',
} as const;

export type ROUTE_KEY = keyof typeof ROUTE;
