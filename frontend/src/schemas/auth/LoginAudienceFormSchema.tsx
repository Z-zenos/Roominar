import z from 'zod';

const loginAudienceFormSchema = z.object({
  email: z.string().email(),

  password: z
    .string()
    .trim()
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z_\d@$!%*?&]{8,}$/, {
    //   message: 'Invalid password.',
    // })
    .min(8)
    .max(255),

  rememberMe: z.boolean().default(true).optional(),
});

type LoginAudienceFormSchema = z.infer<typeof loginAudienceFormSchema>;

export type { LoginAudienceFormSchema };
export { loginAudienceFormSchema };
