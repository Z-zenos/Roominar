import z from 'zod';

const resetPasswordFormSchema = z
  .object({
    newPassword: z.string().trim().min(8).max(255),
    confirmPassword: z.string().trim().min(8).max(255),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'passwordNotMatch',
        path: ['confirmPassword'],
      });
    }
  });

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

export type { ResetPasswordFormSchema };
export { resetPasswordFormSchema };
