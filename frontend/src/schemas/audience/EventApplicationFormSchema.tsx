import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const eventApplicationFormSchema = z.object({
  email: z.string().email(),

  tickets: z
    .array(
      z.object({
        id: z.number(),
        quantity: z.number(),
        price: z.number(),
      }),
    )
    .refine((val) => val.length > 0, { message: 'missingTicket' }),

  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().min(1).max(255),
  workplaceName: z.string().max(255).optional(),
  phone: z.string().min(1),
  industryCode: z.nativeEnum(IndustryCode).optional(),
  jobTypeCode: z.nativeEnum(JobTypeCode).optional(),

  surveyResponseResults: z
    .array(
      z.object({
        questionId: z.number(),
        answerIds: z.array(z.number()),
      }),
    )
    .optional(),

  isAgreed: z.boolean(),
});

type EventApplicationFormSchema = z.infer<typeof eventApplicationFormSchema>;

export type { EventApplicationFormSchema };

export default eventApplicationFormSchema;
