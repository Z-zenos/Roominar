import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';

import useApi from '../lib/api/useApi';
import { toCamelCase } from '../utils/app.util';
import { useQuery } from '@tanstack/react-query';
import type {
  EventsApiFeedbackEventRequest,
  EventsApiListingFeedbackCriteriaRequest,
  EventsApiListingFeedbacksRequest,
  FeedbacksApiUpdateFeedbackRequest,
} from '../lib/api/generated/types/ObjectParamAPI';
import type { FeedbacksApiDeleteFeedbackRequest } from '../lib/api/generated/types/ObjectParamAPI';

export const useListingFeedbacksQuery = (
  params?: EventsApiListingFeedbacksRequest,
  enabled: boolean = true,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-feedbacks', params],
    queryFn: async () => await api.events.listingFeedbacks(params),
    enabled,
  });
};

export const useFeedbackEventMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'feedback-event';
  return useSWRMutation<number, T, typeof key, EventsApiFeedbackEventRequest>(
    key,
    async (_: string, { arg }) => await api.events.feedbackEvent(arg),
    options,
  );
};

export const useUpdateFeedbackMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'update-feedback';
  return useSWRMutation<
    number,
    T,
    typeof key,
    FeedbacksApiUpdateFeedbackRequest
  >(
    key,
    async (_: string, { arg }) => await api.feedbacks.updateFeedback(arg),
    options,
  );
};

export const useDeleteFeedbackMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'delete-feedback';
  return useSWRMutation<void, T, typeof key, FeedbacksApiDeleteFeedbackRequest>(
    key,
    async (_: string, { arg }) => await api.feedbacks.deleteFeedback(arg),
    options,
  );
};

export const useListingFeedbackCriteriaQuery = (
  params?: EventsApiListingFeedbackCriteriaRequest,
) => {
  const api = useApi();
  const key = 'listing-feedback-criteria';
  return useQuery({
    queryKey: [key, params],
    queryFn: async () => await api.events.listingFeedbackCriteria(params),
  });
};
