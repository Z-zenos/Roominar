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
  FormTagsInput,
} from '@/src/component/form/Form';
import {
  TicketDeliveryMethodCode,
  type ApiException,
  type ErrorResponse400,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import {
  usePublishEventMutation,
  useSaveDraftEventMutation,
} from '@/src/api/event.api';
import { FaSquareArrowUpRight } from 'react-icons/fa6';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useListingTagsQuery } from '@/src/api/tag.api';
import { CiStickyNote } from 'react-icons/ci';
import { eventDateSchema } from '@/src/schemas/event/CreateEventFormSchema';
import CalendarTimeline from '../common/DateTime/CalendarTimeline';
import dayjs from 'dayjs';
import Spinner from '../common/Loader/Spinner';
import type { DateSelectArg, EventChangeArg } from '@fullcalendar/core';
import { useListingOrganizationEventsTimelineQuery } from '@/src/api/organization.api';
import type { CreateEventAIFormSchema } from '@/src/schemas/event/CreateEventAIFormSchema';
import createEventAIFormSchema from '@/src/schemas/event/CreateEventAIFormSchema';
import { BaseTabs, TabsList, TabsTrigger } from '../common/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { GrLocation } from 'react-icons/gr';
import { PiVideoBold } from 'react-icons/pi';
import { RiRobot2Line } from 'react-icons/ri';

const LexicalEditor = dynamic(() => import('../editor/app/app'), {
  ssr: false,
});

