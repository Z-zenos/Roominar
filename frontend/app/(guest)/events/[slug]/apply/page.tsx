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
      <div className='bg-gray-50'>
        <EventApplicationForm slug={slug} />
      </div>
    </>
  );
}

export default Page;
