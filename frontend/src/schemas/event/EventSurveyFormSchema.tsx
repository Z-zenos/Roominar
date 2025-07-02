import z from 'zod';

const eventSurveyFormSchema = z.object({
  surveyResponseResults: z
    .array(
      z.object({
        questionId: z.number(),
        answerIds: z.array(z.number()),
        answerText: z.string().optional(),
      }),
    )
    .optional(),
});

type EventSurveyFormSchema = z.infer<typeof eventSurveyFormSchema>;

export type { EventSurveyFormSchema };

export default eventSurveyFormSchema;
