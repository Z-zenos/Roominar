import z from 'zod';

const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;

export type { ForgotPasswordFormSchema };

export { forgotPasswordFormSchema };
