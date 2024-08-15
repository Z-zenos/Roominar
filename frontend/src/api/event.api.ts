import { useQuery } from '@tanstack/react-query';
import type { EventsApiListingEventsRequest } from '../lib/api/generated';
import useApi from '../lib/api/useApi';

export const useListingEventQuery = (params?: EventsApiListingEventsRequest) => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-events', params],
    queryFn: async () => await api.events.listingEvents(params),
  });
};
