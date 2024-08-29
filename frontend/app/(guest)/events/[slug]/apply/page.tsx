import Head from '@/src/component/common/Head';
import EventApplicationForm from '@/src/view/event/EventApplicationForm';

async function Page({ params: { slug } }: { params: { slug: string } }) {
  return (
    <>
      <Head
        description='Detail information about specific event'
        keywords='Foreign Language,Webinar,Event,Sharing,Seminar,Ticket'
        title='Apply Event '
      />
      <EventApplicationForm slug={slug} />
    </>
  );
}

export default Page;
