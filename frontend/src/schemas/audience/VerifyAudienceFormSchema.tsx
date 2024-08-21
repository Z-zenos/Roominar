import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const verifyAudienceFormSchema = z.object({
  industryCode: z.nativeEnum(IndustryCode),
  jobTypeCode: z.nativeEnum(JobTypeCode),
  tags: z.array(z.number()).default([]),
});

type VerifyAudienceFormSchema = z.infer<typeof verifyAudienceFormSchema>;

export type { VerifyAudienceFormSchema };
export { verifyAudienceFormSchema };
