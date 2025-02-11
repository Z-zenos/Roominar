'use client';

import CreateEventForm from '@/src/component/form/CreateEventForm';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return <CreateEventForm slug={slug} />;
}
