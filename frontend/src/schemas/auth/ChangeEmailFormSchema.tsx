import z from 'zod';

const changeEmailFormSchema = z.object({
  newEmail: z.string().email(),
  password: z.string().trim().min(8).max(255),
});

type ChangeEmailFormSchema = z.infer<typeof changeEmailFormSchema>;

export type { ChangeEmailFormSchema };
export { changeEmailFormSchema };
