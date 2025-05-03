'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormCustomLabel,
  FormField,
  FormInput,
  FormInstructions,
  FormItem,
  FormMessage,
  FormSelect,
  FormTagsInput,
  FormTextarea,
} from '@/src/component/form/Form';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import {
  CityCode,
  EventMeetingToolCode,
  SaveDraftEventRequestOrganizeCityCodeEnum,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import type { CreateEventFormSchema } from '@/src/schemas/event/CreateEventFormSchema';
import {
  useGenerateEventAIMutation,
  useGetDraftEventQuery,
  useListingTicketsOfEventQuery,
  usePublishEventMutation,
  useSaveDraftEventMutation,
} from '@/src/api/event.api';
import ImageUploader from '../common/Upload/ImageUploader';
import { styles } from '@/src/constants/styles.constant';
import { useTranslations } from 'next-intl';
import { Button, Checkbox } from '@nextui-org/react';
import { FaChevronRight, FaSquareArrowUpRight } from 'react-icons/fa6';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { BsStars } from 'react-icons/bs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from '../common/Sheet';
import { useListingTagsQuery } from '@/src/api/tag.api';
import { CiStickyNote } from 'react-icons/ci';
import { useListingSurveyOptionsQuery } from '@/src/api/survey.api';
import { useListingTargetOptionsQuery } from '@/src/api/target.api';
import { cn, optionify } from '@/src/utils/app.util';
import createEventFormSchema, {
  eventDateSchema,
} from '@/src/schemas/event/CreateEventFormSchema';
import clsx from 'clsx';
import MultipleFilesUploader from '../common/Upload/MultipleFilesUploader';
import dayjs from 'dayjs';
import Spinner from '../common/Loader/Spinner';
import type { DateSelectArg, EventChangeArg } from '@fullcalendar/core';
import { useListingOrganizationEventsTimelineQuery } from '@/src/api/organization.api';
import ElementLoader from '../common/Loader/ElementLoader';
import { RiRobot2Line } from 'react-icons/ri';
import { AiOutlineSend } from 'react-icons/ai';

// const LazyMap = dynamic(() => import('../common/Map/Map'), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

const LexicalEditor = dynamic(() => import('../editor/app/app'), {
  ssr: false,
  loading: () => <ElementLoader title='Setup editor' />,
});

const LazyCalendarTimeline = dynamic(
  () => import('../common/DateTime/CalendarTimeline'),
  {
    ssr: false,
    loading: () => <ElementLoader title='Loading schedule timeline' />,
  },
);

const CreateTicketForm = dynamic(() => import('./CreateTicketForm'), {
  ssr: false,
  loading: () => <ElementLoader title='Loading ticket form' />,
});

const CreateTargetForm = dynamic(() => import('./CreateTargetForm'), {
  ssr: false,
  loading: () => <ElementLoader title='Loading target form' />,
});

const DraftTicketDataTable = dynamic(
  () => import('@/src/view/ticket/DraftTicketDataTable'),
  {
    ssr: false,
    loading: () => <ElementLoader title='Loading ticket table' />,
  },
);

const UpdateTicketForm = dynamic(() => import('./UpdateTicketForm'), {
  ssr: false,
  loading: () => <ElementLoader title='Loading ticket form' />,
});

interface CreateEventFormProps {
  slug: string;
}

export default function CreateEventForm({ slug }: CreateEventFormProps) {
  const t = useTranslations('form');

  const { data: draftEvent } = useGetDraftEventQuery({ slug }, true);
  const { data: tagData } = useListingTagsQuery();
  const { data: surveyOptions } = useListingSurveyOptionsQuery();
  const { data: targetOptions, refetch: refetchTargetOptions } =
    useListingTargetOptionsQuery();
  const { data: eventsTimeline } = useListingOrganizationEventsTimelineQuery();
  const {
    data: tickets,
    isFetching: isFetchingListingTicketsOfEvent,
    refetch: refetchListingTicketsOfEvent,
  } = useListingTicketsOfEventQuery(
    { eventId: draftEvent?.id },
    draftEvent?.id ? true : false,
  );

  const {
    trigger: generateEventAI,
    isMutating: isGenerating,
    data: generatedContent,
  } = useGenerateEventAIMutation({
    onSuccess() {
      toast.success('Save draft event successfully!');
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const [rightSidebarContent, setRightSidebarContent] = useState<
    'CREATE_TICKET' | 'UPDATE_TICKET' | 'TARGET' | null
  >();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const form = useForm<CreateEventFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: 'ignore description',
      coverImageUrl: '',
      surveyId: undefined,
      targetId: undefined,
      tags: [],

      startAt: undefined,
      endAt: undefined,
      applicationStartAt: undefined,
      applicationEndAt: undefined,

      isOnline: undefined,
      isOffline: undefined,
      organizeAddress: '',
      organizeCityCode: undefined,
      meetingToolCode: undefined,
      meetingUrl: '',

      totalTicketNumber: 0,
      ticketIds: [],
      galleryUrls: [],
      prompt: '',
    },
    resolver: zodResolver(createEventFormSchema),
    shouldFocusError: false,
  });

  useEffect(() => {
    form.reset({
      name: draftEvent?.name ?? '',
      description: draftEvent?.description ?? '',
      coverImageUrl: draftEvent?.coverImageUrl ?? '',
      surveyId: draftEvent?.surveyId,
      targetId: draftEvent?.target?.id ?? null,
      tags: draftEvent?.tags?.map((tag) => tag.id) ?? [],
      startAt: draftEvent?.startAt,
      endAt: draftEvent?.endAt,
      applicationStartAt: draftEvent?.applicationStartAt,
      applicationEndAt: draftEvent?.applicationEndAt,

      isOnline: draftEvent?.isOnline,
      isOffline: draftEvent?.isOffline,
      organizeAddress: draftEvent?.organizeAddress ?? '',
      organizeCityCode: draftEvent?.organizeCityCode as CityCode,
      meetingToolCode: draftEvent?.meetingToolCode ?? EventMeetingToolCode.Zoom,
      meetingUrl: draftEvent?.meetingUrl ?? '',

      totalTicketNumber: draftEvent?.totalTicketNumber ?? 0,
      ticketIds:
        draftEvent?.tickets?.map((ticket) => ticket.id)?.slice(0, 10) ?? [],
      galleryUrls: draftEvent?.gallery ?? [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(draftEvent)]);

  // using a state here to make the "scroll & focus" happen once per submission
  const [canFocus, setCanFocus] = useState(true);

  const onError = () => {
    setCanFocus(true);
  };

  useEffect(() => {
    if (form.formState.errors && canFocus) {
      // Sort inputs based on their position on the page. (the order will be based on validaton order otherwise)
      const elements = Object.keys(form.formState.errors)
        .map((name) => document.getElementsByName(name)[0])
        .filter((el) => !!el)
        .filter((el) => el.tagName !== 'META');

      const inputOrderNames = [
        'name',
        'startAt',
        'coverImageUrl',
        'isOnline',
        'meetingUrl',
        'isOffline',
        'organizeAddress',
        'totalTicketNumber',
      ];

      elements.sort(
        (a, b) =>
          inputOrderNames.indexOf(a['name']) -
          inputOrderNames.indexOf(b['name']),
      );

      if (elements.length > 0) {
        const errorElement = elements[0];
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // scrollIntoView options are not supported in Safari
        errorElement.focus({ preventScroll: true });
        setCanFocus(false); // so the form doesn't suddenly jump to the next input that has error.
      }
    }
  }, [form.formState, canFocus]);

  const { trigger: publishEvent, isMutating: isPublishing } =
    usePublishEventMutation({
      onSuccess() {
        toast.success('Publish event successfully!');
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

  const { trigger: saveDraftEvent, isMutating: isDraftSaving } =
    useSaveDraftEventMutation({
      onSuccess() {
        toast.success('Save draft event successfully!');
      },
      onError(error: ApiException<unknown>) {
        toast.error(
          (error.body as ErrorResponse400)?.message ??
            (error.body as ErrorResponse400)?.errorCode ??
            'Unknown Error 😵',
        );
      },
    });

  function handleSelectDate(timeline: DateSelectArg) {
    const hasApplicationStartEnd =
      form.getValues('applicationStartAt') && form.getValues('applicationEndAt')
        ? true
        : false;
    const hasStartEnd =
      form.getValues('startAt') && form.getValues('endAt') ? true : false;
    if (!hasApplicationStartEnd && !hasStartEnd) {
      form.setValue(
        'applicationStartAt',
        dayjs(timeline.start).hour() == 0
          ? dayjs(timeline.start).hour(12).toDate()
          : timeline.start,
      );
      form.setValue('applicationEndAt', timeline.end);
      form.trigger('applicationStartAt');
    } else if (hasApplicationStartEnd && !hasStartEnd) {
      form.setValue(
        'startAt',
        dayjs(timeline.start).hour() == 0
          ? dayjs(timeline.start).hour(12).toDate()
          : timeline.start,
      );
      form.setValue('endAt', timeline.end);
      form.trigger('startAt');
    } else {
      return;
    }
  }

  function handleDragAndDropDate(info: EventChangeArg) {
    if (info.event.title === 'Application start') {
      form.setValue(
        'applicationStartAt',
        dayjs(info.event.start).hour() == 0
          ? dayjs(info.event.start).hour(12).toDate()
          : info.event.start,
      );
      form.setValue('applicationEndAt', info.event.end);
      form.trigger('applicationStartAt');
    } else if (info.event.title === 'Event start') {
      form.setValue(
        'startAt',
        dayjs(info.event.start).hour() == 0
          ? dayjs(info.event.start).hour(12).toDate()
          : info.event.start,
      );
      form.setValue('endAt', info.event.end);
      form.trigger('startAt');
    }
  }

  function handleValidateEventDates(
    applicationStartAt: Date,
    applicationEndAt: Date,
    startAt: Date,
    endAt: Date,
  ) {
    const result = eventDateSchema.safeParse({
      applicationStartAt,
      applicationEndAt,
      startAt,
      endAt,
    });

    if (!result.success) {
      const errorOrder = [
        'applicationStartAt',
        'applicationEndAt',
        'startAt',
        'endAt',
      ];
      const sortedErrors = result.error.errors.sort(
        (a, b) =>
          errorOrder.indexOf(`${a.path[0]}`) -
          errorOrder.indexOf(`${b.path[0]}`),
      );
      return sortedErrors[0]?.message || null;
    }

    return null; // No errors
  }

  // function handlePublishEvent(data: CreateEventFormSchema) {
  //   // trigger({
  //   //   eventId: 11,
  //   //   publishEventRequest: {
  //   //     name: data.name,
  //   //     description: data.description,
  //   //     coverImageUrl: data.coverImageUrl,
  //   //     surveyId: data.surveyId,
  //   //     targetId: data.targetId,
  //   //     status: data.status,
  //   //     ticketIds: data.ticketIds,
  //   //     tags: data.tags,
  //   //     totalTicketNumber: data.totalTicketNumber,
  //   //     startAt: data.startAt,
  //   //     endAt: data.endAt,
  //   //     applicationEndAt: data.applicationEndAt,
  //   //     applicationStartAt: data.applicationStartAt,
  //   //     isOnline: data.isOnline,
  //   //     isOffline: data.isOffline,
  //   //     organizeAddress: data.organizeAddress,
  //   //     organizeCityCode: PublishEventRequestOrganizeCityCodeEnum.Angiang,
  //   //     meetingToolCode: data.meetingToolCode,
  //   //     meetingUrl: data.meetingUrl,
  //   //   },
  //   // });
  // }

  function handleSaveDraftEvent(data: CreateEventFormSchema) {
    saveDraftEvent({
      eventId: draftEvent.id,
      saveDraftEventRequest: {
        name: data.name,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        surveyId: data.surveyId,
        targetId: data.targetId ?? null,
        ticketIds: data.ticketIds,
        tags: data.tags,
        totalTicketNumber: data.totalTicketNumber,
        startAt: data.startAt,
        endAt: data.endAt,
        applicationEndAt: data.applicationEndAt,
        applicationStartAt: data.applicationStartAt,
        isOnline: data.isOnline,
        isOffline: data.isOffline,
        organizeAddress: data.organizeAddress ?? null,
        organizeCityCode: SaveDraftEventRequestOrganizeCityCodeEnum.Hanoi,
        meetingToolCode: data.meetingToolCode,
        meetingUrl: data.meetingUrl,
        gallery: data.galleryUrls,
      },
    });
  }

  const rightSidebar = useMemo(() => {
    switch (rightSidebarContent) {
      case 'CREATE_TICKET':
        return {
          title: 'CREATE TICKET',
          body: (
            <CreateTicketForm
              eventId={draftEvent?.id}
              onCreate={refetchListingTicketsOfEvent}
            />
          ),
          footer: null,
        };

      case 'UPDATE_TICKET':
        return {
          title: 'UPDATE TICKET',
          body: (
            <UpdateTicketForm
              ticketId={selectedTicketId}
              onUpdate={refetchListingTicketsOfEvent}
            />
          ),
          footer: null,
        };

      case 'TARGET':
        return {
          title: 'TARGET',
          body: <CreateTargetForm />,
          footer: null,
        };

      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightSidebarContent]);

  // if (isGetDraftEventLoading) return <DotLoader />;

  return (
    <Sheet>
      <Form {...form}>
        <form
          id='create-event-form'
          onSubmit={form.handleSubmit(() => {}, onError)}
          className='grid grid-cols-12 items-start gap-3'
        >
          <div className='grid grid-cols-2 gap-6 [&>div]:w-full bg-white rounded-md p-6 shadow-md 1200px:col-span-6 col-span-12 max-w-[1000px]'>
            <div className='col-span-2'>
              <FormInput
                id='name'
                name='name'
                label='name'
                required
                placeholder='Be clear and descriptive with a title that tells people what your event is about.'
                control={form.control}
                showError={true}
                autoComplete='on'
                classNames={{
                  label: 'text-nm font-medium',
                }}
              />
            </div>
            <div className='col-span-2'>
              <FormField
                control={form.control}
                name='startAt'
                render={() => (
                  <FormItem>
                    <FormCustomLabel
                      htmlFor='startAt'
                      custom={
                        <div>
                          <h3 className='text-nm font-medium'>
                            When does your event start and end?
                          </h3>
                          <span className='text-sm font-light inline-block text-gray-600 mb-3'>
                            Select proper date in calendar. You can drag and
                            drop event to any place you want.
                          </span>
                        </div>
                      }
                      required
                    />
                    <FormControl>
                      <LazyCalendarTimeline
                        id='startAt'
                        height={500}
                        events={[
                          {
                            title: 'Application start',
                            start: form.getValues('applicationStartAt'),
                            end: form.getValues('applicationEndAt'),
                            color: '#FFD700',
                          },
                          {
                            title: 'Event start',
                            start: form.getValues('startAt'),
                            end: form.getValues('endAt'),
                            color: '#FF4500',
                          },
                          ...(eventsTimeline
                            ? eventsTimeline.map((event) => ({
                                title: event.name,
                                start: event.startAt,
                                end: event.endAt,
                                color: '#d8fcff',
                              }))
                            : []),
                          ...(eventsTimeline
                            ? eventsTimeline.map((event) => ({
                                title: event.name,
                                start: event.applicationStartAt,
                                end: event.applicationEndAt,
                                color: '#d8fcff',
                                textColor: '#246cff',
                              }))
                            : []),
                        ]}
                        onSelectDate={handleSelectDate}
                        onChange={handleDragAndDropDate}
                        name='startAt'
                      />
                    </FormControl>
                    {form.formState.isSubmitted && (
                      <FormMessage
                        customMessage={handleValidateEventDates(
                          form.getValues('applicationStartAt'),
                          form.getValues('applicationEndAt'),
                          form.getValues('startAt'),
                          form.getValues('endAt'),
                        )}
                        type='custom'
                      />
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-2'>
              <FormField
                control={form.control}
                name='coverImageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormCustomLabel
                      htmlFor='coverImageUrl'
                      label='coverImageUrl'
                      required
                      className='text-nm font-medium'
                    />
                    <FormControl>
                      <ImageUploader
                        name='coverImageUrl'
                        onGetImageUrl={(url) => field.onChange(url)}
                        variant='cover'
                        // defaultImageUrl={auth?.user?.avatarUrl}
                      />
                    </FormControl>
                    <FormMessage label='coverImageUrl' />
                  </FormItem>
                )}
              />

              <FormInstructions>
                <li>
                  This is the main image for your event. We recommend a 700 x
                  350px (2:1 ratio) image.
                </li>
              </FormInstructions>
            </div>

            <div className='col-span-2'>
              <FormCustomLabel
                htmlFor='galleryUrls'
                label='gallery'
                custom={
                  <div>
                    <p className={clsx(styles.flexStart, 'mt-1')}>
                      <BsStars size={20} />
                      <span>
                        <span className='font-semibold mr-2'>Pro tip:</span>
                        Use photos that set the mood, and avoid distracting text
                        overlays.
                      </span>
                    </p>
                    <li className='bg-error text-sm ml-2 mb-1'>
                      You can upload up to{' '}
                      <span className='font-bold text-nm'>5</span> images to
                      showcase your event.
                    </li>
                  </div>
                }
              />

              <MultipleFilesUploader
                name='galleryUrls'
                onGetImageUrls={(urls) => form.setValue('galleryUrls', urls)}
              />
            </div>

            {/* === EVENT FORMAT & ADDRESS === */}
            <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary'>
              Event format & address ⛩️
            </h3>

            <FormField
              control={form.control}
              name='isOnline'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormControl>
                    <Checkbox
                      aria-label='isOnline'
                      classNames={{
                        base: cn(
                          'inline-flex w-full max-w-full bg-content1',
                          'hover:bg-content2 items-center justify-start',
                          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                          'data-[selected=true]:border-primary',
                        ),
                        label: 'w-full',
                      }}
                      onValueChange={(isSelected) => {
                        field.onChange(isSelected);
                        form.trigger(['meetingUrl', 'isOnline', 'isOffline']);
                      }}
                    >
                      <div className='w-full flex justify-between items-start gap-2'>
                        <span className={clsx(styles.flexStart, 'self-center')}>
                          {t('label.isOnline')}
                          <FaChevronRight className='mx-4' />
                        </span>
                        <FormSelect
                          name='meetingToolCode'
                          label='meetingToolCode'
                          control={form.control}
                          options={optionify(EventMeetingToolCode)}
                          i18nPath='code.event.meetingTool'
                          onValueChange={() =>
                            form.trigger(['isOnline', 'meetingUrl'])
                          }
                        />
                        <div
                          className='grow'
                          onClick={(e) =>
                            e.currentTarget.querySelector('input').focus()
                          }
                        >
                          <FormInput
                            id='meetingUrl'
                            name='meetingUrl'
                            label='meetingUrl'
                            placeholder='https://meet.google.com/ass-asfas-12'
                            control={form.control}
                            showError={true}
                          />
                        </div>
                      </div>
                    </Checkbox>
                  </FormControl>
                  <FormMessage label='isOnline' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isOffline'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormControl>
                    <Checkbox
                      aria-label='isOffline'
                      classNames={{
                        base: cn(
                          'inline-flex w-full max-w-full bg-content1',
                          'hover:bg-content2 items-center justify-start',
                          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                          'data-[selected=true]:border-primary',
                        ),
                        label: 'w-full',
                      }}
                      onValueChange={(isSelected) => {
                        field.onChange(isSelected);
                        form.trigger([
                          'organizeAddress',
                          'isOffline',
                          'isOnline',
                        ]);
                      }}
                    >
                      <div className='w-full flex justify-between items-start gap-2'>
                        <span className={clsx(styles.flexStart, 'self-center')}>
                          {t('label.isOffline')}
                          <FaChevronRight className='mx-4' />
                        </span>
                        <FormSelect
                          name='organizeCityCode'
                          label='organizeCityCode'
                          control={form.control}
                          options={optionify(CityCode)}
                          i18nPath='code.city'
                        />
                        <div
                          className='grow'
                          onClick={(e) =>
                            e.currentTarget.querySelector('input').focus()
                          }
                        >
                          <FormInput
                            id='organizeAddress'
                            name='organizeAddress'
                            label='organizeAddress'
                            placeholder='12 Hồ Chí Minh, Hoàn Kiếm, Hà Nội'
                            control={form.control}
                            showError={true}
                          />
                        </div>
                      </div>
                    </Checkbox>
                  </FormControl>
                  <FormMessage label='isOffline' />
                </FormItem>
              )}
            />

            {/* === EVENT APPLICATION NUMBER & TICKETS === */}
            <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary'>
              Tickets 🎟
            </h3>
            <div>
              <FormInput
                id='totalTicketNumber'
                name='totalTicketNumber'
                label='totalTicketNumber'
                required
                placeholder='100'
                control={form.control}
                showError={true}
                type='number'
                classNames={{
                  label: 'text-nm font-medium',
                }}
              />
            </div>
            <FormInstructions>
              <li>
                The order quantity must always be greater than or equal to the
                total number of tickets you set.
              </li>
            </FormInstructions>
            <div className='col-span-2'>
              {draftEvent && (
                <DraftTicketDataTable
                  tickets={tickets}
                  isFetchingListingTicketsOfEvent={
                    isFetchingListingTicketsOfEvent
                  }
                  onOpenCreateTicketForm={() =>
                    setRightSidebarContent('CREATE_TICKET')
                  }
                  onOpenUpdateTicketForm={(ticketId) => {
                    setRightSidebarContent('UPDATE_TICKET');
                    setSelectedTicketId(ticketId);
                  }}
                />
              )}
            </div>
            {/* === MORE === */}
            <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary mt-6'>
              Advanced Information 🌟
            </h3>

            <div className='col-span-1'>
              <FormSelect
                name='surveyId'
                control={form.control}
                placeholder='Select survey'
                label='survey'
                options={surveyOptions?.map((so) => ({
                  value: so.id + '',
                  label: `${so.name} (${so.questionNumber} questions)`,
                }))}
                className='w-full'
                classNames={{
                  label: 'text-nm font-medium',
                }}
              />
            </div>

            <div className='col-span-1'>
              <div onClick={() => refetchTargetOptions({})}>
                <FormSelect
                  name='targetId'
                  control={form.control}
                  label='target'
                  placeholder='Select target'
                  options={targetOptions?.map((to) => ({
                    value: to.id + '',
                    label: to.name,
                  }))}
                  className='w-full'
                  classNames={{
                    label: 'text-nm font-medium',
                  }}
                />
              </div>

              <SheetTrigger
                className='hover:text-primary mt-3 hover:bg-white border border-primary py-1 px-4 bg-primary text-white transition-all text-sm'
                onClick={() => setRightSidebarContent('TARGET')}
              >
                Add new target +
              </SheetTrigger>
            </div>

            <div className='col-span-2'>
              <FormTagsInput
                title='tags'
                name='tags'
                label='tags'
                control={form.control}
                data={tagData}
                classNames={{
                  label: 'text-nm font-medium',
                }}
              />
            </div>

            <div className='col-span-2 my-8 flex justify-center items-center gap-8'>
              <button
                type='button'
                className='relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-yellow-500 rounded-md group'
              >
                <span className='absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-yellow-700 rounded group-hover:-mr-4 group-hover:-mt-4'>
                  <span className='absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white'></span>
                </span>
                <span className='absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-yellow-700 rounded group-hover:-ml-4 group-hover:-mb-4'>
                  <span className='absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white'></span>
                </span>
                <span className='absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-yellow-600 rounded-md group-hover:translate-x-0'></span>
                <span
                  className='relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white'
                  onClick={() => handleSaveDraftEvent(form.getValues())}
                >
                  {isDraftSaving && <Spinner />}
                  Draft <CiStickyNote className='inline w-5 h-5 mb-1 ml1' />
                </span>
              </button>
              <button
                form='create-event-form'
                className='overflow-hidden w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xm font-bold cursor-pointer relative z-10 group'
                type='submit'
              >
                {isPublishing && <Spinner />}
                Publish
                <FaSquareArrowUpRight className='inline w-5 h-5 mb-1 ml1' />
                <span className='absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left'></span>
                <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left'></span>
                <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left'></span>
                <span className='group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-4 z-10'>
                  {isPublishing && <Spinner />}
                  Publish
                  <FaSquareArrowUpRight className='inline-block w-5 h-5 mb-1' />
                </span>
              </button>
            </div>
          </div>

          <div className='col-span-6 p-2'>
            <main className='flex flex-col items-center justify-between'>
              <LexicalEditor
                content={generatedContent?.description ?? ''}
                onChange={(editorState) => {
                  // Convert editor state to string representation for storage
                  const editorStateJSON = JSON.stringify(editorState);

                  // For example, set it in a hidden field or in your form state
                  form.setValue('description', editorStateJSON);
                }}
                onAutoGenerate={generateEventAI}
                isGenerating={isGenerating}
              />
            </main>

            <div className='p-3 bg-white mt-4 shadow-md rounded-md'>
              <div className={clsx(styles.flexStart, 'mb-2')}>
                <h3 className='text-nm font-medium'>AI assistants</h3>
                <RiRobot2Line size={20} />
              </div>
              <div className='relative'>
                <FormTextarea
                  id='prompt'
                  name='prompt'
                  placeholder='What do you want to ask AI?'
                  control={form.control}
                  showError={true}
                  classNames={{
                    label: 'text-nm font-medium',
                  }}
                  rows={5}
                />
                <Button
                  variant='solid'
                  className='absolute top-2 right-2'
                  // onClick={() => {
                  //   generateEventAI(form.getValues('prompt'));
                  // }}
                  size='sm'
                  radius='sm'
                  color='primary'
                >
                  <AiOutlineSend className='w-4 h-4' />
                </Button>
              </div>

              <div className='min-h-[500px] max-h-[1000px] overflow-y-auto flex flex-col items-center justify-center mt-4'>
                AI Response
              </div>
            </div>
          </div>
        </form>
      </Form>
      <SheetOverlay>
        <SheetContent
          side='right'
          className='min-w-[600px]'
        >
          <SheetHeader>
            <SheetTitle className='text-primary'>
              {rightSidebar?.title}
            </SheetTitle>
            <SheetDescription />
          </SheetHeader>
          {rightSidebar?.body}
          <SheetFooter>{rightSidebar?.footer}</SheetFooter>
        </SheetContent>
      </SheetOverlay>
    </Sheet>
  );
}
