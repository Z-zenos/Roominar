import z from 'zod';

const audLoginFormSchema = z.object({
  email: z.string({ required_error: "Email can't empty." }).email({ message: 'Invalid email.' }),

  password: z
    .string({ required_error: 'Please enter password.' })
    .trim()
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z_\d@$!%*?&]{8,}$/, {
    //   message: 'Invalid password.',
    // })
    .min(8, {
      message: 'Invalid password.',
    })
    .max(100, 'Password must be less than 100 characters.'),

  rememberMe: z.boolean().optional(),
});

type AudLoginFormSchema = z.infer<typeof audLoginFormSchema>;

export type { AudLoginFormSchema };
export { audLoginFormSchema };
