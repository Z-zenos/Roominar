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
    cityCode: z.string().trim().min(1).max(20),

    address: z.string().trim().min(1).max(1000),
    representativeUrl: z.string().nullable(),
    phone: z.string().trim().min(1).max(50),
    organizationType: z.nativeEnum(OrganizationTypeCode),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'passwordNotMatch',
        path: ['confirmPassword'],
      });
    }
  });

type RegisterOrganizationFormSchema = z.infer<
  typeof registerOrganizationFormSchema
>;

export type { RegisterOrganizationFormSchema };
export { registerOrganizationFormSchema };
