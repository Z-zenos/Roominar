import type { SWRMutationConfiguration } from 'swr/dist/mutation';
import useApi from '../lib/api/useApi';
import useSWRMutation from 'swr/mutation';
import type {
  OrganizationsApiCreateOrganizationFollowRequest,
  OrganizationsApiDeleteOrganizationFollowRequest,
  OrganizationsApiRegisterOrganizationRequest,
} from '../lib/api/generated';
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

export const useCreateOrganizationFollowMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'create-organization-follow';
  return useSWRMutation<
    number,
    T,
    typeof key,
    OrganizationsApiCreateOrganizationFollowRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.organizations.createOrganizationFollow(arg),
    options,
  );
};

export const useDeleteOrganizationFollowMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'delete-organization-follow';
  return useSWRMutation<
    void,
    T,
    typeof key,
    OrganizationsApiDeleteOrganizationFollowRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.organizations.deleteOrganizationFollow(arg),
    options,
  );
};
