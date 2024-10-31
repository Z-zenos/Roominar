import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const createTargetFormSchema = z.object({
  name: z.string().trim().min(1).max(1024),
  industryCodes: z
    .array(z.nativeEnum(IndustryCode))
    .refine((val) => val.length > 0, { message: 'missingIndustryCodes' }),
  jobTypeCodes: z
    .array(z.nativeEnum(JobTypeCode))
    .refine((val) => val.length > 0, { message: 'missingJobTypeCodes' }),
});

type CreateTargetFormSchema = z.infer<typeof createTargetFormSchema>;

export type { CreateTargetFormSchema };
export { createTargetFormSchema };
