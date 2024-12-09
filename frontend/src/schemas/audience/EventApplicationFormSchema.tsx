import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const eventApplicationFormSchema = z.object({
  email: z.string().email(),

  tickets: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),

  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().min(1).max(255),
  workplaceName: z.string().min(5).max(255),
  phone: z.string().min(1),
  industryCode: z.nativeEnum(IndustryCode),
  jobTypeCode: z.nativeEnum(JobTypeCode),

  surveyResponseResults: z
    .array(
      z.object({
        questionId: z.number(),
        answerIds: z.array(z.number()),
      }),
    )
    .nullable(),

  isAgreed: z.boolean(),
});

type EventApplicationFormSchema = z.infer<typeof eventApplicationFormSchema>;

export type { EventApplicationFormSchema };

export default eventApplicationFormSchema;