export default function CreateEventAIForm() {
  const t = useTranslations('form');
  const { data: tagData } = useListingTagsQuery();
  const { data: eventsTimeline } = useListingOrganizationEventsTimelineQuery();

  const form = useForm<CreateEventAIFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: 'ignore description',
      tags: [],

      startAt: undefined,
      endAt: undefined,
      applicationStartAt: undefined,
      applicationEndAt: undefined,

      isOnline: undefined,
      isOffline: true,
      organizeAddress: '',
      organizeCityCode: undefined,

      totalTicketNumber: 0,
    },
    resolver: zodResolver(createEventAIFormSchema),
    shouldFocusError: false,
  });

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

  function handleSaveDraftEvent(data: CreateEventAIFormSchema) {
    // saveDraftEvent({
    //   eventId: draftEvent.id,
    //   saveDraftEventRequest: {
    //     name: data.name,
    //     description: data.description,
    //     tags: data.tags,
    //     totalTicketNumber: data.totalTicketNumber,
    //     startAt: data.startAt,
    //     endAt: data.endAt,
    //     applicationEndAt: data.applicationEndAt,
    //     applicationStartAt: data.applicationStartAt,
    //     isOnline: data.isOnline,
    //     isOffline: data.isOffline,
    //     organizeAddress: data.organizeAddress ?? null,
    //   },
    // });
  }

  return (
    <Form {...form}>
      <form
        id='create-event-form'
        onSubmit={form.handleSubmit(handleSaveDraftEvent, onError)}
        className='grid grid-cols-12 items-start gap-10'
      >
        <div className='grid grid-cols-2 gap-6 [&>div]:w-full bg-white rounded-md p-6 shadow-md 1200px:col-span-9 col-span-12 max-w-[1000px]'>
          <div className='col-span-2'>
            <h3 className='text-lg font-semibold'>Create an event with AI</h3>
            <p className='text-gray-600 font-light text-sm max-w-[500px] text-wrap'>
              Answer a few questions about your event and our AI creation tool
              will use internal data to build an event page. You can still
              create an event without AI.
            </p>
          </div>
          <div className='col-span-2'>
            <FormCustomLabel
              htmlFor='name'
              custom={
                <div>
                  <h3 className='font-medium text-md'>
                    What’s the name of your event?
                  </h3>
                  <span className='text-sm font-light inline-block text-gray-600 mb-3'>
                    This will be your event’s title. Your title will be used to
                    help create your event’s summary, description, category, and
                    tags – so be specific!
                  </span>
                </div>
              }
              required
            />
            <FormInput
              id='name'
              name='name'
              required
              placeholder='Event title...'
              control={form.control}
              showError={true}
              autoComplete='on'
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
                      <h3 className='text-md font-medium mb-3'>
                        When does your event start and end?
                      </h3>
                    }
                    required
                  />
                  <FormControl>
                    <CalendarTimeline
                      id='startAt'
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
                              color: '#FF4500',
                            }))
                          : []),
                        ...(eventsTimeline
                          ? eventsTimeline.map((event) => ({
                              title: event.name,
                              start: event.applicationStartAt,
                              end: event.applicationEndAt,
                              color: '#FFD700',
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

          {/* === EVENT FORMAT & ADDRESS === */}
          <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary'>
            Where is it located? ⛩️
          </h3>

          <div className='col-span-2'>
            <BaseTabs
              defaultValue={
                form.getValues('isOffline')
                  ? TicketDeliveryMethodCode.Offline
                  : TicketDeliveryMethodCode.Online
              }
              className={clsx('w-full mx-auto mt-2')}
            >
              <TabsList className={clsx('grid grid-cols-2')}>
                <TabsTrigger
                  value={TicketDeliveryMethodCode.Offline}
                  onClick={() => {
                    form.setValue('isOffline', true);
                    form.setValue('isOnline', false, { shouldValidate: true });
                  }}
                  className={clsx(
                    form.getValues('isOffline') === true &&
                      '!bg-primary font-bold !text-white',
                  )}
                >
                  <GrLocation className='w-5 h-5 mr-2' />
                  {t('label.isOffline')}
                </TabsTrigger>
                <TabsTrigger
                  value={TicketDeliveryMethodCode.Online}
                  onClick={() => {
                    form.setValue('isOnline', true);
                    form.setValue('isOffline', false, { shouldValidate: true });
                  }}
                  className={clsx(
                    form.getValues('isOnline') === true &&
                      '!bg-primary font-bold !text-white',
                  )}
                >
                  <PiVideoBold className='w-5 h-5 mr-2' />
                  {t('label.isOnline')}
                </TabsTrigger>
              </TabsList>
            </BaseTabs>
          </div>

          <div className='border-y border-y-primary py-[2px] mt-4 col-span-2'>
            <div className='border-y border-y-primary py-2'>
              <h3 className='text-center text-md'>Description 🗒</h3>
            </div>
          </div>

          <div className='col-span-2'>
            <main className='flex flex-col items-center justify-between'>
              {/* <LexicalEditor /> */}
            </main>
          </div>

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
            />
          </div>
          <FormInstructions>
            <li>
              The order quantity must always be greater than or equal to the
              total number of tickets you set.
            </li>
          </FormInstructions>

          {/* === MORE === */}
          <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary mt-6'>
            Advanced Information 🌟
          </h3>

          <div className='col-span-2'>
            <FormTagsInput
              title='tags'
              name='tags'
              label='tags'
              control={form.control}
              data={tagData}
            />
          </div>

          <button
            form='create-event-form'
            className='mx-auto overflow-hidden w-[132px] p-2 h-12 bg-black text-white border-none rounded-md text-md font-bold cursor-pointer relative z-10 group col-span-2 flex justify-center items-center gap-1'
            type='submit'
          >
            {isPublishing && <Spinner />}
            Generate
            <RiRobot2Line className='inline w-5 h-5' />
            <span className='absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left'></span>
            <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left'></span>
            <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left'></span>
            <span className='group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-4 z-10 flex justify-center gap-1'>
              {isPublishing && <Spinner />}
              Generate
              <RiRobot2Line className='inline w-5 h-5 mt-1' />
            </span>
          </button>
        </div>

        <div className='col-span-3'>
          {/* <EventCard
            event={{
              id: 1,
              slug: '',
              organizationName: 'Roominar',
              name: form.getValues('name'),
              startAt: new Date('2024-10-06'),
              endAt: new Date('2024-10-06'),
              applicationStartAt: new Date('2024-10-06'),
              applicationEndAt: new Date('2024-10-06'),
              totalTicketNumber: 1,
              coverImageUrl: '',
              meetingToolCode: EventMeetingToolCode.Discord,
              isOffline: true,
              publishedAt: new Date('2024-10-06'),
              tags: [],
            }}
            className='w-full'
          /> */}
        </div>
      </form>
    </Form>
  );
}
