import z from 'zod';

const searchEventFormSchema = z.object({
  keyword: z.string().optional(),
  averageRatings: z.enum(['3', '3.5', '4', '4.5']).optional(),
  level: z.array(z.string()).default([]).optional(),
  price: z.array(z.number()).default([1, 1000]).optional(),
  isFree: z.boolean().optional(),
  registerDateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
});

type SearchEventFormSchema = z.infer<typeof searchEventFormSchema>;

export type { SearchEventFormSchema };
export { searchEventFormSchema };
