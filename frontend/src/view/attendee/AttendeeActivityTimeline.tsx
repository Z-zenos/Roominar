'use client';

import type { AttendeeAppliedEvent } from '@/src/lib/api/generated';
import { formatEventDate, formatTransactionDate } from '@/src/utils/app.util';
import { Image } from '@nextui-org/react';
import clsx from 'clsx';
import { Tabs } from '../../component/common/Tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../component/common/Table';
import { MdBookmarkAdded, MdBookmarkBorder } from 'react-icons/md';

interface AttendeeActivityTimelineProps {
  events: AttendeeAppliedEvent[];
}

export default function AttendeeActivityTimeline({
  events,
}: AttendeeActivityTimelineProps) {
  return (
    <div className='bg-white'>
      <div className='max-w-xl py-8'>
        <div className='flow-root'>
          <ul className='-mb-8'>
            {events.length > 0 &&
              events.map((event) => (
                <li key={event.id}>
                  <div className='relative pb-8'>
                    <span
                      className='absolute top-5 left-5 -ml-px h-[95%] w-0.5 bg-gray-200'
                      aria-hidden='true'
                    ></span>
                    <div className='relative flex items-start space-x-3'>
                      <div>
                        <div className='relative px-1'>
                          <div className='h-8 w-8 bg-blue-500 rounded-full ring-8 ring-white flex items-center justify-center'>
                            <svg
                              className='text-white h-5 w-5'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='2'
                                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className='min-w-0 flex-1 py-0'>
                        <div className='text-md text-gray-500'>
                          <div>
                            <div className='flex justify-between items-start gap-2'>
                              <div className='text-gray-900 mr-2 text-nm'>
                                {event.name}

                                <div className='my-1 ml-3 relative inline-flex items-center bg-white rounded-full border border-gray-300 px-3 py-0.5 text-sm'>
                                  <div className='absolute flex-shrink-0 flex items-center justify-center'>
                                    <span
                                      className={clsx(
                                        'h-1.5 w-1.5 rounded-full bg-green-500',
                                        event.checkInId
                                          ? 'bg-green-500'
                                          : 'bg-gray-300',
                                      )}
                                      aria-hidden='true'
                                    ></span>
                                  </div>
                                  <div
                                    className={clsx(
                                      'ml-3.5 font-semibold',
                                      event.checkInId
                                        ? 'text-green-500'
                                        : 'text-gray-300',
                                    )}
                                  >
                                    {event.checkInId ? 'Checked In' : 'Uncheck'}
                                  </div>
                                </div>

                                <span className=' inline-block ml-2 translate-y-1'>
                                  {event.isBookmarked ? (
                                    <MdBookmarkAdded
                                      size={20}
                                      className='text-primary'
                                    />
                                  ) : (
                                    <MdBookmarkBorder size={20} />
                                  )}
                                </span>

                                <p className='whitespace-nowrap text-sm text-gray-700 mt-2'>
                                  Applied at {formatEventDate(event.appliedAt)}
                                </p>
                              </div>
                              <Image
                                src={event.coverImageUrl}
                                alt='event image'
                                width={120}
                                height={80}
                                className='min-w-[120px]'
                              />
                            </div>
                          </div>
                        </div>
                        <div className='mt-5'>
                          <Tabs
                            className='!w-fit'
                            tabClassName='w-[240px] max-w-[240px]'
                            defaultValue='transactions'
                            tabs={[
                              {
                                value: 'transactions',
                                content: event.transactionHistories.length >
                                  0 && (
                                  <Table>
                                    <TableCaption>
                                      A list of transaction histories.
                                    </TableCaption>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className='w-[100px]'>
                                          Status
                                        </TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Purchased At</TableHead>
                                        <TableHead className='text-right'>
                                          Quantity
                                        </TableHead>
                                        <TableHead>Identity Code</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {event.transactionHistories.map((th) => (
                                        <TableRow
                                          key={th.id}
                                          className='text-center'
                                        >
                                          <TableCell className='font-semibold text-sm text-green-500'>
                                            {th.transactionStatus}
                                          </TableCell>
                                          <TableCell>
                                            {th.totalAmount}
                                          </TableCell>
                                          <TableCell>
                                            {formatTransactionDate(
                                              th.purchasedAt,
                                            )}
                                          </TableCell>
                                          <TableCell className='text-right'>
                                            {th.quantity}
                                          </TableCell>
                                          <TableCell>
                                            {th.ticketTransactionItems
                                              .map((tti) => tti.id)
                                              .join(', ')}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                    {/* <TableFooter>
                                          <TableRow>
                                            <TableCell colSpan={3}>
                                              Total
                                            </TableCell>
                                            <TableCell className='text-right'>
                                              $2,500.00
                                            </TableCell>
                                          </TableRow>
                                        </TableFooter> */}
                                  </Table>
                                ),
                              },
                              {
                                value: 'surveys',
                                content:
                                  event.surveyResponseResults.length > 0 &&
                                  event.surveyResponseResults.map((svr, i) => (
                                    <div
                                      key={`svr-${i}`}
                                      className='mt-5'
                                    >
                                      <div className='text-nm text-gray-700'>
                                        {i + 1 + '. ' + svr.question}
                                      </div>
                                      <div className='text-gray-600 font-light text-sm'>
                                        {' - ' + svr.answers.join(', ')}
                                      </div>
                                    </div>
                                  )),
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            {/* <li>
              <div className='relative pb-8'>
                <span
                  className='absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200'
                  aria-hidden='true'
                ></span>
                <div className='relative flex items-start space-x-3'>
                  <div>
                    <div className='relative px-1'>
                      <div className='h-8 w-8 bg-blue-500 rounded-full ring-8 ring-white flex items-center justify-center'>
                        <svg
                          className='text-white h-5 w-5'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className='min-w-0 flex-1 py-0'>
                    <div className='text-md text-gray-500'>
                      <div>
                        <a
                          href='#'
                          className='font-medium text-gray-900 mr-2'
                        >
                          v3.1.0
                        </a>

                        <a
                          href='#'
                          className='my-0.5 relative inline-flex items-center bg-white rounded-full border border-gray-300 px-3 py-0.5 text-sm'
                        >
                          <div className='absolute flex-shrink-0 flex items-center justify-center'>
                            <span
                              className='h-1.5 w-1.5 rounded-full bg-green-500'
                              aria-hidden='true'
                            ></span>
                          </div>
                          <div className='ml-3.5 font-medium text-gray-900'>
                            Feature
                          </div>
                        </a>
                      </div>
                      <span className='whitespace-nowrap text-sm'>9h ago</span>
                    </div>
                    <div className='mt-2 text-gray-700'>
                      <p>
                        - Improved performance by optimizing database queries.
                        <br />
                        - Enhanced security measures to protect user data.
                        <br />- Streamlined the user interface for a more
                        intuitive experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className='relative pb-8'>
                <span
                  className='absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200'
                  aria-hidden='true'
                ></span>
                <div className='relative flex items-start space-x-3'>
                  <div>
                    <div className='relative px-1'>
                      <div className='h-8 w-8 bg-blue-500 rounded-full ring-8 ring-white flex items-center justify-center'>
                        <svg
                          className='text-white h-5 w-5'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className='min-w-0 flex-1 py-0'>
                    <div className='text-md text-gray-500'>
                      <div>
                        <a
                          href='#'
                          className='font-medium text-gray-900 mr-2'
                        >
                          v3.0.10
                        </a>

                        <a
                          href='#'
                          className='my-0.5 relative inline-flex items-center bg-white rounded-full border border-gray-300 px-3 py-0.5 text-sm'
                        >
                          <div className='absolute flex-shrink-0 flex items-center justify-center'>
                            <span
                              className='h-1.5 w-1.5 rounded-full bg-red-500'
                              aria-hidden='true'
                            ></span>
                          </div>
                          <div className='ml-3.5 font-medium text-gray-900'>
                            Bug
                          </div>
                        </a>
                      </div>
                      <span className='whitespace-nowrap text-sm'>6h ago</span>
                    </div>
                    <div className='mt-2 text-gray-700'>
                      <p>
                        - Resolved a critical issue causing crashes on certain
                        devices.
                        <br />
                        - Fixed a login error that prevented some users from
                        accessing their accounts.
                        <br />- Addressed a display glitch causing text overflow
                        in long messages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}
