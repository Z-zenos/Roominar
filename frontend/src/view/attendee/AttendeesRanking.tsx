'use client';

import { useListingAttendeesRankingQuery } from '@/src/api/organization.api';
import { Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import type { Key } from 'react';
import { forwardRef, useCallback } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
} from '@nextui-org/react';
import type { ListingAttendeesRankingItem } from '@/src/lib/api/generated';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';
import { SheetTrigger } from '@/src/component/common/Sheet';
import { AiOutlineEye } from 'react-icons/ai';
import { styles } from '@/src/constants/styles.constant';
import { useRightSidebar } from '@/src/contexts/RightSidebarContext';

const ForwardedIoIcon = forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof IoIosInformationCircleOutline>
>((props, ref) => (
  <span ref={ref}>
    <IoIosInformationCircleOutline {...props} />
  </span>
));
ForwardedIoIcon.displayName = 'ForwardedIoIcon';

const columns = [
  { name: 'Rank', uid: 'no', sortable: false },
  { name: 'Trend', uid: 'trend', sortable: false }, // up/down icon
  { name: 'Người tham gia', uid: 'user_info', sortable: false }, // avatar + full name + email
  { name: 'Đã mua vé', uid: 'purchase_number', sortable: false },
  { name: 'Đã check-in', uid: 'checkin_number', sortable: false },
  { name: 'Khảo sát đã hoàn thành', uid: 'survey_number', sortable: false },
  { name: 'Ranking Score', uid: 'ranking_score', sortable: false },
  { name: 'Hành động', uid: 'actions', sortable: false },
];

export default function AttendeesRanking() {
  const { open } = useRightSidebar();
  const { data: attendeesRanking, isLoading: isLoadingAttendeesRanking } =
    useListingAttendeesRankingQuery();

  const renderCell = useCallback(
    (attendee: ListingAttendeesRankingItem, columnKey: Key) => {
      const cellValue = attendee[columnKey as string];

      switch (columnKey) {
        case 'no':
          return <p>{attendee.id}</p>;

        case 'trend':
          return (
            <div className='flex items-center justify-center'>
              {attendee.rankChange === 'up' ? (
                <BiUpArrow className='text-green-500' />
              ) : (
                <BiDownArrow className='text-red-500 rotate-180' />
              )}
            </div>
          );

        case 'user_info':
          return (
            <User
              avatarProps={{
                src: attendee.avatarUrl,
                className: 'w-[40px] h-[40px]',
              }}
              name={
                <div className='ml-2'>
                  <p>{attendee.fullName}</p>
                  <p className='text-gray-600 font-semibold'>
                    {attendee.email}
                  </p>
                </div>
              }
            />
          );

        case 'purchase_number':
          return (
            <div className='flex items-center justify-center'>
              <p>{attendee.purchaseNumber}</p>
            </div>
          );

        case 'checkin_number':
          return (
            <div className='flex items-center justify-center'>
              <p>{attendee.checkinNumber}</p>
            </div>
          );

        case 'survey_number':
          return (
            <div className='flex items-center justify-center'>
              <p>{attendee.surveyNumber}</p>
            </div>
          );

        case 'ranking_score':
          return (
            <div className='flex items-center justify-center'>
              <p>{attendee.totalScore}</p>
            </div>
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
              <SheetTrigger
                onClick={() => open('ATTENDEE_DETAIL', attendee.id)}
                className={clsx(styles.between, 'gap-2')}
              >
                <AiOutlineEye className='w-5 h-5' />
              </SheetTrigger>
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
    <ul
      role='list'
      className='bg-white rounded-lg shadow-md p-4 mt-2'
    >
      <h3 className='text-md text-orange-500 mb-2 font-semibold flex justify-start items-center gap-2'>
        Ranking người tham gia sự kiện{' '}
        <Tooltip
          className='inline-block'
          content={
            <div className='absolute z-20 mt-2 w-80 p-4 rounded-xl shadow-xl bg-white border border-gray-200 text-sm text-gray-700'>
              <p className='font-semibold mb-2'>🏆 Cách tính điểm ranking</p>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr>
                    <th className='py-1 font-medium'>Hành động</th>
                    <th className='py-1 font-medium text-right'>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🎟️ Mua 1 vé</td>
                    <td className='text-right'>+20 điểm</td>
                  </tr>
                  <tr>
                    <td>✅ Check-in sự kiện</td>
                    <td className='text-right'>+15 điểm</td>
                  </tr>
                  <tr>
                    <td>📋 Hoàn thành khảo sát</td>
                    <td className='text-right'>+10 điểm</td>
                  </tr>
                  <tr>
                    <td>🌟 Đánh giá sự kiện</td>
                    <td className='text-right'>+5 điểm</td>
                  </tr>
                  <tr>
                    <td>🔗 Chia sẻ sự kiện</td>
                    <td className='text-right'>+2 điểm</td>
                  </tr>
                  <tr>
                    <td>📌 Bookmark sự kiện</td>
                    <td className='text-right'>+1 điểm</td>
                  </tr>
                  <tr>
                    <td>❌ Huỷ vé</td>
                    <td className='text-right'>-10 điểm</td>
                  </tr>
                </tbody>
              </table>
              <p className='mt-3 text-xs text-gray-500 italic'>
                🚨 Chỉ những người dùng với nhiều hơn 10 điểm sẽ xuất hiện trong
                ranking
              </p>
            </div>
          }
        >
          <ForwardedIoIcon size={25} />
        </Tooltip>
      </h3>
      <Table
        aria-label='Example table with custom cells, pagination and sorting'
        isHeaderSticky
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'max-h-[600px] w-full mt-4 max-w-[400px]',
          th: 'text-wrap max-w-[100px]',
        }}
        topContentPlacement='outside'
        removeWrapper
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
          emptyContent={
            isLoadingAttendeesRanking
              ? 'Đang tải...'
              : 'Không tìm thấy người tham gia nào'
          }
          items={attendeesRanking ?? []}
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
    </ul>
  );
}
