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
  User,
} from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import type {
  AttendeeSortByCode,
  ListingAttendeesItem,
  OrganizationsApiListingAttendeesRequest,
} from '@/src/lib/api/generated';
import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { formatEventDate, optionify, searchQuery } from '@/src/utils/app.util';
import {
  Form,
  FormCombobox,
  FormDateRangePicker,
  FormInput,
} from '@/src/component/form/Form';
import { IoSearchOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { GrPowerReset } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { BsThreeDots } from 'react-icons/bs';
import { useListingAttendeesQuery } from '@/src/api/organization.api';
import { useTranslations } from 'next-intl';

const columns = [
  { name: 'Apply Time', uid: 'apply_time', sortable: false },
  { name: 'User Name', uid: 'name', sortable: false },
  { name: 'Event Name', uid: 'event_name', sortable: false },
  { name: 'Phone', uid: 'phone', sortable: false },
  { name: 'Industry / Job', uid: 'industry_job', sortable: false },
  { name: 'Workplace Name', uid: 'workplace_name', sortable: false },
  { name: 'Actions', uid: 'actions' },
];

export default function AttendeeDataTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const t = useTranslations();

  const { data, isFetching } = useListingAttendeesQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });

  const [selectedKeys, setSelectedKeys] = useState<any>(null);
  const [page, setPage] = useState<number>(data?.page || 1);
  const form = useForm<OrganizationsApiListingAttendeesRequest>({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      applyAtFrom: searchParams.get('apply_at_from')
        ? dayjs(searchParams.get('apply_at_from')).toDate()
        : undefined,
      applyAtTo: searchParams.get('apply_at_to')
        ? dayjs(searchParams.get('apply_at_to')).toDate()
        : undefined,
      isCheckedIn:
        (searchParams.get('is_checked_in') === 'true' ? true : false) ||
        undefined,
      jobTypeCode:
        (searchParams.get('job_type_code') as JobTypeCode) || undefined,
      industryCode:
        (searchParams.get('industry_code') as IndustryCode) || undefined,
      sortBy: (searchParams.get('sort_by') as AttendeeSortByCode) ?? undefined,
    },
  });

  function handleSearch(data: any = {}) {
    if (form.getValues()['apply_at_range']) {
      const apply_at_range = form.getValues()['apply_at_range'];
      data.apply_at_from = dayjs(apply_at_range.from).format('YYYY-MM-DD');
      data.apply_at_to = dayjs(apply_at_range.to).format('YYYY-MM-DD');
    }
    const filters: OrganizationsApiListingAttendeesRequest = {
      ...form.getValues(),
      ...data,
    };

    const exclude_queries = ['apply_at_range'];

    searchQuery(router, filters, searchParams, exclude_queries);
  }

  const renderCell = useCallback(
    (attendee: ListingAttendeesItem, columnKey: Key) => {
      const cellValue = attendee[columnKey as string];

      switch (columnKey) {
        case 'apply_time':
          return <p className=''>{formatEventDate(attendee.appliedAt)}</p>;

        case 'name':
          return (
            <User
              avatarProps={{
                src: attendee.avatarUrl,
                className: 'w-[40px] h-[40px]',
              }}
              name={
                <div className='ml-2'>
                  <p>{attendee.userName}</p>
                  <p className='font-semibold'>{attendee.email}</p>
                </div>
              }
            />
          );

        case 'event_name':
          return (
            <p className='max-w-[300px] break-words'>{attendee.eventName}</p>
          );

        case 'phone':
          return <p>{cellValue}</p>;

        case 'industry_job':
          return (
            <p className='text-bold text-sm capitalize text-default-500'>
              {t(`code.industry.${attendee.industryCode}`)} /{' '}
              {t(`code.jobType.${attendee.jobTypeCode}`)}
            </p>
          );

        case 'workplace_name':
          return <p>{attendee.workplaceName}</p>;

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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    apply_at_range: {
                      from: null,
                      to: null,
                    },
                    applyAtFrom: undefined,
                    applyAtTo: undefined,
                  });
                  router.push('/organization/atendees');
                }}
                startContent={<GrPowerReset />}
              >
                Reset
              </Button>
              <div className='600px:min-w-[300px] min-w-full'>
                <FormInput
                  name='keyword'
                  leftIcon={<IoSearchOutline size={20} />}
                  placeholder='Search keyword related to attendee...'
                  className='w-full'
                  control={form.control}
                  onKeyDown={debounce(
                    () => handleSearch({ keyword: form.getValues('keyword') }),
                    1000,
                  )}
                />
              </div>
              <FormCombobox
                options={optionify(IndustryCode)}
                i18nPath='code.industry'
                name='industryCode'
                control={form.control}
                onValueChange={handleSearch}
                title='Industry'
              />
              <FormCombobox
                options={optionify(JobTypeCode)}
                i18nPath='code.jobType'
                name='jobTypeCode'
                control={form.control}
                onValueChange={handleSearch}
                title='Job type'
              />

              <FormDateRangePicker
                name='apply_at_range'
                control={form.control}
                className='w-full'
                onValueChange={handleSearch}
              />
            </div>
            {/* <div className='flex items-center justify-start gap-4 400px:mt-3 mt-0'> */}
            {/* <Text
                content='Sort by:'
                className='font-light text-gray-500'
              /> */}
            {/* <FormSelect
                options={optionify(AttendeeSortByCode)}
                i18nPath='code.attendee.sortBy'
                control={form.control}
                onValueChange={handleSearch}
                defaultValue={form.getValues('sortBy')}
                name='sortBy'
              /> */}
            {/* </div> */}
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
