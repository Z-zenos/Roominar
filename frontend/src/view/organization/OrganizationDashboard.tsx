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
import { TagStatsChart } from '@/src/component/common/Chart/TagStatsChart';
import { TrackUserActionsChart } from '@/src/component/common/Chart/TrackUserActionsChart';
import { TicketStatsChart } from '@/src/component/common/Chart/TicketStatsChart';
import AttendeesRanking from '../attendee/AttendeesRanking';
import { useRouter } from 'next/navigation';
import useFormatMoney from '@/src/hooks/useFormatMoney';

const LazyCalendarTimeline = dynamic(
  () => import('@/src/component/common/DateTime/CalendarTimeline'),
  {
    ssr: false,
    loading: () => <ElementLoading title='Loading schedule timeline' />,
  },
);

export default function OrganizationDashboard() {
  const { data: eventsTimeline } = useListingOrganizationEventsTimelineQuery();
  const formatMoney = useFormatMoney();
  const router = useRouter();

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
              styles.flexStart,
              'bg-white rounded-lg shadow-md p-6 col-span-3 h-fit flex-wrap 1200px:gap-x-20 gap-5',
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
                    <p className='text-sm font-light'>Tổng sự kiện</p>
                    <span className='text-md font-semibold text-orange-500'>
                      {dashboardData.totalEvents}
                    </span>
                    <p
                      className={clsx(
                        styles.center,
                        'gap-1 text-xs font-bold text-orange-500',
                      )}
                    >
                      <GoDotFill />
                      {dashboardData.ongoingEvents.length} sự kiện đang diễn ra{' '}
                    </p>
                  </div>
                </div>
                <div className={clsx(styles.center, 'gap-2')}>
                  <Image
                    src='/images/ticket.png'
                    alt='total event'
                    width={50}
                  />

                  <div>
                    <p className='text-sm font-light'>Tổng vé đã bán</p>
                    <span className='text-md font-semibold text-green-500'>
                      {dashboardData.totalTicketsSold}
                    </span>
                    <p
                      className={clsx(
                        styles.center,
                        'gap-1 text-xs font-bold text-green-500',
                      )}
                    >
                      {dashboardData.todayTicketCount} vé đã bán hôm nay
                    </p>
                  </div>
                </div>

                <div className={clsx(styles.center, 'gap-2')}>
                  <Image
                    src='/images/sales.png'
                    alt='total event'
                    width={50}
                  />

                  <div>
                    <p className='text-sm font-light'>Doanh thu</p>
                    <span className='text-md font-semibold text-pink-500'>
                      {formatMoney(dashboardData.totalRevenue)}
                    </span>
                    <p
                      className={clsx(
                        styles.center,
                        'gap-1 text-xs font-bold text-pink-500',
                      )}
                    >
                      Doanh thu hôm nay: {dashboardData.todayRevenueCount}
                    </p>
                  </div>
                </div>
              </>
            )}

            {isLoadingDashboardData && (
              <div className='flex w-full items-center justify-center'>
                <ElementLoading title='Loading dashboard data...' />
              </div>
            )}
            {dashboardData && (
              <div
                className={clsx(
                  styles.flexStart,
                  'col-span-3 gap-2 overflow-x-auto',
                )}
              >
                {dashboardData.ongoingEvents.length > 0 &&
                  dashboardData.ongoingEvents.map((event) => (
                    <div
                      key={event.id}
                      className='bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2 mb-2 flex items-center gap-4 min-w-[360px] cursor-pointer'
                      onClick={() =>
                        router.push(
                          `/organization/events/${event.slug}/overview`,
                        )
                      }
                    >
                      <Image
                        src={
                          event.coverImageUrl || '/images/event-placeholder.png'
                        }
                        alt={event.name}
                        width={50}
                        height={50}
                        className='rounded-md aspect-square object-cover'
                      />
                      <div>
                        <h3 className='text-sm font-semibold text-primary'>
                          {event.name}
                        </h3>
                      </div>
                    </div>
                  ))}
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
              titleFormat={() => 'Lịch sự kiện'}
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
