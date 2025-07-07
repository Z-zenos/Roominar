import OrganizationEventFeedback from '@/src/view/organization/OrganizationFeedback';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return <OrganizationEventFeedback slug={slug} />;
}
