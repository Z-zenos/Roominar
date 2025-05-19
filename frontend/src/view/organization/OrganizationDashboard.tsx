'use client';

import dynamic from 'next/dynamic';
import {
  useGetOrganizationDashboardQuery,
  useGetTagStatsQuery,
  useListingOrganizationEventsTimelineQuery,
} from '@/src/api/organization.api';
import ElementLoading from '@/src/component/common/Loader/ElementLoader';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import { Image } from '@nextui-org/react';
import { GoDotFill } from 'react-icons/go';
import { useState } from 'react';
import { getCookie } from 'cookies-next';
import { TagStatsChart } from '@/src/component/common/Chart/TagStatsChart';
import { TrackUserActionsChart } from '@/src/component/common/Chart/TrackUserActionsChart';
import { TicketStatsChart } from '@/src/component/common/Chart/TicketStatsChart';
import AttendeesRanking from '../attendee/AttendeesRanking';

const LazyCalendarTimeline = dynamic(
  () => import('@/src/component/common/DateTime/CalendarTimeline'),
  {
    ssr: false,
    loading: () => <ElementLoading title='Loading schedule timeline' />,
  },
);

export default function OrganizationDashboard() {
  const { data: eventsTimeline } = useListingOrganizationEventsTimelineQuery();
  const [isEnglish] = useState<boolean>(
    getCookie('NEXT_LOCALE') === 'en' || !getCookie('NEXT_LOCALE'),
  );

  const { data: dashboardData, isLoading: isLoadingDashboardData } =
    useGetOrganizationDashboardQuery();
  const { data: tagStats, isLoading: isLoadingTagStats } =
    useGetTagStatsQuery();

  return (
    <>
      <div className='grid 1200px:grid-cols-5 grid-cols-3 gap-4 p-4 items-baseline'>
        <div className='col-span-3 grid grid-cols-3 gap-2'>
          <div
            className={clsx(
              styles.between,
              'bg-white rounded-lg shadow-md p-6 1200px:col-span-3 col-span-1 h-fit flex-wrap 1200px:gap-2 gap-5',
            )}
          >
            {dashboardData && (
              <>
                <div className={clsx(styles.center, 'gap-2')}>
                  <Image
                    src='/images/event-list.png'
                    alt='total event'
                    width={50}
                  />
                  <div>
                    <p className='text-sm font-light'>Total Events</p>
                    <span className='text-md font-semibold text-primary'>
                      {dashboardData.totalEvents}
                    </span>
                  </div>
                </div>
                <div className={clsx(styles.center, 'gap-2')}>
                  <Image
                    src='/images/ticket.png'
                    alt='total event'
                    width={50}
                  />

                  <div>
                    <p className='text-sm font-light'>Total Tickets Sold</p>
                    <span className='text-md font-semibold text-primary'>
                      {dashboardData.totalTicketsSold}
                    </span>
                    <p
                      className={clsx(
                        styles.center,
                        'gap-1 text-xs font-bold text-green-500',
                      )}
                    >
                      <GoDotFill />
                      {dashboardData.totalActualAttendees} actual participants{' '}
                    </p>
                  </div>
                </div>
                <div className={clsx(styles.center, 'gap-2')}>
                  <Image
                    src='/images/team.png'
                    alt='total event'
                    width={50}
                  />

                  <div>
                    <p className='text-sm font-light'>Member</p>
                    <span className='text-md font-semibold text-primary'>
                      {dashboardData.totalMembers}
                    </span>
                  </div>
                </div>

                <div className={clsx(styles.center, 'gap-2')}>
                  <Image
                    src='/images/sales.png'
                    alt='total event'
                    width={50}
                  />

                  <div>
                    <p className='text-sm font-light'>Revenue</p>
                    <span className='text-md font-semibold text-primary'>
                      {new Number(dashboardData.totalRevenue).toLocaleString(
                        isEnglish ? 'en-US' : 'vi-VN',
                        {
                          style: 'currency',
                          currency: isEnglish ? 'USD' : 'VND',
                        },
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}

            {isLoadingDashboardData && (
              <div className='flex w-full items-center justify-center'>
                <ElementLoading title='Loading dashboard data...' />
              </div>
            )}
          </div>

          <div className='col-span-3'>
            <TrackUserActionsChart />
          </div>

          <div className='col-span-3'>
            <AttendeesRanking />
          </div>
        </div>
        <div className='1200px:col-span-2 col-span-3'>
          <div className='max-h-[600px] bg-white rounded-lg shadow-md p-4'>
            <LazyCalendarTimeline
              height={520}
              aspectRatio={1.35}
              events={[
                ...(eventsTimeline
                  ? eventsTimeline.map((event) => ({
                      title: event.name,
                      start: event.startAt,
                      end: event.endAt,
                      color: '#3048ff',
                    }))
                  : []),
                ...(eventsTimeline
                  ? eventsTimeline.map((event) => ({
                      title: event.name,
                      start: event.applicationStartAt,
                      end: event.applicationEndAt,
                      color: '#ff5c00',
                    }))
                  : []),
              ]}
              dayMaxEventRows={2}
              dayHeaderClassNames={[
                'text-[14px] first:text-red-500 last:text-blue-500',
              ]}
              dayCellClassNames={['text-[14px]']}
              eventClassNames={['text-xs font-semibold']}
              titleFormat={() => 'Event Schedule'}
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek',
              }}
              editable={false}
              selectable={false}
            />
          </div>
          <TicketStatsChart />
          {tagStats && <TagStatsChart data={tagStats.data} />}
          {isLoadingTagStats && (
            <div className='flex w-full items-center justify-center'>
              <ElementLoading title='Loading tag stats...' />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
