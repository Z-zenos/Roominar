'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { styles } from '@/src/constant/styles.constant';
import type { EventApplicationFormSchema } from '@/src/schemas/audience/EventApplicationFormSchema';
import eventApplicationFormSchema from '@/src/schemas/audience/EventApplicationFormSchema';
import {
  Form,
  FormCheckBox,
  FormCombobox,
  FormControl,
  FormCustomLabel,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
} from '@/src/component/form/Form';
import Button from '@/src/component/common/Button/Button';
import { useGetEventDetailQuery } from '@/src/api/event.api';
import { parseCode } from '@/src/util/app.util';
import { MdOutlineOnlinePrediction } from 'react-icons/md';
import Chip from '@/src/component/common/Chip';
import { FaUserFriends } from 'react-icons/fa';
import { Image, Link } from '@nextui-org/react';
import type {
  AnswerItem,
  ApiException,
  ErrorResponse400,
  JobTypeCode,
  QuestionAnswerItem,
  SurveyResponseResultItem,
  TicketItem,
} from '@/src/lib/api/generated';
import { IndustryCode, QuestionTypeCode } from '@/src/lib/api/generated';
import { JobTypeCodeMapping } from '@/src/constant/code.constant';
import { RadioGroup, RadioGroupItem } from '@/src/component/common/RadioGroup';
import Checkbox from '@/src/component/common/Input/Checkbox';
import { useApplyEventMutation } from '@/src/api/application.api';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiSolidSchool } from 'react-icons/bi';
import { FaPhone } from 'react-icons/fa6';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import Timeline from '@/src/component/common/Timeline';

interface EventApplicationFormProps {
  slug: string;
}

