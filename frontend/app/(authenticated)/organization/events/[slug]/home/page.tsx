import OrganizationEventHome from '@/src/view/organization/OrganizationEventHome';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return <OrganizationEventHome slug={slug} />;
}
