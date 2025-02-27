'use client';

import dynamic from 'next/dynamic';
import { useListingOrganizationEventsTimelineQuery } from '@/src/api/organization.api';
import ElementLoading from '@/src/component/common/Loader/ElementLoading';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import { Image } from '@nextui-org/react';
import { GoDotFill } from 'react-icons/go';
import { useState } from 'react';
import { getCookie } from 'cookies-next';
import { TagChart } from '@/src/component/common/Chart/TagChart';

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

  return (
    <div className='grid grid-cols-5 gap-4 p-8'>
      <div className='col-span-3 grid grid-cols-3 gap-2'>
        <div
          className={clsx(
            styles.between,
            'bg-white rounded-lg shadow-md p-6 col-span-3 h-fit',
          )}
        >
          <div className={clsx(styles.center, 'gap-2')}>
            <Image
              src='/images/event-list.png'
              alt='total event'
              width={50}
            />
            <div>
              <p className='text-sm font-light'>Total Events</p>
              <span className='text-md font-semibold text-primary'>40</span>
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
              <span className='text-md font-semibold text-primary'>40</span>
              <p
                className={clsx(
                  styles.center,
                  'gap-1 text-xs font-bold text-green-500',
                )}
              >
                <GoDotFill />
                12 actual participants{' '}
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
              <span className='text-md font-semibold text-primary'>40</span>
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
                {new Number(2200002).toLocaleString(
                  isEnglish ? 'en-US' : 'vi-VN',
                  {
                    style: 'currency',
                    currency: isEnglish ? 'USD' : 'VND',
                  },
                )}
              </span>
            </div>
          </div>
        </div>

        <div className='col-span-1'>
          <TagChart />
        </div>
      </div>
      <div className='col-span-2 bg-white p-4 rounded-lg shadow-md'>
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
        />
      </div>
    </div>
  );
}
