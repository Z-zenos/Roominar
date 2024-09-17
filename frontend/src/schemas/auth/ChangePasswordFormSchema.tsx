import z from 'zod';

const changePasswordFormSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password can't empty" })
    .trim()
    .min(8, {
      message: 'Invalid current password.',
    })
    .max(100, {
      message: 'Current password must be less than 100 characters.',
    }),

  newPassword: z
    .string({ required_error: "New password can't empty" })
    .trim()
    .min(8, {
      message: 'Invalid new password.',
    })
    .max(100, { message: 'New password must be less than 100 characters.' }),

  confirmNewPassword: z
    .string({ required_error: "Confirm new password can't empty" })
    .trim()
    .min(8, {
      message: 'Invalid confirm new password.',
    })
    .max(100, {
      message: 'Confirm new password must be less than 100 characters.',
    }),
});

type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>;

export type { ChangePasswordFormSchema };
export { changePasswordFormSchema };
