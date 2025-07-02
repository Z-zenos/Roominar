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
  User,
  Checkbox,
} from '@nextui-org/react';

import { useForm } from 'react-hook-form';
import type {
  AttendeeSortByCode,
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
import { IoSearchOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { GrPowerReset } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { useListingAttendeesQuery } from '@/src/api/organization.api';
import { useTranslations } from 'next-intl';
import useHighlightMatchedText from '@/src/hooks/useHighlightMatchedText';
import { styles } from '@/src/constants/styles.constant';

import { TbFileTypeCsv } from 'react-icons/tb';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AiOutlineEye } from 'react-icons/ai';
import { SheetTrigger } from '@/src/component/common/Sheet';
import { useRightSidebar } from '@/src/contexts/RightSidebarContext';

const columns = [
  { name: 'Thời gian đăng ký', uid: 'apply_time', sortable: false },
  { name: 'Tên người dùng', uid: 'name', sortable: false },
  { name: 'Số điện thoại', uid: 'phone', sortable: false },
  { name: 'Ngành nghề / Công việc', uid: 'industry_job', sortable: false },
  { name: 'Vé đã mua', uid: 'purchased_tickets', sortable: false },
  { name: 'Hành động', uid: 'actions' },
];

interface AttendeeDataTableProps {
  slug?: string;
}

export default function AttendeeDataTable({ slug }: AttendeeDataTableProps) {
  const [isDownloadAttendeesCSVLoading, setIsDownloadAttendeesCSVLoading] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const [isWithFilterData, setIsWithFilterData] = useState<boolean>(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const t = useTranslations();
  // const [checkedInAttendees, setCheckedInAttendees] = useState<Set<number>>(
  //   new Set(),
  // );
  const highlightMatchedText = useHighlightMatchedText();

  const [selectedKeys, setSelectedKeys] = useState<any>(new Set());

  const { data, isFetching } = useListingAttendeesQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
    slug: slug,
  });
  const [page, setPage] = useState<number>(data?.page || 1);
  const pageCount = Math.ceil(data?.total / data?.perPage);
  const { data: auth } = useSession();
  const { open } = useRightSidebar();

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

  // const { trigger: createCheckIn } = useManualCheckInMutation({
  //   onSuccess() {},
  //   onError: handleApiError,
  // });

  // const { trigger: deleteCheckIn } = useDeleteManualCheckInMutation({
  //   onSuccess() {},
  //   onError: handleApiError,
  // });

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

  // const handleCheckIn = (attendee: ListingAttendeesItem) => {
  //   setCheckedInAttendees((prev) => {
  //     const newCheckedIn = new Set(prev);
  //     if (newCheckedIn.has(attendee.applicationId)) {
  //       newCheckedIn.delete(attendee.applicationId);
  //       deleteCheckIn({
  //         checkInId: attendee.checkInId,
  //       });
  //     } else {
  //       newCheckedIn.add(attendee.applicationId);
  //       createCheckIn({
  //         manualCheckInRequest: {
  //           transactionItemId: attendee.transactionItemId,
  //         },
  //       });
  //     }
  //     return newCheckedIn;
  //   });
  // };

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

        case 'purchased_tickets':
          return (
            <ul className=''>
              {attendee.purchasedTickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className='block text-bold text-sm text-default-500'
                >
                  {highlightMatchedText(ticket.type, form.getValues('keyword'))}
                </li>
              ))}
            </ul>
          );

        // case 'checkin':
        //   return (
        //     <Chip
        //       content={
        //         checkedInAttendees.has(attendee.checkInId)
        //           ? 'Checked In'
        //           : 'Uncheck'
        //       }
        //       leftIcon={
        //         checkedInAttendees.has(attendee.checkInId) ? (
        //           <IoCheckmarkDoneOutline className='text-sm' />
        //         ) : null
        //       }
        //       type={
        //         checkedInAttendees.has(attendee.checkInId)
        //           ? 'success'
        //           : 'default'
        //       }
        //       className='w-fit ml-2'
        //     />
        //   );

        case 'actions':
          return (
            <div
              className='relative flex justify-center items-center gap-2'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <SheetTrigger
                onClick={() => open('ATTENDEE_DETAIL', attendee.id)}
                className={clsx(styles.between, 'gap-2')}
              >
                <AiOutlineEye className='w-5 h-5' />
              </SheetTrigger>
            </div>
          );

        // case 'actions':
        //   return (
        //     <div
        //       className='relative flex justify-center items-center gap-2'
        //       onClick={(e) => {
        //         e.preventDefault();
        //         e.stopPropagation();
        //       }}
        //     >
        //       <SheetTrigger
        //         onClick={() => open('ATTENDEE_DETAIL', attendee.id)}
        //         className={clsx(styles.between, 'gap-2')}
        //       >
        //         <AiOutlineEye className='w-5 h-5' />
        //       </SheetTrigger>
        //       <div
        //         onClick={() => handleCheckIn(attendee)}
        //         className={clsx(styles.between, 'gap-2 cursor-pointer')}
        //       >
        //         {checkedInAttendees.has(attendee.checkInId) ? (
        //           <IoIosRemoveCircleOutline className='w-5 h-5' />
        //         ) : (
        //           <IoIosCheckboxOutline className='w-5 h-5' />
        //         )}
        //       </div>
        //     </div>
        //   );

        default:
          return cellValue;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className='p-4'>
      <Form {...form}>
        <h3 className='text-primary font-semibold text-center text-lg'>
          Danh sách người tham gia
        </h3>
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
                  router.push(`/organization/events/${slug}/overview`);
                }}
                startContent={<GrPowerReset />}
              >
                Đặt lại
              </Button>
              <div className='600px:min-w-[300px] min-w-full'>
                <FormInput
                  name='keyword'
                  leftIcon={<IoSearchOutline size={20} />}
                  placeholder='Tìm kiếm người dùng, email, số điện thoại...'
                  className='800px:w-[400px] w-full'
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
                title='Ngành nghề'
              />
              <FormCombobox
                options={optionify(JobTypeCode)}
                i18nPath='code.jobType'
                name='jobTypeCode'
                control={form.control}
                onValueChange={handleSearch}
                title='Công việc'
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
                  Với dữ liệu lọc
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
          emptyContent={isFetching ? 'Loading...' : 'Không tìm thấy dữ liệu'}
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
            ? 'Đã chọn tất cả'
            : `Đã chọn ${selectedKeys?.size ?? 0} trong số ${data?.data?.length} đã chọn`}
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
    </div>
  );
}
