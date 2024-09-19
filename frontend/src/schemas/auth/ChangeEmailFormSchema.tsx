import z from 'zod';

const changeEmailFormSchema = z.object({
  newEmail: z
    .string({ required_error: "Email can't empty." })
    .email({ message: 'Invalid email.' }),

  password: z
    .string({ required_error: "Password can't empty" })
    .trim()
    .min(8, {
      message: 'Invalid password.',
    })
    .max(100, { message: 'Password must be less than 100 characters.' }),
});

type ChangeEmailFormSchema = z.infer<typeof changeEmailFormSchema>;

export type { ChangeEmailFormSchema };
export { changeEmailFormSchema };
