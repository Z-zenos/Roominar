import z from 'zod';

const registerAudienceFormSchema = z
  .object({
    avatar: z.string().optional(),
    email: z.string().email(),
    firstName: z.string().trim().min(1).max(255),
    lastName: z.string().trim().min(1).max(255),
    password: z.string().trim().min(8).max(255),
    confirmPassword: z.string().trim().min(8).max(255),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'passwordNotMatch',
        path: ['confirmPassword'],
      });
    }
  });

type RegisterAudienceFormSchema = z.infer<typeof registerAudienceFormSchema>;

export type { RegisterAudienceFormSchema };
export { registerAudienceFormSchema };
