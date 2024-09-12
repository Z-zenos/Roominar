import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const updateMyProfileFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name must be greater than 1 characters.' })
    .max(50, { message: 'First name must be less than 50 characters.' }),

  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name must be greater than 1 characters.' })
    .max(50, { message: 'Last name must be less than 50 characters.' }),

  address: z
    .string()
    .trim()
    .min(1, { message: 'Address must be greater than 1 characters.' }),

  workplaceName: z
    .string()
    .max(255, { message: 'Workplace name must be less than 50 characters.' }),

  phoneNumber: z.string().min(1, "Phone number can't empty"),

  industryCode: z.nativeEnum(IndustryCode),
  jobTypeCode: z.nativeEnum(JobTypeCode),
  // cityCode: z.nativeEnum(CityCode),

  avatarUrl: z.string().nullable().optional(),
  tags: z.array(z.number()).nullable(),
});

type UpdateMyProfileFormSchema = z.infer<typeof updateMyProfileFormSchema>;

export type { UpdateMyProfileFormSchema };

export default updateMyProfileFormSchema;
