'use client';

import clsx from 'clsx';
import AnalyzeEventTicket from '../ticket/AnalyzeEventTicket';

interface EventDashboardProps {
  slug: string;
}

function EventDashboard({ slug }: EventDashboardProps) {
  return (
    <div className={clsx('grid grid-cols-4 gap-4 ')}>
      <div className='col-span-2'>
        <AnalyzeEventTicket slug={slug} />
      </div>
    </div>
  );
}

export default EventDashboard;
