'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormCustomLabel,
  FormDateTimePicker,
  FormInput,
  FormTextarea,
} from '@/src/component/form/Form';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import type { CreateSurveyFormSchema } from '@/src/schemas/survey/CreateSurveyFormSchema';
import createSurveyFormSchema from '@/src/schemas/survey/CreateSurveyFormSchema';
import { useCreateSurveyMutation } from '@/src/api/survey.api';
import clsx from 'clsx';
import CreateQuestion, {
  DEFAULT_QUESTION_ANSWER,
} from '../common/QuestionAnswer/CreateQuestion';
import { Button } from '@nextui-org/button';

export default function CreateSurveyForm() {
  const form = useForm<CreateSurveyFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      startAt: null,
      endAt: null,
      maxResponseNumber: null,

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
    // trigger({
    //   eventId: 0,
    //   publishEventRequest: {
    //     ...data,
    //   },
    // });
    console.log(data, trigger, isCreating);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateSurvey)}
        className='grid grid-cols-12 items-start gap-10'
      >
        <div className='grid grid-cols-2 gap-6 [&>div]:w-full bg-white rounded-md p-6 shadow-md col-span-9 max-w-[1000px]'>
          <div className='col-span-2'>
            <FormCustomLabel
              htmlFor='name'
              required
            />
            <FormInput
              id='name'
              name='name'
              placeholder='survey name'
              control={form.control}
              isDisplayError={true}
              className={clsx(
                form.formState.errors.name &&
                  form.formState.touchedFields.name &&
                  'border-error-main',
              )}
            />
          </div>
          <div>
            <FormCustomLabel htmlFor='startAt' />
            <FormDateTimePicker
              name='startAt'
              control={form.control}
            />
          </div>
          <div>
            <FormCustomLabel htmlFor='endAt' />
            <FormDateTimePicker
              name='endAt'
              control={form.control}
            />
          </div>

          <div className='col-span-2'>
            <FormCustomLabel htmlFor='description' />
            <FormTextarea
              id='description'
              name='description'
              placeholder='Describe something about this survey...'
              control={form.control}
              className={clsx(
                form.formState.errors.description &&
                  form.formState.touchedFields.description &&
                  'border-error-main',
              )}
            />
          </div>
          <div>
            <FormCustomLabel htmlFor='maxResponseNumber' />

            <FormInput
              id='maxResponseNumber'
              name='maxResponseNumber'
              placeholder='100'
              control={form.control}
              className={clsx(
                form.formState.errors.maxResponseNumber &&
                  form.formState.touchedFields.maxResponseNumber &&
                  'border-error-main',
              )}
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
        </div>

        <Button type='submit'>Save</Button>
      </form>
    </Form>
  );
}
