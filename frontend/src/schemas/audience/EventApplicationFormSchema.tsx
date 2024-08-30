import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const eventApplicationFormSchema = z.object({
  email: z
    .string({ required_error: "Email can't empty." })
    .email({ message: 'Invalid email.' }),

  ticketId: z.string({ required_error: 'Please select at least one ticket.' }),

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

  workplaceName: z
    .string({ required_error: "Workplace name can't empty" })
    .max(255, { message: 'Workplace name must be less than 50 characters.' }),

  phoneNumber: z
    .string({
      required_error: 'Phone number cannot empty',
    })
    .min(1, "Phone number can't empty"),

  industryCode: z.nativeEnum(IndustryCode, {
    required_error: "Industry code can't empty",
  }),

  jobTypeCode: z.nativeEnum(JobTypeCode, {
    required_error: "Job type code can't empty",
  }),

  questionAnswerResults: z
    .array(
      z.object({
        questionId: z.number(),
        answerIds: z.array(z.number()),
      }),
    )
    .nullable(),

  isAgreed: z.boolean({
    required_error: 'Please agree with our term about privacy.',
  }),
});

type EventApplicationFormSchema = z.infer<typeof eventApplicationFormSchema>;

export type { EventApplicationFormSchema };

export default eventApplicationFormSchema;
