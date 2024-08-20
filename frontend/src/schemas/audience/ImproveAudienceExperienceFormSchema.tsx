import z from 'zod';

const improveAudienceExperienceFormSchema = z.object({
  industryCode: z.string().max(255).nullable(),
  jobTypeCode: z.string().max(255).nullable(),
  tags: z.array(z.string()).nullable(),
});

type ImproveAudienceExperienceFormSchema = z.infer<typeof improveAudienceExperienceFormSchema>;

export type { ImproveAudienceExperienceFormSchema };
export { improveAudienceExperienceFormSchema };
