import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const eventApplicationFormSchema = z
  .object({
    email: z
      .string({ required_error: "Email can't empty." })
      .email({ message: 'Invalid email.' }),

    ticketId: z.string({
      required_error: 'Please select at least one ticket.',
    }),

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

    password: z
      .string({ required_error: "Password can't empty" })
      .trim()
      // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z_\d@$!%*?&]{8,}$/, {
      //   message: 'Invalid password.',
      // })
      .min(8, {
        message: 'Invalid password.',
      })
      .max(100, { message: 'Password must be less than 100 characters.' }),

    confirmPassword: z
      .string({ required_error: 'Missing confirm password' })
      .trim()
      .min(8, {
        message: 'Confirm password must be greater than 8 characters.',
      })
      .max(100, {
        message: 'Confirm password must be less than 100 characters.',
      }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

type EventApplicationFormSchema = z.infer<typeof eventApplicationFormSchema>;

export type { EventApplicationFormSchema };

export default eventApplicationFormSchema;
