import z from 'zod';

const resetPasswordFormSchema = z
  .object({
    newPassword: z
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
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

export type { ResetPasswordFormSchema };
export { resetPasswordFormSchema };
