'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
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
  FormInstructions,
} from '@/src/component/form/Form';
import Button from '@/src/component/common/Button/Button';
import { useGetEventDetailQuery } from '@/src/api/event.api';
import { cn, formatEventDate, optionify } from '@/src/utils/app.util';
import {
  MdAirplaneTicket,
  MdOutlineOnlinePrediction,
  MdVideoCall,
} from 'react-icons/md';
import Chip from '@/src/component/common/Chip';
import { FaUserFriends } from 'react-icons/fa';
import {
  Image,
  Link,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Checkbox as UICheckbox,
  useDisclosure,
  Button as UIButton,
  ModalBody,
} from '@nextui-org/react';
import type {
  AnswerItem,
  ApiException,
  ErrorResponse400,
  QuestionAnswerItem,
  SurveyResponseResultItem,
  TicketItem,
} from '@/src/lib/api/generated';
import { JobTypeCode } from '@/src/lib/api/generated';
import { IndustryCode } from '@/src/lib/api/generated';
import { QuestionTypeCode } from '@/src/lib/api/generated';
import { RadioGroup, RadioGroupItem } from '@/src/component/common/RadioGroup';
import Checkbox from '@/src/component/common/Input/Checkbox';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { BiSolidSchool } from 'react-icons/bi';
import { FaPhone } from 'react-icons/fa6';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import HorizontalTimeline from '@/src/component/common/DateTime/HorizontalTimeline';
import { Alert, AlertDescription, AlertTitle } from '../common/Alert';
import DotLoader from '../common/Loader/DotLoader';
import NumberSpinnerInput from '../common/Input/NumberSpinnerInput';
import { useMemo, useState } from 'react';
import ApplicationCheckout from '../common/Payment/ApplicationCheckout';
import { useCreateFreeApplicationMutation } from '@/src/api/application.api';
import useFormatMoney from '@/src/hooks/useFormatMoney';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface EventApplicationFormProps {
  slug: string;
}

