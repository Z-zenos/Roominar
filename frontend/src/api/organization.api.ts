import type { SWRMutationConfiguration } from 'swr/dist/mutation';
import useApi from '../lib/api/useApi';
import useSWRMutation from 'swr/mutation';
import type { OrganizationsApiRegisterOrganizationRequest } from '../lib/api/generated';

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
