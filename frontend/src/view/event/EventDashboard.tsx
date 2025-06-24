'use client';

import clsx from 'clsx';
import AnalyzeEventTicket from '../ticket/AnalyzeEventTicket';
import AnalyzeEventCheckIn from '../ticket/AnalyzeEventCheckIn';

interface EventDashboardProps {
  slug: string;
}

function EventDashboard({ slug }: EventDashboardProps) {
  return (
    <div className={clsx('grid grid-cols-4')}>
      <div className='1000px:col-span-2 col-span-4'>
        <AnalyzeEventTicket slug={slug} />
      </div>
      <div className='1000px:col-span-2 col-span-4'>
        <AnalyzeEventCheckIn slug={slug} />
      </div>
    </div>
  );
}

export default EventDashboard;
