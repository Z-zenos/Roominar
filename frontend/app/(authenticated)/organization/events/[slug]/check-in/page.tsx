import OrganizationEventCheckIn from '@/src/view/organization/OrganizationEventCheckIn';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return <OrganizationEventCheckIn slug={slug} />;
}
