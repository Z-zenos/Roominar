import dynamic from 'next/dynamic';
import * as React from 'react';

const AttendeeDataTable = dynamic(
  () => import('@/src/view/attendee/AttendeeDataTable'),
  { ssr: false },
);

export default function Page() {
  return <AttendeeDataTable />;
}
