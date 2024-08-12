import Head from '@/src/component/common/Head';
import EventDetail from '@/src/view/events/EventDetail';

async function Page({ params: { slug } }: { params: { slug: string } }) {
  return (
    <>
      <Head
        description='Detail information about specific event'
        keywords='Foreign Language,Webinar,Event,Sharing,Seminar,Ticket'
        title='Detail Event '
      />
      <EventDetail slug={slug} />
    </>
  );
}

export default Page;
