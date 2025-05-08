'use client';

import { useListingAttendeesRankingQuery } from '@/src/api/organization.api';
import { Avatar, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';

const ForwardedIoIcon = forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof IoIosInformationCircleOutline>
>((props, ref) => (
  <span ref={ref}>
    <IoIosInformationCircleOutline {...props} />
  </span>
));
ForwardedIoIcon.displayName = 'ForwardedIoIcon';

export default function AttendeesRanking() {
  const { data: attendeesRanking } = useListingAttendeesRankingQuery();

  return (
    <ul
      role='list'
      className='bg-white rounded-lg shadow-md px-8 py-4 mt-6'
    >
      <h3 className='text-md text-orange-500 mb-2 font-semibold flex justify-start items-center gap-2'>
        Attendees Ranking{' '}
        <Tooltip
          className='inline-block'
          content={
            <div className='absolute z-20 mt-2 w-80 p-4 rounded-xl shadow-xl bg-white border border-gray-200 text-sm text-gray-700'>
              <p className='font-semibold mb-2'>
                🏆 How is the ranking score calculated?
              </p>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr>
                    <th className='py-1 font-medium'>Action</th>
                    <th className='py-1 font-medium text-right'>Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🎟️ Purchase a ticket</td>
                    <td className='text-right'>+20 pts</td>
                  </tr>
                  <tr>
                    <td>✅ Check-in to an event</td>
                    <td className='text-right'>+15 pts</td>
                  </tr>
                  <tr>
                    <td>📋 Complete application survey</td>
                    <td className='text-right'>+10 pts</td>
                  </tr>
                  <tr>
                    <td>🌟 Rate an event</td>
                    <td className='text-right'>+5 pts</td>
                  </tr>
                  <tr>
                    <td>🔗 Share the event</td>
                    <td className='text-right'>+2 pts</td>
                  </tr>
                  <tr>
                    <td>📌 Bookmark an event</td>
                    <td className='text-right'>+1 pt</td>
                  </tr>
                  <tr>
                    <td>❌ Cancel a ticket</td>
                    <td className='text-right'>-10 pts</td>
                  </tr>
                </tbody>
              </table>
              <p className='mt-3 text-xs text-gray-500 italic'>
                🚨 Only users with more than 10 points appear in the ranking.
              </p>
            </div>
          }
        >
          <ForwardedIoIcon size={25} />
        </Tooltip>
      </h3>
      {attendeesRanking &&
        attendeesRanking?.length > 0 &&
        attendeesRanking.map((attendee, i) => (
          <li
            className='flex justify-between gap-x-6 py-5'
            key={attendee.id}
          >
            <div className='flex items-center min-w-0 gap-x-4'>
              <Avatar
                isBordered
                radius='full'
                size='md'
                src={attendee.avatarUrl}
              />
              <div className='min-w-0 flex-auto'>
                <p className='text-nm font-medium text-gray-900'>
                  {attendee.fullName}
                </p>
                <p className='truncate text-sm text-gray-500'>
                  {attendee.email}
                </p>
              </div>
            </div>
            <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
              <p className='text-sm leading-6 text-gray-900'>
                <span
                  className={clsx(
                    i === 0 && 'font-bold text-md text-success-main',
                    i === 1 && 'font-bold text-md text-info-main',
                    i === 2 && 'font-bold text-md text-warning-main',
                  )}
                >
                  {attendee.totalScore}
                </span>{' '}
                points
              </p>
              {/* <p className='mt-1 text-xs leading-5 text-gray-500'>
                Last seen <time dateTime='2023-01-23T13:23Z'>3h ago</time>
              </p> */}
            </div>
          </li>
        ))}
    </ul>
  );
}
