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
  EventStatusCode,
  TicketDeliveryMethodCode,
  TicketStatusCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import type { PublishEventFormSchema } from '@/src/schemas/event/CreateEventFormSchema';
import publishEventFormSchema from '@/src/schemas/event/CreateEventFormSchema';
import { usePublishEventMutation } from '@/src/api/event.api';
import clsx from 'clsx';
import ImageUploader from '../common/Upload/ImageUploader';
import { styles } from '@/src/constant/styles.constant';
import { useTranslations } from 'next-intl';
import { cn, toSelectItem } from '@/src/util/app.util';
import {
  CityCodeMappings,
  EventMeetingToolCodeMappings,
} from '@/src/constant/code.constant';
import type { ChipProps } from '@nextui-org/react';
import {
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { FaChevronRight, FaSquareArrowUpRight } from 'react-icons/fa6';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
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
import { TicketTypeRadio } from '../common/RadioGroup';
import { useListingTagsQuery } from '@/src/api/tag.api';
import { CiStickyNote } from 'react-icons/ci';

const LexicalEditor = dynamic(() => import('../editor/app/app'), {
  ssr: false,
});

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

export default function CreateEventForm() {
  const t = useTranslations('form');

  const { data: tagData } = useListingTagsQuery();

  const form = useForm<PublishEventFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      coverImageUrl: '',
      questionnaireId: null,
      targetId: null,
      comment: '',
      status: EventStatusCode.Draft,
      tags: [],

      startAt: '',
      endAt: '',
      applicationStartAt: '',
      applicationEndAt: '',

      isOnline: null,
      isOffline: null,
      organizeAddress: '',
      organizePlaceName: '',
      organizeCityCode: null,
      meetingToolCode: null,
      meetingUrl: '',

      applicationNumber: 0,
      tickets: [
        {
          name: 'Free Admission',
          deliveryMethod: TicketDeliveryMethodCode.Both,
          description: 'This is a test ticket',
          quantity: 100,
          price: 0,
          type: TicketTypeCode.Free,
          status: TicketStatusCode.Available,
        },
      ],
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handlePublishEvent)}
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
              placeholder='registermail@gmail.com'
              control={form.control}
              isDisplayError={true}
              className={clsx(
                form.formState.errors.name &&
                  form.formState.touchedFields.name &&
                  'border-error-main',
              )}
            />
          </div>
          <div className='col-span-1'>
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

          <div className='col-span-1'>
            <FormCustomLabel htmlFor='applicationStartAt' />
            <FormDateTimePicker
              name='applicationStartAt'
              control={form.control}
            />
          </div>
          <div>
            <FormCustomLabel htmlFor='applicationEndAt' />
            <FormDateTimePicker
              name='applicationEndAt'
              control={form.control}
            />
          </div>

          <div className='col-span-2'>
            <FormCustomLabel htmlFor='coverImageUrl' />

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
                <FormCustomLabel htmlFor='meetingToolCode' />
                <FormSelect
                  name='meetingToolCode'
                  control={form.control}
                  data={toSelectItem(EventMeetingToolCodeMappings)}
                />
              </div>
              <div className='grow'>
                <FormCustomLabel htmlFor='meetingUrl' />
                <FormInput
                  id='meetingUrl'
                  name='meetingUrl'
                  placeholder='https://meet.google.com/ass-asfas-12'
                  control={form.control}
                  isDisplayError={true}
                  className={clsx(
                    form.formState.errors.meetingUrl &&
                      form.formState.touchedFields.meetingUrl &&
                      'border-error-main',
                  )}
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
                <FormCustomLabel htmlFor='organizeCityCode' />
                <FormSelect
                  name='organizeCityCode'
                  control={form.control}
                  data={toSelectItem(CityCodeMappings)}
                />
              </div>
              <div className='grow'>
                <FormCustomLabel htmlFor='organizeAddress' />
                <FormInput
                  id='organizeAddress'
                  name='organizeAddress'
                  placeholder='12 Hồ Chí Minh, Hoàn Kiếm, Hà Nội'
                  control={form.control}
                  isDisplayError={true}
                  className={clsx(
                    form.formState.errors.organizeAddress &&
                      form.formState.touchedFields.organizeAddress &&
                      'border-error-main',
                  )}
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
            <FormCustomLabel
              htmlFor='applicationNumber'
              required
            />
            <FormInput
              id='applicationNumber'
              name='applicationNumber'
              placeholder='100'
              control={form.control}
              isDisplayError={true}
              className={clsx(
                form.formState.errors.applicationNumber &&
                  form.formState.touchedFields.applicationNumber &&
                  'border-error-main',
              )}
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
                  <Sheet>
                    <SheetTrigger className='flex justify-center items-center gap-3 px-6 py-3 rounded-sm border-primary-300 hover:bg-primary hover:text-white hover:border-primary border transition-all '>
                      Add ticket{' '}
                      <IoMdAddCircleOutline className='text-inline w-5 h-5' />
                    </SheetTrigger>
                    <SheetOverlay>
                      <SheetContent
                        side='right'
                        className='min-w-[600px]'
                      >
                        <SheetHeader>
                          <SheetTitle className='text-primary border-b border-b-primary pb-6'>
                            Ticket
                          </SheetTitle>
                          <SheetDescription>
                            <div className='my-6 grid grid-cols-2 gap-4'>
                              <RadioGroup className='col-span-2'>
                                <div
                                  className={clsx(styles.flexStart, 'gap-3')}
                                >
                                  <TicketTypeRadio
                                    // description='Up to 20 items'
                                    value='free'
                                  >
                                    Free
                                  </TicketTypeRadio>
                                  <TicketTypeRadio
                                    // description='Unlimited items. $10 per month.'
                                    value='paid'
                                  >
                                    Paid
                                  </TicketTypeRadio>
                                </div>
                              </RadioGroup>

                              <div className='col-span-2 mt-4'>
                                <FormCustomLabel
                                  htmlFor='ticketName'
                                  required
                                />
                                <FormInput
                                  id='ticketName'
                                  name='ticket.name'
                                  placeholder='100'
                                  control={form.control}
                                  isDisplayError={true}
                                  className={clsx(
                                    form.formState.errors.tickets &&
                                      form.formState.touchedFields.tickets &&
                                      'border-error-main',
                                  )}
                                />
                              </div>

                              <div>
                                <FormCustomLabel
                                  htmlFor='ticketQuantity'
                                  required
                                />
                                <FormInput
                                  id='ticketQuantity'
                                  name='ticket.quantity'
                                  placeholder='100'
                                  control={form.control}
                                  isDisplayError={true}
                                  type='number'
                                  className={clsx(
                                    form.formState.errors.tickets &&
                                      form.formState.touchedFields.tickets &&
                                      'border-error-main',
                                  )}
                                />
                              </div>

                              <div>
                                <FormCustomLabel
                                  htmlFor='ticketPrice'
                                  required
                                />
                                <FormInput
                                  id='ticketPrice'
                                  name='ticket.price'
                                  placeholder='100'
                                  control={form.control}
                                  isDisplayError={true}
                                  type='number'
                                  className={clsx(
                                    form.formState.errors.tickets &&
                                      form.formState.touchedFields.tickets &&
                                      'border-error-main',
                                  )}
                                />
                              </div>

                              <div className='col-span-2 mt-4'>
                                <FormCustomLabel
                                  htmlFor='ticketDescription'
                                  required
                                />
                                <FormTextarea
                                  id='ticketDescription'
                                  name='ticket.description'
                                  placeholder='100'
                                  control={form.control}
                                  isDisplayError={true}
                                  className={clsx(
                                    form.formState.errors.tickets &&
                                      form.formState.touchedFields.tickets &&
                                      'border-error-main',
                                  )}
                                />
                              </div>
                            </div>
                          </SheetDescription>
                        </SheetHeader>
                        <SheetFooter>
                          <Button
                            color='primary'
                            radius='sm'
                          >
                            Create
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </SheetOverlay>
                  </Sheet>
                </div>
              }
              // selectedKeys={selectedKeys}
              // onSelectionChange={setSelectedKeys}
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
                items={form.getValues('tickets')}
              >
                {(item) => (
                  <TableRow key={item.price}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCell(item as TicketItem, columnKey as string)}
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
            <FormCustomLabel
              htmlFor='questionnaire'
              required
            />

            <FormSelect
              name='quesionnaireId'
              control={form.control}
              data={toSelectItem(EventMeetingToolCodeMappings)}
              className='w-full'
            />
          </div>

          <div className='col-span-1'>
            <FormCustomLabel
              htmlFor='target'
              required
            />

            <FormSelect
              name='targetId'
              control={form.control}
              data={toSelectItem(EventMeetingToolCodeMappings)}
              className='w-full'
            />
          </div>

          <div className='col-span-2 mt-4'>
            <FormCustomLabel
              htmlFor='eventComment'
              required
            />
            <FormTextarea
              id='comment'
              name='comment'
              placeholder='Enter comment of organization for audience when they apply'
              control={form.control}
              isDisplayError={true}
              className={clsx(
                form.formState.errors.comment &&
                  form.formState.touchedFields.comment &&
                  'border-error-main',
              )}
            />
          </div>

          <div className='col-span-2'>
            <FormCustomLabel htmlFor='tags' />
            <FormTagsInput
              title='tags'
              name='tags'
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
            {/* <button
              type='submit'
              className='flex justify-center gap-2 items-center shadow-xl text-md bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group'
            >
              Publish
              <svg
                className='w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45'
                viewBox='0 0 16 19'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z'
                  className='fill-gray-800 group-hover:fill-gray-800'
                ></path>
              </svg>
            </button> */}
            <button className='overflow-hidden w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xm font-bold cursor-pointer relative z-10 group'>
              Publish{' '}
              <FaSquareArrowUpRight className='inline w-5 h-5 mb-1 ml1' />
              <span className='absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left'></span>
              <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left'></span>
              <span className='absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left'></span>
              <span className='group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10'>
                Publish{' '}
                <FaSquareArrowUpRight className='inline w-5 h-5 mb-1 ml1' />
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
  );
}
