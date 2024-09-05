import { useQuery } from '@tanstack/react-query';
import type {
  EventsApiGetEventDetailRequest,
  EventsApiListingRelatedEventsRequest,
  EventsApiSearchEventsRequest,
  OrganizationsApiListingTopOrganizationEventsRequest,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../util/app.util';

export const useSearchEventsQuery = (params?: EventsApiSearchEventsRequest) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['search-events', params],
    queryFn: async () => await api.events.searchEvents(params),
  });
};

export const useGetEventDetailQuery = (
  params?: EventsApiGetEventDetailRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-event-detail'],
    queryFn: async () => await api.events.getEventDetail(params),
  });
};

export const useListingTopOrganizationEventsQuery = (
  params?: OrganizationsApiListingTopOrganizationEventsRequest,
  enabled?: boolean,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-top-organization-events'],
    queryFn: async () =>
      await api.organizations.listingTopOrganizationEvents(params),
    enabled,
  });
};

export const useListingRelatedEventsQuery = (
  params?: EventsApiListingRelatedEventsRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-related-events'],
    queryFn: async () => await api.events.listingRelatedEvents(params),
  });
};

export const useListingEventRankQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-event-rank'],
    queryFn: async () => await api.events.listingEventRank(),
  });
};
