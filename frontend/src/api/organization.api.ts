import type { SWRMutationConfiguration } from 'swr/dist/mutation';
import useApi from '../lib/api/useApi';
import useSWRMutation from 'swr/mutation';
import type { OrganizationsApiRegisterOrganizationRequest } from '../lib/api/generated';
import { useQuery } from '@tanstack/react-query';

export const useRegisterOrganizationMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'register-audience';
  return useSWRMutation<
    number,
    T,
    typeof key,
    OrganizationsApiRegisterOrganizationRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.organizations.registerOrganization(arg),
    options,
  );
};

export const useListingOngoingEventOrganizationsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-ongoing-event-organizations'],
    queryFn: async () =>
      await api.organizations.listingOrganizationsOfOngoingEvent(),
  });
};
