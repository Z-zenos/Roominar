import { useQuery } from '@tanstack/react-query';
import type {
  EventsApiCreateEventBookmarkRequest,
  EventsApiDeleteEventBookmarkRequest,
  EventsApiDeleteManualCheckInRequest,
  EventsApiGenerateEventAiRequest,
  EventsApiGetEventDetailRequest,
  EventsApiListingMyEventsRequest,
  EventsApiListingRecommendationEventsRequest,
  EventsApiListingRelatedEventsRequest,
  EventsApiListingTicketsOfEventRequest,
  EventsApiManualCheckInRequest,
  EventsApiPublishEventRequest,
  EventsApiQrCheckInRequest,
  EventsApiSaveDraftEventRequest,
  EventsApiSearchEventsRequest,
  GenerateEventAIResponse,
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
  enabled?: boolean,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-tickets-of-events'],
    queryFn: async () => await api.events.listingTicketsOfEvent(params),
    enabled,
  });
};

export const useListingOrganizationEventsQuery = (
  params?: OrganizationsApiListingOrganizationEventsRequest,
) => {
  params = toCamelCase(params);
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

export const useManualCheckInMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'manual-check-in';
  return useSWRMutation<number, T, typeof key, EventsApiManualCheckInRequest>(
    key,
    async (_: string, { arg }) => await api.events.manualCheckIn(arg),
    options,
  );
};

export const useQRChecInMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'qr-check-in';
  return useSWRMutation<number, T, typeof key, EventsApiQrCheckInRequest>(
    key,
    async (_: string, { arg }) => await api.events.qrCheckIn(arg),
    options,
  );
};

export const useDeleteManualCheckInMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'delete-manual-check-in';
  return useSWRMutation<
    void,
    T,
    typeof key,
    EventsApiDeleteManualCheckInRequest
  >(
    key,
    async (_: string, { arg }) => await api.events.deleteManualCheckIn(arg),
    options,
  );
};

export const useGetDraftEventQuery = (enabled?: boolean) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-draft-event'],
    queryFn: async () => await api.events.getDraftEvent(),
    enabled,
  });
};

export const useSaveDraftEventMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'save-draft-event';
  return useSWRMutation<number, T, typeof key, EventsApiSaveDraftEventRequest>(
    key,
    async (_: string, { arg }) => await api.events.saveDraftEvent(arg),
    options,
  );
};

export const useListingRecommendationEventsQuery = (
  params?: EventsApiListingRecommendationEventsRequest,
  enabled?: boolean,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-recommendation-events', params],
    queryFn: async () => await api.events.listingRecommendationEvents(params),
    enabled,
  });
};

export const useGenerateEventAIMutation = <T>(
  options?: SWRMutationConfiguration<GenerateEventAIResponse, T>,
) => {
  const api = useApi();
  const key = 'generate-event-ai';
  return useSWRMutation<
    GenerateEventAIResponse,
    T,
    typeof key,
    EventsApiGenerateEventAiRequest
  >(
    key,
    async (_: string, { arg }) => await api.events.generateEventAi(arg),
    options,
  );
};

export const useListingEventOptionsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-event-options'],
    queryFn: async () => await api.events.listingEventOptions(),
  });
};
