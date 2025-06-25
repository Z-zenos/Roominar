'use client';

import type { Key } from 'react';
import { useCallback, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Link,
  Image,
} from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { ManageEventSortByCode } from '@/src/lib/api/generated';
import type {
  ListingOrganizationEventsItem,
  OrganizationsApiListingOrganizationEventsRequest,
} from '@/src/lib/api/generated';
import { EventMeetingToolCode } from '@/src/lib/api/generated';
import { EventStatusCode, EventTimeStatusCode } from '@/src/lib/api/generated';
import { useRouter, useSearchParams } from 'next/navigation';
import { useListingOrganizationEventsQuery } from '@/src/api/event.api';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { formatEventDate, optionify, searchQuery } from '@/src/utils/app.util';
import {
  Form,
  FormCombobox,
  FormDateRangePicker,
  FormInput,
  FormSelect,
} from '@/src/component/form/Form';
import { IoSearchOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { GrPowerReset } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { BsThreeDots } from 'react-icons/bs';
import Chip from '@/src/component/common/Chip';
import { styles } from '@/src/constants/styles.constant';
import { CiLocationOn } from 'react-icons/ci';
import { FcVideoCall } from 'react-icons/fc';
import { useTranslations } from 'next-intl';
import { FaChevronDown } from 'react-icons/fa6';
import type { DateRange } from 'react-day-picker';

const columns = [
  { name: 'Tên', uid: 'name', sortable: true },
  { name: 'Địa chỉ / Liên kết', uid: 'address' },
  { name: 'Trạng thái', uid: 'status' },
  { name: 'Tình trạng vé', uid: 'ticket_state' },
  { name: 'Bắt đầu - Kết thúc', uid: 'start_at' },
  { name: 'Hành động', uid: 'actions' },
];

export default function EventDataTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const t = useTranslations('code');

  const { data, isFetching } = useListingOrganizationEventsQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });

  const [selectedKeys, setSelectedKeys] = useState<any>(null);
  const [page, setPage] = useState<number>(data?.page || 1);
  const pageCount = Math.ceil(data?.total / data?.perPage);

  const form = useForm<
    OrganizationsApiListingOrganizationEventsRequest & {
      startAtRange?: DateRange;
    }
  >({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      tags: (searchParams.getAll('tags[]') as unknown as number[]) || undefined,
      meetingToolCodes:
        (searchParams.getAll('meetingToolCodes[]') as EventMeetingToolCode[]) ||
        undefined,
      startAtFrom: searchParams.get('start_at_from')
        ? dayjs(searchParams.get('start_at_from')).format('YYYY-MM-DD')
        : undefined,
      startAtTo: searchParams.get('start_at_to')
        ? dayjs(searchParams.get('start_at_to')).format('YYYY-MM-DD')
        : undefined,
      eventStatus:
        (searchParams.getAll('event_status[]') as EventStatusCode[]) ||
        undefined,
      timeStatus:
        (searchParams.get('time_status') as EventTimeStatusCode) || undefined,

      sortBy:
        (searchParams.get('sort_by') as ManageEventSortByCode) ?? undefined,
      startAtRange: {
        from: searchParams.get('start_at_from')
          ? dayjs(searchParams.get('start_at_from')).toDate()
          : null,
        to: searchParams.get('start_at_to')
          ? dayjs(searchParams.get('start_at_to')).toDate()
          : null,
      } as DateRange,
    },
  });

  function handleSearch(data: any = {}) {
    if (form.getValues('startAtRange')) {
      const startAtRange = form.getValues('startAtRange');
      data.startAtFrom = dayjs(startAtRange.from).format('YYYY-MM-DD');
      data.startAtTo = dayjs(startAtRange.to).format('YYYY-MM-DD');
    }
    const filters: OrganizationsApiListingOrganizationEventsRequest = {
      ...form.getValues(),
      ...data,
    };

    const exclude_queries = ['startAtRange', 'start_at_range'];

    searchQuery(router, filters, searchParams, exclude_queries);
  }

  const renderCell = useCallback(
    (event: ListingOrganizationEventsItem, columnKey: Key) => {
      const cellValue = event[columnKey as string];

      switch (columnKey) {
        case 'name':
          return (
            <div className={clsx(styles.flexStart, 'gap-3')}>
              <Image
                src={event.coverImageUrl}
                alt={event.name}
                width={100}
                height={80}
                className='rounded-md min-w-[100px]'
              />
              <Link
                className='font-semibold text-nm capitalize text-primary hover:underline cursor-pointer'
                onClick={() =>
                  router.push(
                    `/organization/events/${event.slug}/${event.status == EventStatusCode.Draft ? 'create' : 'overview'}`,
                  )
                }
              >
                {event.name}
              </Link>
            </div>
          );

        case 'address':
          return (
            <div className='flex flex-col w-fit'>
              {event.organizeAddress && (
                <p
                  className={clsx(
                    styles.flexStart,
                    'text-bold text-small capitalize',
                  )}
                >
                  <CiLocationOn size={20} /> {event.organizeAddress}
                </p>
              )}
              {event.meetingUrl && event.organizeAddress && (
                <div className='h-1 border-b border-b-gray-300 mb-2'></div>
              )}
              {event.meetingUrl && (
                <Link
                  className={clsx(
                    styles.flexStart,
                    'text-bold text-tiny text-blue-500',
                  )}
                  href={event.meetingUrl}
                >
                  {event.meetingToolCode ? (
                    <Chip
                      className={clsx(
                        event.meetingToolCode === EventMeetingToolCode.Zoom &&
                          '!bg-[#2D8CFF] !text-[#fff]',
                        event.meetingToolCode === EventMeetingToolCode.Meet &&
                          '!bg-[#FFC107] !text-[#fff]',
                        event.meetingToolCode ===
                          EventMeetingToolCode.Discord &&
                          '!bg-[#7289DA] !text-[#fff]',
                        event.meetingToolCode ===
                          EventMeetingToolCode.Roominar &&
                          '!bg-[#FF0000] !text-[#fff]',
                        event.meetingToolCode ===
                          EventMeetingToolCode.ContactLater &&
                          '!bg-[#FF0000] !text-[#fff]',
                        'capitalize w-fit',
                      )}
                      content={t(`event.meetingTool.${event.meetingToolCode}`)}
                    />
                  ) : (
                    <FcVideoCall size={20} />
                  )}{' '}
                  <span className='hover:underline'>{event.meetingUrl}</span>
                </Link>
              )}
            </div>
          );

        case 'status':
          return (
            <Chip
              className='capitalize w-fit'
              type={
                event.status === EventStatusCode.Draft
                  ? 'warning'
                  : event.status === EventStatusCode.Public
                    ? 'success'
                    : 'default'
              }
              content={cellValue}
            />
          );

        case 'ticket_state':
          return (
            <p className='text-bold text-sm capitalize underline text-primary cursor-pointer transition-all hover:border hover:border-primary text-center hover:no-underline'>
              {event.tickets.reduce(
                (acc, ticket) => acc + ticket.availableQuantity,
                0,
              ) ?? 0}
              / {event.totalTicketNumber}
            </p>
          );

        case 'start_at':
          return (
            <div className='flex flex-col'>
              <p className='text-bold capitalize'>{cellValue}</p>
              <div className='flex flex-col gap-1 items-center justify-center'>
                <p className='text-bold text-small capitalize text-default-500'>
                  {event.startAt
                    ? formatEventDate(event.startAt)
                    : 'Not set up'}
                </p>

                <FaChevronDown size={12} />

                <p className='text-bold text-small capitalize text-default-500'>
                  {event.endAt ? formatEventDate(event.endAt) : 'Not set up'}
                </p>
              </div>
            </div>
          );

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
                    <BsThreeDots className='text-default-600' />
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
    },
    [],
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSearch)}>
          <div className='flex justify-between items-center flex-wrap gap-1'>
            <div className='flex items-center justify-start gap-4 flex-wrap'>
              <Button
                className={clsx(
                  'text-[17px] !px-3 !bg-orange-100 !text-orange-500 !hover:text-orange-500 !hover:border-orange-500 !hover:shadow-orange-100',
                )}
                radius='sm'
                size='md'
                onClick={() => {
                  form.reset({
                    tags: [],
                    eventStatus: [],
                    timeStatus: undefined,

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    start_at_range: {
                      from: null,
                      to: null,
                    },
                    startAtFrom: undefined,
                    startAtTo: undefined,

                    startAtRange: {
                      from: null,
                      to: null,
                    },
                  });
                  router.push('/organization/events');
                }}
                startContent={<GrPowerReset />}
              >
                Đặt lại
              </Button>
              <div className='600px:min-w-[300px] min-w-full'>
                <FormInput
                  name='keyword'
                  leftIcon={<IoSearchOutline size={20} />}
                  placeholder='Tìm kiếm sự kiện...'
                  className='w-full'
                  control={form.control}
                  onKeyDown={debounce(
                    () => handleSearch({ keyword: form.getValues('keyword') }),
                    1000,
                  )}
                />
              </div>
              <FormCombobox
                options={optionify(EventStatusCode)}
                i18nPath='code.event.status'
                name='eventStatus'
                control={form.control}
                onValueChange={handleSearch}
                title='Status'
              />
              <FormCombobox
                options={optionify(EventTimeStatusCode)}
                i18nPath='code.event.timeStatus'
                name='timeStatus'
                control={form.control}
                onValueChange={handleSearch}
                title='Timeline Status'
              />

              <FormDateRangePicker
                name='startAtRange'
                control={form.control}
                className='w-full'
                onValueChange={handleSearch}
              />
            </div>
            <div className='flex items-center justify-start gap-4 450px:mt-3 mt-0'>
              {/* <Text
                content='Sort by:'
                className='font-light text-gray-500'
              /> */}
              <FormSelect
                options={optionify(ManageEventSortByCode)}
                i18nPath='code.event.manageSortBy'
                control={form.control}
                onValueChange={handleSearch}
                defaultValue={form.getValues('sortBy')}
                name='sortBy'
              />
            </div>
          </div>
        </form>
      </Form>

      <Table
        aria-label='Example table with custom cells, pagination and sorting'
        isHeaderSticky
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'max-h-[600px] mt-10',
        }}
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        topContentPlacement='outside'
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={isFetching ? 'Loading...' : 'No data found'}
          items={data?.data ?? []}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className='py-2 px-2 flex justify-between items-center'>
        <span className='w-[30%] text-small text-default-400'>
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys?.size ?? 0} of ${data?.data?.length} selected`}
        </span>
        {pageCount > 1 && (
          <ReactPaginate
            breakLabel='...'
            nextLabel={width > 800 ? 'next >' : '>'}
            onPageChange={({ selected }: any) => {
              handleSearch({ page: selected + 1 });
              setPage(selected + 1);
            }}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={width > 800 ? '< previous' : '<'}
            renderOnZeroPageCount={null}
            forcePage={page - 1}
            className='mx-auto flex lg:gap-4 gap-1 mt-4 w-full items-center justify-center'
            pageClassName='lg:py-2 lg:px-4 py-1 px-2'
            nextClassName='lg:py-2 lg:px-4 py-1 px-2'
            previousClassName='lg:py-2 lg:px-4 py-1 px-2'
            disabledClassName='text-gray-400'
            activeClassName='bg-primary text-white rounded-md'
          />
        )}
      </div>
    </>
  );
}
