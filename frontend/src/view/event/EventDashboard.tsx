'use client';

import clsx from 'clsx';
import AnalyzeEventTicket from '../ticket/AnalyzeEventTicket';
import AnalyzeEventCheckIn from '../ticket/AnalyzeEventCheckIn';
import dynamic from 'next/dynamic';
import ElementLoader from '@/src/component/common/Loader/ElementLoader';

interface EventDashboardProps {
  slug: string;
}

const LazyAttendeeTable = dynamic(
  () => import('../attendee/AttendeeDataTable'),
  {
    ssr: false,
    loading: () => <ElementLoader title='Đang tải danh sách người tham dự' />,
  },
);

function EventDashboard({ slug }: EventDashboardProps) {
  return (
    <div className={clsx('grid grid-cols-4')}>
      <div className='1000px:col-span-2 col-span-4'>
        <AnalyzeEventTicket slug={slug} />
      </div>
      <div className='1000px:col-span-2 col-span-4'>
        <AnalyzeEventCheckIn slug={slug} />
      </div>

      <div className='col-span-4'>
        <LazyAttendeeTable slug={slug} />
      </div>
    </div>
  );
}

export default EventDashboard;
