'use client';

import type { Key } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  User,
  Link,
  Checkbox,
} from '@nextui-org/react';

import { useForm } from 'react-hook-form';
import type {
  ApiException,
  AttendeeSortByCode,
  ErrorResponse400,
  ListingAttendeesItem,
  OrganizationsApiDownloadAttendeesCsvRequest,
  OrganizationsApiListingAttendeesRequest,
} from '@/src/lib/api/generated';
import { IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import dayjs from 'dayjs';
import {
  camelToSnake,
  formatEventDate,
  optionify,
  searchQuery,
  toCamelCase,
} from '@/src/utils/app.util';
import {
  Form,
  FormCombobox,
  FormDateRangePicker,
  FormInput,
} from '@/src/component/form/Form';
import { IoCheckmarkDoneOutline, IoSearchOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { GrPowerReset } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { BsThreeDots } from 'react-icons/bs';
import { useListingAttendeesQuery } from '@/src/api/organization.api';
import { useTranslations } from 'next-intl';
import useHighlightMatchedText from '@/src/hooks/useHighlightMatchedText';
import { styles } from '@/src/constants/styles.constant';
import {
  useCreateCheckInMutation,
  useDeleteCheckInMutation,
} from '@/src/api/event.api';
import toast from 'react-hot-toast';
import { TbFileTypeCsv } from 'react-icons/tb';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AiOutlineEye } from 'react-icons/ai';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from '@/src/component/common/Sheet';
import AttendeeDetail from './AttendeeDetail';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/src/component/common/DropdownMenu';
import Chip from '@/src/component/common/Chip';

const columns = [
  { name: 'Apply Time', uid: 'apply_time', sortable: false },
  { name: 'User Name', uid: 'name', sortable: false },
  { name: 'Event Name', uid: 'event_name', sortable: false },
  { name: 'Phone', uid: 'phone', sortable: false },
  { name: 'Industry / Job', uid: 'industry_job', sortable: false },
  { name: 'Checkin Status', uid: 'checkin', sortable: false },
  { name: 'Actions', uid: 'actions' },
];

export default function AttendeeDataTable() {
  const [isDownloadAttendeesCSVLoading, setIsDownloadAttendeesCSVLoading] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const [isWithFilterData, setIsWithFilterData] = useState<boolean>(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const t = useTranslations();
  const highlightMatchedText = useHighlightMatchedText();
  const [checkedInAttendees, setCheckedInAttendees] = useState<Set<number>>(
    new Set(),
  );

  const [selectedKeys, setSelectedKeys] = useState<any>(new Set());
  const [selectedAttendeeId, setSelectedAttendeeId] = useState<number | null>(
    null,
  );
  const { data, isFetching } = useListingAttendeesQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });
  const [page, setPage] = useState<number>(data?.page || 1);
  const pageCount = Math.ceil(data?.total / data?.perPage);
  const { data: auth } = useSession();
  const [rightSidebarContent, setRightSidebarContent] = useState<
    'ATTENDEE_DETAIL' | null
  >();

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

  useEffect(() => {
    if (data) {
      setCheckedInAttendees(
        () =>
          new Set(
            data?.data
              ?.filter((item) => item.checkInId)
              ?.map((item) => item.applicationId),
          ),
      );
    }
  }, [data]);

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

  const { trigger: createCheckIn } = useCreateCheckInMutation({
    onSuccess() {},
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const { trigger: deleteCheckIn } = useDeleteCheckInMutation({
    onSuccess() {},
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  function handleDownloadAttendeesCSV() {
    setIsDownloadAttendeesCSVLoading(true);
    let params = {
      ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
      withFilter: isWithFilterData,
    } as OrganizationsApiDownloadAttendeesCsvRequest;

    params = toCamelCase(params);
    if (params.applyAtFrom) {
      params.applyAtFrom = new Date(params.applyAtFrom);
    }
    if (params.applyAtTo) params.applyAtTo = new Date(params.applyAtTo);

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/attendees/csv`,
        {
          params: camelToSnake(params),
          headers: {
            Authorization: `Bearer ${auth.token.accessToken}`,
          },
        },
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendees-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
      })
      .finally(() => {
        setIsDownloadAttendeesCSVLoading(false);
      });
  }

  const handleCheckIn = (attendee: ListingAttendeesItem) => {
    setCheckedInAttendees((prev) => {
      const newCheckedIn = new Set(prev);
      if (newCheckedIn.has(attendee.applicationId)) {
        newCheckedIn.delete(attendee.applicationId);
        deleteCheckIn({
          eventId: attendee.eventId,
          checkInId: attendee.checkInId,
        });
      } else {
        newCheckedIn.add(attendee.applicationId);
        createCheckIn({
          eventId: attendee.eventId,
          createCheckInRequest: {
            applicationId: attendee.applicationId,
            ticketId: null,
            transactionItemId: null,
          },
        });
      }
      return newCheckedIn;
    });
  };

  const rightSidebar = useMemo(() => {
    switch (rightSidebarContent) {
      case 'ATTENDEE_DETAIL':
        return {
          title: 'ATTENDEE DETAIL',
          body: <AttendeeDetail id={selectedAttendeeId} />,
          footer: null,
        };

      // case 'TARGET':
      //   return {
      //     title: 'TARGET',
      //     body: <CreateTargetForm />,
      //     footer: null,
      //   };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightSidebarContent]);

  const renderCell = useCallback(
    (attendee: ListingAttendeesItem, columnKey: Key) => {
      const cellValue = attendee[columnKey as string];

      switch (columnKey) {
        case 'apply_time':
          return <p>{formatEventDate(attendee.appliedAt)}</p>;

        case 'name':
          return (
            <User
              avatarProps={{
                src: attendee.avatarUrl,
                className: 'w-[40px] h-[40px]',
              }}
              name={
                <div className='ml-2'>
                  <p>
                    {highlightMatchedText(
                      attendee.userName,
                      form.getValues('keyword'),
                    )}
                  </p>
                  <p className='font-semibold'>
                    {highlightMatchedText(
                      attendee.email,
                      form.getValues('keyword'),
                    )}
                  </p>
                </div>
              }
            />
          );

        case 'event_name':
          return (
            <Link
              underline='hover'
              className='max-w-[300px] text-sm break-words'
              href={`/organization/events/${attendee.eventId}`}
            >
              {highlightMatchedText(
                attendee.eventName,
                form.getValues('keyword'),
              )}
            </Link>
          );

        case 'phone':
          return (
            <p>{highlightMatchedText(cellValue, form.getValues('keyword'))}</p>
          );

        case 'industry_job':
          return (
            <p className='text-bold text-sm capitalize text-default-500'>
              {attendee.industryCode
                ? t(`code.industry.${attendee.industryCode}`)
                : '---'}{' '}
              /{' '}
              {attendee.jobTypeCode
                ? t(`code.jobType.${attendee.jobTypeCode}`)
                : '---'}
            </p>
          );

        case 'checkin':
          return (
            <Chip
              content={
                checkedInAttendees.has(attendee.checkInId)
                  ? 'Checked In'
                  : 'Uncheck'
              }
              leftIcon={
                checkedInAttendees.has(attendee.checkInId) ? (
                  <IoCheckmarkDoneOutline className='text-sm' />
                ) : null
              }
              type={
                checkedInAttendees.has(attendee.checkInId)
                  ? 'success'
                  : 'default'
              }
              className='w-fit ml-2'
            />
          );

        case 'actions':
          return (
            <div className='relative flex justify-center items-center gap-2 hover:bg-gray-200'>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={clsx(styles.center, 'w-full h-10')}
                >
                  <BsThreeDots className='text-default-500 cursor-pointer' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <SheetTrigger
                      onClick={() => {
                        setRightSidebarContent('ATTENDEE_DETAIL');
                        setSelectedAttendeeId(attendee.id);
                      }}
                      className={clsx(styles.between, 'gap-2')}
                    >
                      <AiOutlineEye className='w-5 h-5' />
                      View Detail
                    </SheetTrigger>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <Sheet>
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
                  router.push('/organization/attendees');
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
            <div className='flex items-center justify-start gap-4 mt-0'>
              <div className='flex flex-col justify-start gap-2'>
                <Button
                  type='button'
                  className='bg-success-500 text-white'
                  radius='sm'
                  size='md'
                  onClick={handleDownloadAttendeesCSV}
                  endContent={<TbFileTypeCsv size={36} />}
                  isLoading={isDownloadAttendeesCSVLoading}
                >
                  Download
                </Button>
                <Checkbox
                  size='sm'
                  className='text-ss font-light text-gray-600'
                  radius='none'
                  isSelected={isWithFilterData}
                  onValueChange={(value) => {
                    setIsWithFilterData(value);
                  }}
                >
                  With Filter Data
                </Checkbox>
              </div>
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
