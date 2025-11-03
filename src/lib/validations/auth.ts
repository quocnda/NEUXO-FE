import * as z from 'zod';

import { REGEX_PASSWORD } from '../regex';
import { validationMessages } from './validation.utility';

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty(validationMessages.required('User name'))
    .max(100, { message: 'User name must be less than 100 characters.' })
    .refine((value) => value.trim() === value, { message: 'User name must not have leading or trailing whitespaces.' }),
  password: z
    .string()
    .nonempty(validationMessages.required('Password'))
    .min(8, validationMessages.gt(8, 'Password'))
    .regex(REGEX_PASSWORD, {
      message: 'Password must include at least one uppercase and one lowercase letter, numbers and Special characters.',
    })
    .refine((value) => value.trim() === value, { message: 'Password must not have leading or trailing whitespaces.' }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty(validationMessages.required('Email'))
    .email(validationMessages.invalid('Email'))
    .max(100, { message: 'Email must be less than 100 characters.' }),
});

export const schemaAssignee = z.object({
  name: z.string().nonempty(validationMessages.required('Assignee name')).nullable(),
});

export const schemaAddToProspect = z.object({
  name: z.string().nonempty(validationMessages.required('Prospect name')).nullable(),
});

export const schemaSignUpAccount = z
  .object({
    first_name: z.string().nonempty(validationMessages.required()),
    last_name: z.string().nonempty(validationMessages.required()),
    role: z.string().nonempty(validationMessages.required('Role')),
    email: z
      .string()
      .nonempty(validationMessages.required('Email'))
      .email(validationMessages.invalid('Email'))
      .max(100, { message: 'Email must be less than 100 characters.' }),
    phone_number: z
      .string()
      .optional()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: 'Phone number must be a valid number',
      }),
    password: z
      .string()
      .nonempty(validationMessages.required('Password'))
      .min(8, validationMessages.gt(8, 'Password'))
      .regex(REGEX_PASSWORD, {
        message:
          'Password must include at least one uppercase and one lowercase letter, numbers and Special characters.',
      })
      .refine((value) => value.trim() === value, {
        message: 'Password must not have leading or trailing whitespaces.',
      }),
    confirmPassword: z.string().nonempty(validationMessages.required('Confirm password')),
  })
  .refine((data: { password: any; confirmPassword: any }) => data.password === data.confirmPassword, {
    message: 'The passwords do not match.',
    path: ['confirmPassword'],
  });

export const schemaChangePassword = (statusPassword?: boolean) =>
  z
    .object({
      old_password: statusPassword ? z.string().nonempty(validationMessages.required('Old password')) : z.string(),
      new_password: z.string(),
      confirm_password: z.string().nonempty(validationMessages.required('Confirm password')),
    })
    .refine((data: { new_password: any; confirm_password: any }) => data.new_password === data.confirm_password, {
      message: 'Password does not match.',
      path: ['confirm_password'],
    });

export const loginGmailSchema = z.object({
  email: z
    .string()
    .nonempty(validationMessages.required('Email'))
    .email(validationMessages.invalid('Email'))
    .max(100, { message: 'Email must be less than 100 characters.' }),
  password: z.string().nonempty(validationMessages.required('Password')),
});

export const verifyCodeSchema = z.object({
  correntPin: z
    .string()
    .nonempty(validationMessages.required())
    .max(4, validationMessages.max(4))
    .min(4, validationMessages.gt(4)),
});

export const schemaSignUp = z.object({
  first_name: z.string().nonempty(validationMessages.required()),
  last_name: z.string().nonempty(validationMessages.required()),
  email: z.string().refine((value) => !value || z.string().email().safeParse(value).success, {
    message: validationMessages.invalid('Email'),
  }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: 'Phone number must be a valid number',
    }),
  location: z.string(),
});

const response = schemaChangePassword();

export type LoginSchema = z.infer<typeof loginSchema>;
export type ForgotSchema = z.infer<typeof forgotPasswordSchema>;
export type SchemaAssignee = z.infer<typeof schemaAssignee>;
export type SchemaAddToProspect = z.infer<typeof schemaAddToProspect>;
export type SchemaSignUpAccount = z.infer<typeof schemaSignUpAccount>;
export type SchemaChangePassword = z.infer<typeof response>;
export type LoginGmailSchema = z.infer<typeof loginGmailSchema>;
export type VerifyCodeSchema = z.infer<typeof verifyCodeSchema>;
export type SchemaSignUp = z.infer<typeof schemaSignUp>;
