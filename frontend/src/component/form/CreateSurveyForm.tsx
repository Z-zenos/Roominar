'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormDateTimePicker,
  FormInput,
  FormTextarea,
} from '@/src/component/form/Form';
import {
  QuestionTypeCode,
  type ApiException,
  type ErrorResponse400,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import type { CreateSurveyFormSchema } from '@/src/schemas/survey/CreateSurveyFormSchema';
import createSurveyFormSchema from '@/src/schemas/survey/CreateSurveyFormSchema';
import { useCreateSurveyMutation } from '@/src/api/survey.api';
import CreateQuestion, {
  DEFAULT_QUESTION_ANSWER,
} from '../common/QuestionAnswer/CreateQuestion';
import { Button } from '@nextui-org/button';
import { FaSquareArrowUpRight } from 'react-icons/fa6';

export default function CreateSurveyForm() {
  const form = useForm<CreateSurveyFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      startAt: null,
      endAt: null,
      maxResponseNumber: '',

      questionAnswers: [DEFAULT_QUESTION_ANSWER],
    },
    resolver: zodResolver(createSurveyFormSchema),
  });

  const { trigger, isMutating: isCreating } = useCreateSurveyMutation({
    onSuccess() {
      toast.success('Create survey successfully!');
      form.reset();
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  function handleCreateSurvey(data: CreateSurveyFormSchema) {
    trigger({
      createSurveyRequest: {
        name: data.name,
        description: data.description,
        startAt: data.startAt,
        endAt: data.endAt,
        maxResponseNumber: Number(data.maxResponseNumber),
        questionAnswers: data.questionAnswers.map((qa, qi) => ({
          question: qa.question,
          typeCode: qa.typeCode,
          orderNumber: qi,
          answers: qa.answers.map((a, ai) => ({
            answer: a.answer,
            orderNumber: ai,
            isCorrect:
              qa.typeCode === QuestionTypeCode.Text ? true : a.isCorrect,
          })),
        })),
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateSurvey)}
        className='grid grid-cols-12 items-start gap-10'
      >
        <div className='grid grid-cols-2 gap-6 [&>div]:w-full bg-white rounded-md p-6 shadow-md col-span-9 max-w-[1000px]'>
          <div className='col-span-2'>
            <FormInput
              id='name'
              name='name'
              label='name'
              required
              placeholder='survey name'
              control={form.control}
              showError={true}
            />
          </div>
          <div>
            <FormDateTimePicker
              name='startAt'
              label='startAt'
              control={form.control}
            />
          </div>
          <div>
            <FormDateTimePicker
              name='endAt'
              label='endAt'
              control={form.control}
            />
          </div>

          <div className='col-span-2'>
            <FormTextarea
              id='description'
              name='description'
              label='description'
              placeholder='Describe something about this survey...'
              control={form.control}
            />
          </div>
          <div>
            <FormInput
              id='maxResponseNumber'
              name='maxResponseNumber'
              label='maxResponseNumber'
              placeholder='100'
              control={form.control}
            />
          </div>

          {/* === QUESTIONS & ANSWERS === */}
          <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary'>
            Create Questions and Answers ❓
          </h3>

          <div className='col-span-2'>
            <CreateQuestion
              control={form.control}
              register={form.register}
              getValues={form.getValues}
              setValue={form.setValue}
              errors={form.formState.errors}
            />
          </div>

          <Button
            className='overflow-hidden w-32 p-2 h-12 bg-black !text-white border-none rounded-md text-xm font-bold cursor-pointer relative z-10 group'
            type='submit'
            isLoading={isCreating}
          >
            Save <FaSquareArrowUpRight className='inline w-5 h-5 mb-1 ml-1' />
            <span className='absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left'></span>
            <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left'></span>
            <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left'></span>
            <span className='group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10'>
              Save <FaSquareArrowUpRight className='inline w-5 h-5 mb-1 ml1' />
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
