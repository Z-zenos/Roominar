import z from 'zod';

const loginAudienceFormSchema = z.object({
  email: z.string({ required_error: 'empty' }).email({ message: 'invalid' }),

  password: z
    .string({ required_error: 'Please enter password.' })
    .trim()
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z_\d@$!%*?&]{8,}$/, {
    //   message: 'Invalid password.',
    // })
    .min(8, {
      message: 'invalid',
    })
    .max(100, 'Password must be less than 100 characters.'),

  rememberMe: z.boolean().default(true).optional(),
});

type LoginAudienceFormSchema = z.infer<typeof loginAudienceFormSchema>;

export type { LoginAudienceFormSchema };
export { loginAudienceFormSchema };
