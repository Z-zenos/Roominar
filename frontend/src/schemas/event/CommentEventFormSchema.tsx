import z from 'zod';

const commentEventRequestSchema = z.object({
  content: z.string().trim().min(1).max(255),
});

type CommentEventRequestSchema = z.infer<typeof commentEventRequestSchema>;

export type { CommentEventRequestSchema };
export { commentEventRequestSchema };
