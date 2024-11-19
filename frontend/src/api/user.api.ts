import type { SWRMutationConfiguration } from 'swr/dist/mutation';
import type {
  GetMeResponse,
  UsersApiListingMyEventsRequest,
  UsersApiUpdateAudienceRequest,
} from '../lib/api/generated';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../util/app.util';
import { useQuery } from '@tanstack/react-query';

export const useUpdateMyProfileMutation = <T>(
  options?: SWRMutationConfiguration<GetMeResponse, T>,
) => {
  const api = useApi();
  const key = 'register-audience';
  return useSWRMutation<
    GetMeResponse,
    T,
    typeof key,
    UsersApiUpdateAudienceRequest
  >(
    key,
    async (_: string, { arg }) => await api.users.updateAudience(arg),
    options,
  );
};

export const useListingMyEventsQuery = (
  params?: UsersApiListingMyEventsRequest,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-my-events', params],
    queryFn: async () => await api.users.listingMyEvents(params),
  });
};
