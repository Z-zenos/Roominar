'use client';

import type { Key } from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  RadioGroup,
  Radio,
} from '@nextui-org/react';

import { useForm } from 'react-hook-form';
import type {
  EventsApiListingEventPurchasedTicketsRequest,
  ListingEventPurchasedTicketsItem,
  OrganizationsApiListingAttendeesRequest,
} from '@/src/lib/api/generated';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { handleApiError, searchQuery } from '@/src/utils/app.util';
import { Form, FormInput } from '@/src/component/form/Form';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { GrPowerReset } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import useHighlightMatchedText from '@/src/hooks/useHighlightMatchedText';
import { styles } from '@/src/constants/styles.constant';

import Chip from '@/src/component/common/Chip';
import { IoIosCheckboxOutline, IoIosRemoveCircleOutline } from 'react-icons/io';
import {
  useDeleteManualCheckInMutation,
  useManualCheckInMutation,
} from '@/src/api/event.api';
import { useListingEventPurchasedTicketsQuery } from '@/src/api/ticket.api';

const columns = [
  { name: 'Mã vé', uid: 'id', sortable: false },
  { name: 'Trạng thái', uid: 'checkin', sortable: false },
  { name: 'Hành động', uid: 'actions' },
];

interface AttendeeCheckInTableProps {
  slug: string;
}

export default function AttendeeCheckInTable({
  slug,
}: AttendeeCheckInTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const highlightMatchedText = useHighlightMatchedText();
  const [checkedIns, setCheckedIns] = useState<number[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<any>(new Set());

  const { data, isFetching } = useListingEventPurchasedTicketsQuery({
    slug: slug,
    ...(queryString.parse(
      searchParams.toString(),
    ) as unknown as EventsApiListingEventPurchasedTicketsRequest),
  });
  const [page, setPage] = useState<number>(data?.page || 1);
  const pageCount = Math.ceil(data?.total / data?.perPage);

  const form = useForm<EventsApiListingEventPurchasedTicketsRequest>({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      isCheckedIn:
        (searchParams.get('is_checked_in') === 'true' ? true : false) ||
        undefined,
    },
  });

  useEffect(() => {
    if (data) {
      setCheckedIns(
        data.data.filter((ept) => ept.checkInId).map((ept) => ept.checkInId),
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

  const { trigger: manualCheckIn } = useManualCheckInMutation({
    onSuccess() {},
    onError: handleApiError,
  });

  const { trigger: deleteManualCheckIn } = useDeleteManualCheckInMutation({
    onSuccess() {},
    onError: handleApiError,
  });

  const handleCheckIn = (ept: ListingEventPurchasedTicketsItem) => {
    setCheckedIns((prev) => {
      const newCheckedIn = prev;
      if (newCheckedIn.includes(ept.checkInId)) {
        newCheckedIn.filter((checkInId) => checkInId !== ept.checkInId);
        deleteManualCheckIn({
          checkInId: ept.checkInId,
        });
      } else {
        newCheckedIn.push(ept.checkInId);
        manualCheckIn({
          manualCheckInRequest: {
            transactionItemId: ept.transactionItemId,
          },
        });
      }
      return newCheckedIn;
    });
  };

  const renderCell = useCallback(
    (ept: ListingEventPurchasedTicketsItem, columnKey: Key) => {
      const cellValue = ept[columnKey as string];

      switch (columnKey) {
        case 'id':
          return (
            <p>
              {highlightMatchedText(
                ept.transactionItemId + '',
                form.getValues('keyword'),
              )}
            </p>
          );

        case 'checkin':
          return (
            <Chip
              content={
                checkedIns.includes(ept.checkInId)
                  ? 'Đã check-in'
                  : 'Chưa check-in'
              }
              leftIcon={
                checkedIns.includes(ept.checkInId) ? (
                  <IoCheckmarkDoneOutline className='text-sm' />
                ) : null
              }
              type={checkedIns.includes(ept.checkInId) ? 'success' : 'default'}
              className='w-fit ml-2'
            />
          );

        case 'actions':
          return (
            <div
              className='relative flex justify-center items-center gap-2'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div
                onClick={() => handleCheckIn(ept)}
                className={clsx(styles.between, 'gap-2 cursor-pointer')}
              >
                {checkedIns.includes(ept.checkInId) ? (
                  <IoIosRemoveCircleOutline className='w-5 h-5' />
                ) : (
                  <IoIosCheckboxOutline className='w-5 h-5' />
                )}
              </div>
            </div>
          );
        default:
          return cellValue;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  'text-sm !px-3 !bg-orange-100 !text-orange-500 !hover:text-orange-500 !hover:border-orange-500 !hover:shadow-orange-100',
                )}
                radius='sm'
                size='md'
                onClick={() => {
                  form.reset();
                  router.refresh();
                }}
                startContent={<GrPowerReset />}
              >
                Xoá tìm kiếm
              </Button>
              <div className='600px:min-w-[300px] min-w-full'>
                <FormInput
                  name='keyword'
                  placeholder='Nhập mã vé để tìm kiếm...'
                  className='w-[300px]'
                  control={form.control}
                  onKeyDown={debounce(
                    () => handleSearch({ keyword: form.getValues('keyword') }),
                    1000,
                  )}
                />
              </div>

              <RadioGroup orientation='horizontal'>
                <Radio
                  className='mr-4'
                  value='all'
                >
                  Tất cả
                </Radio>
                <Radio
                  className='mr-4'
                  value='checked-in'
                  onClick={() => form.setValue('isCheckedIn', false)}
                >
                  Đã check-in
                </Radio>
                <Radio
                  className='mr-4'
                  value='un-check-in'
                  onClick={() => form.setValue('isCheckedIn', true)}
                >
                  Chưa check-in
                </Radio>
              </RadioGroup>
            </div>
          </div>
        </form>
      </Form>
      <Table
        aria-label='Example table with custom cells, pagination and sorting'
        isHeaderSticky
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'max-h-[600px] mt-2',
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
            <TableRow key={item.transactionItemId}>
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
            : `Đã chọn ${selectedKeys?.size ?? 0} / ${data?.data?.length}`}
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
