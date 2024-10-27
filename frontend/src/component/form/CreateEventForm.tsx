'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormCustomLabel,
  FormDateTimePicker,
  FormInput,
  FormInstructions,
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
  EventStatusCode,
  TicketStatusCode,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import type { PublishEventFormSchema } from '@/src/schemas/event/CreateEventFormSchema';
import publishEventFormSchema from '@/src/schemas/event/CreateEventFormSchema';
import {
  useListingTicketsOfEventQuery,
  usePublishEventMutation,
} from '@/src/api/event.api';
import ImageUploader from '../common/Upload/ImageUploader';
import { styles } from '@/src/constant/styles.constant';
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
import { useCallback, useMemo, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
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
import { cn, optionify } from '@/src/util/app.util';

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
  eventId?: number;
}

export default function CreateEventForm() {
  const t = useTranslations('form');

  const { data: tagData } = useListingTagsQuery();
  const { data: surveyOptions } = useListingSurveyOptionsQuery();
  const { data: targetOptions, refetch: refetchTargetOptions } =
    useListingTargetOptionsQuery();
  const { data: tickets } = useListingTicketsOfEventQuery({
    eventId: 1,
  });

  const [rightSidebarContent, setRightSidebarContent] = useState<
    'TICKET' | 'TARGET' | null
  >();

  const form = useForm<PublishEventFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      coverImageUrl: '',
      survey_id: null,
      targetId: null,
      comment: '',
      status: EventStatusCode.Public,
      tags: [],

      startAt: undefined,
      endAt: undefined,
      applicationStartAt: undefined,
      applicationEndAt: undefined,

      isOnline: null,
      isOffline: null,
      organizeAddress: '',
      organizePlaceName: '',
      organizeCityCode: null,
      meetingToolCode: null,
      meetingUrl: '',

      applicationNumber: 0,
      ticketIds: [],
    },
    resolver: zodResolver(publishEventFormSchema),
  });

  const { trigger, isMutating: isPusblishing } = usePublishEventMutation({
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

  function handlePublishEvent(data: PublishEventFormSchema) {
    // trigger({
    //   eventId: 0,
    //   publishEventRequest: {
    //     ...data,
    //   },
    // });
    console.log(data);
  }

  console.log(form.getValues());

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

  return (
    <Sheet>
      <Form {...form}>
        <form
          id='create-event-form'
          onSubmit={form.handleSubmit(handlePublishEvent)}
          className='grid grid-cols-12 items-start gap-10'
        >
          <div className='grid grid-cols-2 gap-6 [&>div]:w-full bg-white rounded-md p-6 shadow-md col-span-9 max-w-[1000px]'>
            <div className='col-span-2'>
              <FormInput
                id='name'
                name='name'
                label='name'
                required
                placeholder='event name'
                control={form.control}
                showError={true}
              />
            </div>
            <div>
              <FormDateTimePicker
                name='startAt'
                label='startAt'
                required
                control={form.control}
              />
            </div>
            <div>
              <FormDateTimePicker
                name='endAt'
                label='endAt'
                required
                control={form.control}
              />
            </div>

            <div>
              <FormDateTimePicker
                name='applicationStartAt'
                label='applicationStartAt'
                required
                control={form.control}
              />
            </div>
            <div>
              <FormDateTimePicker
                name='applicationEndAt'
                label='applicationEndAt'
                required
                control={form.control}
              />
            </div>

            <div className='col-span-2'>
              <FormCustomLabel
                htmlFor='coverImageUrl'
                label='coverImageUrl'
              />

              <ImageUploader
                name='coverImageUrl'
                onGetImageUrl={(url) => form.setValue('coverImageUrl', url)}
                variant='cover'
                // defaultImageUrl={auth?.user?.avatarUrl}
              />
              <FormInstructions>
                <li>
                  This is the main image for your event. We recommend a 700 x
                  350px (2:1 ratio) image.
                </li>
              </FormInstructions>
            </div>

            {/* === EVENT FORMAT & ADDRESS === */}
            <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary'>
              Event format & address ⛩️
            </h3>

            <Checkbox
              aria-label='isOnline'
              name='isOnline'
              classNames={{
                base: cn(
                  'inline-flex w-full max-w-full col-span-2 bg-content1',
                  'hover:bg-content2 items-center justify-start',
                  'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                  'data-[selected=true]:border-primary',
                ),
                label: 'w-full',
              }}
              // isSelected={isSelected}
              // onValueChange={setIsSelected}
              onValueChange={(isSelected) =>
                form.setValue('isOnline', isSelected)
              }
            >
              <div className='w-full flex justify-between items-center gap-2'>
                <span className={styles.flexStart}>
                  {t('label.isOnline')}
                  <FaChevronRight className='mx-4' />
                </span>
                <div>
                  <FormSelect
                    name='meetingToolCode'
                    label='meetingToolCode'
                    control={form.control}
                    options={optionify(EventMeetingToolCode)}
                    i18nPath='code.event.meetingTool'
                  />
                </div>
                <div className='grow'>
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

            <Checkbox
              aria-label='isOffline'
              name='isOffline'
              classNames={{
                base: cn(
                  'inline-flex w-full max-w-full col-span-2 bg-content1',
                  'hover:bg-content2 items-center justify-start',
                  'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                  'data-[selected=true]:border-primary',
                ),
                label: 'w-full',
              }}
              onValueChange={(isSelected) =>
                form.setValue('isOffline', isSelected)
              }
            >
              <div className='w-full flex justify-between items-center gap-2'>
                <span className={styles.flexStart}>
                  {t('label.isOffline')}
                  <FaChevronRight className='mx-4' />
                </span>
                <div>
                  <FormSelect
                    name='organizeCityCode'
                    label='organizeCityCode'
                    control={form.control}
                    options={optionify(CityCode)}
                    i18nPath='code.city'
                  />
                </div>
                <div className='grow'>
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

            <div className='border-y border-y-primary py-[2px] mt-4 col-span-2'>
              <div className='border-y border-y-primary py-2'>
                <h3 className='text-center text-md '>Description 🗒</h3>
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
                id='applicationNumber'
                name='applicationNumber'
                label='applicationNumber'
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
                  items={tickets ?? []}
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
                required
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
                  required
                  placeholder='Select target'
                  options={targetOptions?.map((to) => ({
                    value: to.id + '',
                    label: `${to.name}`,
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
                required
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
              <button className='relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-yellow-500 rounded-md group'>
                <span className='absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-yellow-700 rounded group-hover:-mr-4 group-hover:-mt-4'>
                  <span className='absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white'></span>
                </span>
                <span className='absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-yellow-700 rounded group-hover:-ml-4 group-hover:-mb-4'>
                  <span className='absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white'></span>
                </span>
                <span className='absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-yellow-600 rounded-md group-hover:translate-x-0'></span>
                <span className='relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white'>
                  Draft <CiStickyNote className='inline w-5 h-5 mb-1 ml1' />
                </span>
              </button>
              <button
                form='create-event-form'
                className='overflow-hidden w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xm font-bold cursor-pointer relative z-10 group'
              >
                Publish
                <FaSquareArrowUpRight className='inline w-5 h-5 mb-1 ml1' />
                <span className='absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left'></span>
                <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left'></span>
                <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left'></span>
                <span className='group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10'>
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
              applicationNumber: 1,
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
