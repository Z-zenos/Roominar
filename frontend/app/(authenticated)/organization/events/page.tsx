import dynamic from 'next/dynamic';
import * as React from 'react';

const EventDataTable = dynamic(
  () => import('@/src/view/event/EventDataTable'),
  { ssr: false },
);

export default function Page() {
  return <EventDataTable />;
}
