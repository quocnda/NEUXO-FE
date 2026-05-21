import * as z from 'zod';

import { linkedinUrlRegex, twitterUrlRegex, validationMessages } from './validation.utility';

export const createCompanySchema = z.object({
  linkedin_url: z.string().nonempty(validationMessages.required('Linkedin url')).regex(linkedinUrlRegex, {
    message: 'Invalid LinkedIn URL. Please use the format: https://www.linkedin.com/company/company_name',
  }),
});

export const schemaAddGuestMention = () =>
  z.object({
    linkedin_url: z
      .string()
      .nonempty(validationMessages.required())
      .regex(linkedinUrlRegex, { message: 'Invalid linkedin url' }),
    twitter_url: z
      .string()
      .refine((value) => !value || twitterUrlRegex.test(value), { message: 'Invalid twitter url' }),
  });
export const schemaAddTwitter = z.object({
  url_twitter: z
    .string()
    .nonempty(validationMessages.required())
    .regex(twitterUrlRegex, { message: 'Invalid twitter url' }),
});

export const schemaUpdateProfile = z.object({
  country: z.string().nullish(),
  twitter_url: z
    .string()
    .refine((value) => !value || twitterUrlRegex.test(value), { message: 'Invalid twitter url' })
    .nullish(),
  website: z
    .string()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: validationMessages.invalid('Website'),
    })
    .nullish(),
});

export const schemaAddICPWatchlist = z.object({
  icp_id: z.string().nonempty(validationMessages.required()),
});

export type SchemaCreateCompany = z.infer<typeof createCompanySchema>;
export type SchemaAddICPWatchlist = z.infer<typeof schemaAddICPWatchlist>;

const schemaAddGuestMentionType = schemaAddGuestMention();
export type SchemaAddGuestMention = z.infer<typeof schemaAddGuestMentionType>;

export type SchemaAddTwitter = z.infer<typeof schemaAddTwitter>;
