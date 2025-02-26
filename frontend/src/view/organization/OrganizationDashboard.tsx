'use client';

import dynamic from 'next/dynamic';
import { useListingOrganizationEventsTimelineQuery } from '@/src/api/organization.api';
import ElementLoading from '@/src/component/common/Loader/ElementLoading';

const LazyCalendarTimeline = dynamic(
  () => import('@/src/component/common/DateTime/CalendarTimeline'),
  {
    ssr: false,
    loading: () => <ElementLoading title='Loading schedule timeline' />,
  },
);

export default function OrganizationDashboard() {
  const { data: eventsTimeline } = useListingOrganizationEventsTimelineQuery();

  return (
    <div className='grid grid-cols-5 gap-4 p-8'>
      <div className='col-span-3'></div>
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
        />
      </div>
    </div>
  );
}