export default function EventApplicationForm({
  slug,
}: EventApplicationFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { data: event } = useGetEventDetailQuery({ slug });
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();
  const {
    isOpen: isPaymentOpen,
    onOpen: onOpenPayment,
    onOpenChange: onOpenPaymentChange,
  } = useDisclosure();
  const {
    isOpen: isTicketDetailOpen,
    onOpen: onOpenTicketDetail,
    onOpenChange: onOpenTicketDetailChange,
  } = useDisclosure();
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const formatMoney = useFormatMoney();

  const form = useForm<EventApplicationFormSchema>({
    mode: 'onChange',
    defaultValues: {
      email: auth?.user?.email || '',
      tickets: [],
      firstName: auth?.user?.firstName || '',
      lastName: auth?.user?.lastName || '',
      workplaceName: auth?.user?.workplaceName || '',
      phone: auth?.user?.phone || '',
      industryCode: (auth?.user?.industryCode as IndustryCode) || null,
      jobTypeCode: (auth?.user?.jobTypeCode as JobTypeCode) || null,
      surveyResponseResults: [],
      isAgreed: false,
    },
    resolver: zodResolver(eventApplicationFormSchema),
  });

  const totalAmount = useMemo(() => {
    return form.getValues('tickets').reduce((acc, ticket) => {
      return acc + ticket.price * ticket.quantity;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form.getValues('tickets'))]);

  const totalTickets = useMemo(() => {
    return form.getValues('tickets').reduce((acc, ticket) => {
      return acc + ticket.quantity;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form.getValues('tickets'))]);

  const { trigger, isMutating: isCreating } = useCreateFreeApplicationMutation({
    onSuccess() {
      toast.success('Buy ticket successfully');
      setTimeout(() => {
        router.push('/tickets-n-payments');
      }, 2000);
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const checkOnlySelectFreeTicket = () => {
    return form.getValues('tickets').every((ticket) => ticket.price === 0);
  };

  const handleCreateFreeApplication = async () => {
    await trigger({
      createApplicationRequest: {
        eventId: event.id,
        email: form.getValues('email'),
        firstName: form.getValues('firstName'),
        lastName: form.getValues('lastName'),
        workplaceName: form.getValues('workplaceName'),
        phone: form.getValues('phone'),
        industryCode: form.getValues('industryCode'),
        jobTypeCode: form.getValues('jobTypeCode'),
        surveyResponseResults: form.getValues(
          'surveyResponseResults',
        ) as SurveyResponseResultItem[],
        isAgreed: form.getValues('isAgreed'),
        tickets: form
          .getValues('tickets')
          .filter(Boolean)
          .map((ticket) => ({
            id: ticket.id,
            quantity: ticket.quantity,
          })),
      },
    });
  };

  return (
    <Form {...form}>
      {event?.applicationEndAt < new Date() && (
        <Alert className='450px:px-[15%] px-[5%] rounded-none fixed bg-white z-20'>
          <AlertTitle>Event Application Expired!</AlertTitle>
          <AlertDescription className='font-light opacity-60 text-sm'>
            The application period for this event has ended. Please check{' '}
            <Link
              href='/search?is_apply_ongoing=true'
              underline='hover'
            >
              {' '}
              other upcoming events{' '}
            </Link>{' '}
            or contact the organizer for more details.
          </AlertDescription>
        </Alert>
      )}

      {event ? (
        <form
          onSubmit={form.handleSubmit(() => {
            if (checkOnlySelectFreeTicket()) {
              handleCreateFreeApplication();
            } else {
              onOpenPayment();
            }
          })}
          className={clsx(
            'grid grid-cols-7 w-full items-start gap-10 mx-auto 450px:py-20 py-10',
            width < 1000 && 'px-[5%]',
            width > 1400 && 'px-[15%]',
            width < 1400 && width > 1000 && 'px-[10%]',
            event?.applicationEndAt < new Date() &&
              'pointer-events-none pt-24 [&_.text-input-id]:!bg-gray-100 [&_button]:!bg-gray-100 [&_input]:!bg-gray-100',
          )}
        >
          <div className={clsx(width > 1200 ? 'col-span-2' : 'col-span-7')}>
            {event && (
              <div className='rounded-md p-5 shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] bg-white'>
                <div
                  className={
                    'flex 1200px:justify-between justify-start gap-2 items-start mb-3'
                  }
                >
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

                <div className={clsx(styles.between, 'mt-3')}>
                  <Chip
                    content={
                      (event.soldTicketsNumber ?? 0) +
                      ' / ' +
                      event.totalTicketNumber
                    }
                    leftIcon={<FaUserFriends className='text-sm' />}
                    type='info'
                  />
                  {event.meetingToolCode && (
                    <Chip
                      content={event.meetingToolCode}
                      leftIcon={
                        <MdOutlineOnlinePrediction className='text-sm' />
                      }
                      type='success'
                    />
                  )}
                </div>
              </div>
            )}
            <div className='rounded-md pt-5 shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] my-6 bg-white'>
              <h3 className='text-md font-semibold px-5 text-orange-500'>
                Ticket 🎟
              </h3>
              <p className='font-light text-sm my-3 opacity-80 px-5'>
                Check detail to see which ticket type is right for you.
              </p>
              {event.maxTicketNumberPerAccount && (
                <div
                  className={clsx(
                    styles.flexStart,
                    'border mx-5 py-1 gap-2 px-3 rounded-sm border-yellow-500 bg-yellow-50 mb-2',
                  )}
                >
                  <span>⚠️</span>
                  <p className='text-sm font-light'>
                    You can only select max{' '}
                    <span className='text-red-500 font-bold text-nm'>
                      {event.maxTicketNumberPerAccount}
                    </span>{' '}
                    tickets
                  </p>
                </div>
              )}
              <div className='grid 1200px:grid-cols-1 450px:grid-cols-2 grid-cols-1'>
                {event &&
                  event.tickets.map((ticket: TicketItem, index: number) => (
                    <UICheckbox
                      aria-label='tickets'
                      name='tickets'
                      classNames={{
                        base: cn(
                          'flex max-w-full mx-0 my-1 w-full bg-content1',
                          'hover:bg-content2 items-center justify-start',
                          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                          'data-[selected=true]:border-primary',
                          ((form.getValues('tickets').filter(Boolean).length ===
                            event.maxTicketNumberPerAccount &&
                            !form
                              .getValues('tickets')
                              .filter(Boolean)
                              .find((t) => t.id === ticket.id)) ||
                            !ticket.purchaseble ||
                            (ticket.salesStartAt &&
                              ticket.salesStartAt > new Date()) ||
                            (ticket.salesEndAt &&
                              ticket.salesEndAt < new Date())) &&
                            'pointer-events-none text-gray-600 bg-gray-100',
                        ),
                        label: 'w-full m-0',
                      }}
                      onValueChange={(selected: boolean) => {
                        if (selected) {
                          form.setValue(
                            `tickets.${index}`,
                            {
                              id: ticket.id,
                              quantity: 1,
                              price: ticket.price,
                            },
                            { shouldValidate: true },
                          );
                        } else {
                          form.setValue(
                            'tickets',
                            form
                              .getValues('tickets')
                              .filter((t) => t.id !== ticket.id),
                            { shouldValidate: true },
                          );
                        }
                      }}
                      key={`t-${ticket.id}`}
                      isSelected={form
                        .getValues('tickets')
                        .some((t) => t.id === ticket.id)}
                    >
                      <div className='w-full flex justify-between items-center gap-2'>
                        <div className='font-normal w-full'>
                          <h4 className='text-sm font-medium leading-5'>
                            {ticket.name}
                          </h4>
                          <p className='font-light opacity-80 leading-5 text-ss mt-1'>
                            {ticket.description}
                          </p>
                          <div className={clsx(styles.between, 'w-full')}>
                            {ticket.price ? (
                              <div className='text-sm w-full'>
                                <span>Price: </span>
                                <span className='text-primary font-semibold ml-2'>
                                  {formatMoney(ticket.price)}
                                </span>
                              </div>
                            ) : (
                              <span>Free</span>
                            )}
                            <p className='text-sm'>
                              <span className='text-orange-500 font-semibold mr-1'>
                                {ticket.quantity}
                              </span>
                              tickets
                            </p>
                          </div>

                          <div className={clsx(styles.between, 'w-full')}>
                            <NumberSpinnerInput
                              onChange={(value) => {
                                if (
                                  totalTickets + 1 >
                                  event.maxTicketNumberPerAccount
                                ) {
                                  toast(
                                    () => (
                                      <span
                                        className={clsx(
                                          styles.between,
                                          'gap-2',
                                        )}
                                      >
                                        <span>
                                          You can only select max{' '}
                                          <b>
                                            {event.maxTicketNumberPerAccount}
                                          </b>{' '}
                                          ticket(s)
                                        </span>
                                      </span>
                                    ),
                                    {
                                      icon: '⚠️',
                                    },
                                  );
                                  return;
                                }
                                if (value > ticket.quantity) {
                                  toast(
                                    () => (
                                      <span
                                        className={clsx(
                                          styles.between,
                                          'gap-2',
                                        )}
                                      >
                                        <span>
                                          You can only select max{' '}
                                          <b>{ticket.quantity}</b> {ticket.name}{' '}
                                          tickets
                                        </span>
                                      </span>
                                    ),
                                    {
                                      icon: '⚠️',
                                    },
                                  );
                                  return;
                                }

                                form.setValue(
                                  `tickets.${index}`,
                                  {
                                    id: ticket.id,
                                    quantity: value,
                                    price: ticket.price,
                                  },
                                  { shouldValidate: true },
                                );
                              }}
                              value={
                                form.getValues(`tickets.${index}`)?.quantity
                              }
                              max={event.maxTicketNumberPerAccount}
                            />
                            <button
                              className='underline text-xs text-primary translate-y-2 cursor-pointer !pointer-events-auto'
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedTicket(ticket);
                                onOpenTicketDetail();
                              }}
                            >
                              Detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </UICheckbox>
                  ))}
              </div>
              <div className='grid grid-cols-3'>
                <div className='col-span-2 py-2 px-4 bg-success-sub text-success-main border border-success-main border-r-0'>
                  <p className='font-semibold'>Amount</p>
                  <p>{totalAmount}</p>
                </div>
                <div className='bg-primary py-2 px-4 text-white'>
                  <p className='font-semibold'>Tickets</p>
                  <p>{totalTickets}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={clsx(width > 1200 ? 'col-span-5' : 'col-span-7')}>
            <div className='w-full 450px:shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] 450px:border border-gray-200 450px:px-10 450px:py-6 rounded-md 450px:bg-white'>
              <h2 className='450px:text-lg text-xm font-semibold text-primary'>
                Enter your detail information ✍
              </h2>

              {event && (
                <HorizontalTimeline
                  applicationStartAt={event.applicationStartAt}
                  applicationEndAt={event.applicationEndAt}
                  startAt={event.startAt}
                  endAt={event.endAt}
                  className='my-3'
                />
              )}
              <div
                className={clsx(
                  'grid 450px:gap-8 gap-4 items-center',
                  width < 600 ? 'grid-cols-1' : 'grid-cols-2',
                )}
              >
                <div>
                  <FormInput
                    id='email'
                    name='email'
                    type='email'
                    label='email'
                    required
                    rightIcon={
                      <HiMail
                        size={20}
                        className='text-primary'
                      />
                    }
                    placeholder='registermail@gmail.com'
                    control={form.control}
                    showError={true}
                    className={clsx(
                      status === 'authenticated' &&
                        'bg-slate-100 text-gray-500',
                    )}
                    disabled={status === 'authenticated'}
                  />
                </div>
                {width < 600 ? <></> : <>&nbsp;</>}
                <div className='self-start'>
                  <FormInput
                    id='firstName'
                    name='firstName'
                    label='firstName'
                    required
                    placeholder='Kevin'
                    className={clsx(
                      status === 'authenticated' &&
                        'bg-slate-100 text-gray-500',
                    )}
                    disabled={status === 'authenticated'}
                    control={form.control}
                    showError={true}
                  />
                </div>
                <div className='self-start'>
                  <FormInput
                    id='lastName'
                    name='lastName'
                    label='lastName'
                    required
                    placeholder='De Bruyne'
                    className={clsx(
                      status === 'authenticated' &&
                        'bg-slate-100 text-gray-500',
                    )}
                    disabled={status === 'authenticated'}
                    control={form.control}
                    showError={true}
                  />
                </div>
                <div className='self-start'>
                  <FormInput
                    id='workplaceName'
                    name='workplaceName'
                    label='workplaceName'
                    placeholder='Place you work or learn'
                    className={clsx(
                      status === 'authenticated' &&
                        'bg-slate-100 text-gray-500',
                    )}
                    disabled={
                      auth?.user?.workplaceName && status === 'authenticated'
                    }
                    control={form.control}
                    showError={true}
                    rightIcon={
                      <BiSolidSchool
                        className='text-primary'
                        size={20}
                      />
                    }
                  />
                </div>
                <div className='self-start'>
                  <FormInput
                    id='phone'
                    name='phone'
                    label='phone'
                    required
                    placeholder='your phone number'
                    className={clsx(
                      status === 'authenticated' &&
                        'bg-slate-100 text-gray-500',
                    )}
                    disabled={status === 'authenticated' && !!auth.user.phone}
                    control={form.control}
                    showError={true}
                    rightIcon={
                      <FaPhone
                        className='text-primary'
                        size={20}
                      />
                    }
                  />
                </div>
                <div className='self-start'>
                  <FormCombobox
                    label='jobTypeCode'
                    options={optionify(JobTypeCode)}
                    i18nPath='code.jobType'
                    name='jobTypeCode'
                    control={form.control}
                    title='type job'
                    multiple={false}
                    className={clsx(
                      'w-full',
                      auth?.user?.jobTypeCode &&
                        status === 'authenticated' &&
                        'bg-slate-100 text-gray-500 pointer-events-none',
                    )}
                  />
                </div>
                <div className='self-start'>
                  <FormCombobox
                    label='industryCode'
                    options={optionify(IndustryCode)}
                    i18nPath='code.industry'
                    name='industryCode'
                    control={form.control}
                    title='industry'
                    multiple={false}
                    className={clsx(
                      'w-full',
                      auth?.user?.industryCode &&
                        status === 'authenticated' &&
                        'bg-slate-100 text-gray-500 pointer-events-none',
                    )}
                  />
                </div>
              </div>
            </div>
            {event && event.survey && (
              <div className='w-full shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] border border-gray-200 px-10 py-6 rounded-md mt-6 bg-white'>
                <h2 className='text-md font-semibold text-secondary'>
                  Answer some questions
                </h2>
                <p className='font-light opacity-80 text-sm'>
                  Your answers will be an extremely useful and valuable source
                  of information to help us survey, analyze and improve the
                  quality of future events.
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
                              questionAnswer.answers.map(
                                (answer: AnswerItem) => (
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
                                                    qa.answerIds.push(
                                                      answer.id,
                                                    );
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
                                                      (item) =>
                                                        item !== answer.id,
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
                                ),
                              )}

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
              title={
                checkOnlySelectFreeTicket() ||
                form.getValues('tickets').filter(Boolean).length === 0
                  ? 'Apply'
                  : 'Go To Payment'
              }
              type='submit'
              className='w-80 mt-5 mx-auto'
              disabled={
                !form.getValues('isAgreed') ||
                event?.applicationEndAt < new Date() ||
                form.getValues('tickets').length === 0 ||
                form.getValues('tickets').filter(Boolean).length >
                  event.maxTicketNumberPerAccount
              }
              isLoading={isCreating}
            />
          </div>

          <Modal
            isOpen={isPaymentOpen}
            onOpenChange={onOpenPaymentChange}
            placement='top-center'
            size='2xl'
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1'>
                    Payment
                  </ModalHeader>
                  <ModalBody>
                    <ApplicationCheckout
                      eventId={event.id}
                      tickets={form.getValues('tickets').map((ticket) => ({
                        id: ticket.id,
                        quantity: ticket.quantity,
                      }))}
                      email={form.getValues('email')}
                      firstName={form.getValues('firstName')}
                      lastName={form.getValues('lastName')}
                      phone={form.getValues('phone')}
                      workplaceName={form.getValues('workplaceName')}
                      industryCode={form.getValues('industryCode')}
                      jobTypeCode={form.getValues('jobTypeCode')}
                      surveyResponseResults={
                        form.getValues(
                          'surveyResponseResults',
                        ) as SurveyResponseResultItem[]
                      }
                      isAgreed={form.getValues('isAgreed')}
                      onClose={onClose}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <UIButton
                      color='danger'
                      variant='flat'
                      onPress={onClose}
                    >
                      Close
                    </UIButton>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isTicketDetailOpen}
            onOpenChange={onOpenTicketDetailChange}
            placement='top-center'
            size='2xl'
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1'>
                    Ticket Detail
                  </ModalHeader>
                  <ModalBody>
                    <div className={clsx('flex gap-2 flex-col')}>
                      <div className='px-3'>
                        <div className={clsx(styles.between)}>
                          <h3
                            className={clsx(
                              'font-medium text-nm line-clamp-2 h-12 text-primary',
                            )}
                          >
                            {selectedTicket.name}
                          </h3>
                          <div className='rounded-md p-4 text-info-main bg-info-sub'>
                            {selectedTicket.price
                              ? formatMoney(selectedTicket.price)
                              : 'FRee'}
                          </div>
                        </div>
                        <p className='text-sm text-gray-700'>
                          <span className='underline font-semibold'>
                            Available quantity
                          </span>
                          : {selectedTicket.soldQuantity} /{' '}
                          {selectedTicket.quantity}
                        </p>
                        <p className='text-sm text-gray-700'>
                          {selectedTicket.description}
                        </p>
                        <div className={clsx(styles.between, 'w-full')}>
                          <div
                            className={clsx('my-3', styles.flexStart, 'gap-2')}
                          >
                            <Chip
                              content={t(
                                `code.ticket.type.${selectedTicket.type}`,
                              )}
                              leftIcon={
                                <MdAirplaneTicket className='text-sm' />
                              }
                              type='info'
                              className='text-xs w-fit'
                            />
                            <Chip
                              content={selectedTicket.deliveryMethod}
                              leftIcon={<MdVideoCall className='text-sm' />}
                              type='success'
                              className='text-xs w-fit'
                            />
                          </div>
                          {selectedTicket.salesStartAt && (
                            <div className='flex flex-col gap-1 font-light text-sm'>
                              <p>
                                Open sale at:{' '}
                                <span className='font-semibold'>
                                  {formatEventDate(selectedTicket.salesStartAt)}
                                </span>
                              </p>
                              <p>
                                Close sale at:{' '}
                                <span className='font-semibold'>
                                  {formatEventDate(selectedTicket.salesEndAt)}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>

                        <p className='font-medium text-nm'>
                          Cancellation Policy:
                        </p>
                        <FormInstructions>
                          <li>
                            {t(
                              `code.ticket.cancellationPolicy.${selectedTicket.cancellationPolicyCode}`,
                            )}{' '}
                            {selectedTicket.cancellationPolicyExtraDescription && (
                              <span className='font-light'>
                                (
                                {
                                  selectedTicket.cancellationPolicyExtraDescription
                                }
                                )
                              </span>
                            )}
                          </li>
                        </FormInstructions>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <UIButton
                      color='warning'
                      variant='flat'
                      onPress={onClose}
                    >
                      Close
                    </UIButton>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </form>
      ) : (
        <DotLoader />
      )}
    </Form>
  );
}
