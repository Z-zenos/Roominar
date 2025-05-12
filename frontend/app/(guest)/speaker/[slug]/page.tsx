import SpeakerProfile from '@/src/view/speaker/SpeakerProfile';

async function Page({ params: { slug } }: { params: { slug: string } }) {
  return <SpeakerProfile slug={slug} />;
}

export default Page;
