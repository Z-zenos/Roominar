import useApi from '../lib/api/useApi';
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation';
import type {
  OrganizationsApiCreateOrganizationFollowRequest,
  OrganizationsApiDeleteOrganizationFollowRequest,
  OrganizationsApiGetAttendeeDetailRequest,
  OrganizationsApiGetOrganizationDetailRequest,
  OrganizationsApiListingAttendeesRequest,
  OrganizationsApiRegisterOrganizationRequest,
} from '../lib/api/generated';
import { useQuery } from '@tanstack/react-query';
import { toCamelCase } from '../utils/app.util';

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

export const useListingRandomOrganizationsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-random-organizations'],
    queryFn: async () => await api.organizations.listingRandomOrganizations(),
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

export const useListingAttendeesQuery = (
  params?: OrganizationsApiListingAttendeesRequest,
) => {
  params = toCamelCase(params);
  if (params.applyAtFrom) {
    params.applyAtFrom = new Date(params.applyAtFrom);
  }
  if (params.applyAtTo) params.applyAtTo = new Date(params.applyAtTo);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-attendees', params],
    queryFn: async () => await api.organizations.listingAttendees(params),
  });
};

export const useGetAttendeeDetailQuery = (
  params: OrganizationsApiGetAttendeeDetailRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-attendee-detail'],
    queryFn: async () => await api.organizations.getAttendeeDetail(params),
  });
};

export const useListingOrganizationEventsTimelineQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-orgnization-events-timeline'],
    queryFn: async () =>
      await api.organizations.listingOrganizationEventsTimeline(),
  });
};

export const useGetOrganizationDetailQuery = (
  params?: OrganizationsApiGetOrganizationDetailRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-organization-detail'],
    queryFn: async () => await api.organizations.getOrganizationDetail(params),
  });
};
