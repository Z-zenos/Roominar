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
  Chip,
  User,
} from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { ManageEventSortByCode } from '@/src/lib/api/generated';
import type {
  EventMeetingToolCode,
  ListingOrganizationEventsItem,
  OrganizationsApiListingOrganizationEventsRequest,
} from '@/src/lib/api/generated';
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

const statusColorMap = {
  PUBLIC: 'success',
  paused: 'danger',
  vacation: 'warning',
};

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'status', uid: 'status', sortable: true },
  { name: 'apply state', uid: 'apply_state', sortable: true },
  { name: 'start at', uid: 'start_at' },
  // { name: 'EMAIL', uid: 'email' },
  // { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function EventDataTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { data, isFetching } = useListingOrganizationEventsQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });

  const [selectedKeys, setSelectedKeys] = useState<any>(null);
  const [page, setPage] = useState<number>(data?.page || 1);
  const form = useForm<OrganizationsApiListingOrganizationEventsRequest>({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      tags: (searchParams.getAll('tags[]') as unknown as number[]) || undefined,
      meetingToolCodes:
        (searchParams.getAll('meetingToolCodes[]') as EventMeetingToolCode[]) ||
        undefined,
      startAtFrom: searchParams.get('start_at_from')
        ? dayjs(searchParams.get('start_at_from')).toDate()
        : undefined,
      startAtTo: searchParams.get('start_at_to')
        ? dayjs(searchParams.get('start_at_to')).toDate()
        : undefined,
      eventStatus:
        (searchParams.getAll('event_status[]') as EventStatusCode[]) ||
        undefined,
      timeStatus:
        (searchParams.get('time_status') as EventTimeStatusCode) || undefined,

      sortBy:
        (searchParams.get('sort_by') as ManageEventSortByCode) ?? undefined,
    },
  });

  function handleSearch(data: any = {}) {
    if (form.getValues()['start_at_range']) {
      const start_at_range = form.getValues()['start_at_range'];
      data.start_at_from = dayjs(start_at_range.from).format('YYYY-MM-DD');
      data.start_at_to = dayjs(start_at_range.to).format('YYYY-MM-DD');
    }
    const filters: OrganizationsApiListingOrganizationEventsRequest = {
      ...form.getValues(),
      ...data,
    };

    const exclude_queries = ['start_at_range'];

    searchQuery(router, filters, searchParams, exclude_queries);
  }

  const renderCell = useCallback(
    (event: ListingOrganizationEventsItem, columnKey: Key) => {
      const cellValue = event[columnKey as string];

      switch (columnKey) {
        case 'name':
          return (
            <User
              avatarProps={{
                radius: 'lg',
                src: event.coverImageUrl,
                className: 'w-[100px] h-[100px]',
              }}
              // description={user.email}
              name={cellValue}
            >
              {event.name}
            </User>
          );
        case 'status':
          return (
            <Chip
              className='capitalize'
              color={statusColorMap[event.status]}
              size='sm'
              variant='flat'
            >
              {cellValue}
            </Chip>
          );
        case 'apply_state':
          return (
            <div className='flex flex-col'>
              <p className='text-bold text-small capitalize'>{cellValue}</p>
              <p className='text-bold text-tiny capitalize text-default-400'>
                {event.appliedNumber ?? 0} / {event.totalTicketNumber}
              </p>
            </div>
          );

        case 'start_at':
          return (
            <div className='flex flex-col'>
              <p className='text-bold text-small capitalize'>{cellValue}</p>
              <p className='text-bold text-tiny capitalize text-default-400'>
                {formatEventDate(event.startAt)}
              </p>
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
                  });
                  router.push('/organization/events');
                }}
                startContent={<GrPowerReset />}
              >
                Reset
              </Button>
              <div className='600px:min-w-[300px] min-w-full'>
                <FormInput
                  name='keyword'
                  leftIcon={<IoSearchOutline size={20} />}
                  placeholder='Search event name...'
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
                name='start_at_range'
                control={form.control}
                className='w-full'
                onValueChange={handleSearch}
              />
            </div>
            <div className='flex items-center justify-start gap-4 400px:mt-3 mt-0'>
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
        <ReactPaginate
          breakLabel='...'
          nextLabel={width > 800 ? 'next >' : '>'}
          onPageChange={({ selected }: any) => {
            handleSearch({ page: selected + 1 });
            setPage(selected + 1);
          }}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(data?.total / data?.perPage) || 0}
          previousLabel={width > 800 ? '< previous' : '<'}
          renderOnZeroPageCount={null}
          forcePage={page >= 1 ? page - 1 : 0}
          className='mx-auto flex lg:gap-4 gap-1 mt-4 w-full items-center justify-center'
          pageClassName='lg:py-2 lg:px-4 py-1 px-2'
          nextClassName='lg:py-2 lg:px-4 py-1 px-2'
          previousClassName='lg:py-2 lg:px-4 py-1 px-2'
          disabledClassName='text-gray-400'
          activeClassName='bg-primary text-white rounded-md'
        />
      </div>
    </>
  );
}
