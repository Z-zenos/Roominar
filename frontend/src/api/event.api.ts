import { useQuery } from '@tanstack/react-query';
import type {
  EventsApiCreateEventBookmarkRequest,
  EventsApiDeleteEventBookmarkRequest,
  EventsApiGetEventDetailRequest,
  EventsApiListingMyEventsRequest,
  EventsApiListingRelatedEventsRequest,
  EventsApiListingTicketsOfEventRequest,
  EventsApiPublishEventRequest,
  EventsApiSearchEventsRequest,
  OrganizationsApiListingOrganizationEventsRequest,
  OrganizationsApiListingTopOrganizationEventsRequest,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../utils/app.util';
import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';

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

export const useCreateEventBookmarkMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'create-event-bookmark';
  return useSWRMutation<
    number,
    T,
    typeof key,
    EventsApiCreateEventBookmarkRequest
  >(
    key,
    async (_: string, { arg }) => await api.events.createEventBookmark(arg),
    options,
  );
};

export const useDeleteEventBookmarkMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'delete-event-bookmark';
  return useSWRMutation<
    void,
    T,
    typeof key,
    EventsApiDeleteEventBookmarkRequest
  >(
    key,
    async (_: string, { arg }) => await api.events.deleteEventBookmark(arg),
    options,
  );
};

export const usePublishEventMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'publish-event';
  return useSWRMutation<number, T, typeof key, EventsApiPublishEventRequest>(
    key,
    async (_: string, { arg }) => await api.events.publishEvent(arg),
    options,
  );
};

export const useListingTicketsOfEventQuery = (
  params?: EventsApiListingTicketsOfEventRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-tickets-of-events'],
    queryFn: async () => await api.events.listingTicketsOfEvent(params),
  });
};

export const useListingOrganizationEventsQuery = (
  params?: OrganizationsApiListingOrganizationEventsRequest,
) => {
  params = toCamelCase(params);
  if (params.startAtFrom) {
    params.startAtFrom = new Date(params.startAtFrom);
  }
  if (params.startAtTo) params.startAtTo = new Date(params.startAtTo);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-organization-events', params],
    queryFn: async () =>
      await api.organizations.listingOrganizationEvents(params),
  });
};

export const useListingMyEventsQuery = (
  params?: EventsApiListingMyEventsRequest,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-my-events', params],
    queryFn: async () => await api.events.listingMyEvents(params),
  });
};
