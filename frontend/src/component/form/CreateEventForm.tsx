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
import type {
  ApiException,
  ErrorResponse400,
  TicketItem,
} from '@/src/lib/api/generated';
import {
  CityCode,
  EventMeetingToolCode,
  SaveDraftEventRequestOrganizeCityCodeEnum,
  TicketStatusCode,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import type { CreateEventFormSchema } from '@/src/schemas/event/CreateEventFormSchema';
import {
  useGetDraftEventQuery,
  usePublishEventMutation,
  useSaveDraftEventMutation,
} from '@/src/api/event.api';
import ImageUploader from '../common/Upload/ImageUploader';
import { styles } from '@/src/constants/styles.constant';
import { useTranslations } from 'next-intl';
import type { ChipProps } from '@nextui-org/react';
import {
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { FaChevronRight, FaSquareArrowUpRight } from 'react-icons/fa6';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsStars, BsThreeDots } from 'react-icons/bs';
import { IoMdAddCircleOutline } from 'react-icons/io';
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
import CreateTicketForm from './CreateTicketForm';
import CreateTargetForm from './CreateTargetForm';
import { useListingTargetOptionsQuery } from '@/src/api/target.api';
import { cn, optionify } from '@/src/utils/app.util';
import DotLoader from '../common/Loader/DotLoader';
import createEventFormSchema, {
  eventDateSchema,
} from '@/src/schemas/event/CreateEventFormSchema';
import clsx from 'clsx';
import MultipleFilesUploader from '../common/Upload/MultipleFilesUploader';
import CalendarTimeline from '../common/DateTime/CalendarTimeline';
import dayjs from 'dayjs';
import Spinner from '../common/Loader/Spinner';
import type { DateSelectArg, EventChangeArg } from '@fullcalendar/core';
import { useListingOrganizationEventsTimelineQuery } from '@/src/api/organization.api';

// const LexicalEditor = dynamic(() => import('../editor/app/app'), {
//   ssr: false,
// });

const statusColorMap: Record<string, ChipProps['color']> = {
  [TicketStatusCode.Available]: 'success',
  [TicketStatusCode.SoldOut]: 'danger',
  [TicketStatusCode.Canceled]: 'warning',
};

const TICKET_TABLE_COLUMNS = [
  { name: 'NAME', uid: 'name' },
  { name: 'PRICE', uid: 'price' },
  { name: 'QUANTITY', uid: 'quantity' },
  { name: 'STATUS', uid: 'status' },
  { name: 'TYPE', uid: 'type' },
  { name: 'ACTIONS', uid: 'actions' },
];

interface CreateEventFormProps {
  slug: string;
}

export default function CreateEventForm({ slug }: CreateEventFormProps) {
  const t = useTranslations('form');

  const { data: draftEvent, isLoading: isGetDraftEventLoading } =
    useGetDraftEventQuery({ slug });
  const { data: tagData } = useListingTagsQuery();
  const { data: surveyOptions } = useListingSurveyOptionsQuery();
  const { data: targetOptions, refetch: refetchTargetOptions } =
    useListingTargetOptionsQuery();
  const { data: eventsTimeline } = useListingOrganizationEventsTimelineQuery();

  const [rightSidebarContent, setRightSidebarContent] = useState<
    'TICKET' | 'TARGET' | null
  >();

  const form = useForm<CreateEventFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: 'ignore description',
      coverImageUrl: '',
      surveyId: undefined,
      targetId: undefined,
      comment: '',
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
      comment: draftEvent?.comment ?? '',
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

  function handlePublishEvent(data: CreateEventFormSchema) {
    // trigger({
    //   eventId: 11,
    //   publishEventRequest: {
    //     name: data.name,
    //     description: data.description,
    //     coverImageUrl: data.coverImageUrl,
    //     surveyId: data.surveyId,
    //     targetId: data.targetId,
    //     comment: data.comment,
    //     status: data.status,
    //     ticketIds: data.ticketIds,
    //     tags: data.tags,
    //     totalTicketNumber: data.totalTicketNumber,
    //     startAt: data.startAt,
    //     endAt: data.endAt,
    //     applicationEndAt: data.applicationEndAt,
    //     applicationStartAt: data.applicationStartAt,
    //     isOnline: data.isOnline,
    //     isOffline: data.isOffline,
    //     organizeAddress: data.organizeAddress,
    //     organizeCityCode: PublishEventRequestOrganizeCityCodeEnum.Angiang,
    //     meetingToolCode: data.meetingToolCode,
    //     meetingUrl: data.meetingUrl,
    //   },
    // });
  }

  function handleSaveDraftEvent(data: CreateEventFormSchema) {
    saveDraftEvent({
      eventId: draftEvent.id,
      saveDraftEventRequest: {
        name: data.name,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        surveyId: data.surveyId,
        targetId: data.targetId ?? null,
        comment: data.comment,
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

  const renderCell = useCallback((ticket: TicketItem, columnKey: string) => {
    const cellValue = columnKey !== 'actions' ? ticket[columnKey] : null;

    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className='text-nm font-semibold'>{ticket.name}</p>
            <p className='text-xs text-gray-600 font-ligth max-w-[300px] truncate'>
              {ticket.description}
            </p>
          </div>
        );
      case 'price':
        return <p>{cellValue ? cellValue : 'Free'}</p>;

      case 'quantity':
        return <p>{cellValue}</p>;
      case 'status':
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[ticket.status]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        );

      case 'type':
        return <p>{cellValue}</p>;

      case 'actions':
        return (
          <div className='relative flex justify-end items-center gap-2'>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size='sm'
                  variant='light'
                >
                  <BsThreeDots className='text-default-300' />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const rightSidebar = useMemo(() => {
    switch (rightSidebarContent) {
      case 'TICKET':
        return {
          title: 'TICKET',
          body: <CreateTicketForm />,
          footer: null,
        };

      case 'TARGET':
        return {
          title: 'TARGET',
          body: <CreateTargetForm />,
          footer: null,
        };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightSidebarContent]);

  if (isGetDraftEventLoading) return <DotLoader />;

  console.log(form.formState.errors);

  return (
    <Sheet>
      <Form {...form}>
        <form
          id='create-event-form'
          onSubmit={form.handleSubmit(handlePublishEvent, onError)}
          className='grid grid-cols-12 items-start gap-10'
        >
          <div className='grid grid-cols-2 gap-6 [&>div]:w-full bg-white rounded-md p-6 shadow-md col-span-9 max-w-[1000px]'>
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
                      label='timeline'
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
                  <>
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
                  </>
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
            <div className='col-span-2'>
              <Table
                aria-label='Example table with custom cells, pagination and sorting'
                isHeaderSticky
                classNames={{
                  wrapper: 'max-h-[382px]',
                }}
                bottomContent={
                  <div className='flex justify-end'>
                    {/* === RIGHT SIDE BAR === */}
                    <SheetTrigger
                      onClick={() => setRightSidebarContent('TICKET')}
                      className='flex justify-center items-center gap-3 px-6 py-3 rounded-sm border-primary-300 hover:bg-primary hover:text-white hover:border-primary border transition-all '
                    >
                      Add ticket
                      <IoMdAddCircleOutline className='text-inline w-5 h-5' />
                    </SheetTrigger>
                  </div>
                }
              >
                <TableHeader columns={TICKET_TABLE_COLUMNS}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.name === 'actions' ? 'center' : 'start'}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  emptyContent={'Not setup ticket yet'}
                  items={draftEvent?.tickets ?? []}
                >
                  {(item) => (
                    <TableRow key={item.price}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCell(item, columnKey as string)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                />
              </div>

              <SheetTrigger
                className='hover:text-primary mt-3 hover:bg-white border border-primary py-2 px-4 bg-primary text-white transition-all'
                onClick={() => setRightSidebarContent('TARGET')}
              >
                Add new target +
              </SheetTrigger>
            </div>

            <div className='col-span-2 mt-4'>
              <FormTextarea
                id='comment'
                name='comment'
                label='eventComment'
                placeholder='Enter comment of organization for audience when they apply'
                control={form.control}
                showError={true}
              />
            </div>

            <div className='col-span-2'>
              <FormTagsInput
                title='tags'
                name='tags'
                label='tags'
                control={form.control}
                data={tagData}
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
                <span className='group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10'>
                  {isPublishing && <Spinner />}
                  Publish
                  <FaSquareArrowUpRight className='inline-block w-5 h-5 mb-1' />
                </span>
              </button>
            </div>
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
