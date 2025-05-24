import EventDashboard from '@/src/view/event/EventDashboard';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return <EventDashboard slug={slug} />;
}
