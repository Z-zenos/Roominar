import { useQuery } from '@tanstack/react-query';
import type { EventsApiGetEventDetailRequest, EventsApiSearchEventsRequest } from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../util/app.util';

export const useSearchEventsQuery = (params?: EventsApiSearchEventsRequest) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-events', params],
    queryFn: async () => await api.events.searchEvents(params),
  });
};

export const useGetEventDetailQuery = (params?: EventsApiGetEventDetailRequest) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-event-detail'],
    queryFn: async () => await api.events.getEventDetail(params),
  });
};
