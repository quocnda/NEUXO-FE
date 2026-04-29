import * as z from 'zod';

import { validationMessages } from './validation.utility';

const requiredTextEditor = ['<p><br></p>', ''];
export const emailTemplateSchema = z.object({
  template_name: z
    .string()
    .nonempty(validationMessages.required())
    .max(100, { message: 'Template name must be less than 100 characters.' })
    .refine((value) => value.trim() === value, {
      message: 'Template name must not have leading or trailing whitespaces.',
    }),
  template_subject: z
    .string()
    .nonempty(validationMessages.required())
    .max(100, { message: 'Template subject must be less than 100 characters.' })
    .refine((value) => value.trim() === value, {
      message: 'Template subject must not have leading or trailing whitespaces.',
    }),
  template_content: z.string().refine((value) => !requiredTextEditor.includes(value), {
    message: 'Please enter this field!',
  }),
});
export const signatureSchema = z.object({
  signature_name: z
    .string()
    .nonempty(validationMessages.required())
    .max(100, { message: 'Signature name must be less than 100 characters.' })
    .refine((value) => value.trim() === value, {
      message: 'Signature name must not have leading or trailing whitespaces.',
    }),
  signature_html: z.string().refine((value) => !requiredTextEditor.includes(value), {
    message: 'Please enter this field!',
  }),
});

export type IEmailTemplate = z.infer<typeof emailTemplateSchema>;
export type ISignature = z.infer<typeof signatureSchema>;
