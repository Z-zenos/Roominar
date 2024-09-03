import EventDetail from '@/src/view/event/EventDetail';

async function Page({ params: { slug } }: { params: { slug: string } }) {
  return <EventDetail slug={slug} />;
}

export default Page;
