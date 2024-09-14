import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const updateMyProfileFormSchema = z.object({
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

  address: z
    .string()
    .trim()
    .min(1, { message: 'Address must be greater than 1 characters.' })
    .nullable(),

  workplaceName: z
    .string()
    .max(255, { message: 'Workplace name must be less than 50 characters.' })
    .nullable(),

  phoneNumber: z.string().min(1, "Phone number can't empty").nullable(),

  industryCode: z.nativeEnum(IndustryCode),
  jobTypeCode: z.nativeEnum(JobTypeCode),
  // cityCode: z.nativeEnum(CityCode),

  avatarUrl: z.string().nullable(),
  tags: z.array(z.number()).nullable(),
});

type UpdateMyProfileFormSchema = z.infer<typeof updateMyProfileFormSchema>;

export type { UpdateMyProfileFormSchema };

export default updateMyProfileFormSchema;
