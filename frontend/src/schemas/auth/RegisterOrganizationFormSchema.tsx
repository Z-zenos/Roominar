import { OrganizationTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const registerOrganizationFormSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().trim().min(1).max(255),
    lastName: z.string().trim().min(1).max(255),
    password: z.string().trim().min(8).max(255),
    confirmPassword: z.string().trim().min(8).max(255),

    organizationName: z.string().trim().min(1).max(255),
    cityCode: z.string().trim().nullable(),

    address: z.string().trim().max(1000).nullable(),
    slug: z.string().nullable(),
    phone: z.string().trim().max(11).nullable(),
    organizationType: z.nativeEnum(OrganizationTypeCode),
  })
  .superRefine(
    ({ confirmPassword, password, address, phone, organizationType }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'passwordNotMatch',
          path: ['confirmPassword'],
        });
      }
      if (organizationType === OrganizationTypeCode.Business && !address) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'missingAddress',
          path: ['address'],
        });
      }
      if (organizationType === OrganizationTypeCode.Business && !phone) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'missingPhone',
          path: ['phone'],
        });
      }
    },
  );

type RegisterOrganizationFormSchema = z.infer<
  typeof registerOrganizationFormSchema
>;

export type { RegisterOrganizationFormSchema };
export { registerOrganizationFormSchema };
