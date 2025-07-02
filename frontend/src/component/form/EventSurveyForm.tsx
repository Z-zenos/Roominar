import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from './Form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AnswerItem, QuestionAnswerItem } from '@/src/lib/api/generated';
import { QuestionTypeCode } from '@/src/lib/api/generated';
import Checkbox from '../common/Input/Checkbox';
import { RadioGroup, RadioGroupItem } from '../common/RadioGroup';
import type { EventSurveyFormSchema } from '@/src/schemas/event/EventSurveyFormSchema';
import eventSurveyFormSchema from '@/src/schemas/event/EventSurveyFormSchema';
import Button from '../common/Button/Button';
import toast from 'react-hot-toast';
import { handleApiError } from '@/src/utils/app.util';
import {
  useCreateSurveyResponseResultMutation,
  useGetEventSurveyQuery,
} from '@/src/api/event.api';
import Spinner from '../common/Loader/Spinner';

interface EventSurveyFormProps {
  eventId: number;
}

export default function EventSurveyForm({ eventId }: EventSurveyFormProps) {
  const form = useForm<EventSurveyFormSchema>({
    mode: 'onChange',
    defaultValues: {
      surveyResponseResults: [],
    },
    resolver: zodResolver(eventSurveyFormSchema),
  });

  const { data: survey, isLoading } = useGetEventSurveyQuery({
    eventId: eventId,
  });

  const { trigger: createSurveyResponseResult, isMutating: isCreating } =
    useCreateSurveyResponseResultMutation({
      onSuccess() {
        form.reset();
        toast.success('Cảm ơn bạn đã gửi phản hồi! 🎉');
      },
      onError: handleApiError,
    });

  function handleSaveSurveyResponse(data: EventSurveyFormSchema) {
    createSurveyResponseResult({
      eventId: eventId,
      createSurveyResponseResultRequest: {
        surveyResponseResults: data.surveyResponseResults.map((item) => ({
          questionId: item.questionId,
          answerIds: item.answerIds,
          answerText: item.answerText || null,
        })),
      },
    });
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSaveSurveyResponse)}>
        <div className='w-full shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] border border-gray-200 px-10 py-6 rounded-md mt-6 bg-white'>
          <h2 className='text-md font-semibold text-secondary'>
            Chúng tôi muốn xin ý kiến của bạn 📝
          </h2>
          <p className='font-light opacity-80 text-sm'>
            Ý kiến của bạn sẽ là nguồn thông tin vô cùng hữu ích và quý giá giúp
            chúng tôi khảo sát, phân tích và cải thiện chất lượng các sự kiện
            trong tương lai.
          </p>
          <FormField
            control={form.control}
            name='surveyResponseResults'
            render={({ field }) => (
              <FormItem>
                {survey &&
                  survey?.questionAnwers.map(
                    (questionAnswer: QuestionAnswerItem) => (
                      <div
                        className='mt-4 bg-emerald-50 p-5'
                        key={`qa-${questionAnswer.id}`}
                      >
                        <h3 className='text-nm font-semibold text-slate-800'>
                          {questionAnswer.orderNumber}.{questionAnswer.question}
                        </h3>

                        {questionAnswer.typeCode ===
                          QuestionTypeCode.Multiple &&
                          questionAnswer.answers.map((answer: AnswerItem) => (
                            <FormField
                              key={`qa-${questionAnswer.id}-${answer.id}`}
                              control={form.control}
                              name='surveyResponseResults'
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={`ficb-${answer.id}`}
                                    className='mt-3'
                                  >
                                    <FormControl>
                                      <Checkbox
                                        key={`qa-${questionAnswer.id}-${answer.id}`}
                                        checked={field?.value.some((v) =>
                                          v.answerIds.includes(answer.id),
                                        )}
                                        onCheckedChange={(checked) => {
                                          let newItems = null;
                                          const currentValue = [...field.value];

                                          if (checked) {
                                            const qa = currentValue.find(
                                              (item) =>
                                                item.questionId ===
                                                questionAnswer.id,
                                            );
                                            if (!qa) {
                                              newItems = [
                                                ...currentValue,
                                                {
                                                  questionId: questionAnswer.id,
                                                  answerIds: [answer.id],
                                                },
                                              ];
                                            } else {
                                              qa.answerIds.push(answer.id);
                                              newItems = currentValue;
                                            }
                                          } else {
                                            const qa = currentValue.find(
                                              (item) =>
                                                item.questionId ===
                                                questionAnswer.id,
                                            );
                                            qa.answerIds = qa.answerIds.filter(
                                              (item) => item !== answer.id,
                                            );
                                            newItems = currentValue;
                                          }
                                          field.onChange(newItems);
                                        }}
                                        title={answer.answer}
                                      />
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}

                        {questionAnswer.typeCode ===
                          QuestionTypeCode.Single && (
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                let newItems = null;
                                const currentValue = [...field.value];

                                const qa = currentValue.find(
                                  (item) =>
                                    item.questionId === questionAnswer.id &&
                                    item.answerIds.includes(+value),
                                );
                                if (!qa) {
                                  newItems = [
                                    ...currentValue,
                                    {
                                      questionId: questionAnswer.id,
                                      answerIds: [+value],
                                    },
                                  ];
                                } else {
                                  qa.answerIds.push(+value);
                                  newItems = currentValue;
                                }

                                field.onChange(newItems);
                              }}
                              className='flex flex-col space-y-1'
                            >
                              {questionAnswer.answers.map(
                                (answer: AnswerItem) => (
                                  <FormItem
                                    key={`qa-${questionAnswer.id}-${answer.id}`}
                                    className='flex items-center space-x-3 space-y-0 mt-2'
                                  >
                                    <FormControl>
                                      <RadioGroupItem value={answer.id + ''} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>
                                      {answer.answer}
                                    </FormLabel>
                                  </FormItem>
                                ),
                              )}
                            </RadioGroup>
                          </FormControl>
                        )}
                      </div>
                    ),
                  )}
              </FormItem>
            )}
          />

          <Button
            title={'Gửi phản hồi'}
            type='submit'
            className='w-80 mt-5 mx-auto'
            disabled={form.getValues('surveyResponseResults').length === 0}
            isLoading={isCreating}
          />
        </div>
      </form>
    </Form>
  );
}
