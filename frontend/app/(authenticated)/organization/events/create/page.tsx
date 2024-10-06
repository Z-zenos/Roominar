'use client';

import CreateEventForm from '@/src/component/form/CreateEventForm';

export default function Page() {
  return (
    <div>
      <h3 className='text-xm text-primary mb-8'>Planning New Event</h3>
      <CreateEventForm />
    </div>
  );
}
