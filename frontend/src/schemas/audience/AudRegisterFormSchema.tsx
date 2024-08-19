import z from 'zod';

const audRegisterFormSchema = z
  .object({
    avatar: z.string().optional(),

    email: z.string({ required_error: "Email can't empty." }).email({ message: 'Invalid email.' }),

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

type AudRegisterFormSchema = z.infer<typeof audRegisterFormSchema>;

export type { AudRegisterFormSchema };
export { audRegisterFormSchema };
