import OrganizationProfile from '@/src/view/organization/OrganizationProfile';

async function Page({ params: { slug } }: { params: { slug: string } }) {
  return <OrganizationProfile slug={slug} />;
}

export default Page;
