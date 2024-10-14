import { QuestionTypeCode } from '@/src/lib/api/generated';
import z from 'zod';

const answerSchema = z.object({
  answer: z.string().trim().min(1).max(1024),
  isCorrect: z.boolean().default(false),
});

const questionAnswerSchema = z.object({
  question: z.string().trim().min(1).max(1024),
  typeCode: z.nativeEnum(QuestionTypeCode),
  answers: z.array(answerSchema),
});

const createSurveyFormSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().nullable(),
  startAt: z.date().nullable(),
  endAt: z.date().nullable(),
  maxResponseNumber: z.string().regex(/^\d+$/).transform(Number).nullable(),
  questionAnswers: z.array(questionAnswerSchema),
});

type CreateSurveyFormSchema = z.infer<typeof createSurveyFormSchema>;
type CreateQuestionAnswerSchema = z.infer<typeof questionAnswerSchema>;
type AnswerSchema = z.infer<typeof answerSchema>;

export type {
  CreateSurveyFormSchema,
  CreateQuestionAnswerSchema,
  AnswerSchema,
};
export default createSurveyFormSchema;
