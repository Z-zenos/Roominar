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
  FormField,
  FormInput,
  FormItem,
  FormLabel,
} from '@/src/component/form/Form';
import { Label } from '@/src/component/common/Label';
import Button from '@/src/component/common/Button/Button';
import { useGetEventDetailQuery } from '@/src/api/event.api';
import { formatEventDate, parseCode } from '@/src/util/app.util';
import { MdOutlineAccessTime, MdOutlineOnlinePrediction } from 'react-icons/md';
import Chip from '@/src/component/common/Chip';
import { FaUserFriends } from 'react-icons/fa';
import { Image, Link } from '@nextui-org/react';
import type {
  AnswerItem,
  QuestionAnswerItem,
  TicketItem,
} from '@/src/lib/api/generated';
import { IndustryCode, QuestionTypeCode } from '@/src/lib/api/generated';
import { JobTypeCodeMapping } from '@/src/constant/code.constant';
import { RadioGroup, RadioGroupItem } from '@/src/component/common/RadioGroup';
import Checkbox from '@/src/component/common/Input/Checkbox';

interface EventApplicationFormProps {
  slug: string;
}

export default function EventApplicationForm({
  slug,
}: EventApplicationFormProps) {
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: event } = useGetEventDetailQuery({ slug });

  const form = useForm<EventApplicationFormSchema>({
    mode: 'all',
    defaultValues: {
      email: '',
      ticketId: undefined,
      firstName: '',
      lastName: '',
      workplaceName: '',
      phoneNumber: '',
      industryCode: undefined,
      jobTypeCode: undefined,
      questionAnswerResults: [],
      isAccepted: false,
    },
    resolver: zodResolver(eventApplicationFormSchema),
  });

  function handleApplyEvent(data: EventApplicationFormSchema) {
    console.log(data);
  }

  console.log(form.getValues());

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleApplyEvent)}
        className={clsx(
          'grid grid-cols-7 w-full items-start gap-10 mx-auto px-[15%] py-20',
        )}
      >
        <div className='col-span-2'>
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
              <span className='flex items-center text-ss gap-1 my-2'>
                <MdOutlineAccessTime className='text-nm' />
                {formatEventDate(event.startAt) +
                  '〜' +
                  formatEventDate(event.endAt)}
              </span>
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

        <div className='col-span-5'>
          <div className='w-full shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] border border-gray-200 px-10 py-6 rounded-md bg-white'>
            <h2 className='text-lg font-semibold text-primary'>
              Enter your detail information ✍
            </h2>
            <div className='grid grid-cols-2 gap-8 items-center'>
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='email'
                    className={clsx(styles.label)}
                  >
                    Your email
                  </Label>
                </div>
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
                  )}
                />
              </div>
              &nbsp;
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='firstName'
                    className={clsx(styles.label)}
                  >
                    First name
                  </Label>
                </div>
                <FormInput
                  id='firstName'
                  name='firstName'
                  placeholder='Kevin'
                  className={clsx(
                    form.formState.errors.firstName &&
                      form.formState.touchedFields.firstName &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={true}
                />
              </div>
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='lastName'
                    className={clsx(styles.label)}
                  >
                    Last name
                  </Label>
                </div>
                <FormInput
                  id='lastName'
                  name='lastName'
                  placeholder='De Bruyne'
                  className={clsx(
                    form.formState.errors.lastName &&
                      form.formState.touchedFields.lastName &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={true}
                />
              </div>
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='workplaceName'
                    className={clsx(styles.label)}
                  >
                    Workplace name
                  </Label>
                </div>
                <FormInput
                  id='workplaceName'
                  name='workplaceName'
                  placeholder='Kevin'
                  className={clsx(
                    form.formState.errors.firstName &&
                      form.formState.touchedFields.firstName &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={true}
                />
              </div>
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='phoneNumber'
                    className={clsx(styles.label)}
                  >
                    Phone number
                  </Label>
                </div>
                <FormInput
                  id='phoneNumber'
                  name='phoneNumber'
                  placeholder='Kevin'
                  className={clsx(
                    form.formState.errors.firstName &&
                      form.formState.touchedFields.firstName &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={true}
                />
              </div>
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='email'
                    className={clsx(styles.label)}
                  >
                    Job Type
                  </Label>
                </div>
                <FormCombobox
                  data={Object.keys(JobTypeCodeMapping).map((key: string) => ({
                    value: key,
                    label: JobTypeCodeMapping[key],
                  }))}
                  name='jobTypeCode'
                  control={form.control}
                  title='type job'
                  multiple={false}
                  className='w-full'
                />
              </div>
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='email'
                    className={clsx(styles.label)}
                  >
                    Industry
                  </Label>
                </div>
                <FormCombobox
                  data={Object.keys(IndustryCode).map((ic: string) => ({
                    value: IndustryCode[ic],
                    label: parseCode(IndustryCode[ic]),
                  }))}
                  name='industryCode'
                  control={form.control}
                  title='industry'
                  multiple={false}
                  className='w-full'
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
                name='questionAnswerResults'
                render={({ field }) => (
                  <FormItem>
                    {event.questionnaire.questionAnwers.map(
                      (questionAnswer: QuestionAnswerItem) => (
                        <div
                          className='mt-4 bg-emerald-50 p-5'
                          key={`qa-${questionAnswer.id}`}
                        >
                          <h3 className='text-nm font-semibold text-slate-800'>
                            {questionAnswer.orderNumber}.{' '}
                            {questionAnswer.question}
                          </h3>

                          {questionAnswer.typeCode ===
                            QuestionTypeCode.Multiple &&
                            questionAnswer.answers.map((answer: AnswerItem) => (
                              <FormField
                                key={`qa-${questionAnswer.id}-${answer.id}`}
                                control={form.control}
                                name='questionAnswerResults'
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
              name='isAccepted'
            >
              <p className='text-sm text-gray-600 font-light'>
                Please agree to the
                <Link
                  href='#'
                  underline='hover'
                  className='text-primary mx-1'
                >
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link
                  href='#'
                  underline='hover'
                  className='text-primary mx-1'
                >
                  Personal Information Handling
                </Link>{' '}
                before apply.
              </p>
            </FormCheckBox>
          </div>
          <Button
            title='Apply Event'
            type='submit'
            className='w-80 mt-5 mx-auto'
            // disabled={!form.formState.isValid}
            isLoading={false}
          />
        </div>
      </form>
    </Form>
  );
}
