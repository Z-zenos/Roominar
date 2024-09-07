import z from 'zod';

const forgotPasswordFormSchema = z.object({
  email: z
    .string({ required_error: "Email can't empty." })
    .email({ message: 'Invalid email.' }),
});

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;

export type { ForgotPasswordFormSchema };

export { forgotPasswordFormSchema };
