import { OrganizationTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const registerOrganizationFormSchema = z
  .object({
    email: z
      .string({ required_error: "Email can't empty." })
      .email({ message: 'Invalid email.' }),

    firstName: z
      .string({ required_error: "First name can't empty" })
      .trim()
      .min(1, { message: 'First name must be greater than 1 characters.' })
      .max(50, { message: 'First name must be less than 50 characters.' }),

    lastName: z
      .string({ required_error: "Last name can't empty" })
      .trim()
      .min(1, { message: 'Last name must be greater than 1 characters.' })
      .max(50, { message: 'Last name must be less than 50 characters.' }),

    password: z
      .string({ required_error: "Password can't empty" })
      .trim()
      .min(8, {
        message: 'Invalid password.',
      })
      .max(100, { message: 'Password must be less than 100 characters.' }),

    confirmPassword: z
      .string({ required_error: 'Missing confirm password' })
      .trim()
      .min(8, {
        message: 'Confirm password must be greater than 8 characters.',
      })
      .max(100, {
        message: 'Confirm password must be less than 100 characters.',
      }),

    name: z
      .string({ required_error: "Organization name can't empty" })
      .trim()
      .min(1, {
        message: 'Organization name must be greater than 1 characters.',
      })
      .max(50, {
        message: 'Organization name must be less than 50 characters.',
      }),

    hp_url: z.string().nullable(),
    city_code: z
      .string({ required_error: "City can't empty" })
      .trim()
      .min(1, {
        message: 'City must be greater than 1 characters.',
      })
      .max(50, {
        message: 'City must be less than 50 characters.',
      }),

    contact_email: z
      .string({ required_error: "Contact email can't empty." })
      .email({ message: 'Invalid contact email.' }),
    address: z
      .string({ required_error: "Address can't empty" })
      .trim()
      .min(1, {
        message: 'Address must be greater than 1 characters.',
      })
      .max(50, {
        message: 'Address must be less than 50 characters.',
      }),
    representative_url: z.string().nullable(),
    phone: z
      .string({ required_error: "Address can't empty" })
      .trim()
      .min(1, {
        message: 'Address must be greater than 1 characters.',
      })
      .max(50, {
        message: 'Address must be less than 50 characters.',
      }),
    type: z.nativeEnum(OrganizationTypeCode),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

type RegisterAudienceFormSchema = z.infer<
  typeof registerOrganizationFormSchema
>;

export type { RegisterAudienceFormSchema };
export { registerOrganizationFormSchema };
