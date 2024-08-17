import { useQuery } from '@tanstack/react-query';
import type { EventsApiListingEventsRequest } from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../util/app.util';

export const useListingEventQuery = (params?: EventsApiListingEventsRequest) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-events', params],
    queryFn: async () => await api.events.listingEvents(params),
  });
};
