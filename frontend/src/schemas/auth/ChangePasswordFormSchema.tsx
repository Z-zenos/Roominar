import z from 'zod';

const changePasswordFormSchema = z.object({
  currentPassword: z.string().trim().min(8).max(255),
  newPassword: z.string().trim().min(8).max(255),
  confirmNewPassword: z.string().trim().min(8).max(255),
});

type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>;

export type { ChangePasswordFormSchema };
export { changePasswordFormSchema };