export default function EventApplicationForm({
  slug,
}: EventApplicationFormProps) {
  useState<boolean>(false);
  const { data: event } = useGetEventDetailQuery({ slug });
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();

  const form = useForm<EventApplicationFormSchema>({
    mode: 'all',
    defaultValues: {
      email: auth?.user?.email || '',
      ticketId: undefined,
      firstName: auth?.user?.firstName || '',
      lastName: auth?.user?.lastName || '',
      workplaceName: auth?.user?.workplaceName || '',
      phone: auth?.user?.phone || '',
      industryCode: (auth?.user?.industryCode as IndustryCode) || undefined,
      jobTypeCode: (auth?.user?.jobTypeCode as JobTypeCode) || undefined,
      surveyResponseResults: [],
      isAgreed: false,
    },
    resolver: zodResolver(eventApplicationFormSchema),
  });

  const { trigger, isMutating: isApplying } = useApplyEventMutation({
    onSuccess() {
      toast.success('Apply event successfully!');
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

  function handleApplyEvent(data: EventApplicationFormSchema) {
    trigger({
      eventId: event.id,
      createApplicationRequest: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        workplaceName: data.workplaceName,
        phone: data.phone,
        industryCode: data.industryCode,
        jobTypeCode: data.jobTypeCode,
        surveyResponseResults:
          data.surveyResponseResults as SurveyResponseResultItem[],
        ticketId: +data.ticketId,
        isAgreed: data.isAgreed,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleApplyEvent)}
        className={clsx(
          'grid grid-cols-7 w-full items-start gap-10 mx-auto  py-20',
          width < 1000 && 'px-[5%]',
          width > 1400 && 'px-[15%]',
          width < 1400 && width > 1000 && 'px-[10%]',
        )}
      >
        <div className={clsx(width > 1200 ? 'col-span-2' : 'col-span-7')}>
          {event && (
            <div className='rounded-md p-5 shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px] bg-white'>
              <div className={'flex justify-between gap-2 items-start mb-3'}>
                <Image
                  src={
                    event.coverImageUrl ??
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVoYkFRN0wzDRnM7OwHq7yINArQLe5UJKV9A&s'
                  }
                  alt='event image'
                  width={100}
                  height={80}
                  className={clsx('w-full h-full min-w-[100px] rounded-md')}
                />
                <h3 className='font-medium text-nm text-primary line-clamp-2'>
                  {event.name}
                </h3>
              </div>
              <p className='text-sm font-light line-clamp-1 text-gray-700'>
                {event.organizationAddress}
              </p>

              <div className={clsx(styles.between)}>
                <Chip
                  content={
                    event.appliedNumber + ' / ' + event.applicationNumber
                  }
                  leftIcon={<FaUserFriends className='text-sm' />}
                  type='info'
                />
                {event.meetingToolCode && (
                  <Chip
                    content={event.meetingToolCode}
                    leftIcon={<MdOutlineOnlinePrediction className='text-sm' />}
                    type='success'
                  />
                )}
              </div>
            </div>
          )}
          <div className='rounded-md py-5 shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px] my-6 bg-white'>
            <FormField
              control={form.control}
              name='ticketId'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <h3 className='text-md font-semibold px-5 text-orange-500'>
                    Ticket 🎟
                  </h3>
                  <p className='font-light text-sm my-3 opacity-80 px-5'>
                    Check description to see which ticket type is right for you.
                  </p>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value + ''}
                      className='flex flex-col space-y-1'
                    >
                      {event &&
                        event.tickets.map((ticket: TicketItem) => (
                          <FormItem
                            className={clsx(
                              styles.between,
                              'gap-3 border-t border-t-gray-200 py-3 cursor-pointer transition-all px-5 hover:bg-emerald-50 hover:border-emerald-100',
                              form.getValues('ticketId') === ticket.id + '' &&
                                'bg-emerald-50 border-b border-b-gray-300',
                            )}
                            key={`t-${ticket.id}`}
                          >
                            <FormLabel className='font-normal cursor-pointer'>
                              <h4 className='text-nm'>{ticket.name}</h4>
                              <p className='font-light opacity-80 text-sm mt-2'>
                                {ticket.description}
                              </p>
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value={ticket.id + ''} />
                            </FormControl>
                          </FormItem>
                        ))}
                    </RadioGroup>
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className={clsx(width > 1200 ? 'col-span-5' : 'col-span-7')}>
          <div className='w-full shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] border border-gray-200 px-10 py-6 rounded-md bg-white'>
            <h2 className='text-lg font-semibold text-primary'>
              Enter your detail information ✍
            </h2>

            {event && (
              <Timeline
                applicationStartAt={event.applicationStartAt}
                applicationEndAt={event.applicationEndAt}
                startAt={event.startAt}
                endAt={event.endAt}
                className='my-3'
              />
            )}
            <div
              className={clsx(
                'grid gap-8 items-center',
                width < 600 ? 'grid-cols-1' : 'grid-cols-2',
              )}
            >
              <div>
                <FormCustomLabel
                  htmlFor='email'
                  required
                />
                <FormInput
                  id='email'
                  name='email'
                  type='email'
                  rightIcon={
                    <HiMail
                      size={20}
                      className='text-primary'
                    />
                  }
                  placeholder='registermail@gmail.com'
                  control={form.control}
                  isDisplayError={true}
                  className={clsx(
                    form.formState.errors.email &&
                      form.formState.touchedFields.email &&
                      'border-error-main',
                    status === 'authenticated' && 'bg-slate-100 text-gray-500',
                  )}
                  disabled={status === 'authenticated'}
                />
              </div>
              {width < 600 ? <></> : <>&nbsp;</>}
              <div className='self-start'>
                <FormCustomLabel
                  htmlFor='firstName'
                  required
                />
                <FormInput
                  id='firstName'
                  name='firstName'
                  placeholder='Kevin'
                  className={clsx(
                    form.formState.errors.firstName &&
                      form.formState.touchedFields.firstName &&
                      'border-error-main',
                    status === 'authenticated' && 'bg-slate-100 text-gray-500',
                  )}
                  disabled={status === 'authenticated'}
                  control={form.control}
                  isDisplayError={true}
                />
              </div>
              <div className='self-start'>
                <FormCustomLabel
                  htmlFor='lastName'
                  required
                />
                <FormInput
                  id='lastName'
                  name='lastName'
                  placeholder='De Bruyne'
                  className={clsx(
                    form.formState.errors.lastName &&
                      form.formState.touchedFields.lastName &&
                      'border-error-main',
                    status === 'authenticated' && 'bg-slate-100 text-gray-500',
                  )}
                  disabled={status === 'authenticated'}
                  control={form.control}
                  isDisplayError={true}
                />
              </div>
              <div className='self-start'>
                <FormCustomLabel
                  htmlFor='workplaceName'
                  required
                />
                <FormInput
                  id='workplaceName'
                  name='workplaceName'
                  placeholder='Place you work or learn'
                  className={clsx(
                    form.formState.errors.firstName &&
                      form.formState.touchedFields.firstName &&
                      'border-error-main',
                    status === 'authenticated' && 'bg-slate-100 text-gray-500',
                  )}
                  disabled={status === 'authenticated'}
                  control={form.control}
                  isDisplayError={true}
                  rightIcon={
                    <BiSolidSchool
                      className='text-primary'
                      size={20}
                    />
                  }
                />
              </div>
              <div className='self-start'>
                <FormCustomLabel
                  htmlFor='phone'
                  required
                />
                <FormInput
                  id='phone'
                  name='phone'
                  placeholder='Kevin'
                  className={clsx(
                    form.formState.errors.firstName &&
                      form.formState.touchedFields.firstName &&
                      'border-error-main',
                    status === 'authenticated' && 'bg-slate-100 text-gray-500',
                  )}
                  disabled={status === 'authenticated'}
                  control={form.control}
                  isDisplayError={true}
                  rightIcon={
                    <FaPhone
                      className='text-primary'
                      size={20}
                    />
                  }
                />
              </div>
              <div className='self-start'>
                <FormCustomLabel
                  htmlFor='jobTypeCode'
                  required
                />
                <FormCombobox
                  data={Object.keys(JobTypeCodeMapping).map((key: string) => ({
                    value: key,
                    label: JobTypeCodeMapping[key],
                  }))}
                  name='jobTypeCode'
                  control={form.control}
                  title='type job'
                  multiple={false}
                  className={clsx(
                    'w-full',
                    status === 'authenticated' &&
                      'bg-slate-100 text-gray-500 pointer-events-none',
                  )}
                />
              </div>
              <div className='self-start'>
                <FormCustomLabel
                  htmlFor='industryCode'
                  required
                />
                <FormCombobox
                  data={Object.keys(IndustryCode).map((ic: string) => ({
                    value: IndustryCode[ic],
                    label: parseCode(IndustryCode[ic]),
                  }))}
                  name='industryCode'
                  control={form.control}
                  title='industry'
                  multiple={false}
                  className={clsx(
                    'w-full',
                    status === 'authenticated' &&
                      'bg-slate-100 text-gray-500 pointer-events-none',
                  )}
                />
              </div>
            </div>
          </div>
          {event && (
            <div className='w-full shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] border border-gray-200 px-10 py-6 rounded-md mt-6 bg-white'>
              <h2 className='text-md font-semibold text-secondary'>
                Answer some questions
              </h2>
              <p className='font-light opacity-80 text-sm'>
                Your answers will be an extremely useful and valuable source of
                information to help us survey, analyze and improve the quality
                of future events.
              </p>
              <FormField
                control={form.control}
                name='surveyResponseResults'
                render={({ field }) => (
                  <FormItem>
                    {event.survey.questionAnwers.map(
                      (questionAnswer: QuestionAnswerItem) => (
                        <div
                          className='mt-4 bg-emerald-50 p-5'
                          key={`qa-${questionAnswer.id}`}
                        >
                          <h3 className='text-nm font-semibold text-slate-800'>
                            {questionAnswer.orderNumber}.
                            {questionAnswer.question}
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
                                            const currentValue = [
                                              ...field.value,
                                            ];

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
                                                    questionId:
                                                      questionAnswer.id,
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
                                              qa.answerIds =
                                                qa.answerIds.filter(
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
                                        <RadioGroupItem
                                          value={answer.id + ''}
                                        />
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
            </div>
          )}
          <div className={clsx(styles.center, 'mt-5')}>
            <FormCheckBox
              control={form.control}
              name='isAgreed'
            >
              <p className='text-sm text-gray-600 font-light'>
                Please agree to the
                <Link
                  href='#'
                  underline='hover'
                  className='text-primary mx-1'
                >
                  Terms of Use
                </Link>
                and
                <Link
                  href='#'
                  underline='hover'
                  className='text-primary mx-1'
                >
                  Personal Information Handling
                </Link>
                before apply.
              </p>
            </FormCheckBox>
          </div>
          <Button
            title='Apply Event'
            type='submit'
            className='w-80 mt-5 mx-auto'
            disabled={!form.formState.isValid}
            isLoading={isApplying}
          />
        </div>
      </form>
    </Form>
  );
}
