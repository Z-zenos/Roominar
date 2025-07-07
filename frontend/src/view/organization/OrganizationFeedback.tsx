'use client';

import { useGetEventIdBySlugQuery } from '@/src/api/event.api';
import Spinner from '@/src/component/common/Loader/Spinner';
import FeedbackList from '../event/FeedbackList';

interface OrganizationFeedbackProps {
  slug: string;
}

export default function OrganizationFeedback({
  slug,
}: OrganizationFeedbackProps) {
  const { data: eventId, isLoading } = useGetEventIdBySlugQuery(slug);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <FeedbackList eventId={eventId} />
    </div>
  );
}
