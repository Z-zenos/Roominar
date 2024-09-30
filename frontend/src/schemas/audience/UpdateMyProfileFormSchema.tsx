import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const updateMyProfileFormSchema = z.object({
  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().min(1).max(255),
  address: z.string().trim().max(1000).nullable(),
  workplaceName: z.string().max(255).nullable(),
  phone: z.string().min(1).nullable(),
  industryCode: z.nativeEnum(IndustryCode),
  jobTypeCode: z.nativeEnum(JobTypeCode),
  // cityCode: z.nativeEnum(CityCode),
  avatarUrl: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
});

type UpdateMyProfileFormSchema = z.infer<typeof updateMyProfileFormSchema>;

export type { UpdateMyProfileFormSchema };

export default updateMyProfileFormSchema;
